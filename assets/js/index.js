$(function () {
    getUserInfo();

    var layer = layui.layer;
    //退出
    $('#btnLogout').on('click', function () {
        // 框架提供的询问
        layer.confirm('是否确认退出？', { icon: 3, title: '提示' }, function (index) {
            //do something
            //清空本地存储
            localStorage.removeItem('token');
            //跳转到登录页面
            location.href = '/login.html';
            //关闭询问框
            layer.close(index);
        });
    })
});

//获取用户信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // // headers 就是请求头配置对象   
        // headers: {
        //     Authorization: localStorage.getItem("token") || ""
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            // 请求成功，渲染用户头像信息
            renderAvatar(res.data);
        },
        // //无论成功或者失败，都是触发complete方法
        // complete: function (res) {
        //     console.log(res);
        //     //判断：如果是身份认证失败，跳转回登录页面
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         //删除本地token
        //         localStorage.removeItem('token');
        //         //页面跳转
        //         location.href = '/login.html';
        //     }
        // }
    });
}


//封装用户头像渲染
function renderAvatar(user) {
    //用户名（昵称优先，没有用username）
    var name = user.nickname || user.username;
    $('#welcome').html("欢迎&nbsp;&nbsp;" + name);
    // 用户头像
    if (user.user_pic !== null) {
        // 有头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.user-avater').hide();
    } else {
        // 没有头像，显示文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.user-avater').html(first).show();
    }
}