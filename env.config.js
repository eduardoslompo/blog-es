const dotenv = require('dotenv');
const fs = require('fs');

// Carrega o arquivo .env
dotenv.config();

// Caminho para o arquivo environment.ts
const targetPath = './src/environments/environment.ts';

// Conteúdo do arquivo environment.ts gerado
const environmentFileContent = `
export const environment = {
  production: false,
  githubUsername: '${process.env.GITHUB_USERNAME || ''}',
  githubRepo: '${process.env.GITHUB_REPO || ''}',
  githubToken: '${process.env.NG_APP_GITHUB_TOKEN || ''}'
};
`;

// Escreve o arquivo environment.ts
fs.writeFileSync(targetPath, environmentFileContent);

console.log(`Arquivo environment.ts gerado em ${targetPath}`);
