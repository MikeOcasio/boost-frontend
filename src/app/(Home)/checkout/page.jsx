"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BiLoader } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";
import { loadStripe } from "@stripe/stripe-js";

import { useUserStore } from "@/store/use-user";
import { useCartStore } from "@/store/use-cart";
import { CheckoutOrderCard } from "./_components/CheckoutOrderCard";
import { PlatformCredentialDialog } from "./_components/PlatformCredentialDialog";
import { fetchGameById } from "@/lib/actions/products-action";
import { checkoutSession } from "@/lib/actions/orders-action";
import { fetchCurrentUser } from "@/lib/actions/user-actions";
import { fetchPlatformById } from "@/lib/actions/platforms-action";

// load stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const CheckoutPage = () => {
  const router = useRouter();
  const { userToken, setUser, removeToken, user } = useUserStore();
  const { cartItems, emptyCart, totalPrice, setTotalPrice } = useCartStore();

  const [orderByPlatform, setOrderByPlatform] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // dialog
  const [dialogId, setDialogId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // State for clientSecret
  const [clientSecret, setClientSecret] = useState("");

  const [selectedSubplatform, setSelectedSubplatform] = useState("");

  // fetch user info
  const handleUserFetch = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchCurrentUser();

      if (response?.error) {
        router.push("/login");
        throw new Error(response.error);
      }

      setUser(response);
    } catch (err) {
      toast.error(err.message || "An error occurred while fetching the user.");
      setError(true);
      await removeToken();
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router, removeToken, setUser]);

  useEffect(() => {
    if (!userToken) {
      toast.error("Please login before checking out.");
      router.push("/login");
      setLoading(false);
      return;
    }

    handleUserFetch();
  }, [handleUserFetch, router, userToken]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(false);
    let validOrders = [];
    let calculatedTotal = 0;
    let platformOrders = {};

    try {
      for (const item of cartItems) {
        const product = await fetchGameById(item.id);

        if (product?.error) {
          emptyCart();
          toast.error("Invalid product in cart. Please try again!");
          router.push("/");
          return;
        } else {
          // Create the updated order object
          const order = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            is_active: product.is_active,
            tax: product.tax,
            category_id: product.category_id,
            prod_attr_cats: product.prod_attr_cats,
            platform: item.platform,
            quantity: item.quantity,
          };

          if (item.is_dropdown) {
            order.is_dropdown = product.is_dropdown;
            order.dropdown_options = item.dropdown_options;
            order.starting_point = item.starting_point;
            order.ending_point = item.ending_point;
            order.item_qty = item.dropdown_options.length;
            order.quantity = 1;
            order.price = item.dropdown_options.reduce(
              (acc, curr) => acc + curr.price,
              0
            );
          }

          if (item.is_slider) {
            order.is_slider = product.is_slider;
            order.slider_range = item.slider_range;
            order.item_qty = item.slider_range.length - 1;
            order.quantity = 1;
            order.starting_point = item.starting_point;
            order.ending_point = item.ending_point;
            order.price = item.slider_range.reduce(
              (acc, curr) => acc + curr.price,
              0
            );
          }

          validOrders.push(order);

          // Update total price, including tax
          if (item.is_dropdown) {
            calculatedTotal +=
              parseFloat(order.price) + parseFloat(order.tax) * order.item_qty;
          } else if (item.is_slider) {
            calculatedTotal +=
              parseFloat(order.price) + parseFloat(order.tax) * order.item_qty;
          } else {
            calculatedTotal +=
              parseFloat(order.price) * order.quantity +
              parseFloat(order.tax) * order.quantity;
          }

          // Group orders by platform ID
          const platformId = item.platform.id;
          if (!platformOrders[platformId]) {
            platformOrders[platformId] = [];
          }
          platformOrders[platformId].push(order);
        }
      }

      // Convert grouped orders to an array of arrays
      const groupedOrders = Object.values(platformOrders);

      setOrderByPlatform(groupedOrders);
      setTotalPrice(calculatedTotal.toFixed(2));

      localStorage.setItem("totalPrice", calculatedTotal.toFixed(2));
      localStorage.setItem("cartItems", JSON.stringify(validOrders));
    } catch (error) {
      setError(true);
      toast.error("Failed to load orders. Please try again!");
    } finally {
      setLoading(false);
    }
  }, [cartItems, emptyCart, router, setTotalPrice]);

  // Function to fetch clientSecret
  const fetchClientSecret = useCallback(async (orders) => {
    try {
      setLoading(true);

      // if order is slider or dropdown then add tax to the price and make the tax 0
      const options = orders.map((order) => {
        if (order.is_dropdown || order.is_slider) {
          return {
            ...order,
            price: order.price + order.tax * order.item_qty,
            tax: 0,
          };
        } else {
          return order;
        }
      });

      const data = await checkoutSession(options);

      if (data.error) {
        toast.error(data.error);
        setLoading(false);

        return null;
      } else {
        // in session storage set the current order data with the session id
        sessionStorage.setItem(
          "place_order",
          JSON.stringify({
            orders,
            sessionId: data.sessionId,
          })
        );

        setClientSecret(data.sessionId);
        return data.sessionId;
      }
    } catch (error) {
      toast.error(error.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (clientSecret) {
      // Load the Stripe Checkout UI once the sessionId is available
      const redirectToCheckout = async () => {
        const stripe = await stripePromise;
        stripe.redirectToCheckout({ sessionId: clientSecret });
      };

      redirectToCheckout();
    }
  }, [clientSecret]);

  useEffect(() => {
    if (userToken) {
      loadOrders();
    }
  }, [userToken, cartItems, loadOrders]);

  // credential dialog
  const handleCredentialDialog = async (platform_id) => {
    try {
      setLoading(true);
      const result = await fetchPlatformById(platform_id.id);

      if (result.error) {
        toast.error(result.error);
      } else {
        setDialogId(result);
        setOpenDialog(true);
      }
    } catch (error) {
      toast.error("Failed to fetch platform details. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 max-w-7xl mx-auto min-h-screen space-y-6 p-4">
      <p className="text-center text-4xl font-title sm:text-5xl">Checkout</p>

      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Some error occurred. Please try again!
          {/* reload */}
          <button onClick={loadOrders} className="p-2 rounded-lg bg-white/10">
            Reload
          </button>
        </p>
      )}

      {!loading &&
      !error &&
      (orderByPlatform?.length < 1 || cartItems?.length < 1) ? (
        <p className="w-full">No order found!</p>
      ) : (
        (orderByPlatform.length > 0 || cartItems.length > 0) &&
        orderByPlatform.map((platformOrders, index) => {
          // variables for order platform

          const platformId = platformOrders[0].platform.id;
          const platformName = platformOrders[0].platform.name;
          const userHasPlatformCredential = user?.platforms.some(
            (platform) =>
              platform.id === platformId && !platform.has_sub_platforms
          );

          return (
            <div
              key={index}
              className="space-y-4 bg-white/10 p-2 py-4 rounded-lg"
            >
              {!userHasPlatformCredential && (
                <p className="text-center text-sm text-red-500">
                  You do not have any credential for this platform. Please add
                  your credential to continue.
                </p>
              )}

              <div className="flex flex-col gap-4">
                {platformOrders.map((order, index) => (
                  <CheckoutOrderCard key={index} order={order} />
                ))}
              </div>

              <div className="flex flex-col gap-2 border border-white/10 p-4 rounded-lg">
                <p className="text-sm flex flex-wrap gap-2 justify-between items-center border-b pb-2 border-white/10">
                  <span>Price</span>
                  <span>
                    $
                    {
                      // if dropdown or slider, do not include quantity
                      platformOrders
                        .reduce(
                          (acc, curr) =>
                            curr.is_dropdown || curr.is_slider
                              ? acc + Number(curr.price)
                              : acc + Number(curr.price * curr.quantity),

                          0
                        )
                        .toFixed(2)
                    }
                  </span>
                </p>

                <p className="text-sm flex flex-wrap gap-2 justify-between items-center">
                  Tax
                  <span>
                    $
                    {platformOrders
                      .reduce(
                        (acc, curr) =>
                          curr.is_dropdown || curr.is_slider
                            ? acc + Number(curr.tax) * curr.item_qty
                            : acc + Number(curr.tax) * curr.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </p>
              </div>

              {/* pay now */}
              <div className="flex flex-wrap gap-4">
                {!userHasPlatformCredential && (
                  <button
                    onClick={() =>
                      handleCredentialDialog(platformOrders[0].platform)
                    }
                    className="flex-1 bg-Gold rounded-lg p-2 text-base font-bold min-w-fit"
                  >
                    Add {platformName} Credential
                  </button>
                )}

                {/* show the dropdown of user subplatforms */}
                {!userHasPlatformCredential &&
                  user?.sub_platforms.length > 0 && (
                    <div className="flex flex-wrap gap-2 items-center flex-1 min-w-fit">
                      <select
                        value={selectedSubplatform}
                        onChange={(e) => setSelectedSubplatform(e.target.value)}
                        className="p-4 rounded-lg bg-white/10 border border-white/10 hover:border-white/20 w-full"
                      >
                        <option value="" className="bg-neutral-800">
                          Select a platform
                        </option>

                        {user?.sub_platforms.map((subplatform) => (
                          <option
                            key={subplatform.id}
                            value={subplatform.id}
                            className="bg-neutral-800"
                          >
                            {subplatform.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                <button
                  disabled={
                    cartItems.length < 1 ||
                    loading ||
                    error ||
                    totalPrice < 1 ||
                    (!userHasPlatformCredential && !selectedSubplatform)
                  }
                  type="button"
                  onClick={() => fetchClientSecret(platformOrders)}
                  className="min-w-fit w-full flex items-center flex-wrap-reverse gap-4 text-xl font-bold disabled:bg-gray-500/20 bg-Gold p-2 flex-1 max-w-xl px-4 rounded-lg hover:bg-Gold/80 justify-center mx-auto"
                >
                  <span>Pay Now</span>
                  <span>
                    $
                    {totalPrice &&
                      platformOrders
                        ?.reduce(
                          (acc, curr) =>
                            curr.is_dropdown || curr.is_slider
                              ? acc +
                                Number(curr.price) +
                                Number(curr.tax * curr.item_qty)
                              : acc +
                                Number(
                                  curr.price * curr.quantity +
                                    curr.tax * curr.quantity
                                ),
                          0
                        )
                        .toFixed(2)}
                  </span>
                </button>
              </div>
            </div>
          );
        })
      )}

      <div className="text-right text-2xl font-bold flex items-center justify-between gap-2 border border-white/10 rounded-lg p-4">
        <span>Total Price</span>
        <span>${totalPrice}</span>
      </div>

      {/* dialog */}
      <PlatformCredentialDialog
        dialogId={dialogId}
        dialogOpen={openDialog}
        onClose={() => setOpenDialog(false)}
        loadOrders={loadOrders}
        handleUserFetch={handleUserFetch}
      />
    </div>
  );
};

export default CheckoutPage;
