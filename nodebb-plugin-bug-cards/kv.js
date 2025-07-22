// kv.js
// EdgeOne KV 存储 Node.js 封装
const fetch = require('node-fetch');

const KV_ENDPOINT = process.env.EDGEONE_KV_ENDPOINT || 'https://kv.<your-region>.edgeone.ai/v1/kv';
const KV_TOKEN = process.env.EDGEONE_KV_TOKEN || '<YOUR_API_TOKEN>';
const KV_NAMESPACE = process.env.EDGEONE_KV_NAMESPACE || '<YOUR_NAMESPACE>';

async function kvRequest(method, key, value) {
    const url = `${KV_ENDPOINT}/${KV_NAMESPACE}/${key}`;
    const options = {
        method,
        headers: {
            'Authorization': `Bearer ${KV_TOKEN}`,
            'Content-Type': 'application/json',
        },
    };
    if (value) options.body = JSON.stringify({ value });
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

module.exports = {
    async get(key) {
        return kvRequest('GET', key);
    },
    async set(key, value) {
        return kvRequest('PUT', key, value);
    },
    async del(key) {
        return kvRequest('DELETE', key);
    },
    // list 需根据 EdgeOne KV API 支持情况实现
}; 