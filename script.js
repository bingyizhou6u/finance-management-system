// 收支趋势图表
const trendChart = new Chart(document.getElementById('trendChart'), {
    type: 'line',
    data: {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        datasets: [
            {
                label: '收入',
                data: [120000, 150000, 128500, 160000, 145000, 180000],
                borderColor: '#34C759',
                backgroundColor: 'rgba(52, 199, 89, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: '支出',
                data: [90000, 95000, 85200, 100000, 92000, 95000],
                borderColor: '#FF3B30',
                backgroundColor: 'rgba(255, 59, 48, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    drawBorder: false
                },
                ticks: {
                    callback: function(value) {
                        return '¥' + value.toLocaleString();
                    }
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    }
});

// 支出分类图表
const categoryChart = new Chart(document.getElementById('categoryChart'), {
    type: 'doughnut',
    data: {
        labels: ['人工成本', '办公用品', '水电费', '市场推广', '其他'],
        datasets: [{
            data: [40, 15, 20, 15, 10],
            backgroundColor: [
                '#007AFF',
                '#5856D6',
                '#34C759',
                '#FF9500',
                '#FF3B30'
            ],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    usePointStyle: true,
                    padding: 20
                }
            }
        },
        cutout: '70%'
    }
});

// 导航栏交互
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        // 移除所有active类
        document.querySelectorAll('.nav-links li').forEach(li => {
            li.classList.remove('active');
        });
        // 添加active类到当前点击的项
        this.parentElement.classList.add('active');
    });
});

// 搜索功能
const searchInput = document.querySelector('.search-bar input');
searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const tableRows = document.querySelectorAll('.recent-transactions tbody tr');
    
    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// 通知点击事件
document.querySelector('.notifications').addEventListener('click', function() {
    // 这里可以添加显示通知面板的逻辑
    alert('通知功能开发中...');
});

// 预算趋势图
const budgetTrendChart = new Chart(document.getElementById('budgetTrendChart'), {
    type: 'line',
    data: {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        datasets: [
            {
                label: '预算',
                data: [500000, 500000, 500000, 500000, 500000, 500000],
                borderColor: '#007AFF',
                backgroundColor: 'rgba(0, 122, 255, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: '实际支出',
                data: [350000, 380000, 375000, 420000, 400000, 450000],
                borderColor: '#FF3B30',
                backgroundColor: 'rgba(255, 59, 48, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    drawBorder: false
                },
                ticks: {
                    callback: function(value) {
                        return '¥' + value.toLocaleString();
                    }
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    }
});

// 预算卡片交互
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', function() {
        // 这里可以添加点击预算卡片后的交互逻辑
        console.log('点击了预算卡片:', this.querySelector('h4').textContent);
    });
});

// 新增预算按钮交互
document.querySelector('.add-budget-btn').addEventListener('click', function() {
    // 这里可以添加新增预算的交互逻辑
    alert('新增预算功能开发中...');
});

// 收入趋势图
const incomeTrendChart = new Chart(document.getElementById('incomeTrendChart'), {
    type: 'line',
    data: {
        labels: ['1月', '2月', '3月'],
        datasets: [
            {
                label: '产品收入',
                data: [250000, 300000, 280000],
                borderColor: '#007AFF',
                backgroundColor: 'rgba(0, 122, 255, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: '服务收入',
                data: [100000, 120000, 110000],
                borderColor: '#34C759',
                backgroundColor: 'rgba(52, 199, 89, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: '其他收入',
                data: [35000, 30000, 40000],
                borderColor: '#FF9500',
                backgroundColor: 'rgba(255, 149, 0, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    drawBorder: false
                },
                ticks: {
                    callback: function(value) {
                        return '¥' + value.toLocaleString();
                    }
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    }
});

// 收入构成图
const incomeCompositionChart = new Chart(document.getElementById('incomeCompositionChart'), {
    type: 'doughnut',
    data: {
        labels: ['产品收入', '服务收入', '其他收入'],
        datasets: [{
            data: [830000, 330000, 105000],
            backgroundColor: [
                '#007AFF',
                '#34C759',
                '#FF9500'
            ],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    usePointStyle: true,
                    padding: 20
                }
            }
        },
        cutout: '70%'
    }
});

// 报表生成按钮交互
document.querySelector('.generate-report-btn').addEventListener('click', function() {
    // 这里可以添加生成报表的逻辑
    alert('报表生成中...');
});

// 导出按钮交互
document.querySelector('.export-btn').addEventListener('click', function() {
    // 这里可以添加导出报表的逻辑
    alert('报表导出中...');
});

// 打印按钮交互
document.querySelector('.print-btn').addEventListener('click', function() {
    // 这里可以添加打印报表的逻辑
    window.print();
});

// 扫描发票按钮交互
document.querySelector('.scan-invoice-btn').addEventListener('click', function() {
    // 这里可以添加扫描发票的逻辑
    alert('扫描发票功能开发中...');
});

// 新增发票按钮交互
document.querySelector('.add-invoice-btn').addEventListener('click', function() {
    // 这里可以添加新增发票的逻辑
    alert('新增发票功能开发中...');
});

// 发票操作按钮交互
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const action = this.classList.contains('view') ? '查看' :
                      this.classList.contains('edit') ? '编辑' : '删除';
        const invoiceId = this.closest('tr').querySelector('td').textContent;
        alert(`${action}发票 ${invoiceId} 功能开发中...`);
    });
});

// 发票筛选器交互
document.querySelector('.apply-filters-btn').addEventListener('click', function() {
    // 这里可以添加应用筛选的逻辑
    alert('应用筛选功能开发中...');
});

// 发票搜索功能
const invoiceSearchInput = document.querySelector('.invoices-page .search-bar input');
invoiceSearchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const tableRows = document.querySelectorAll('.invoice-list tbody tr');
    
    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// 系统设置页面交互
document.addEventListener('DOMContentLoaded', function() {
    // 设置导航切换
    const navItems = document.querySelectorAll('.nav-item');
    const settingsSections = document.querySelectorAll('.settings-section');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有active类
            navItems.forEach(nav => nav.classList.remove('active'));
            settingsSections.forEach(section => section.classList.remove('active'));

            // 添加active类到当前点击的项
            this.classList.add('active');
            const targetId = this.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // 保存设置按钮交互
    const saveSettingsBtn = document.querySelector('.save-settings-btn');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', function() {
            // 这里可以添加保存设置的逻辑
            alert('设置已保存');
        });
    }

    // 立即备份按钮交互
    const backupNowBtn = document.querySelector('.backup-now-btn');
    if (backupNowBtn) {
        backupNowBtn.addEventListener('click', function() {
            // 这里可以添加立即备份的逻辑
            alert('系统备份中...');
        });
    }

    // 添加用户按钮交互
    const addUserBtn = document.querySelector('.add-user-btn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', function() {
            // 这里可以添加新增用户的逻辑
            alert('新增用户功能开发中...');
        });
    }

    // 用户操作按钮交互
    document.querySelectorAll('.users-list .action-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const action = this.classList.contains('edit') ? '编辑' : '删除';
            const username = this.closest('tr').querySelector('td').textContent;
            alert(`${action}用户 ${username} 功能开发中...`);
        });
    });

    // 设置搜索功能
    const settingsSearchInput = document.querySelector('.settings-page .search-bar input');
    if (settingsSearchInput) {
        settingsSearchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const settingsGroups = document.querySelectorAll('.settings-group');
            
            settingsGroups.forEach(group => {
                const text = group.textContent.toLowerCase();
                group.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
});

// 登录页面功能
document.addEventListener('DOMContentLoaded', function() {
    // 检查当前页面是否为仪表盘页面
    const isDashboardPage = document.querySelector('.dashboard') !== null;
    
    // 只在仪表盘页面上初始化图表
    if (isDashboardPage) {
        // 收支趋势图表
        const trendChart = new Chart(document.getElementById('trendChart'), {
            type: 'line',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
                datasets: [
                    {
                        label: '收入',
                        data: [120000, 150000, 128500, 160000, 145000, 180000],
                        borderColor: '#34C759',
                        backgroundColor: 'rgba(52, 199, 89, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: '支出',
                        data: [90000, 95000, 85200, 100000, 92000, 95000],
                        borderColor: '#FF3B30',
                        backgroundColor: 'rgba(255, 59, 48, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '¥' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });

        // 支出分类饼图
        const categoryChart = new Chart(document.getElementById('categoryChart'), {
            type: 'doughnut',
            data: {
                labels: ['人工成本', '办公用品', '水电费', '市场推广', '其他'],
                datasets: [{
                    data: [45, 12, 10, 25, 8],
                    backgroundColor: [
                        '#5856D6',
                        '#FF9500',
                        '#FF3B30',
                        '#34C759',
                        '#007AFF'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                },
                cutout: '70%'
            }
        });
    }

    // 检查当前页面是否为预算页面
    const isBudgetPage = document.querySelector('.budget-page') !== null;
    
    // 只在预算页面上初始化预算趋势图表
    if (isBudgetPage && document.getElementById('budgetTrendChart')) {
        // 预算趋势图表
        const budgetTrendChart = new Chart(document.getElementById('budgetTrendChart'), {
            type: 'bar',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
                datasets: [
                    {
                        label: '预算',
                        data: [100000, 100000, 100000, 120000, 120000, 120000],
                        backgroundColor: 'rgba(0, 122, 255, 0.5)',
                        borderColor: '#007AFF',
                        borderWidth: 1
                    },
                    {
                        label: '实际支出',
                        data: [85000, 92000, 88000, 0, 0, 0],
                        backgroundColor: 'rgba(255, 59, 48, 0.5)',
                        borderColor: '#FF3B30',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '¥' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    // 检查当前页面是否为财务报表页面
    const isReportsPage = document.querySelector('.reports-page') !== null;
    
    // 只在财务报表页面上初始化图表
    if (isReportsPage) {
        // 收入趋势图表
        if (document.getElementById('incomeTrendChart')) {
            const incomeTrendChart = new Chart(document.getElementById('incomeTrendChart'), {
                type: 'line',
                data: {
                    labels: ['1月', '2月', '3月'],
                    datasets: [
                        {
                            label: '产品收入',
                            data: [250000, 300000, 280000],
                            borderColor: '#34C759',
                            backgroundColor: 'rgba(52, 199, 89, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: '服务收入',
                            data: [100000, 120000, 110000],
                            borderColor: '#007AFF',
                            backgroundColor: 'rgba(0, 122, 255, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: '其他收入',
                            data: [35000, 30000, 40000],
                            borderColor: '#5856D6',
                            backgroundColor: 'rgba(88, 86, 214, 0.1)',
                            tension: 0.4,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '¥' + value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        }

        // 收入构成图表
        if (document.getElementById('incomeCompositionChart')) {
            const incomeCompositionChart = new Chart(document.getElementById('incomeCompositionChart'), {
                type: 'doughnut',
                data: {
                    labels: ['产品收入', '服务收入', '其他收入'],
                    datasets: [{
                        data: [65, 25, 10],
                        backgroundColor: [
                            '#34C759',
                            '#007AFF',
                            '#5856D6'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'right',
                        }
                    },
                    cutout: '70%'
                }
            });
        }
    }

    // 登录页面功能
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        // 登录按钮点击事件
        loginBtn.addEventListener('click', function() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            
            // 简单的表单验证
            if (!username || !password) {
                alert('请输入用户名和密码');
                return;
            }
            
            // 模拟登录验证
            // 在实际应用中，这里应该是一个API请求
            if (username === 'admin' && password === 'admin123') {
                // 如果选择了"记住我"，则将用户信息存储在localStorage中
                if (remember) {
                    localStorage.setItem('user', JSON.stringify({
                        username: username,
                        isLoggedIn: true
                    }));
                } else {
                    // 否则存储在sessionStorage中（关闭浏览器后会清除）
                    sessionStorage.setItem('user', JSON.stringify({
                        username: username,
                        isLoggedIn: true
                    }));
                }
                
                // 登录成功，跳转到首页
                window.location.href = 'dashboard.html';
            } else {
                alert('用户名或密码错误');
            }
        });
        
        // 回车键提交表单
        document.getElementById('password').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loginBtn.click();
            }
        });
    }
    
    // 检查用户是否已登录（适用于所有页面）
    function checkLoginStatus() {
        // 如果不是登录页面，检查登录状态
        if (!document.querySelector('.login-page')) {
            const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
            
            if (!user || !user.isLoggedIn) {
                // 未登录，重定向到登录页面
                window.location.href = 'index.html';
            }
        }
    }
    
    // 在非登录页面上检查登录状态
    checkLoginStatus();
    
    // 退出登录功能
    const profileElement = document.querySelector('.profile');
    if (profileElement) {
        // 为用户头像添加点击事件，显示下拉菜单
        profileElement.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // 检查下拉菜单是否已存在
            let dropdown = document.querySelector('.profile-dropdown');
            
            if (dropdown) {
                // 如果已存在，则切换显示/隐藏
                dropdown.classList.toggle('show');
            } else {
                // 创建下拉菜单
                dropdown = document.createElement('div');
                dropdown.className = 'profile-dropdown show';
                
                // 添加下拉菜单项
                dropdown.innerHTML = `
                    <div class="dropdown-item">
                        <i class="fas fa-user-circle"></i>
                        <span>个人资料</span>
                    </div>
                    <div class="dropdown-item logout">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>退出登录</span>
                    </div>
                `;
                
                // 将下拉菜单添加到页面
                profileElement.appendChild(dropdown);
                
                // 为退出登录按钮添加点击事件
                dropdown.querySelector('.logout').addEventListener('click', function() {
                    // 清除登录信息
                    localStorage.removeItem('user');
                    sessionStorage.removeItem('user');
                    
                    // 重定向到登录页面
                    window.location.href = 'index.html';
                });
            }
        });
        
        // 点击页面其他地方关闭下拉菜单
        document.addEventListener('click', function() {
            const dropdown = document.querySelector('.profile-dropdown');
            if (dropdown) {
                dropdown.classList.remove('show');
            }
        });
    }
});

// 标签管理页面功能
if (document.querySelector('.tags-page')) {
    // API URL
    const apiUrl = 'https://finance-api.bingyizhou6u.workers.dev';
    
    // DOM 元素
    const tagsList = document.getElementById('tags-list');
    const totalTagsElement = document.getElementById('total-tags');
    const mostUsedTagElement = document.getElementById('most-used-tag');
    const recentTagsElement = document.getElementById('recent-tags');
    const linkedTransactionsElement = document.getElementById('linked-transactions');
    const tagSearchInput = document.getElementById('tag-search');
    const tagSortSelect = document.getElementById('tag-sort');
    const addTagBtn = document.querySelector('.add-tag-btn');
    const saveTagBtn = document.getElementById('save-tag-btn');
    const updateTagBtn = document.getElementById('update-tag-btn');
    
    // 模态框
    const addTagModal = new bootstrap.Modal(document.getElementById('addTagModal'));
    const editTagModal = new bootstrap.Modal(document.getElementById('editTagModal'));
    
    // 图表
    let tagUsageChart;
    let tagDistributionChart;
    
    // 加载标签数据
    async function loadTags() {
        try {
            const response = await fetch(`${apiUrl}/api/tags`);
            const data = await response.json();
            
            if (data.success) {
                displayTags(data.data);
                updateTagStats(data.data);
                createTagCharts(data.data);
            } else {
                console.error('加载标签失败:', data.error);
            }
        } catch (error) {
            console.error('加载标签时出错:', error);
        }
    }
    
    // 显示标签列表
    function displayTags(tags) {
        tagsList.innerHTML = '';
        
        if (tags.length === 0) {
            tagsList.innerHTML = '<tr><td colspan="5" class="text-center">暂无标签数据</td></tr>';
            return;
        }
        
        // 根据排序选项排序
        const sortBy = tagSortSelect.value;
        if (sortBy === 'name') {
            tags.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'usage') {
            // 假设我们有使用次数数据
            tags.sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0));
        } else if (sortBy === 'date') {
            tags.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
        
        // 根据搜索过滤
        const searchTerm = tagSearchInput.value.toLowerCase();
        const filteredTags = searchTerm 
            ? tags.filter(tag => tag.name.toLowerCase().includes(searchTerm))
            : tags;
        
        filteredTags.forEach(tag => {
            const row = document.createElement('tr');
            
            // 使用次数（模拟数据，实际应从API获取）
            const usageCount = Math.floor(Math.random() * 20);
            
            // 创建日期（如果没有，使用当前日期）
            const createdAt = tag.created_at ? new Date(tag.created_at).toLocaleDateString() : new Date().toLocaleDateString();
            
            row.innerHTML = `
                <td>
                    <span class="tag-color-preview" style="background-color: ${tag.color}"></span>
                    <span class="tag-badge" style="background-color: ${tag.color}">${tag.name}</span>
                </td>
                <td>${tag.color}</td>
                <td>${usageCount}</td>
                <td>${createdAt}</td>
                <td>
                    <button class="btn tag-action-btn edit-tag-btn" data-id="${tag.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn tag-action-btn delete-tag-btn" data-id="${tag.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            
            tagsList.appendChild(row);
        });
        
        // 添加编辑和删除事件监听器
        document.querySelectorAll('.edit-tag-btn').forEach(btn => {
            btn.addEventListener('click', () => editTag(btn.dataset.id));
        });
        
        document.querySelectorAll('.delete-tag-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteTag(btn.dataset.id));
        });
    }
    
    // 更新标签统计信息
    function updateTagStats(tags) {
        // 标签总数
        totalTagsElement.textContent = tags.length;
        
        // 最常用标签（模拟数据）
        if (tags.length > 0) {
            const randomIndex = Math.floor(Math.random() * tags.length);
            mostUsedTagElement.textContent = tags[randomIndex].name;
        }
        
        // 最近添加的标签数量（假设最近7天）
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const recentTags = tags.filter(tag => {
            const tagDate = tag.created_at ? new Date(tag.created_at) : new Date();
            return tagDate >= oneWeekAgo;
        });
        
        recentTagsElement.textContent = recentTags.length;
        
        // 关联交易数量（模拟数据）
        const linkedTransactions = Math.floor(Math.random() * 100);
        linkedTransactionsElement.textContent = linkedTransactions;
    }
    
    // 创建标签图表
    function createTagCharts(tags) {
        // 使用情况图表
        const usageCtx = document.getElementById('tagUsageChart').getContext('2d');
        
        // 模拟使用数据
        const usageData = tags.slice(0, 5).map(tag => ({
            name: tag.name,
            color: tag.color,
            count: Math.floor(Math.random() * 50) + 1
        }));
        
        if (tagUsageChart) {
            tagUsageChart.destroy();
        }
        
        tagUsageChart = new Chart(usageCtx, {
            type: 'bar',
            data: {
                labels: usageData.map(item => item.name),
                datasets: [{
                    label: '使用次数',
                    data: usageData.map(item => item.count),
                    backgroundColor: usageData.map(item => item.color),
                    borderColor: usageData.map(item => item.color),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        // 分布图表
        const distributionCtx = document.getElementById('tagDistributionChart').getContext('2d');
        
        // 模拟分布数据
        const distributionData = tags.map(tag => ({
            name: tag.name,
            color: tag.color,
            value: Math.floor(Math.random() * 100) + 1
        }));
        
        if (tagDistributionChart) {
            tagDistributionChart.destroy();
        }
        
        tagDistributionChart = new Chart(distributionCtx, {
            type: 'doughnut',
            data: {
                labels: distributionData.map(item => item.name),
                datasets: [{
                    data: distributionData.map(item => item.value),
                    backgroundColor: distributionData.map(item => item.color),
                    borderColor: '#ffffff',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        });
    }
    
    // 编辑标签
    async function editTag(tagId) {
        try {
            const response = await fetch(`${apiUrl}/api/tags/${tagId}`);
            const data = await response.json();
            
            if (data.success) {
                const tag = data.data;
                document.getElementById('edit-tag-id').value = tag.id;
                document.getElementById('edit-tag-name').value = tag.name;
                document.getElementById('edit-tag-color').value = tag.color;
                
                editTagModal.show();
            } else {
                console.error('获取标签详情失败:', data.error);
                alert('获取标签详情失败');
            }
        } catch (error) {
            console.error('编辑标签时出错:', error);
            alert('编辑标签时出错');
        }
    }
    
    // 删除标签
    async function deleteTag(tagId) {
        if (confirm('确定要删除这个标签吗？')) {
            try {
                const response = await fetch(`${apiUrl}/api/tags/${tagId}`, {
                    method: 'DELETE'
                });
                const data = await response.json();
                
                if (data.success) {
                    alert('标签删除成功');
                    loadTags();
                } else {
                    console.error('删除标签失败:', data.error);
                    alert('删除标签失败');
                }
            } catch (error) {
                console.error('删除标签时出错:', error);
                alert('删除标签时出错');
            }
        }
    }
    
    // 添加标签
    async function addTag() {
        const name = document.getElementById('tag-name').value;
        const color = document.getElementById('tag-color').value;
        
        if (!name) {
            alert('请输入标签名称');
            return;
        }
        
        try {
            const response = await fetch(`${apiUrl}/api/tags`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    color,
                    created_by: 1 // 假设当前用户ID为1
                })
            });
            const data = await response.json();
            
            if (data.success) {
                alert('标签添加成功');
                document.getElementById('add-tag-form').reset();
                addTagModal.hide();
                loadTags();
            } else {
                console.error('添加标签失败:', data.error);
                alert('添加标签失败');
            }
        } catch (error) {
            console.error('添加标签时出错:', error);
            alert('添加标签时出错');
        }
    }
    
    // 更新标签
    async function updateTag() {
        const id = document.getElementById('edit-tag-id').value;
        const name = document.getElementById('edit-tag-name').value;
        const color = document.getElementById('edit-tag-color').value;
        
        if (!name) {
            alert('请输入标签名称');
            return;
        }
        
        try {
            const response = await fetch(`${apiUrl}/api/tags/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    color
                })
            });
            const data = await response.json();
            
            if (data.success) {
                alert('标签更新成功');
                editTagModal.hide();
                loadTags();
            } else {
                console.error('更新标签失败:', data.error);
                alert('更新标签失败');
            }
        } catch (error) {
            console.error('更新标签时出错:', error);
            alert('更新标签时出错');
        }
    }
    
    // 事件监听器
    addTagBtn.addEventListener('click', () => addTagModal.show());
    saveTagBtn.addEventListener('click', addTag);
    updateTagBtn.addEventListener('click', updateTag);
    
    tagSearchInput.addEventListener('input', () => {
        loadTags();
    });
    
    tagSortSelect.addEventListener('change', () => {
        loadTags();
    });
    
    // 初始加载
    loadTags();
} 