"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Props = {
  children: ReactNode;
  allowedRoles?: string[]; // e.g. ['CUSTOMER', 'PROVIDER']
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in
        router.push("/login");
      } else if (
        allowedRoles &&
        !allowedRoles.includes(user.role.toUpperCase())
      ) {
        // Logged in but unauthorized
        router.push("/");
      }
    }
  }, [user, loading, router, allowedRoles]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
