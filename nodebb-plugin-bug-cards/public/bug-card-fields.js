// bug-card-fields.js
// 用于在发帖表单中动态插入Bug卡片专属字段

$(window).on('action:composer.loaded', function (ev, data) {
    // 只在新建主题或回复时插入
    if (!data || !data.composer || !data.composer.$form) return;
    const $form = data.composer.$form;
    if ($form.find('.bug-card-fields').length) return; // 防止重复插入

    const html = `
    <div class="bug-card-fields panel panel-default">
      <div class="panel-heading">Bug 卡片信息</div>
      <div class="panel-body">
        <div class="form-group">
          <label>截图</label>
          <input type="file" name="bug_screenshot" accept="image/*" class="form-control" />
        </div>
        <div class="form-group">
          <label>编程语言</label>
          <input type="text" name="bug_language" class="form-control" placeholder="如 Python/C++/JavaScript" />
        </div>
        <div class="form-group">
          <label>IDE/编辑器</label>
          <input type="text" name="bug_ide" class="form-control" placeholder="如 VSCode/Xcode/PyCharm" />
        </div>
        <div class="form-group">
          <label>操作系统</label>
          <input type="text" name="bug_os" class="form-control" placeholder="如 Windows/Linux/macOS" />
        </div>
        <div class="form-group">
          <label>关键代码段</label>
          <textarea name="bug_code" class="form-control" rows="3" placeholder="可粘贴关键代码"></textarea>
        </div>
        <div class="form-group">
          <label>报错信息</label>
          <textarea name="bug_error" class="form-control" rows="2" placeholder="如：TypeError: undefined is not a function"></textarea>
        </div>
      </div>
    </div>
    `;
    $form.find('.composer').before(html);
});

// 拦截表单提交，改为调用 EdgeOne API
$(window).on('action:composer.submit', function (ev, data) {
    const $form = data.composer.$form;
    const bug = {
        screenshot: $form.find('input[name="bug_screenshot"]').val(),
        language: $form.find('input[name="bug_language"]').val(),
        ide: $form.find('input[name="bug_ide"]').val(),
        os: $form.find('input[name="bug_os"]').val(),
        code: $form.find('textarea[name="bug_code"]').val(),
        error: $form.find('textarea[name="bug_error"]').val(),
        title: $form.find('input[name="title"]').val(),
        content: $form.find('textarea[name="content"]').val(),
    };
    fetch('/api/bug-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bug)
    }).then(res => res.json()).then(resp => {
        if (resp.success) {
            app.alertSuccess('Bug卡片已提交！');
        } else {
            app.alertError('提交失败：' + (resp.error || '未知错误'));
        }
    });
    // 阻止默认提交
    return false;
}); 