import { signInAction } from "~/app/actions";
import { FormMessage, type Message } from "~/components/form-message";
// import { SubmitButton } from "@/components/submit-button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import Link from "next/link";
import { createClient } from "~/utils/supabase/server";
import { redirect } from "next/navigation";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "~/components/ui/card";

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
    <div className="relative flex min-h-[calc(100vh-257px)] w-full items-center p-8">
      <div className="z-10 ml-30 w-full max-w-md shrink-0">
        <Card className="w-full rounded-none">
          <CardHeader>
            <CardTitle>Tizimga kirish</CardTitle>
            <CardDescription>
              Akkauntingiz yo&apos;qmi?{" "}
              <Link
                className="text-primary font-medium underline"
                href="/sign-up"
              >
                Ro&apos;yxatdan o&apos;tish
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
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Parol
                </label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Parolingiz"
                  minLength={6}
                  required
                  className="h-12 rounded-none"
                />
                <Link
                  className="text-foreground text-xs underline"
                  href="/forgot-password"
                >
                  Parolni unutdingizmi?
                </Link>
              </div>
              <Button
                formAction={signInAction}
                className="h-12 w-full rounded-none"
              >
                Kirish
              </Button>
              <FormMessage message={searchParams} />
            </form>
          </CardContent>
        </Card>
      </div>
      <img
        src="/xorazmiy.png"
        alt=""
        className="absolute top-0 right-0 bottom-0 z-0 h-full"
      />
    </div>
  );
}
