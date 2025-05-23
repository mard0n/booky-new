import Link from "next/link";
import { createClient } from "~/utils/supabase/server";
import { signOutAction } from "~/app/actions";
import { AuthButton } from "./auth-button";
import Search from "./Search";

export function Logo() {
  return (
    <Link className="text-2xl" href="/">
      <img src="/Booky.svg" alt="Booky" className="h-8" />
    </Link>
  );
}

function Explore() {
  return <Link className="hover:opacity-80" href="/explore">Tanishish</Link>;
}

function Divider() {
  return (
    <div className="block h-full w-[1px] self-stretch border-r mx-8 " />
  );
}

export default async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user:authUser },
  } = await supabase.auth.getUser()

  return (
    <div className="flex h-20 items-center justify-between border-b">
      <div className="ml-8">
      <Logo />
      </div>
      <Divider />
      <Search />
      <Divider />
      <Explore />
      <Divider />
      <AuthButton authUser={authUser} signOut={signOutAction} />
    </div>
  );
}
