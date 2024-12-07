import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <form className="flex-1 flex flex-col my-40 w-full max-w-lg mx-auto">
      <h1 className="text-4xl text-center uppercase font-bold">
        Welcome back!
      </h1>
      <p className="text-base italic text-center text-foreground">
        Please log in to continue
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8 uppercase">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="YOU@EXAMPLE.COM" required />
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <Link
            className="text-xs text-foreground uppercase"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
        <Input
          type="password"
          name="password"
          placeholder="YOUR PASSWORD"
          required
        />
        <SubmitButton pendingText="Signing In..." formAction={signInAction}>
          LOG IN
        </SubmitButton>
        <p className="text-sm text-foreground">
          Don't have an account?{" "}
          <Link
            className="text-foreground font-medium underline"
            href="/sign-up"
          >
            Sign up
          </Link>
        </p>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
