'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import Link from "next/link"
import { type User } from "@supabase/supabase-js"

interface AuthButtonProps {
  user: User | null
  signOut: () => Promise<void>
}

export function AuthButton({ user, signOut }: AuthButtonProps) {
  return user ? (
    <>
      <Link href="/library">Library</Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarFallback>
              B
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">Account settings</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={() => signOut()}
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  ) : (
    <div className="flex gap-8">
      <button>
        <Link href="/sign-in">Sign in</Link>
      </button>
      <button>
        <Link href="/sign-up">Sign up</Link>
      </button>
    </div>
  )
}