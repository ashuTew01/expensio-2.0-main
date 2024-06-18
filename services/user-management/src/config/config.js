// Configuration Loader
import development from './env/development.js';

const env = process.env.NODE_ENV || 'development';
const config = {
  development,
};

export default config[env];
