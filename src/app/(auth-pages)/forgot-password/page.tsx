import { forgotPasswordAction } from "~/app/actions";
import { FormMessage, type Message } from "~/components/form-message";
// import { SubmitButton } from "~/components/submit-button";
// import { Input } from "~/components/ui/input";
// import { Label } from "~/components/ui/label";
import Link from "next/link";
import { createClient } from "~/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ForgotPassword(props: {
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
  
  return (
    <>
      <form className="flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6 min-w-64 max-w-64 mx-auto">
        <div>
          <h1 className="text-2xl font-medium">Reset Password</h1>
          <p className="text-sm text-secondary-foreground">
            Already have an account?{" "}
            <Link className="text-primary underline" href="/sign-in">
              Sign in
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <label htmlFor="email">Email</label>
          <input name="email" placeholder="you@example.com" required />
          <button formAction={forgotPasswordAction}>
            Reset Password
          </button>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </>
  );
}
