'use strict';

const DEFAULT_BASE_URL = 'https://api.axiomauth.com/v1';
const SDK_VERSION = '1.4.2';

class AxiomAuthError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = 'AxiomAuthError';
    this.status = status;
    this.body = body;
  }
}

class AxiomAuth {
  constructor({ apiKey, baseUrl = DEFAULT_BASE_URL, timeout = 10000 } = {}) {
    if (!apiKey) throw new Error('AxiomAuth: apiKey is required');
    this._key = apiKey;
    this._base = baseUrl.replace(/\/$/, '');
    this._timeout = timeout;

    this.users = {
      list:        (p) => this._get('/users', p),
      get:         (id) => this._get(`/users/${id}`),
      deprovision: (id) => this._del(`/users/${id}`),
    };
    this.sessions = {
      list:   (p)  => this._get('/sessions', p),
      revoke: (id) => this._del(`/sessions/${id}`),
    };
    this.config = {
      get:    ()  => this._get('/config'),
      update: (d) => this._patch('/config', d),
    };
    this.audit = {
      list: (p) => this._get('/audit', p),
    };
    this.auth = {
      token: (d) => this._post('/auth/token', d),
    };
  }

  async _request(method, path, params, body) {
    const url = new URL(`${this._base}${path}`);
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), this._timeout);

    try {
      const res = await fetch(url.toString(), {
        method,
        headers: {
          'Authorization': `Bearer ${this._key}`,
          'Content-Type': 'application/json',
          'User-Agent': `axiomauth-node/${SDK_VERSION}`,
        },
        signal: ctrl.signal,
        ...(body ? { body: JSON.stringify(body) } : {}),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new AxiomAuthError(`API error ${res.status}`, res.status, data);
      return data;
    } finally {
      clearTimeout(timer);
    }
  }

  _get(path, params)   { return this._request('GET',    path, params, null); }
  _post(path, body)    { return this._request('POST',   path, null,   body); }
  _patch(path, body)   { return this._request('PATCH',  path, null,   body); }
  _del(path)           { return this._request('DELETE', path, null,   null); }
}

module.exports = { AxiomAuth, AxiomAuthError };
