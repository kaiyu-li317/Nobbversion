// api/bug-cards.js
export async function onRequest(context) {
  const { request, env } = context;
  const kv = env.bugdexKV; // 你的 KV 命名空间

  if (request.method === 'POST') {
    // 新增 Bug 卡片
    const bug = await request.json();
    const id = 'bug_' + Date.now();
    await kv.put(id, JSON.stringify(bug));
    return new Response(JSON.stringify({ id, success: true }), { headers: { 'Content-Type': 'application/json' } });
  }

  if (request.method === 'GET') {
    // 查询所有 Bug 卡片（分页可扩展）
    const result = await kv.list({ prefix: 'bug_', limit: 100 });
    const bugs = [];
    for (const { key } of result.keys) {
      const value = await kv.get(key, { type: 'json' });
      if (value) bugs.push({ id: key, ...value });
    }
    return new Response(JSON.stringify(bugs), { headers: { 'Content-Type': 'application/json' } });
  }

  return new Response('Method Not Allowed', { status: 405 });
} 