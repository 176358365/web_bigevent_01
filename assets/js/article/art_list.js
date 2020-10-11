$(function () {
    var layer = layui.layer;


    // 定义时间过滤器
    template.defaults.imports.dateFormat = function (data) {
        var dt = new Date(data);


        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())


        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + "-" + m + "-" + d + " " + hh + ':' + mm + ":" + ss
    }


    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : "0" + n;
    }
    // 定义查询参数
    var q = {
        pagenum: 1,   //页码值
        pagesize: 2,//每页显示多少条数据
        cate_id: "",  //文章分类的Id
        state: "",  //文章的状态，可选值有：已发布，草稿
    };

    // 初始化文章列表
    initTable();
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                var str = template('tpl-table', res);
                $('tbody').html(str);
                renderPage(res.total)
            }
        })
    }

    // 初始化分类
    var form = layui.form;
    initCate();

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 赋值。渲染form
                var str = template('tpl-cate', res)
                $('[name=cate_id]').html(str);
                form.render();
            }
        })
    }

    // 筛选
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取
        var state = $('[name=state]').val()
        var cate_id = $('[name=cate_id]').val()
        // 赋值
        q.state = state;
        q.cate_id = cate_id;
        // 再次初始化文章列表
        initTable();
    })


    // 分页
    var laypage = layui.laypage;
    function renderPage(num) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: num, //数据总数，从服务端得到
            limit: q.pagesize,  //每页几条数据
            curr: q.pagenum,  //默认在第几页
            // 分页模块设置,显示子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],  //每页显示多少条数据的选择器
            jump: function (obj, first) {
                // obj：包含了所有的参数   first是否是第一次初始化分页
                // 该变当前页
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                // 判断，不是第一次初始化分页，才能重新调用初始化文章列表
                if (!first) {
                    initTable();
                }
            }
        });
    }


    // 删除
    var layer = layui.layer;
    $('tbody').on('click', ".btn-delete", function () {
        var id = $(this).attr('data-Id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg('恭喜你，文章删除成功！')
                    // 页面汇总删除按钮个数等于1，页码大于一
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    initTable();
                }
            })
            layer.close(index);
        });
    })
})