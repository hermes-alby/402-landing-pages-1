import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const dist = path.join(root, 'dist');

const checks = [
  {
    file: 'deepl.html',
    substrings: [
      'DeepL API Pricing Alternative',
      'DeepL API pricing alternative',
      'How does this compare to DeepL API Pro pricing?',
      'Is there a DeepL API free tier?'
    ]
  },
  {
    file: 'linkedin-profiles-hermes.html',
    substrings: [
      'Scout Profiles with Hermes Agent',
      'Hermes Agent scout profile research',
      'Can Hermes Agent scout profile descriptions from a prompt?'
    ]
  },
  {
    file: 'coingecko.html',
    substrings: [
      'CoinGecko API Pricing Alternative',
      'CoinGecko API pricing alternative',
      'Can I query CoinGecko on-chain DEX API data?'
    ]
  },
  {
    file: 'coingecko-hermes.html',
    substrings: [
      'Hermes Agent Crypto Data',
      'Hermes Agent crypto data',
      'Can Hermes Agent use this for crypto trading or research?'
    ]
  },
  {
    file: 'linkedin-profiles.html',
    substrings: [
      'PayPerQ LinkedIn Profile API',
      'PayPerQ LinkedIn profile API'
    ]
  }
];

for (const { file, substrings } of checks) {
  const htmlPath = path.join(dist, file);
  assert.ok(fs.existsSync(htmlPath), `${file} should be generated`);
  const html = fs.readFileSync(htmlPath, 'utf8');
  for (const substring of substrings) {
    assert.ok(html.includes(substring), `${file} should include ${substring}`);
  }
}

console.log('GSC SEO copy checks passed');
