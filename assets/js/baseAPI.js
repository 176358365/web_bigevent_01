//开发服务器地址
var baseUrl = "http://ajax.frontend.itheima.net";
//测试环境服务器地址
// var baseUrl = "http://ajax.frontend.itheima.net";
//生产环境服务器地址
// var baseUrl = "http://ajax.frontend.itheima.net";


//拦截所有ajax请求,在每次发起ajax请求是触发
//处理ajax请求中的参数
$.ajaxPrefilter(function (params) {
    //拼接对应环境的服务器地址
    params.url = baseUrl + params.url;
    // 对需要权限的接口配置头信息
    if (params.url.indexOf("/my/") !== -1) {
        params.headers = {
            Authorization: localStorage.getItem("token") || ""
        }
    }
    //拦截所有响应，判断身份信息
    params.complete = function (res) {
        // console.log(res);
        //判断：如果是身份认证失败，跳转回登录页面
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            //删除本地token
            localStorage.removeItem('token');
            //页面跳转
            location.href = '/login.html';
        }
    }
})
