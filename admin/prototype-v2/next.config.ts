import path from "node:path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	/*
	  This project sits inside the `dashboard` docs repo, which is itself below a
	  directory containing another lockfile. Pin the root so Turbopack does not
	  infer a parent directory and warn on every build.
	*/
	turbopack: {
		root: path.join(__dirname),
	},

	/*
	  `typedRoutes` is deliberately off. The reusable components — StatCard,
	  DataTable's `hrefFor`, the Overview link rows — take `href` as a plain
	  string so they stay generic across all 18 features. Turning typed routes on
	  would force a cast at every one of those call sites, which buys less than it
	  costs in a prototype whose routes are generated from `config/navigation.ts`
	  anyway.
	*/
}

export default nextConfig
