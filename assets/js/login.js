$(function () {
    // 点击去注册账号，隐藏登录区域，显示注册区域
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    // 点击去登录，显示登录区域，隐藏注册区域
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    });



    //自定义验证规则
    var form = layui.form;
    form.verify({
        //密码规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        //确认密码规则
        repwd: function (value) {
            //选择器必须带空格，选择的是后代中的input，name属性值为password的那一个标签
            var pwd = $('.reg-box input[name=password]').val();
            // 比较两次输入的密码
            if (value !== pwd) {
                return "两次密码输入不一致！";
            }
        }
    });

    //注册功能
    var layer = layui.layer;
    $("#form_reg").on("submit", function (e) {
        //阻止表单默认提交
        e.preventDefault();
        //发送ajax
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $(".reg-box [name=username]").val(),
                password: $(".reg-box [name=password]").val(),
            },
            success: function (res) {
                //返回状态判断
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                //提交成功后处理代码
                layer.msg("注册成功，请登录！");
                //手动切换到登录界面
                $('#link_login').click();
            }
        });
    })

    //登录功能
    $('#form_login').submit(function (e) {
        //阻止表单默认提交行为
        e.preventDefault();
        //发送ajax请求
        $.ajax({
            method: 'POST',
            url: '/api/login',
            //快速获取表单内容
            data: $(this).serialize(),
            success: function (res) {
                //校验返回状态
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //提示信息，保存token，跳转页面
                layer.msg("登录成功!");
                //保存token，未来的接口要受用token
                localStorage.setItem('token', res.token);
                //跳转
                location.href = "/index.html";
            }
        })
    })
})