import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Button } from "../ui/button";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();


  async function getCartItemCount(customerId: string) {
    try {
      // Fetch the count of cart items for the given customer_id
      const { count, error } = await supabase
        .from('cart_items')
        .select('*', { count: 'exact', head: true }) // Use head: true to fetch only the count
        .eq('customer_id', customerId);
  
      // Handle potential errors
      if (error) {
        console.error('Error fetching cart item count:', error);
        throw new Error('Failed to fetch cart item count');
      }
  
      // Return the count (or 0 if no items are found)
      return count || 0;
    } catch (err) {
      console.error('Unexpected error:', err);
      throw new Error('An unexpected error occurred');
    }
  }

  if (!user) {
    return (
      <div className="flex ml-auto uppercase h-full items-center">
        <Link
          href="/sign-in"
          className="flex items-center pr-10 h-full relative after:content-[''] after:right-0 after:bg-black after:w-[1px] after:h-full after:absolute after:top-0"
        >
          Cart (0)
        </Link>{" "}
        <Link
          href="/sign-in"
          className="flex items-center px-10 h-full relative after:content-[''] after:right-0 after:bg-black after:w-[1px] after:h-full after:absolute after:top-0"
        >
          Log in
        </Link>{" "}
        <Link className="flex items-center pl-10 h-full" href="/sign-up">
          Sign up
        </Link>{" "}
      </div>
    );
  }

  
  let no_of_cart_items = await getCartItemCount(user.id);

  return (
    <div className="flex ml-auto uppercase items-center h-full">
      <Link
        href="/cart"
        className="flex items-center pr-10 h-full relative after:content-[''] after:right-0 after:bg-black after:w-[1px] after:h-full after:absolute after:top-0"
      >
        Cart ({no_of_cart_items})
      </Link>{" "}
      <Link href="/profile" className="flex items-center px-10 h-full">
        PROFILE
      </Link>
      <form action={signOutAction} className="h-full">
        <Button
          type="submit"
          className="uppercase text-base cursor-pointer hover:bg-transparent flex items-center px-10 h-full relative after:content-[''] after:left-0 after:bg-black after:w-[1px] after:h-full after:absolute after:top-0 bg-transparent"
        >
          Sign out
        </Button>
      </form>
    </div>
  );
}
