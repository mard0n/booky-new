import { signInAction } from "~/app/actions";
import { FormMessage, type Message } from "~/components/form-message";
// import { SubmitButton } from "@/components/submit-button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import Link from "next/link";
import { createClient } from "~/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/");
  }

  return (
    <form className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium">Tizimga kirish</h1>
      <p className="text-sm text-foreground">
        Akkauntingiz yo&apos;qmi?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Ro&apos;yxatdan o&apos;tish
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <label htmlFor="email">Email</label>
        <input name="email" placeholder="siz@misol.com" required />
        <div className="flex justify-between items-center">
          <label htmlFor="password">Parol</label>
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Parolni unutdingizmi?
          </Link>
        </div>
        <input
          type="password"
          name="password"
          placeholder="Parolingiz"
          required
        />
        <button formAction={signInAction}>
          Kirish
        </button>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
