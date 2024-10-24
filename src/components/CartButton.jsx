import {
  BiCart,
  BiCross,
  BiImage,
  BiMinus,
  BiPlus,
  BiTrash,
} from "react-icons/bi";
import {
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { useCartStore } from "@/store/use-cart";
import Link from "next/link";
import Image from "next/image";

export const CartButton = ({ mobileNav }) => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    totalPrice,
  } = useCartStore();

  return (
    <Popover>
      {mobileNav ? (
        <PopoverButton className="w-full group relative flex flex-wrap items-center gap-x-6 rounded-lg my-2 p-2 hover:bg-yellow-600/30">
          <BiCart className="bg-inherit p-2 h-11 w-11 rounded-lg" />
          <span>Cart</span>
        </PopoverButton>
      ) : (
        <PopoverButton className="outline-none border-none">
          <BiCart className="h-10 w-10 p-2 rounded-lg hover:bg-Plum/30 border border-white/10 -mb-1.5" />
        </PopoverButton>
      )}

      <PopoverBackdrop
        transition
        className="fixed h-[120vh] -mt-10 -mx-10 top-0 inset-0 bg-black/50 backdrop-blur-sm z-50"
      />

      <PopoverPanel
        focus
        transition
        className="fixed max-w-2xl min-h-40 mx-auto inset-x-4 top-20 z-50 origin-top rounded-xl p-4 ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-zinc-800 overflow-y-auto transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
      >
        <div className="flex flex-row-reverse items-center justify-between">
          <PopoverButton aria-label="Close menu" className="p-1">
            <BiCross className="h-6 w-6 text-zinc-500 dark:text-zinc-400 rotate-45" />
          </PopoverButton>

          <h3 className="text-lg font-semibold">Cart</h3>
        </div>

        {cartItems?.length < 1 ? (
          <p className="text-sm text-gray-300 text-center mt-4">
            Your cart is empty. Add items to your cart to continue.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {cartItems?.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap gap-4 items-center border-b border-white/10 pb-2"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    quality={100}
                    width={100}
                    height={100}
                    className="mx-auto w-[100px] object-contain bg-white/10 rounded-md p-2"
                  />
                ) : (
                  <BiImage className="h-24 w-24 bg-white/10 p-2 rounded-md" />
                )}

                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{item.name}</p>

                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm px-2 bg-white/10 rounded-md">
                        {item.platform?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="p-1 border border-white/10 bg-white/10 hover:border-white/20 rounded-md"
                      >
                        <BiMinus className="h-5 w-5" />
                      </button>

                      <p>{item.quantity}</p>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="p-1 border border-white/10 bg-white/10 hover:border-white/20 rounded-md"
                      >
                        <BiPlus className="h-5 w-5" />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 border border-white/10 bg-white/10 hover:border-white/20 rounded-md"
                        >
                          <BiTrash className="h-5 w-5 text-red-600" />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <p className="text-lg font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* total price */}
            <div className="flex flex-wrap gap-4 justify-between items-center">
              <p>Total Price</p>
              <p className="text-lg font-semibold">${totalPrice}</p>
            </div>

            <Link href="/checkout">
              <button className="w-full mt-4 p-2 rounded-lg bg-Gold/90">
                Buy Now
              </button>
            </Link>
          </div>
        )}
      </PopoverPanel>
    </Popover>
  );
};
