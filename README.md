# axiomauth

Official Node.js SDK for the [AxiomAuth](https://axiomauth.com) identity platform.

[![npm version](https://img.shields.io/npm/v/axiomauth.svg)](https://www.npmjs.com/package/axiomauth)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Installation

```bash
npm install axiomauth
```

## Quick Start

```javascript
const { AxiomAuth } = require('axiomauth');

const client = new AxiomAuth({
  apiKey: process.env.AXIOMAUTH_API_KEY
});

// List organisation users
const { data: users } = await client.users.list();

// Get org config
const config = await client.config.get();

// List active SSO sessions
const { data: sessions } = await client.sessions.list();
```

## Authentication

Generate API keys from your [AxiomAuth dashboard](https://axiomauth.com/dashboard).  
All requests require a Bearer token:

```javascript
const client = new AxiomAuth({ apiKey: 'axm_live_your_key_here' });
```

## API Reference

### `client.users`

```javascript
// List users (paginated)
const { data, total } = await client.users.list({ page: 1, per_page: 20 });

// Get a single user
const user = await client.users.get('usr_abc123');

// Deprovision
await client.users.deprovision('usr_abc123');
```

### `client.sessions`

```javascript
const { data } = await client.sessions.list();
await client.sessions.revoke('sess_abc123');
```

### `client.config`

```javascript
// Returns org config: sso_enabled, saml_metadata_url, scim_endpoint, mfa_required, etc.
const config = await client.config.get();
await client.config.update({ session_duration_hours: 12 });
```

### `client.audit`

```javascript
const { data } = await client.audit.list({
  from: '2025-01-01T00:00:00Z',
  action: 'login.success'
});
```

## Error Handling

```javascript
try {
  await client.users.list();
} catch (err) {
  if (err.status === 401) // invalid API key
  if (err.status === 403) // insufficient permissions
  if (err.status === 429) // rate limited — retry after err.retryAfter seconds
}
```

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `apiKey` | — | API key (required) |
| `baseUrl` | `https://api.axiomauth.com/v1` | Override for testing |
| `timeout` | `10000` | Request timeout (ms) |

## Support

- Docs: [axiomauth.com/docs](https://axiomauth.com/docs)
- Issues: [github.com/axiomauth/axiomauth-node/issues](https://github.com/axiomauth/axiomauth-node/issues)
- Email: support@axiomauth.com

## License

[MIT](LICENSE) — © Axiom Identity Services Ltd.
