// Configuration Loader
import development from "./env/development.js";
import production from "./env/production.js";

const env = process.env.NODE_ENV || "development";
const config = {
	development,
	production,
};

export default config[env];
