"use client"

import { ThemeProvider } from "next-themes"

import { SessionProvider } from "@/components/app/session-provider"

/*
  Light is the default rather than `system`.

  Admin work happens on a desk monitor in an office, usually next to the
  production storefront — which is a light surface. Following the OS instead
  meant anyone with a dark-themed OS never saw the light palette at all.

  `enableSystem` stays on, so "Match system" remains a choice in the topbar
  theme menu alongside Light and Dark; next-themes persists whatever the
  operator picks. Change `defaultTheme` here to "system" to restore the old
  behaviour.
*/
export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
			<SessionProvider>{children}</SessionProvider>
		</ThemeProvider>
	)
}
