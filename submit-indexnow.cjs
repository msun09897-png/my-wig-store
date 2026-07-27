/*
 * Submits the canonical ARELVIENNE URLs to IndexNow after a production deploy.
 *
 * Safe local preview:
 *   node submit-indexnow.cjs
 *
 * Send the live submission:
 *   node submit-indexnow.cjs --submit
 */

const fs = require('fs');
const https = require('https');

const HOST = 'arelvienne.com';
const INDEXNOW_KEY = 'a13da8f942954c0499bbf1244f00ff19';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const urls = fs.readFileSync('indexnow-urls.txt', 'utf8')
  .split(/\r?\n/)
  .map(value => value.trim())
  .filter(Boolean);

if (!urls.length) throw new Error('indexnow-urls.txt is empty.');
if (urls.some(url => new URL(url).host !== HOST)) {
  throw new Error(`Every IndexNow URL must belong to ${HOST}.`);
}
if (fs.readFileSync(`${INDEXNOW_KEY}.txt`, 'utf8').trim() !== INDEXNOW_KEY) {
  throw new Error('IndexNow key file does not match the configured key.');
}

const payload = JSON.stringify({
  host: HOST,
  key: INDEXNOW_KEY,
  keyLocation: KEY_LOCATION,
  urlList: urls
});

if (!process.argv.includes('--submit')) {
  console.log(`Dry run passed: ${urls.length} canonical URLs are ready for IndexNow.`);
  console.log(`Key location: ${KEY_LOCATION}`);
  process.exit(0);
}

const request = https.request(ENDPOINT, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload)
  }
}, response => {
  let body = '';
  response.setEncoding('utf8');
  response.on('data', chunk => { body += chunk; });
  response.on('end', () => {
    if (response.statusCode === 200 || response.statusCode === 202) {
      console.log(`IndexNow accepted ${urls.length} URLs (HTTP ${response.statusCode}).`);
      return;
    }
    console.error(`IndexNow returned HTTP ${response.statusCode}${body ? `: ${body}` : ''}`);
    process.exitCode = 1;
  });
});

request.on('error', error => {
  console.error(`IndexNow request failed: ${error.message}`);
  process.exitCode = 1;
});

request.end(payload);
