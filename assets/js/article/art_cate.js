$(function () {
    // 初始化文章分类列表
    initArtCateList();

    // 封装初始化文章分类列表
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                var str = template('tpi-table', res);
                $('tbody').html(str);
            }
        })
    }


    // 显示添加文章分类列表
    var layer = layui.layer;
    var form = layui.form;
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '260px'],
            title: '添加文章分类',
            content: $("#dialog-add").html()
        });
    })


    // 提交文章分类添加(事件委托)
    var indexAdd = null;
    $('body').on('submit', "#form-add", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 添加成功之后重新渲染页面中得数据
                initArtCateList();
                layer.msg('恭喜你，文章类别添加成功！');
                layer.close(indexAdd);
            }
        })
    })
    //修改表单
    var indexEdit = null;
    $('tbody').on('click', ".btn-edit", function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '260px'],
            title: '修改文章分类',
            content: $("#dialog-edit").html()
        });
        // 获取id，发送ajax获取数据，渲染到页面
        var id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val("form-edit", res.data)
            }
        })
    })
    // 修改-提交
    $('body').on('submit', "#form-edit", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.messagee);
                }
                initArtCateList();
                layer.msg("恭喜你，文章类别更新成功！");
                layer.close(indexEdit);
            }
        })
    })
    // 删除
    $('tbody').on("click", ".btn-delete", function () {
        var id = $(this).attr('data-id');
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg("删除文章分类成功！");
                    layer.close(index);
                    initArtCateList();
                }
            })

        });
    })
})