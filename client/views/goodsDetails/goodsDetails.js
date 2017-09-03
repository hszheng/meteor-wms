/**
 * 我的上传板块逻辑以及动画
 *
 * @author  Vivian Yang
 * @review
 */
Template.goodsDetails.onCreated(function() {
    var self = this;
    var selector = {};
    var options = {};
    self.subscribe('model', selector, options);

});
Template.goodsDetails.onRendered(function() {
    // 定义变量
    var userId = Meteor.userId(),
        user = { selector: { userId: userId }, options: {} },
        level = '',
        data = { selector: { _id: Session.get('goodsId') }, options: { sort: { timestamp: -1 } } };

    //返回搜索页面
    $('#goodsDetails .goodsNameArea .innerContainer button').click(function() {
        if (FlowRouter.current().oldRoute) {
            // 跳转回原来的页面
            FlowRouter.go(FlowRouter.current().oldRoute.path);
        } else {
            // 跳转回首页
            FlowRouter.go('/searchPage');
        }
    });

    //获取用户等级
    if (!userId) {
        level = '游客';
    } else {
        Meteor.call('getUserInfoByUserId', user, function(err, result) {
            level = result.level;
            Session.set('showArrange', result.showArrange);
        });
    }

    //获取当前产品信息
    Meteor.call('getProductByProductId', data, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }
        Session.set('curProduct', result);

        var modelData = {
            selector: {
                specification: result.specification,
                isRemove: { $ne: true }
            },
            options: { sort: { timestamp: -1 } }
        };

        var modelResult = Model.find(modelData.selector, modelData.options).fetch();

        //处理是否可查看价格
        var finialPrice = price(level, result.finalPrice, result.minPrice, result.maxPrice);

        //展示产品信息
        $('#productTitleName').html(result.productName); //展示头部标题
        $('#productName').text(result.productName); //产品名称
        $('#price').text(finialPrice); //获取商品价格
        $('#specification').text(result.specification); //规格型号
        $('#searchTimes').text(result.searchTimes);//搜索次数
        $('#storeNum').text(result.storeNum); //库存数量
        $('#brand').text(result.brand); //品牌
        if (level == '游客' || level == '普通会员') {
            $('#revenue').text('***');
        } else {
            $('#revenue').text((parseInt(result.finalPrice)).toFixed(2));
        }

        // console.log(parseInt(result.price) * 1.08);

        //是否有优惠
        if (result.isDiscount === true) {
            $('#isDiscount').text('是');
        } else {
            $('#isDiscount').text('否');
        }

        //是否提供发票
        if (result.isRevenue === true) {
            $('#isInvoice').text('是');
        } else {
            $('#isInvoice').text('否');
        }

        $('#year').text(result.years); //年限说明
        $('#productStatus').text(result.productStatus); //产品状态
        $('#substituteModel').text(result.substituteModel); //代替型号
    });


    //点击显示图片
    $("#goodsDetails .goodsSummaryContainer .goodsSummaryArea .goodsInfo .showPicBtn .button").click(function() {
        $("#goodsDetails .pictureContainer").css('display', 'block');
        $('#goodsDetails .pictureContainer .successAlert .innerArea .imgShow').html("");
        var picArr = [];

        if (Session.get('curProduct')) {
            var productData = Session.get('curProduct');
            picArr = productData.productImgArr;
        }
        if (picArr.length == 0) {
            $('#goodsDetails .pictureContainer .successAlert .innerArea .imgShow').append('<div class="text">无</div>');

        } else {

            if (picArr.length == 1) {
                $('#goodsDetails .pictureContainer .successAlert ').css('height', '5.23rem');
                $('#goodsDetails .pictureContainer .successAlert ').css('width', '5.23rem');
                $('#goodsDetails .pictureContainer .successAlert .innerArea .imgShow').append('<img style="height:90%;width:85%;" src="' + picArr[0] + '">')
            } else {


                if (picArr.length == 2) {
                    $('#goodsDetails .pictureContainer .successAlert ').css('height', '5.23rem');
                    $('#goodsDetails .pictureContainer .successAlert ').css('width', '8.466667rem');

                    for (var i = 0; i < picArr.length; i++) {
                        $('#goodsDetails .pictureContainer .successAlert .innerArea .imgShow').append('<img style="height:90%" src="' + picArr[i] + '">')
                    }
                } else {
                    $('#goodsDetails .pictureContainer .successAlert ').css('height', '9.466667rem');
                    $('#goodsDetails .pictureContainer .successAlert ').css('width', '8.466667rem');
                    for (var i = 0; i < 4; i++) {
                        $('#goodsDetails .pictureContainer .successAlert .innerArea .imgShow').append('<img src="' + picArr[i] + '">')
                    }
                }
            }
        }




    });
    //点击关闭弹出窗
    $("#goodsDetails .pictureContainer .successAlert .innerArea .button").click(function() {
        $("#goodsDetails .pictureContainer").css('display', 'none');
    })

    //加入购物车

    $('#bottomOperationArea button').click(function(e) {
        var buttonIndex = $(this).index(),
            productInfo = Session.get('curProduct'),
            userId = Meteor.userId(),
            productId = Session.get('goodsId'),
            num = 1,
            data = {
                userId: userId,
                productId: productId,
                num: num
            };

        //添加商品详情到购物车
        Meteor.call('insertTrade', data, function(err, result) {
            console.log(err);
        });
        if (buttonIndex === 0) {
            FlowRouter.go('/shoppingTrolley');
        } else {
            $('#goodsDetails .coverContainer').show();
        }
    });

    $('.alertOperationBtn button').click(function(e) {
        var buttonIndex = $(this).index();
        if (buttonIndex === 1) {
            FlowRouter.go('/shoppingTrolley');
        } else {
            $('#goodsDetails .coverContainer').hide();
            if (FlowRouter.current().oldRoute) {
                // 跳转回原来的页面
                FlowRouter.go(FlowRouter.current().oldRoute.path);
            } else {
                // 跳转回首页
                FlowRouter.go('/searchPage');
            }
        }
    });
});

//展示价格
function price(level, price, min, max) {
    switch (level) {
        case '游客':
            price = '***';
            return price;
            break;
        case '普通会员':
            if (Session.get('showArrange')) {
                price = '' + min + '-' + max;
            } else {
                price = '*';
            }
            return price;
            break;
        case 'vip会员':
            price = price;
            return price;
            break;
        case '超级会员':
            price = price;
            return price;
            break;
    }
}
