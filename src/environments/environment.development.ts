import * as dotenv from 'dotenv';

// Carrega o arquivo .env
dotenv.config();

export const environment = {
  production: true,
  githubUsername: process.env['GITHUB_USERNAME'] || '',
  githubRepo: process.env['GITHUB_REPO'] || '',
  githubToken: process.env['NG_APP_GITHUB_TOKEN'] || ''
};