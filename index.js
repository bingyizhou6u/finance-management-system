export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // API 路由处理
    if (url.pathname.startsWith('/api/')) {
      return await handleApiRequest(request, env, url);
    }
    
    // 静态文件处理
    return env.ASSETS.fetch(request);
  }
};

async function handleApiRequest(request, env, url) {
  const path = url.pathname.replace('/api/', '');
  
  // 处理数据库查询
  if (path === 'users') {
    try {
      const { results } = await env.DB.prepare('SELECT id, username, name, email, role FROM users').all();
      return new Response(JSON.stringify({ success: true, data: results }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // 处理交易记录查询
  if (path === 'transactions') {
    try {
      const { results } = await env.DB.prepare(`
        SELECT t.id, t.transaction_date, t.amount, t.type, 
               c.name as category_name, a.name as account_name, 
               t.description, t.status
        FROM transactions t
        LEFT JOIN categories c ON t.category_id = c.id
        LEFT JOIN accounts a ON t.account_id = a.id
        ORDER BY t.transaction_date DESC
        LIMIT 10
      `).all();
      
      return new Response(JSON.stringify({ success: true, data: results }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // 处理预算查询
  if (path === 'budgets') {
    try {
      const { results } = await env.DB.prepare(`
        SELECT b.id, b.name, b.amount, b.start_date, b.end_date,
               c.name as category_name
        FROM budgets b
        LEFT JOIN categories c ON b.category_id = c.id
      `).all();
      
      return new Response(JSON.stringify({ success: true, data: results }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // 处理系统设置查询
  if (path === 'settings') {
    try {
      const { results } = await env.DB.prepare('SELECT * FROM settings').all();
      
      // 将结果转换为键值对格式
      const settings = {};
      for (const row of results) {
        settings[row.setting_key] = row.setting_value;
      }
      
      return new Response(JSON.stringify({ success: true, data: settings }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // 未找到匹配的 API 路由
  return new Response(JSON.stringify({ success: false, error: 'API endpoint not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
} 