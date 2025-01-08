"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus } from "lucide-react";

const cartItems = [
  {
    id: 1,
    products: {
      name: "Product 1",
      price: 10,
      image_url: "https://placehold.co/600x400",
    },
    quantity: 10,
  },
  {
    id: 2,
    products: {
      name: "Product 2",
      price: 20,
      image_url: "https://placehold.co/600x400",
    },
    quantity: 2,
  },
];

const CartPage = () => {
  return (
    <section className="py-20 min-h-screen">
      <div className="container max-w-4xl">
        <h1 className="text-3xl text-black font-bold mb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded">
                        {item.products.image_url && (
                          <img
                            src={item.products.image_url}
                            alt={item.products.name}
                            className="w-full h-full object-cover rounded"
                          />
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-medium">{item.products.name}</h3>
                        <p className="text-gray-600">₱150.00</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          // onClick={() =>
                          //   updateQuantity(item.id, item.quantity - 1)
                          // }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <span className="w-8 text-center">{item.quantity}</span>

                        <Button
                          variant="outline"
                          size="icon"
                          // onClick={() =>
                          //   updateQuantity(item.id, item.quantity + 1)
                          // }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="w-24 text-right">₱150.00</div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        // onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-black flex justify-between items-center">
                <span className="font-bold uppercase">Total</span>
                <span className="text-xl font-bold">₱300.00</span>
              </div>

              <Button className="w-full mt-4 text- uppercase font-bold">
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CartPage;
