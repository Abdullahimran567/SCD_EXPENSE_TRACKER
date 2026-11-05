/** @type {import('dependency-cruiser').IConfiguration} */
export default {
	forbidden: [
		{
			name: "controllers-only-to-services-or-utils",
			comment: "Controllers may only import from services, utils, or external libraries (not repositories or db directly)",
			severity: "error",
			from: { path: "^src/controller/" },
			to: {
				path: ["^src/repositories/", "^src/config/db\\.js$"],
			},
		},
		{
			name: "services-only-to-repositories-or-utils",
			comment: "Services may only import from repositories, utils, or other services (never controllers or db directly)",
			severity: "error",
			from: { path: "^src/services/" },
			to: {
				path: ["^src/controller/", "^src/config/db\\.js$"],
			},
		},
		{
			name: "only-repositories-import-db",
			comment: "Only repositories, tests, or config/app/index setup may import the database client",
			severity: "error",
			from: {
				pathNot: ["^src/repositories/", "^src/config/", "^src/app\\.js$", "^src/index\\.js$"],
			},
			to: {
				path: "^src/config/db\\.js$",
			},
		},
		{
			name: "no-upward-imports",
			comment: "Repositories must not import from services or controllers; services must not import from controllers",
			severity: "error",
			from: { path: "^src/repositories/" },
			to: {
				path: ["^src/services/", "^src/controller/", "^src/routes/"],
			},
		},
	],
	options: {
		doNotFollow: {
			path: "node_modules",
		},
		tsPreCompilationDeps: false,
	},
};
