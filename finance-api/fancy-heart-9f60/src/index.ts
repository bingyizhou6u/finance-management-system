/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

/**
 * 金融管理系统 API
 * 
 * 提供用户、交易记录、预算、发票和系统设置等数据的API接口
 */

// 定义环境变量类型
export interface Env {
	DB: D1Database;
}

// 定义设置项接口
interface SettingRow {
	setting_key: string;
	setting_value: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// 设置CORS头
		const headers = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
			'Content-Type': 'application/json'
		};

		// 处理预检请求
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers });
		}

		const url = new URL(request.url);
		
		try {
			// API 路由处理
			if (url.pathname.startsWith('/api/')) {
				return await handleApiRequest(request, env, url, headers);
			}
			
			// 默认响应
			return new Response(JSON.stringify({ 
				message: '金融管理系统 API', 
				endpoints: [
					'/api/users',
					'/api/transactions',
					'/api/budgets',
					'/api/invoices',
					'/api/accounts',
					'/api/categories',
					'/api/settings',
					'/api/tags',
					'/api/recurring-transactions',
					'/api/attachments',
					'/api/audit-logs',
					'/api/financial-reports'
				]
			}), { headers });
		} catch (error: unknown) {
			// 错误处理
			const errorMessage = error instanceof Error ? error.message : '服务器错误';
			return new Response(
				JSON.stringify({ success: false, error: errorMessage }),
				{ status: 500, headers }
			);
		}
	},
} satisfies ExportedHandler<Env>;

async function handleApiRequest(
	request: Request, 
	env: Env, 
	url: URL, 
	headers: HeadersInit
): Promise<Response> {
	const path = url.pathname.replace('/api/', '');
	
	// 用户API
	if (path === 'users') {
		return await handleUsersRequest(request, env, url, headers);
	}
	
	// 交易记录API
	if (path === 'transactions') {
		return await handleTransactionsRequest(request, env, url, headers);
	}
	
	// 预算API
	if (path === 'budgets') {
		return await handleBudgetsRequest(request, env, url, headers);
	}
	
	// 发票API
	if (path === 'invoices') {
		return await handleInvoicesRequest(request, env, url, headers);
	}
	
	// 账户API
	if (path === 'accounts') {
		return await handleAccountsRequest(request, env, url, headers);
	}
	
	// 分类API
	if (path === 'categories') {
		return await handleCategoriesRequest(request, env, url, headers);
	}
	
	// 系统设置API
	if (path === 'settings') {
		return await handleSettingsRequest(request, env, url, headers);
	}
	
	// 标签API
	if (path === 'tags') {
		return await handleTagsRequest(request, env, url, headers);
	}
	
	// 定期交易API
	if (path === 'recurring-transactions') {
		return await handleRecurringTransactionsRequest(request, env, url, headers);
	}
	
	// 附件API
	if (path === 'attachments') {
		return await handleAttachmentsRequest(request, env, url, headers);
	}
	
	// 审计日志API
	if (path === 'audit-logs') {
		return await handleAuditLogsRequest(request, env, url, headers);
	}
	
	// 财务报表API
	if (path === 'financial-reports') {
		return await handleFinancialReportsRequest(request, env, url, headers);
	}
	
	// 未找到匹配的 API 路由
	return new Response(
		JSON.stringify({ success: false, error: 'API端点未找到' }), 
		{ status: 404, headers }
	);
}

// 处理用户相关请求
async function handleUsersRequest(
	request: Request, 
	env: Env, 
	url: URL, 
	headers: HeadersInit
): Promise<Response> {
	try {
		const { results } = await env.DB.prepare(`
			SELECT id, username, name, email, role, avatar, status, phone, department, 
			       created_at, last_login, login_attempts
			FROM users
		`).all();
		
		return new Response(
			JSON.stringify({ success: true, data: results }), 
			{ headers }
		);
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '查询用户数据时出错';
		return new Response(
			JSON.stringify({ success: false, error: errorMessage }), 
			{ status: 500, headers }
		);
	}
}

// 处理交易记录相关请求
async function handleTransactionsRequest(
	request: Request, 
	env: Env, 
	url: URL, 
	headers: HeadersInit
): Promise<Response> {
	try {
		// 获取查询参数
		const limit = url.searchParams.get('limit') || '20';
		const offset = url.searchParams.get('offset') || '0';
		
		const { results } = await env.DB.prepare(`
			SELECT t.id, t.transaction_date, t.amount, t.type, 
				   c.name as category_name, a.name as account_name, 
				   t.description, t.status, t.payment_method, t.receipt_number,
				   t.is_reconciled, t.reconciled_at, t.notes
			FROM transactions t
			LEFT JOIN categories c ON t.category_id = c.id
			LEFT JOIN accounts a ON t.account_id = a.id
			ORDER BY t.transaction_date DESC
			LIMIT ?
			OFFSET ?
		`).bind(limit, offset).all();
		
		// 获取交易标签
		for (const transaction of results) {
			const { results: tags } = await env.DB.prepare(`
				SELECT t.id, t.name, t.color
				FROM tags t
				JOIN transaction_tags tt ON t.id = tt.tag_id
				WHERE tt.transaction_id = ?
			`).bind(transaction.id).all();
			
			transaction.tags = tags;
		}
		
		return new Response(
			JSON.stringify({ success: true, data: results }), 
			{ headers }
		);
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '查询交易记录时出错';
		return new Response(
			JSON.stringify({ success: false, error: errorMessage }), 
			{ status: 500, headers }
		);
	}
}

// 处理预算相关请求
async function handleBudgetsRequest(
	request: Request, 
	env: Env, 
	url: URL, 
	headers: HeadersInit
): Promise<Response> {
	try {
		const { results } = await env.DB.prepare(`
			SELECT b.id, b.name, b.amount, b.start_date, b.end_date,
				   c.name as category_name, b.alert_threshold, b.is_active,
				   b.recurring, b.color
			FROM budgets b
			LEFT JOIN categories c ON b.category_id = c.id
		`).all();
		
		return new Response(
			JSON.stringify({ success: true, data: results }), 
			{ headers }
		);
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '查询预算数据时出错';
		return new Response(
			JSON.stringify({ success: false, error: errorMessage }), 
			{ status: 500, headers }
		);
	}
}

// 处理发票相关请求
async function handleInvoicesRequest(
	request: Request, 
	env: Env, 
	url: URL, 
	headers: HeadersInit
): Promise<Response> {
	try {
		const { results } = await env.DB.prepare(`
			SELECT i.id, i.invoice_number, i.amount, i.invoice_date, i.due_date,
				   i.status, i.description, i.type, i.payment_terms,
				   i.payment_date, i.payment_method, i.notes
			FROM invoices i
			ORDER BY i.invoice_date DESC
		`).all();
		
		// 获取发票附件
		for (const invoice of results) {
			const { results: attachments } = await env.DB.prepare(`
				SELECT id, file_name, file_type, file_size
				FROM attachments
				WHERE entity_type = 'invoice' AND entity_id = ?
			`).bind(invoice.id).all();
			
			invoice.attachments = attachments;
		}
		
		return new Response(
			JSON.stringify({ success: true, data: results }), 
			{ headers }
		);
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '查询发票数据时出错';
		return new Response(
			JSON.stringify({ success: false, error: errorMessage }), 
			{ status: 500, headers }
		);
	}
}

// 处理账户相关请求
async function handleAccountsRequest(
	request: Request, 
	env: Env, 
	url: URL, 
	headers: HeadersInit
): Promise<Response> {
	try {
		const { results } = await env.DB.prepare(`
			SELECT id, name, type, balance, currency, description, is_active
			FROM accounts
			ORDER BY name
		`).all();
		
		return new Response(
			JSON.stringify({ success: true, data: results }), 
			{ headers }
		);
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '查询账户数据时出错';
		return new Response(
			JSON.stringify({ success: false, error: errorMessage }), 
			{ status: 500, headers }
		);
	}
}

// 处理分类相关请求
async function handleCategoriesRequest(
	request: Request, 
	env: Env, 
	url: URL, 
	headers: HeadersInit
): Promise<Response> {
	try {
		const { results } = await env.DB.prepare(`
			SELECT id, name, type, icon, color, parent_id, description
			FROM categories
			ORDER BY name
		`).all();
		
		return new Response(
			JSON.stringify({ success: true, data: results }), 
			{ headers }
		);
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '查询分类数据时出错';
		return new Response(
			JSON.stringify({ success: false, error: errorMessage }), 
			{ status: 500, headers }
		);
	}
}

// 处理系统设置相关请求
async function handleSettingsRequest(
	request: Request, 
	env: Env, 
	url: URL, 
	headers: HeadersInit
): Promise<Response> {
	try {
		const { results } = await env.DB.prepare('SELECT * FROM settings').all<SettingRow>();
		
		// 将结果转换为键值对格式
		const settings: Record<string, string> = {};
		for (const row of results) {
			settings[row.setting_key] = row.setting_value;
		}
		
		return new Response(
			JSON.stringify({ success: true, data: settings }), 
			{ headers }
		);
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '查询系统设置时出错';
		return new Response(
			JSON.stringify({ success: false, error: errorMessage }), 
			{ status: 500, headers }
		);
	}
}

// 处理标签相关请求
async function handleTagsRequest(
	request: Request, 
	env: Env, 
	url: URL, 
	headers: HeadersInit
): Promise<Response> {
	try {
		const { results } = await env.DB.prepare(`
			SELECT id, name, color
			FROM tags
			ORDER BY name
		`).all();
		
		return new Response(
			JSON.stringify({ success: true, data: results }), 
			{ headers }
		);
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '查询标签数据时出错';
		return new Response(
			JSON.stringify({ success: false, error: errorMessage }), 
			{ status: 500, headers }
		);
	}
}

// 处理定期交易相关请求
async function handleRecurringTransactionsRequest(
	request: Request, 
	env: Env, 
	url: URL, 
	headers: HeadersInit
): Promise<Response> {
	try {
		const { results } = await env.DB.prepare(`
			SELECT r.id, r.name, r.amount, r.type, r.frequency, 
				   r.start_date, r.end_date, r.next_date,
				   c.name as category_name, a.name as account_name,
				   r.description, r.is_active
			FROM recurring_transactions r
			LEFT JOIN categories c ON r.category_id = c.id
			LEFT JOIN accounts a ON r.account_id = a.id
			ORDER BY r.next_date
		`).all();
		
		return new Response(
			JSON.stringify({ success: true, data: results }), 
			{ headers }
		);
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '查询定期交易数据时出错';
		return new Response(
			JSON.stringify({ success: false, error: errorMessage }), 
			{ status: 500, headers }
		);
	}
}

// 处理附件相关请求
async function handleAttachmentsRequest(
	request: Request, 
	env: Env, 
	url: URL, 
	headers: HeadersInit
): Promise<Response> {
	try {
		// 获取查询参数
		const entityType = url.searchParams.get('entity_type');
		const entityId = url.searchParams.get('entity_id');
		
		let query = `
			SELECT id, file_name, file_path, file_type, file_size, 
				   entity_type, entity_id, created_at
			FROM attachments
		`;
		
		let params: string[] = [];
		
		if (entityType && entityId) {
			query += ` WHERE entity_type = ? AND entity_id = ?`;
			params = [entityType, entityId];
		}
		
		query += ` ORDER BY created_at DESC`;
		
		const { results } = await env.DB.prepare(query).bind(...params).all();
		
		return new Response(
			JSON.stringify({ success: true, data: results }), 
			{ headers }
		);
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '查询附件数据时出错';
		return new Response(
			JSON.stringify({ success: false, error: errorMessage }), 
			{ status: 500, headers }
		);
	}
}

// 处理审计日志相关请求
async function handleAuditLogsRequest(
	request: Request, 
	env: Env, 
	url: URL, 
	headers: HeadersInit
): Promise<Response> {
	try {
		// 获取查询参数
		const limit = url.searchParams.get('limit') || '50';
		const offset = url.searchParams.get('offset') || '0';
		
		const { results } = await env.DB.prepare(`
			SELECT a.id, a.action, a.entity_type, a.entity_id, 
				   a.old_value, a.new_value, a.ip_address,
				   a.created_at, u.username as user_name
			FROM audit_logs a
			LEFT JOIN users u ON a.user_id = u.id
			ORDER BY a.created_at DESC
			LIMIT ?
			OFFSET ?
		`).bind(limit, offset).all();
		
		return new Response(
			JSON.stringify({ success: true, data: results }), 
			{ headers }
		);
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '查询审计日志时出错';
		return new Response(
			JSON.stringify({ success: false, error: errorMessage }), 
			{ status: 500, headers }
		);
	}
}

// 处理财务报表相关请求
async function handleFinancialReportsRequest(
	request: Request, 
	env: Env, 
	url: URL, 
	headers: HeadersInit
): Promise<Response> {
	try {
		const { results } = await env.DB.prepare(`
			SELECT f.id, f.name, f.type, f.start_date, f.end_date,
				   f.parameters, f.is_public, f.created_at,
				   u.username as created_by_name
			FROM financial_reports f
			LEFT JOIN users u ON f.created_by = u.id
			ORDER BY f.created_at DESC
		`).all();
		
		return new Response(
			JSON.stringify({ success: true, data: results }), 
			{ headers }
		);
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '查询财务报表时出错';
		return new Response(
			JSON.stringify({ success: false, error: errorMessage }), 
			{ status: 500, headers }
		);
	}
}
