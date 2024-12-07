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
    <div className="flex items-center gap-4">
      Hey, {fullname}!
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await signOutAction();
        }}
      >
        <button className="group bg-white relative inline-block text-sm font-medium text-black focus:outline-none rounded-lg">
          <span className="absolute inset-0 translate-x-1 translate-y-1 bg-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0 rounded-lg"></span>
          <span className="relative text-base font-semibold block border border-current bg-primary px-8 py-3 rounded-lg">
            {" "}
            Sign out
          </span>
        </button>{" "}
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Link
        href="/sign-in"
        className="group bg-white relative inline-block text-sm font-medium text-black focus:outline-none rounded-lg"
      >
        <span className="absolute inset-0 translate-x-1 translate-y-1 bg-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0 rounded-lg"></span>
        <span className="relative text-base font-semibold block border border-current bg-primary px-8 py-3 rounded-lg">
          {" "}
          Login
        </span>
      </Link>{" "}
    </div>
  );
}
