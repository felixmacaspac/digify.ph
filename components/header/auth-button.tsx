import { signOutAction, getUserName, isLoggedIn } from "@/app/actions";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const supabase = await createClient();

  const { data: user, error: authError } = await supabase.auth.getUser();

  let fullname = "";

  if (authError) {
    console.log("Error fetching user:", authError.message);
  } else {
    const userId = user.user.id;

    fullname = (await getUserName(userId)) || "";
  }

  return (await isLoggedIn()) ? (
    <div className="flex items-center gap-4 ml-auto h-full">
      Hey, {fullname}!
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await signOutAction();
        }}
      >
        <button className="group bg-white relative inline-block text-sm font-medium text-black focus:outline-none rounded-lg">
          {" "}
          Sign out
        </button>{" "}
      </form>
    </div>
  ) : (
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
