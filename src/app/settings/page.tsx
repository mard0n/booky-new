"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { FormMessage, type Message } from "~/components/form-message";
import { api } from "~/trpc/react";
import { createClient } from "~/utils/supabase/client";

export default function SettingsPage() {
  // Placeholder state for user data
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState<Message | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null);

  // Track initial user data for dirty check
  const [initialData, setInitialData] = useState({
    name: "",
    location: "",
    avatarUrl: null as string | null,
  });

  // Get current user from Supabase Auth
  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => {
        if (user) setSupabaseUserId(user.id);
      });
  }, []);

  // Fetch user profile from tRPC
  const userQuery = api.user.getUserBySupabaseId.useQuery(
    { id: supabaseUserId ?? "" },
    { enabled: !!supabaseUserId },
  );

  // Populate form fields when user data is loaded
  useEffect(() => {
    if (userQuery.data) {
      setUsername(userQuery.data.name ?? "");
      setEmail(userQuery.data.email ?? "");
      setLocation(userQuery.data.location ?? "");
      setProfilePhoto(userQuery.data.avatarUrl ?? null);
      setInitialData({
        name: userQuery.data.name ?? "",
        location: userQuery.data.location ?? "",
        avatarUrl: userQuery.data.avatarUrl ?? null,
      });
    }
  }, [userQuery.data]);

  // Auto-clear success message after 3 seconds
  useEffect(() => {
    if (message && "success" in message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Determine if there are unsaved changes
  const isDirty =
    username !== initialData.name ||
    location !== initialData.location ||
    photoFile !== null ||
    profilePhoto !== initialData.avatarUrl;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setMessage({ error: "Faqat rasmlar ruxsat etiladi." });
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ error: "Fayl hajmi 2MB dan kichik bo'lishi kerak." });
        return;
      }
      setPhotoFile(file);
      setProfilePhoto(URL.createObjectURL(file));
    }
  };

  const updateProfile = api.user.updateProfile.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!supabaseUserId) {
      setMessage({ error: "Foydalanuvchi autentifikatsiyadan o'tmagan." });
      return;
    }
    let avatarUrl = profilePhoto;
    try {
      // Upload new photo if selected
      if (photoFile) {
        const supabase = createClient();
        const fileExt = photoFile.name.split(".").pop();
        const filePath = `avatars/${supabaseUserId}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(filePath, photoFile, { upsert: true });
        if (uploadError) throw uploadError;
        // Get public URL
        const { data } = supabase.storage.from("images").getPublicUrl(filePath);
        avatarUrl = data.publicUrl;
      }
      // If photo was removed, set avatarUrl to undefined
      if (!profilePhoto && !photoFile) {
        avatarUrl = null;
      }
      await updateProfile.mutateAsync({
        supabaseUserId,
        name: username,
        location,
        avatarUrl: avatarUrl ?? undefined,
      });
      setMessage({ success: "Profil muvaffaqiyatli yangilandi!" });
      userQuery.refetch();
      setPhotoFile(null);
    } catch (err: unknown) {
      setMessage({
        error:
          (err as { message?: string })?.message ??
          "Profilni yangilashda xatolik yuz berdi.",
      });
    }
  };

  // Remove profile photo handler
  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    setPhotoFile(null);
  };

  // Loading state
  if (userQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-muted-foreground">Yuklanmoqda...</span>
      </div>
    );
  }

  return (
    <div className="bg-muted/10 flex min-h-[calc(100vh-257px)] items-center justify-center py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-background relative flex w-full max-w-xl flex-col gap-6 rounded-none border p-8 shadow-md"
        aria-label="Account settings form"
      >
        <h2 className="text-2xl font-semibold">Hisob sozlamalari</h2>
        <div className="flex items-center gap-4">
          <label
            htmlFor="profile-photo"
            className="group flex cursor-pointer items-center gap-2"
          >
            <Avatar className="border-input h-16 w-16 border-2">
              {profilePhoto ? (
                <AvatarImage src={profilePhoto} alt="Profile photo preview" />
              ) : (
                <AvatarFallback>
                  {username?.at(0) ?? email?.at(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="ml-2 group-hover:underline">Rasm yuklash</span>
            <input
              id="profile-photo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
              aria-label="Profile photo upload"
              disabled={updateProfile.isPending}
            />
          </label>
          {profilePhoto && (
            <Button
              type="button"
              variant="destructive"
              className=""
              onClick={handleRemovePhoto}
              disabled={updateProfile.isPending}
            >
              O&apos;chirish
            </Button>
          )}
        </div>
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <label htmlFor="username" className="font-semibold">
              Foydalanuvchi nomi
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Foydalanuvchi nomingizni kiriting"
              required
              disabled={updateProfile.isPending}
              aria-required="true"
            />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <Input
              id="email"
              value={email}
              readOnly
              className="bg-muted/50 cursor-not-allowed"
              aria-readonly="true"
              disabled={updateProfile.isPending}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="location" className="font-semibold">
            Manzil
          </label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Manzilingizni kiriting"
            disabled={updateProfile.isPending}
          />
        </div>
        {message && (
          <div aria-live="polite">
            <FormMessage message={message} />
          </div>
        )}
        <Button
          size="lg"
          type="submit"
          className="px-4"
          disabled={updateProfile.isPending || !isDirty}
        >
          {updateProfile.isPending
            ? "Saqlanmoqda..."
            : "O'zgarishlarni saqlash"}
        </Button>
      </form>
    </div>
  );
}
