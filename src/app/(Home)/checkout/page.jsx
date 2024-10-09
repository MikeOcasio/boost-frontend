"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
// import StripeCheckout from "react-stripe-checkout";

import { useUserStore } from "@/store/use-user";
import { useCartStore } from "@/store/use-cart";
import { fetchGameById, fetchCurrentUser } from "@/lib/actions";
import { CheckoutOrderCard } from "./_components/CheckoutOrderCard";
import { BiLoader } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";

const CheckoutPage = () => {
  const router = useRouter();
  const { userToken } = useUserStore();
  const { cartItems, emptyCart, totalPrice, setTotalPrice } = useCartStore();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const storedTotalPrice = localStorage.getItem("totalPrice");

    if (storedTotalPrice) {
      setTotalPrice(parseFloat(storedTotalPrice));
    }
  }, [setTotalPrice]);

  const checkUserSession = async () => {
    const currentUser = await fetchCurrentUser();
    if (currentUser?.error) {
      toast.error(currentUser.error);
      router.push("/login");
    }
  };

  useEffect(() => {
    if (!userToken) {
      router.push("/login");
    } else {
      checkUserSession();
    }
  }, [userToken, router]);

  // Fetch product details by id and check authenticity
  const loadOrders = async () => {
    setLoading(true);
    setError(false);
    let validOrders = [];
    let calculatedTotal = 0;

    try {
      for (const item of cartItems) {
        const product = await fetchGameById(item.id);
        if (product?.error) {
          // If any product is tampered with, clear the cart and prevent fraud
          emptyCart();
          toast.error("Invalid product in cart. Please try again!");
          return;
        } else {
          validOrders.push({
            ...item,
            platform_id: item.platform.id, // Adjust platform_id for backend requirement
          });
          calculatedTotal += parseFloat(item.price) * item.quantity;
        }
      }

      setOrders(validOrders);
      setTotalPrice(calculatedTotal.toFixed(2));
      localStorage.setItem("totalPrice", calculatedTotal.toFixed(2));
    } catch (error) {
      setError(true);
      toast.error("Failed to load orders. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userToken) {
      loadOrders();
    }
  }, [userToken]);

  // Handle Stripe Payment
  const handlePayment = async (token) => {
    try {
      const stripeAmount = Math.round(totalPrice * 100);

      const paymentResponse = await axios.post("/api/stripe-payment", {
        token,
        amount: stripeAmount,
      });

      if (paymentResponse.status === 200) {
        const paymentStatus =
          paymentResponse.data.status === "succeeded" ? "paid" : "failed";

        // Send order to API
        await sendOrderData(paymentStatus);
      }
    } catch (error) {
      toast.error("Payment failed. Please try again!");
    }
  };

  // Send order data to API after payment
  const sendOrderData = async (paymentStatus) => {
    const orderPayload = {
      products: orders.map((order) => ({
        product_id: order.id,
        quantity: order.quantity,
        platform_id: order.platform_id,
      })),
      total_price: totalPrice,
      payment_status: paymentStatus,
      promotion_id: null,
      date: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await axios.post(
        "http://18.225.8.157:3000/api/order/create",
        orderPayload
      );

      if (response.status === 200) {
        toast.success("Order placed successfully!");
        emptyCart(); // Clear cart after successful order
      }
    } catch (error) {
      toast.error("Failed to place order. Please try again!");
    }
  };

  console.log("orders", orders);

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

      {!loading &&
        !error &&
        (orders.length < 1 ? (
          <p className="w-full">No order found!</p>
        ) : (
          orders.length > 0 && (
            <div>
              <div className="flex flex-col gap-4">
                {orders.map((order, index) => (
                  <CheckoutOrderCard key={index} order={{ ...order }} />
                ))}
              </div>

              <div className="text-right text-2xl font-bold">
                Total Price: ${totalPrice}
              </div>

              {/* Stripe Payment Button */}
              {/* <StripeCheckout
            stripeKey={process.env.NEXT_PUBLIC_STRIPE_KEY} // Add your Stripe public key
            token={handlePayment}
            amount={totalPrice * 100} // Stripe expects the amount in cents
            name="Game Store Checkout"
            billingAddress
            shippingAddress
          /> */}
            </div>
          )
        ))}
    </div>
  );
};

export default CheckoutPage;
