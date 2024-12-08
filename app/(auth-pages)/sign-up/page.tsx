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
        <h1 className="text-4xl text-center uppercase font-bold">Sign up</h1>
        <p className="text-base italic text-center text-black">
          Already have an account?{" "}
          <Link
            className="text-black font-semibold underline uppercase"
            href="/sign-in"
          >
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8 uppercase text-black">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="YOU@EXAMPLE.COM" required />
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="YOUR PASSWORD"
            minLength={6}
            required
          />
          <Label htmlFor="first_name">First Name</Label>
          <Input
            type="text"
            name="first_name"
            placeholder="(EX. JUAN)"
            minLength={1}
            required
          />
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            type="text"
            name="last_name"
            placeholder="(EX. DELA CRUZ)"
            minLength={1}
            required
          />
          <Label htmlFor="street">Street</Label>
          <Input
            type="text"
            name="street"
            placeholder="(EX. 1234 EXAMPLE ST)"
            minLength={6}
            required
          />
          <Label htmlFor="city">City</Label>
          <Input
            type="text"
            name="city"
            placeholder="(EX. IMUS CAVITE)"
            minLength={6}
            required
          />
          <Label htmlFor="province">Province</Label>
          <Input
            type="text"
            name="province"
            placeholder="(EX. CAVITE)"
            minLength={6}
            required
          />
          <Label htmlFor="zip">Zip Code</Label>
          <Input
            type="number"
            name="zip"
            placeholder="(EX. 4103)"
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
