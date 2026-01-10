const fs = require('fs');
const path = require('path');

// Load .env file
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  console.log('.env file not found, using defaults');
}

// Define environment file paths
const targetPath = path.resolve(__dirname, '../src/environments/environment.ts');
const targetProdPath = path.resolve(__dirname, '../src/environments/environment.prod.ts');

// Define environment content
const envConfigFile = `export const environment = {
  production: ${process.env.PRODUCTION || false},
  apiUrl: '${process.env.API_URL || "http://localhost:8080/api"}'
};
`;

const envProdConfigFile = `export const environment = {
  production: true,
  apiUrl: '${process.env.API_URL || "http://localhost:8080/api"}'
};
`;

// Ensure directory exists
const dir = path.dirname(targetPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Write files
fs.writeFile(targetPath, envConfigFile, (err) => {
  if (err) {
    console.error(err);
    throw err;
  }
  console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
});

fs.writeFile(targetProdPath, envProdConfigFile, (err) => {
  if (err) {
    console.error(err);
    throw err;
  }
  console.log(`Angular environment.prod.ts file generated correctly at ${targetProdPath} \n`);
});