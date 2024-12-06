import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className="flex-1 flex flex-col my-40 w-full max-w-lg mx-auto">
        <h1 className="text-2xl font-medium">Sign up</h1>
        <p className="text-sm text text-foreground">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />
          <Label htmlFor="first_name">First Name</Label>
          <Input
            type="text"
            name="first_name"
            placeholder="(ex. John)"
            minLength={1}
            required
          />
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            type="text"
            name="last_name"
            placeholder="(ex. Smith)"
            minLength={1}
            required
          />
          <Label htmlFor="street">Street</Label>
          <Input
            type="text"
            name="street"
            placeholder="(ex. Westgrove St.)"
            minLength={6}
            required
          />
          <Label htmlFor="city">City</Label>
          <Input
            type="text"
            name="city"
            placeholder="(ex. New York City)"
            minLength={6}
            required
          />
          <Label htmlFor="state">State</Label>
          <Input
            type="text"
            name="state"
            placeholder="(ex. Alabama)"
            minLength={6}
            required
          />
          <Label htmlFor="zip">Zip Code</Label>
          <Input
            type="number"
            name="zip"
            placeholder="(ex. 1234)"
            minLength={1}
            required
          />
          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            Sign up
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </>
  );
}
