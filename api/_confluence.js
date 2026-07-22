'use strict';

const fs   = require('fs');
const path = require('path');

function loadEnv(envPath) {
  if (!fs.existsSync(envPath)) return {};
  const env = {};
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#') || !t.includes('=')) continue;
    const idx = t.indexOf('=');
    env[t.slice(0, idx).trim()] = t.slice(idx + 1).trim();
  }
  return env;
}

// Local dev: load from confluence-jira-audit/.env (two levels up from api/)
const ENV_PATH = path.join(__dirname, '..', '..', 'confluence-jira-audit', '.env');
const ENV = loadEnv(ENV_PATH);

function clean(s) { return (s || '').split('').filter(c => c.charCodeAt(0) >= 32 && c.charCodeAt(0) <= 126).join(''); }

function getCredentials() {
  return {
    cfUrl:   clean(process.env.ATLASSIAN_URL   || ENV.ATLASSIAN_URL   || '').replace(/\/$/, ''),
    cfEmail: clean(process.env.ATLASSIAN_EMAIL  || ENV.ATLASSIAN_EMAIL  || ''),
    cfToken: clean(process.env.ATLASSIAN_API_TOKEN || ENV.ATLASSIAN_API_TOKEN || ''),
  };
}

function authHeader(email, token) {
  return 'Basic ' + Buffer.from(`${email}:${token}`).toString('base64');
}

module.exports = { getCredentials, authHeader };
