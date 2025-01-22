"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";


interface cartItem {
  cart_id: string;
product: {
  product_id: string;
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

function calculateTotal(cart: cartItem[]): number {
  return cart.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0); // Start the total at 0
}


const CheckoutPage = () => {
  const router = useRouter();
  const supabase = createClient();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "credit-card",
  });

  const [cartItems, setCartItems] = useState<cartItem[]>([]);
  const [userID, setUserID] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { 
          data: { user: userData }, 
          error: userError 
        } = await supabase.auth.getUser();
  
        if (userError || !userData) {
          router.push("/sign-in");
          return;
        }

        setUserID(userData.id);

  
        // Fetch all data from the user by user ID from customers table
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('*') // Select all columns
          .eq('customer_id', userData.id) // Filter by user ID
          .single(); // Assuming there should be only one customer record per user
  
        if (customerError) {
          console.error("Error fetching customer data:", customerError);
          // Handle error, e.g., display an error message to the user
          return;
        }
  
        // Process the fetched customer data
        // Example: Update component state

        setFormData({
          firstName: customerData.first_name,
          lastName: customerData.last_name,
          email: userData.email,
          phone: customerData.phone,
          address: customerData.street,
          city: customerData.city,
          postalCode: customerData.zip,
          paymentMethod: "credit-card",
        });

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
        console.error("An error occurred:", error);
        // Handle general errors, e.g., display an error message to the user
      }
    };
  
    fetchData();
  }, [router]);


  const createOrder = async () => {
    try {
      // 1. Prepare order data
      const orderData = {
        customer_id: userID, // Get current user ID
        payment_method: formData.paymentMethod,
        order_total: calculateTotal(cartItems) + 50
      };

      // 2. Create a new order record
      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select();

      if (error) {
        console.error("Error creating order:", error);
        // Handle error, e.g., display an error message to the user
        return;
      }

      const orderId = data[0].order_id;

      // 3. Loop through cart items and create order_items records
      for (const cartItem of cartItems) {
        const orderItemData = {
          order_id: orderId,
          product_id: cartItem.product.product_id,
          quantity: cartItem.quantity,
        };

        const { error: itemError } = await supabase
          .from('order_items')
          .insert(orderItemData);

        if (itemError) {
          console.error("Error creating order item:", itemError);
          // Handle error, e.g., log the error or retry the insert
          continue; // Continue processing other cart items even if one fails
        }

        // Get current stock for the product
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('stocks')
          .eq('product_id', cartItem.product.product_id)
          .single();

        if (productError || !productData) {
          console.error("Error fetching product stock:", productError || "No product data found");
          continue; // Continue processing other cart items
        }

        const newStock = productData.stocks - cartItem.quantity;

        if (newStock < 0) {
          console.error(`Insufficient stock for product ID: ${cartItem.product.product_id}`);
          continue; // Skip this cart item if stock is insufficient
        }

        // Reduce stock in 'products' table
        const { error: stockError } = await supabase
          .from('products')
          .update({ stocks: newStock})
          .eq('product_id', cartItem.product.product_id);

        if (stockError) {
          console.error("Error updating product stock:", stockError);
          // Handle error appropriately
          continue;
        }

        // 5. Delete cart items
        const { error: deleteError } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cartItem.cart_id); // Assuming cart_id is unique

        if (deleteError) {
          console.error("Error deleting cart item:", deleteError);
          // Handle error, e.g., log the error or retry the delete
          continue; // Continue deleting other cart items
        }
      }

      // Redirect to success page, clear cart, etc.
      router.push(`/checkout/success?orderId=${orderId}`); 


    } catch (error) {
      console.error("An unexpected error occurred:", error);
      // Handle general errors, e.g., display an error message to the user
    }
  };

      // Calculate the total cost of the cart
      const cartTotal = cartItems.reduce(
        (total, item) => total + item.quantity * item.product.price,
        0
      );

  return (
    <section className="py-20 min-h-screen bg-gray-50">
      <div className="container max-w-6xl">
        <h1 className="text-3xl text-black font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <form className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" value={formData.firstName} required readOnly/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" value={formData.lastName} required readOnly/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} required readOnly/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} required readOnly/>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input id="address" name="address" value={formData.address} required readOnly/>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" value={formData.city} required readOnly/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input id="postalCode" name="postalCode" value={formData.postalCode} required readOnly/>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <RadioGroup
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <Label htmlFor="credit-card">Credit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash-on-delivery" id="cash" />
                    <Label htmlFor="cash">Cash on Delivery</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.cart_id} className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.product.product_code}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        <span>{(item.product.price * item.quantity).toFixed(2)}</span>
                      </p>
                    </div>
                  ))}

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₱{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>₱50.00</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total</span>
                      <span>₱{(cartTotal + 50).toFixed(2)}</span>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary hover:bg-primary/90 h-10 px-4 py-2 w-full mt-4 text- uppercase font-bold"
                    onClick={createOrder}
                  >
                    Place Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
