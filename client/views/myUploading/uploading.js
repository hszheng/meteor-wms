/**
 * 我的上传板块逻辑以及动画
 *
 * @author  Vivian Yang
 * @review
 */

Template.myUploading.onRendered(function() {
    var data = { selector: { userId: Meteor.userId(), isRemoved: { $ne: true } }, options: { sort: { timestamp: -1 } ,limit: 15} };
        

    getProduct(data);

    //点击上传按钮跳转至上传页面
    $('#myUploadingContainer .uploadingNowContainer .uploadingNowBtn .addMyProdece').click(function() {
        if (Session.get("userInfo")) {
            var userData=Session.get("userInfo");
            if (userData[0].identifyStatus=="认证失败") {
                 Utility.alertMsg("对不起，您已经认证失败");
            } else {
                FlowRouter.go('/uploadingPage');
            }
        }

    });

    //点击我的上传回到上一页
    $('#myUploadingContainer .uploadingBtnArea .redBtn .submitUploading').click(function() {
        FlowRouter.go('/personalPage');
    });

    $('.situation a').text('PC端上传(请复制到浏览器打开):'+HOST+"/pcLogin")
});

function getProduct(data){
    var userId = Meteor.userId(),
        myAllProductions = [],
        html = '';
    Meteor.call('getProductAndCount', data, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }
        _.each(result.productData, function(item, index) {
            myAllProductions.push(item);
        });

        $("#myUploadingContainer .situation .allCount").text(result.allCount);
        // var j = 0;
        // for (var i = 0; i < result.length; i++) {
        //     if (result[i].checkStatus == "审核通过") {
        //         j = j + 1;
        //     }
        // }
        $("#myUploadingContainer .situation .passSituation").text(result.passCount);

        //加载我的所有产品
        for (var i = 0; i < myAllProductions.length; i++) {

            var modelData = {
                selector: {
                    specification: myAllProductions[i].specification,
                    isRemove: { $ne: true }
                },
                options: { sort: { timestamp: -1 } }
            };

            // Meteor.call("getModel", modelData, function(err, result) {

            //     if (err) {
            //         console.log(err);
            //         return;
            //     }

            //     Session.set("clickTime",result[0].clickTime);

            // })


            html = html +'<div class="production" data-id="' + myAllProductions[i]._id + '">' +
                '<div class="detailsArea">' +
                '<h3>' + myAllProductions[i].productName + '</h3>' +
                '<p>规格型号：' + myAllProductions[i].specification + '<span class="storeText">库存：' + myAllProductions[i].storeNum + '</span></p>' +
                '<p>产品类别：' + myAllProductions[i].productCateory + '<span class="storeText">品牌：' + myAllProductions[i].brand + '</span></p>' +
                '<p class="buttomTxt">￥' + myAllProductions[i].price + '<span class="stateArea">' + myAllProductions[i].checkStatus + '</span><span class="clear"></span></p>' +
                '</div>' +
                '<div class="clear"></div></div>';

        };

        $('#myUploadingContainer .productions').html(html);
        //点击产品进入产品详情页
        $('#myUploadingContainer .productions .production').off('click');
        $('#myUploadingContainer .productions .production').on('click',function(e) {
            var postId = $(this).data('id');
            Session.set('postId', postId);
            FlowRouter.go('/editUploadingPage/' + postId);
        });

        //滚动条滚动到底部执行的事件
        $('.productsContainer').off('scroll');
        $('.productsContainer').on('scroll',function(){
            if($('.productions').height() - ($('.productsContainer').outerHeight() + $('.productsContainer')[0].scrollTop) < 5){
                data.options.limit = data.options.limit + 15;
                getProduct(data);
            }
        });
    });
}