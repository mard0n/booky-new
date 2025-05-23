import { forgotPasswordAction, signInAction } from "~/app/actions";
import { FormMessage, type Message } from "~/components/form-message";
import Link from "next/link";
import { createClient } from "~/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";

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
      {/* <form className="flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6 min-w-64 max-w-64 mx-auto">
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
      </form> */}
      <div className="relative flex min-h-[calc(100vh-257px)] w-full items-center p-8">
      <div className="z-10 ml-30 w-full max-w-md shrink-0">
        <Card className="w-full rounded-none">
          <CardHeader>
            <CardTitle>Parolni tiklash</CardTitle>
            <CardDescription>
            Akkauntingiz bormi?{" "}
              <Link
                className="text-primary font-medium underline"
                href="/sign-in"
              >
                Tizimga kirish
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="siz@misol.com"
                  required
                  className="h-12 rounded-none"
                />
              </div>
              <Button
                formAction={forgotPasswordAction}
                className="h-12 w-full rounded-none"
              >
                Parolni tiklash
              </Button>
              <FormMessage message={searchParams} />
            </form>
          </CardContent>
        </Card>
      </div>
      <img
        src="/navoiy.png"
        alt=""
        className="absolute top-0 right-0 bottom-0 z-0 h-full"
      />
    </div>
    </>
  );
}
