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
  const { data: user } = api.user.getUserBySupabaseId.useQuery(
    { id: authUser?.id ?? "" },
    { enabled: !!authUser?.id },
  );
  return user ? (
    <>
      <Link href="/library" className="mr-8 hover:opacity-80">Mening Kutubxonam</Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="border-input h-8 w-8 border-2 mr-8">
            {user.avatarUrl ? (
              <AvatarImage src={user.avatarUrl} alt="Profile photo preview" />
            ) : (
              <AvatarFallback>
                {user.name?.at(0) ?? user.email?.at(0)}
              </AvatarFallback>
            )}
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
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
    <div className="flex h-full">
      <Link className="flex items-center justify-center px-8 -ml-8 hover:opacity-70" href="/sign-in">
        Kirish
      </Link>
      <Link className="flex items-center justify-center bg-primary h-full px-8 text-white hover:bg-primary/90" href="/sign-up">
        Ro&apos;yxatdan otish
      </Link>
    </div>
  );
}
