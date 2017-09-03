/**
 * pc端修改产品信息板块逻辑以及动画
 *
 * @author  Vivian Yang
 * @review
 */

Template.pcEditUploading.onRendered(function() {
    var productImgArr = [],
        userId = Meteor.userId(),
        data = { selector: { _id: Session.get('postId') }, options: { sort: { timestamp: -1 } } },
        myAllProductions = [],
        unitsBtn = $('.unitsLists .units'),
        invoiceBtn = $('#invoice .yesOrNO'),
        isRevenue = $('#isRevenue .yesOrNO'),
        freeBtn = $('#free .yesOrNO'),
        productStateBtn = $('#productStateBtn .stateType'),
        sellStateBtn = $('#sellStateBtn .stateType'),
        categoriesData = { selector: { isRemoved: { $ne: true } }, options: { sort: { timestamp: -1 } } };

    //获取当前产品的详细信息
    Meteor.call('getProductByProductId', data, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }

       //显示品牌和分类  productCateory
        $('#brand').find('input').val(result.brand);
        $('#productCategories').find('input').val(result.productCateory);
        
        // 图片展示
        for (var i = 0; i < result.productImgArr.length; i++) {
            var imgAmount = $('#pcEditUploading .productionInfo .addPic .imgLists .imgArea');
            $('#pcEditUploading .productionInfo .addPic .imgLists').prepend('<div class="imgArea commonImgArea"><span><img src="' + result.productImgArr[i] + '" alt="产品图片" class="showImg"></span><div class="cancleThisPic"></div></div>');

            if (imgAmount.length > 2) {
                $('#pcEditUploading .productionInfo .addPic .imgLists .addNew').hide();
            }

            //关闭当前上传图片
            $('#pcEditUploading .productionInfo .addPic .imgLists .cancleThisPic').click(function(e) {
                $(this).parent().remove();
                // console.log(imgAmount.length);
                if (imgAmount.length < 4) {
                    $('#pcEditUploading .productionInfo .addPic .imgLists .addNew').show();
                }
            });

        }

        // 查找匹配的选项
        for (var i = 0; i < unitsBtn.length; i++) {
            if (result.unit === unitsBtn.eq(i).find('p').html()) {
                unitsBtn.eq(i).addClass('redBtn');
            }
        }

        for (var i = 0; i < productStateBtn.length; i++) {
            if (result.productStatus === productStateBtn.eq(i).find('p').html()) {
                productStateBtn.eq(i).addClass('redBtn');
            }
        }

        for (var i = 0; i < sellStateBtn.length; i++) {
            if (result.saleStatus === sellStateBtn.eq(i).find('p').html()) {
                sellStateBtn.eq(i).addClass('redBtn');
            }
        }

        // 是否选项
        for (var i = 0; i < freeBtn.length; i++) {
            if (result.isDiscount === freeBtn.eq(i).find('p').data('state')) {
                freeBtn.eq(i).addClass('redBtn');
            }
        }

        for (var i = 0; i < invoiceBtn.length; i++) {
            if (result.isInvoice === invoiceBtn.eq(i).find('p').data('state')) {
                invoiceBtn.eq(i).addClass('redBtn');
            }
        }

        for (var i = 0; i < isRevenue.length; i++) {
            if (result.isRevenue === isRevenue.eq(i).find('p').data('state')) {
                isRevenue.eq(i).addClass('redBtn');
            }
        }

        // 下拉框当前选项显示

        $('#productionName').find('input').val(result.productName);
        $('#specification').find('input').val(result.specification);
        $('#storeNum').find('input').val(result.storeNum);
        $('#brand .commonRightArea .selectArea .currentSelectItem').find('input').val(result.brand);
        $('#price').find('input').val(result.price);
        $('#productId').find('input').val(result.productId);
        $('#years').find('input').val(result.years);
        $('#substituteModel').find('input').val(result.substituteModel);
        $('#pcEditUploading .productionInfo .productionDetails .inventory .commonRightArea .selectArea .currentSelectItem').find('input').val(result.storeType);

    });

    //获取品牌 && 获取待销售状况
    Meteor.call('getProductCategories', categoriesData, function(err, result) {
        var liIndex = $('#productCategories #optionsItem li');
        if (err) {
            console.log(err);
            return;
        }
        for (var i = 0; i < result.length; i++) {
            var brandNum = 0,
                productNum = 0;
            if (result[i].type === '产品') {
                brandNum++;
                // if (brandNum === 1) {
                //     $('#productCategories').find('input').val(result[i].name);
                // }
                $('#productCategories #optionsItem').prepend('<li><p>' + result[i].name + '</p></li>');
            } else if (result[i].type === '品牌') {
                productNum++;
                // if (productNum === 1) {
                //     $('#brand').find('input').val(result[i].name);
                // }
                $('#brand #optionsItem').prepend('<li><p>' + result[i].name + '</p></li>');
            }
        }

        //选择状况并关闭
        $('#pcEditUploading .productionInfo .productionDetails .selectorContainer .commonRightArea .selectArea ul li').click(function(e) {
            var selectVal = $(this).find('p').text(),
                operationEle = $(this).parents('.selectArea');
            operationEle.find('input').val(selectVal);

            $(this).parent().fadeOut();
            operationEle.find('span').removeClass('open');
            operationEle.find('span').addClass('close');
        });
    });


    //选择按钮选中状态
    $('.unitsLists .commonRightArea .units').click(function(e) {
        selected($(this));
    });
    $('.favorable .commonRightArea .units').click(function(e) {
        selected($(this));
    });


    //选择待销售状况
    $('#pcEditUploading .productionInfo .productionDetails .selectorContainer .commonRightArea .selectArea .currentSelectItem').click(function(e) {
        // var curClick = $(this).parent();
        if ($(this).find('span').hasClass('close')) {
            $(this).parent().find('ul').fadeIn();
            $(this).find('span').removeClass('close');
            $(this).find('span').addClass('open');
        } else {
            $(this).parent().find('ul').fadeOut();
            $(this).find('span').removeClass('open');
            $(this).find('span').addClass('close');
        }
    });

    //选择状况并关闭
    $('#pcEditUploading .productionInfo .productionDetails .selectorContainer .commonRightArea .selectArea ul li').click(function(e) {
        var selectVal = $(this).find('p').text(),
            operationEle = $(this).parents('.selectArea');
        operationEle.find('input').val(selectVal);

        $(this).parent().fadeOut();
        operationEle.find('span').removeClass('open');
        operationEle.find('span').addClass('close');
    });

    //上传图片
    $('#pcEditUploading .addNew .uploadPanel input[type="file"]').change(function(e) {
        Meteor.setTimeout(function() {
            $('#pcEditUploading .addNew .upload-control.start').click();
        }, 200);
    });

    //点击保存弹出弹出框
    $('#pcEditUploading .submitProductionInfoBtn .submitBtn').click(function() {
        $('#pcEditUploading #makeSure').show();

    });

    //不保存
    $('#pcEditUploading #cancleSave').click(function() {
        $('#pcEditUploading #makeSure').hide();
        FlowRouter.go('/pcMyUploading');
    });

    $('#pcEditUploading #save').click(function() {
        $('#pcEditUploading #makeSure').hide();
        var productImg = $('.showImg'),
            productName = $('#productionName').find('input').val(), //产品名称
            specification = $('#specification').find('input').val(), //规格型号
            unit = $('#pcEditUploading .productionInfo .productionDetails .commonInputArea .unitsLists .commonRightArea .redBtn').find('p').text(), //单位
            storeNum = parseInt($('#storeNum').find('input').val()), //库存数量
            productCategories = $('#productCategories .currentSelectItem').find('input').val(), //产品类别
            brand = $('#brand .currentSelectItem').find('input').val(), //制造厂商、品牌
            price = parseInt($('#price').find('input').val()), //价格
            isDiscount = $('#pcEditUploading .productionInfo .productionDetails .buyInBulk .redBtn').find('p').data('state'), //优惠
            isInvoice = $('#pcEditUploading .productionInfo .productionDetails .hasBill .redBtn').find('p').data('state'), //发票
            productId = $('#productId').find('input').val(), //产品序列号
            years = $('#years').find('input').val(), //年限
            productStatus = $('#pcEditUploading .productionInfo .productionDetails .stateInfo .redBtn').find('p').text(), //产品状态
            substituteModel = $('#substituteModel').find('input').val(), //代替型号
            saleStatus = $('#pcEditUploading .productionInfo .productionDetails .sellCondition .redBtn').find('p').text(), //待销售状况
            storeType = $('#pcEditUploading .productionInfo .productionDetails .inventory .commonRightArea .selectArea .currentSelectItem').find('input').val(), //库存类别
            saleAmount = 0, //产品销量
            replaceName = changeChar(productName), //字符替换后的字符
            replaceNumber = changeChar(specification), //字符替换后的字符
            isRevenue = $('#pcEditUploading .productionInfo .productionDetails .isRevenue .redBtn').find('p').data('state'), //是否含税
            finalPrice = isRevenue ? Math.round(price * 1.05) : Math.round(price * 1.08*1.05), //后台价格
            postId = Session.get('postId');

        for (var i = 0; i < $('#pcEditUploading .productionInfo .addPic .imgLists .imgArea').length; i++) {
            productImgArr.push(productImg[i].src);
        }
        var judgeData = { selector: { userId: Meteor.userId() }, options: {} };
        Meteor.call('getCreditNo', judgeData, function(err, result) {

            if (result > 3) {
                checkStatus = '待审核';

            } else {
                checkStatus = '审核通过';
            }

            var data = {
                _id: postId,
                modifier: {
                    productImgArr: productImgArr,
                    productName: productName,
                    specification: specification,
                    unit: unit,
                    storeNum: storeNum,
                    brand: brand,
                    price: price,
                    isDiscount: isDiscount,
                    isInvoice: isInvoice,
                    productId: productId,
                    years: years,
                    productStatus: productStatus,
                    substituteModel: substituteModel,
                    saleStatus: saleStatus,
                    finalPrice: finalPrice,
                    replaceName: replaceName,
                    replaceNumber: replaceNumber,
                    storeType: storeType,
                    checkStatus: checkStatus,
                    isRevenue:isRevenue
                }
            };


            Meteor.call('updateProduct', data, function(err, result) {
                console.log(err);
                if (!err) {
                    $('#pcEditUploading #success').show();
                    setTimeout(function() {
                        $('#pcEditUploading #success').fadeOut();
                    }, 500);
                    setTimeout(function() {
                        FlowRouter.go('/pcMyUploading');
                    }, 800);
                }
            });

        })


    });

    //返回我的所有产品
    $('#pcEditUploading .topMenuArea .editProduction').click(function() {
        if (FlowRouter.current().oldRoute) {
            // 跳转回原来的页面
            FlowRouter.go(FlowRouter.current().oldRoute.path);
        } else {
            // 跳转回首页
            FlowRouter.go('/pcMyUploading');
        }
    });

    //删除当前产品
    $('#pcEditUploading .submitProductionInfoBtn .delete').click(function() {
        $('#pcEditUploading #deleteAlert').show();
    });

    //不删除
    $('#pcEditUploading #cancleDelete').click(function() {
        $('#pcEditUploading #deleteAlert').hide();
    });

    //删除
    $('#pcEditUploading #Delete').click(function() {
        $('#pcEditUploading #deleteAlert').hide();
        var postId = Session.get('postId'),
            data = { _id: postId, modifier: { isRemoved: true } };

        Meteor.call('updateProduct', data, function(err, result) {
            console.log(err, result);
            if (!err) {
                FlowRouter.go('/pcMyUploading');
            }
        });
    });

    $('#editPCUploadBackBtn').click(function(){
        FlowRouter.go('/pcMyUploading');;
    })
});

function selected(selectDiv) {
    if (!selectDiv.hasClass('redBtn')) {
        selectDiv.addClass('redBtn');
        selectDiv.siblings().removeClass('redBtn');
    }
}


//字符转换
function changeChar(words) {
    //去掉字符串中的空格
    var str1 = words.replace(/\s/g, '');
    //去掉字符串中的横杠
    var str2 = str1.replace(/-/g, '');
    //大写字母转换为小写字母
    var str3 = str2.toLowerCase();
    var str = str3.split(''),
        replaceName = '';

    for (var i = 0; i < str.length; i++) {
        switch (str[i]) {
            case '1':
                str[i] = 'i';
                break;
            case '0':
                str[i] = 'o';
                break;
            default:
                break;
        }
        replaceName = replaceName + str[i];
    }

    return replaceName;
}

Template.pcEditUploading.helpers({
    uploadCallback: function() {
        return {
            finished: function(index, fileInfo, context) {
                var url = fileInfo.baseUrl + fileInfo.name,
                    addBtn = $('#pcEditUploading .productionInfo .addPic .imgLists'),
                    imgAmount = $('#pcEditUploading .productionInfo .addPic .imgLists .imgArea');
                addBtn.prepend('<div class="imgArea commonImgArea"><span><img src="' + url + '" alt="产品图片" class="showImg"></span><div class="cancleThisPic"></div></div>');
                //关闭当前上传图片
                $('#pcEditUploading .productionInfo .addPic .imgLists .cancleThisPic').click(function(e) {
                    // console.log($(this).parent().index());
                    $(this).parent().remove();
                    // console.log(imgAmount.length);
                    if (imgAmount.length < 4) {
                        $('#pcEditUploading .productionInfo .addPic .imgLists .addNew').show();
                    }
                });
                if (imgAmount.length > 2) {
                    $('#pcEditUploading .productionInfo .addPic .imgLists .addNew').hide();
                }
                $('#pcEditUploading .addNew .jqUploadclass').val('');
            }
        };
    }
});
