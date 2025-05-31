import { signUpAction } from "~/app/actions";
import { FormMessage, type Message } from "~/components/form-message";
import Link from "next/link";
import { createClient } from "~/utils/supabase/server";
import { redirect } from "next/navigation";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const UZBEKISTAN_REGIONS = [
  "Toshkent shahri",
  "Andijon viloyati",
  "Buxoro viloyati",
  "Farg'ona viloyati",
  "Jizzax viloyati",
  "Xorazm viloyati",
  "Namangan viloyati",
  "Navoiy viloyati",
  "Qashqadaryo viloyati",
  "Qoraqalpog'iston Respublikasi",
  "Samarqand viloyati",
  "Sirdaryo viloyati",
  "Surxondaryo viloyati",
  "Toshkent viloyati",
];

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
      <div className="flex h-screen w-full flex-1 items-center justify-center gap-2 p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-257px)] w-full p-8 flex items-center">
      <div className="max-w-md z-10 w-full shrink-0 ml-30">
        <Card className="w-full rounded-none">
          <CardHeader>
            <CardTitle>Ro&apos;yxatdan o&apos;tish</CardTitle>
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
                <label htmlFor="name" className="text-sm font-medium">
                  Ismingiz
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Ismingizni kiriting"
                  required
                  className="h-12 rounded-none"
                />
              </div>
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
              </div>
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">
                  Hududingiz
                </label>
                <Select name="location" required>
                  <SelectTrigger className="h-12 rounded-none">
                    <SelectValue placeholder="Hududni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {UZBEKISTAN_REGIONS.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button formAction={signUpAction} className="w-full h-12 rounded-none">
                Ro&apos;yxatdan o&apos;tish
              </Button>
              <FormMessage message={searchParams} />
            </form>
          </CardContent>
        </Card>
      </div>
      <img
        src="/fargoniy.png"
        alt=""
        className="absolute z-0 right-0 bottom-0 top-0 h-full"
      />
    </div>
  );
}
