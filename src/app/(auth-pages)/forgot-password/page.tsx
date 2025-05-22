import { forgotPasswordAction } from "~/app/actions";
import { FormMessage, type Message } from "~/components/form-message";
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
          <h1 className="text-2xl font-medium">Parolni tiklash</h1>
          <p className="text-sm text-secondary-foreground">
            Akkauntingiz bormi?{" "}
            <Link className="text-primary underline" href="/sign-in">
              Tizimga kirish
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <label htmlFor="email">Email</label>
          <input name="email" placeholder="siz@misol.com" required />
          <button formAction={forgotPasswordAction}>
            Parolni tiklash
          </button>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </>
  );
}
