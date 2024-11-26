"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { Authenticated, AuthLoading } from "convex/react";
import LoadingLogo from "@/components/shared/LoadingLogo";

export default function ConvexClientProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const convexURL = process.env.NEXT_PUBLIC_CONVEX_URL || "";

  const convexClient = new ConvexReactClient(convexURL);

  return (
    <ClerkProvider>
      <ConvexProviderWithClerk useAuth={useAuth} client={convexClient}>
        <Authenticated>{children}</Authenticated>
        <AuthLoading>
          <LoadingLogo />
        </AuthLoading>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
