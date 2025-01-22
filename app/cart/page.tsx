"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface cartItem {
      cart_id: string;
    product: {
      product_code: string;
      brand: string;
      megapixels: string;
      sensor_size: string;
      sensor_type: string;
      price: number;
      stocks: string;
      product_image: string;
    };
    quantity: number;
}


const CartPage = () => {
  const supabase = createClient();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<cartItem[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const {
          data: { user: userData },
          error: userError,
        } = await supabase.auth.getUser();
  
        if (userError || !userData) {
          router.push("/sign-in");
          return;
        }
    
  
        //fetch cart items based on the user_id
  
        const { data: cartData, error : cartError} = await supabase
          .from('cart_items')
          .select("cart_id, product_id, quantity")
          .eq("customer_id", userData.id);
  
        if (cartError) {
          router.push("/products");
          return;
        }
  
        // Extract all product IDs from the cart
        const productIds = cartData.map((item) => item.product_id);
  
        // Fetch product data for all product IDs
        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("*")
          .in("product_id", productIds);
  
        if (productError || !productData) {
          console.error("Error fetching product data:", productError);
          router.push("/products");
          return;
        }
  
        // Merge product data into cart items
        const mergedCartData = cartData.map((item) => ({
          ...item,
          product: productData.find((product) => product.product_id === item.product_id),
        }));
  
  
        setCartItems(mergedCartData);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
      
    };
  

    fetchCartData();
  }, [router]);


  const removeItem = async (cartId: string) => {
    try {
      // Remove item from the database
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("cart_id", cartId);

      if (error) {
        console.error("Error removing item from cart:", error);
        return;
      }

      // Update the UI
      setCartItems((prevItems) => prevItems.filter((item) => item.cart_id !== cartId));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };


  if (loading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  
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
                <Card key={item.cart_id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded">
                        {item.product.product_image && (
                          <img
                            src={item.product.product_image}
                            alt={item.product.product_code}
                            className="w-full h-full object-cover rounded"
                          />
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-medium">{item.product.product_code}</h3>
                        <p className="text-gray-600">₱{item.product.price}</p>
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

                      <div className="w-24 text-right">₱{item.quantity * item.product.price}</div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => removeItem(item.cart_id)}
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

              <Link
                href="/checkout"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary hover:bg-primary/90 h-10 px-4 py-2 w-full mt-4 text- uppercase font-bold"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CartPage;
