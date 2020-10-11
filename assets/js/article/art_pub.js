$(function () {
    var layer = layui.layer;
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
    // 初始化富文本编辑器
    initEditor();


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)



    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    })

    $('#file').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files;
        if (files.length === 0) {
            return layer.msg('请选择图片！')
        }
        var file = e.target.files[0];
        // 根据文件，创建对应的URL地址
        var newImgURL = URL.createObjectURL(file);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    // 设置文章提交状态
    var state = "已发布";


    $('#btnSave2').on('click', function () {
        state = "草稿";
    })

    // 添加文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // 创建FormData对象，收集数据
        var fd = new FormData(this);
        // 放入状态
        fd.append('state', state);
        // 放入图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                // 查询fd的内容
                // console.log(...fd);
                // 文章发布
                publishArticle(fd);
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // FormData类型数据ajax提交，需要设置下面两个属性
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布新文章失败！')
                }
                layer.msg('恭喜你，发布新文章成功,跳转中...')
                // location.href = '/article/art_list.html'
                setTimeout(function () {
                    window.parent.document.querySelector('#art_list').click();
                }, 1500)
            }
        })
    }
})