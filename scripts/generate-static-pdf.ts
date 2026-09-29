import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateCompanyProfilePdf } from '../server/generateCompanyProfilePdf.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('Generating authentic 18-page Company Profile PDF...');
  const buffer = await generateCompanyProfilePdf();
  
  const publicPath = path.join(__dirname, '..', 'public', 'Company-Profile-PT-Radcom-Solusindo.pdf');
  const distPath = path.join(__dirname, '..', 'dist', 'Company-Profile-PT-Radcom-Solusindo.pdf');
  
  fs.writeFileSync(publicPath, buffer);
  console.log(`Saved to ${publicPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
  
  if (fs.existsSync(path.join(__dirname, 'dist'))) {
    fs.writeFileSync(distPath, buffer);
    console.log(`Saved to ${distPath}`);
  }
}

main().catch(err => {
  console.error('Failed to generate PDF:', err);
  process.exit(1);
});
