$(function () {
    var form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })


    // 初始化用户信息
    initUserInfo();
    // 初始化用户信息封装
    var layer = layui.layer;
    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //成功后,快速将内容赋值到表单中
                form.val('formUserInfo', res.data);
            }
        })
    }

    // 表单重置
    $('#btnReset').on('click', function (e) {
        // 阻止表单默认重置
        e.preventDefault();
        initUserInfo();
    })

    // 监听表单提交事件
    $('.layui-form').on('submit', function (e) {
        //阻止表单默认提交行为
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // 快速获取表单数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！');
                }
                layer.msg('更新用户信息成功！')
                //调用父页面中的更新用户信息和头像的方法
                window.parent.getUserInfo();

            }
        })
    })
})