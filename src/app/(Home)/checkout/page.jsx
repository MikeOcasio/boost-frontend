"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BiLoader } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";
// import { loadStripe } from "@stripe/stripe-js";

import { useUserStore } from "@/store/use-user";
import { useCartStore } from "@/store/use-cart";
import {
  fetchGameById,
  fetchCurrentUser,
  checkoutSession,
} from "@/lib/actions";
import { CheckoutOrderCard } from "./_components/CheckoutOrderCard";
import { createOrder } from "@/lib/actions/orders-action";

// load stripe
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const CheckoutPage = () => {
  const router = useRouter();
  const { userToken, setUser, removeToken } = useUserStore();
  const { cartItems, emptyCart, totalPrice, setTotalPrice } = useCartStore();

  const [orders, setOrders] = useState([]);
  const [orderByPlatform, setOrderByPlatform] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // fetch user info
  const handleUserFetch = async () => {
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
  };

  useEffect(() => {
    if (!userToken) {
      toast.error("Please login before checking out.");
      router.push("/login");
      setLoading(false);
      return;
    }

    handleUserFetch();
  }, [userToken]);

  const loadOrders = async () => {
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
            product_attribute_category_id:
              product.product_attribute_category_id,
            platform: item.platform,
            quantity: item.quantity,
          };

          validOrders.push(order);

          // Update total price, including tax
          calculatedTotal +=
            parseFloat(order.price) * order.quantity +
            parseFloat(order.tax) * order.quantity;

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

      console.log("groupedOrders", groupedOrders);

      setOrderByPlatform(groupedOrders);
      setOrders(validOrders);
      setTotalPrice(calculatedTotal.toFixed(2));

      localStorage.setItem("totalPrice", calculatedTotal.toFixed(2));
      localStorage.setItem("cartItems", JSON.stringify(validOrders));
    } catch (error) {
      setError(true);
      toast.error("Failed to load orders. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    console.log("orders ", orders);

    try {
      setLoading(true);
      const stripe = await stripePromise;

      // create checkout session
      const data = await checkoutSession(orders);

      console.log("checkout res data ", data);

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error(error.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    console.log("orders ", orders);
    // order data must be like this
    // {
    //   "order": {
    //     "user_id": 4,
    //     "state": "open",
    //     "platform": 6,
    //   },
    //   "product_ids": [
    //     18,
    //     20,
    //     19,
    //     18
    //   ]
    // }

    const data = {
      order: {
        user_id: 4,
        state: "open",
        platform: 6,
      },
      product_ids: [18, 20, 19, 18],
    };

    try {
    } catch (error) {}
  };

  useEffect(() => {
    if (userToken) {
      loadOrders();
    }
  }, [userToken, cartItems]);

  const convertToSubCurrency = (amount) => {
    return Math.round(amount * 100);
  };

  return (
    <div className="mt-24 max-w-7xl mx-auto min-h-screen space-y-6 p-4">
      <p className="text-center text-4xl font-title sm:text-5xl">Checkout</p>

      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load Orders. Please try again!
          {/* reload */}
          <button onClick={loadOrders} className="p-2 rounded-lg bg-white/10">
            Reload
          </button>
        </p>
      )}

      {(!loading && !error && orders?.length < 1) || cartItems?.length < 1 ? (
        <p className="w-full">No order found!</p>
      ) : (
        (orders.length > 0 || cartItems.length > 0) && (
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              {cartItems.map((order, index) => (
                <CheckoutOrderCard key={index} order={order} />
              ))}
            </div>

            <div className="flex flex-col gap-2 border border-white/10 p-4 rounded-lg">
              <p className="text-sm flex flex-wrap gap-2 justify-between items-center border-b pb-2 border-white/10">
                <span>Price</span>
                <span>
                  $
                  {orders.reduce(
                    (acc, curr) => acc + Number(curr.price * curr.quantity),
                    0
                  )}
                </span>
              </p>

              <p className="text-sm flex flex-wrap gap-2 justify-between items-center">
                Tax
                <span>
                  $
                  {orders.reduce(
                    (acc, curr) => acc + Number(curr.tax) * curr.quantity,
                    0
                  )}
                </span>
              </p>
            </div>

            <div className="text-right text-2xl font-bold flex items-center justify-between gap-2">
              <span>Total Price</span>
              <span>${totalPrice}</span>
            </div>

            {/* pay now */}
            <div className="w-full flex justify-center items-center">
              <button
                disabled={
                  cartItems.length < 1 || loading || error || totalPrice < 1
                }
                type="button"
                onClick={handleCheckout}
                className="disabled:bg-gray-500/20 bg-Gold p-2 rounded-lg w-full max-w-xl hover:bg-Gold/80 text-xl font-bold"
              >
                Pay Now
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default CheckoutPage;
