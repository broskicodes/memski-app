"use client";

import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

const PostHogPageView = dynamic(() => import("../components/PosthogPageView"), {
  ssr: false,
});

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: false, // Disable automatic pageview capture, as we capture manually,
    person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
  });
}

export default function Template({ children }: PropsWithChildren) {
  return(
    <PostHogProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PostHogProvider>
  )

}