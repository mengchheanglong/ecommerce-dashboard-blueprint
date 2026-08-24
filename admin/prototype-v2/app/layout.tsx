import type { Metadata } from "next"
import { Plus_Jakarta_Sans, Kantumruy_Pro } from "next/font/google"

import "./globals.css"
import { Providers } from "./providers"
import { Toaster } from "@/components/ui/sonner"

/*
  Type is the production stack: Plus Jakarta Sans for Latin, Kantumruy Pro for
  Khmer. Both are loaded here rather than per-page so a Khmer merchant name in a
  table never falls back to a system face mid-column.
*/
const jakarta = Plus_Jakarta_Sans({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800"],
	variable: "--font-jakarta",
	display: "swap",
})

const kantumruy = Kantumruy_Pro({
	subsets: ["khmer", "latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-khmer",
	display: "swap",
})

export const metadata: Metadata = {
	title: "Angkoro Admin — V1 Prototype",
	description:
		"Internal admin system prototype for the Angkoro platform, built to the V1 PRD.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="en"
			className={`${jakarta.variable} ${kantumruy.variable}`}
			suppressHydrationWarning
		>
			<head>
				<link rel="icon" type="image/svg+xml" href="/logo.svg" />
				<link rel="alternate icon" type="image/png" href="/logo_icon.png" />
			</head>
			<body>
				<Providers>
					{children}
					<Toaster />
				</Providers>
			</body>
		</html>
	)
}
