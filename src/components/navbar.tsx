import Link from "next/link";
import { createClient } from "~/utils/supabase/server";
import { signOutAction } from "~/app/actions";
import { AuthButton } from "./auth-button";
import Search from "./Search";

function Logo() {
  return (
    <Link className="text-2xl" href="/">
      Booky
    </Link>
  );
}

function Explore() {
  return <Link href="/explore">Explore</Link>;
}

function Divider() {
  return (
    <div className="inline-block h-full min-h-[1em] w-[1px] self-stretch bg-neutral-200 dark:bg-neutral-600" />
  );
}

export default async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex h-20 items-center justify-between gap-8 px-8 border-neutral-200 dark:border-neutral-600 border-b">
      <Logo />
      <Divider />
      <Search />
      <Divider />
      <Explore />
      <Divider />
      <AuthButton user={user} signOut={signOutAction} />
    </div>
  );
}
