import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <>
      <form className="flex-1 flex flex-col my-40 w-full max-w-lg mx-auto">
        <div>
          <h1 className="text-4xl text-center uppercase font-bold">
            Reset Password
          </h1>
          <p className="text-base italic text-center text-black">
            Already have an account?{" "}
            <Link
              className="text-black font-semibold underline uppercase"
              href="/sign-in"
            >
              Sign in
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8 text-black">
          <Label htmlFor="email">EMAIL</Label>
          <Input name="email" placeholder="YOU@EXAMPLE.COM" required />
          <SubmitButton formAction={forgotPasswordAction}>
            Reset Password
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </>
  );
}
