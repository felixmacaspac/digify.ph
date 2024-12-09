import { signOutAction, getCustomerFullName } from "@/app/actions";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Button } from "../ui/button";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const fullname = await getCustomerFullName(user?.id);

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

  return (
    <div className="flex ml-auto uppercase items-center h-full">
      <span className="pr-10">Hey, {fullname}!</span>
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
