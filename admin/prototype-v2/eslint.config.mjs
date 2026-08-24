import next from "eslint-config-next"

/*
  eslint-config-next 16 exports a flat-config array directly — no FlatCompat
  wrapper, which is the older `.eslintrc` bridge and crashes on this version.
*/
const config = [
	...next,
	{ ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
]

export default config
