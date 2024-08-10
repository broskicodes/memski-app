"use client";

import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

const PostHogPageView = dynamic(() => import("../components/PosthogPageView"), {
  ssr: false,
});

if (typeof window !== "undefined") {
  try {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false,
      person_profiles: 'identified_only',
    });
  } catch (error) {
    console.warn("PostHog initialization failed. Analytics will be disabled.", error);
    // Implement fallback or disable analytics
  }
}

export default function Template({ children }: PropsWithChildren) {
  return(
    <PostHogProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PostHogProvider>
  )

}