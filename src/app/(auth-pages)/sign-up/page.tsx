import { signUpAction } from "~/app/actions";
import { FormMessage, type Message } from "~/components/form-message";
// import { SubmitButton } from "@/components/submit-button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import Link from "next/link";
import { createClient } from "~/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/");
  }



  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className="flex flex-col min-w-64 max-w-64 mx-auto">
        <h1 className="text-2xl font-medium">Sign up</h1>
        <p className="text-sm text text-foreground">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <label htmlFor="email">Email</label>
          <input name="email" placeholder="you@example.com" required />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />
          <button formAction={signUpAction}>
            Sign up
          </button>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </>
  );
}
