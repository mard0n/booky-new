"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Link from "next/link";
import type { AuthUser } from "~/server/db/schema";
import { api } from "~/trpc/react";

interface AuthButtonProps {
  authUser: AuthUser | null;
  signOut: () => Promise<void>;
}

export function AuthButton({ authUser, signOut }: AuthButtonProps) {
  console.log('authUser', authUser);
  
  const { data: user } = api.user.getUserBySupabaseId.useQuery(
    { id: authUser?.id ?? "" },
    { enabled: !!authUser?.id }
  );
  console.log('user', user);
  return user ? (
    <>
      <Link href="/library">Mening Kutubxonam</Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="border-input h-8 w-8 border-2">
            {user.avatarUrl ? (
              <AvatarImage src={user.avatarUrl} alt="Profile photo preview" />
            ) : (
              <AvatarFallback>{user.name?.at(0) ?? user.email?.at(0)}</AvatarFallback>
            )}
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {/* <DropdownMenuItem asChild>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem> */}
          <DropdownMenuItem asChild>
            <Link href="/settings">Hisobni sozlash</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={() => signOut()}
          >
            Chiqish
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  ) : (
    <div className="flex gap-8">
      <button>
        <Link href="/sign-in">Kirish</Link>
      </button>
      <button>
        <Link href="/sign-up">Ro&apos;yxatdan otish</Link>
      </button>
    </div>
  );
}
