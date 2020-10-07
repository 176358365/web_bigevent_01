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
})
