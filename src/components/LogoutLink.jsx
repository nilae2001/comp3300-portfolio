"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

export default function LogoutLink() {
  const { user, isLoading } = useUser();

  if (isLoading) return null;
  if (!user) return null; 

  return (
    <a
      href="/auth/logout"
      className="text-red-500 underline mt-4 block"
    >
      Log Out
    </a>
  );
}
