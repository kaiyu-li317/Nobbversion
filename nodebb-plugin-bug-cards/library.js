"use strict";

const Plugin = {};
const kv = require('./kv');
const Navigation = require.main.require('./src/navigation');
const meta = require.main.require('./src/meta');

Plugin.init = async function (params) {
    // 插件初始化，可注册路由、菜单等
    const { router, middleware } = params;
    // 自动精简导航栏
    const navToRemove = ['groups', 'chats', 'tags', 'unread', 'recent', 'popular', 'users', 'categories'];
    for (const item of navToRemove) {
        try { await Navigation.remove(item); } catch (e) {}
    }
    // 自动设置首页为主分类（假设分类slug为bug-stories）
    try {
        await meta.settings.set('homePageRoute', '/category/bug-stories');
    } catch (e) {}
    // 新增API：提交Bug卡片
    router.post('/api/bug-cards', middleware.applyCSRF, async (req, res) => {
        try {
            const bug = req.body;
            const id = 'bug_' + Date.now();
            await kv.set(id, bug);
            res.json({ id, success: true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
    // 查询所有Bug卡片（简单示例，实际可分页/筛选）
    // router.get('/api/bug-cards', ...)
};

Plugin.onPostCreate = async function (data) {
    // 预留：发帖时处理 bug 卡片自定义字段
    // data.post 包含帖子内容
    // data.data 包含前端传来的额外字段
    return data;
};

module.exports = Plugin; 