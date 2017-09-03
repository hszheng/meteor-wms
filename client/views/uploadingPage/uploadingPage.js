/**
 * 上传板块逻辑以及动画
 *
 * @author  Vivian Yang
 * @review
 */

Template.uploadingPage.onRendered(function() {
    var categoriesData = { selector: { isRemoved: { $ne: true } }, options: { sort: { timestamp: -1 } } };

    //返回我的所有产品
    $('#uploadingPage .topMenuArea .editProduction').click(function() {
        FlowRouter.go('/myUploading');
    });


    //获取品牌 && 获取待销售状况
    Meteor.call('getProductCategories', categoriesData, function(err, result) {
        var liIndex = $('#productCategories #optionsItem li');
        if (err) {
            console.log(err);
            return ;
        }
        // console.log(result);
        for (var i = 0; i < result.length; i++) {
            var brandNum = 0,
                productNum = 0;
            if (result[i].type === '产品') {
                brandNum++;
                if (brandNum === 1) {
                    $('#productCategories').find('input').val(result[i].name);
                }
                $('#productCategories #optionsItem').prepend('<li><p>' + result[i].name + '</p></li>');
            } else if (result[i].type === '品牌') {
                productNum++;
                if (productNum === 1) {
                    $('#brand').find('input').val(result[i].name);
                }
                $('#brand #optionsItem').prepend('<li><p>' + result[i].name + '</p></li>');
            }
        }

        //选择状况并关闭
        $('#uploadingPage .productionInfo .productionDetails .selectorContainer .commonRightArea .selectArea ul li').click(function(e) {
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
    $('#uploadingPage .productionInfo .productionDetails .selectorContainer .commonRightArea .selectArea .currentSelectItem').click(function(e) {

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

    //上传图片
    $('#uploadingPage .addNew .uploadPanel input[type="file"]').change(function(e) {
        Meteor.setTimeout(function() {
            $('#uploadingPage .addNew .upload-control.start').click();
        }, 200);
    });

    //上传产品
    $('#uploadingPage .submitProductionInfoBtn .submitBtn').click(function() {
        var productImg = $('.showImg'),
            productImgArr = [],
            userId = Meteor.userId(), //用户ID
            productName = $('#productionName').find('input').val(), //产品名称
            specification = $('#specification').find('input').val(), //规格型号
            unit = $('#uploadingPage .productionInfo .productionDetails .commonInputArea .unitsLists .commonRightArea .redBtn').find('p').text(), //单位
            storeNum = parseInt($('#storeNum').find('input').val()), //库存数量
            productCategories = $('#productCategories .currentSelectItem').find('input').val(), //产品类别
            brand = $('#brand .currentSelectItem').find('input').val(), //制造厂商、品牌
            price = parseInt($('#price').find('input').val()), //价格
            isDiscount = $('#uploadingPage .productionInfo .productionDetails .buyInBulk .redBtn').find('p').data('state'), //优惠
            // isInvoice = $('#uploadingPage .productionInfo .productionDetails .hasBill .redBtn').find('p').data('state'), //发票
            productId = $('#productId').find('input').val(), //产品序列号
            years = $('#years').find('input').val(), //年限
            productStatus = $('#uploadingPage .productionInfo .productionDetails .stateInfo .redBtn').find('p').text(), //产品状态
            substituteModel = $('#substituteModel').find('input').val(), //代替型号
            saleStatus = $('#uploadingPage .productionInfo .productionDetails .sellCondition .redBtn').find('p').text(), //待销售状况
            isRevenue = $('#uploadingPage .productionInfo .productionDetails .isRevenue .redBtn').find('p').data('state'), //是否含税
            storeType = $('#uploadingPage .productionInfo .productionDetails .inventory .commonRightArea .selectArea .currentSelectItem').find('input').val(), //库存类别
            finalPrice = isRevenue ? Math.round(price * 1.05) : Math.round(price * 1.08*1.05), //后台价格
            minPrice = 0, //最低价
            maxPrice = 0, //最高价
            replaceName = changeChar(productName), //字符替换后的字符
            replaceNumber = changeChar(specification), //字符替换后的字符
            checkStatus = '', //待审核
            identifyStatus = '', //待鉴定
            searchTimes = 0, //搜索次数
            saleAmount = 0; //产品销量

            

        // 表单验证
        if (productName === "") {
             Utility.alertMsg("产品名称不能为空");
            return;
        };

        if (specification === "") {
             Utility.alertMsg("规格型号不能为空");
            return;
        };
        if (storeNum === "") {
             Utility.alertMsg("库存数量不能为空");
            return;
        } else {
            if (!/^[0-9]*$/.test(storeNum)) {
                 Utility.alertMsg("库存数量请输入数字！");
                return;
            }

        };

        if (price === "") {
             Utility.alertMsg("价格不能为空");
            return;
        } else {
            if (!/^[0-9]*$/.test(price)) {
                 Utility.alertMsg("价格请输入数字！");
                return;
            }

        }





        // 图片处理
        for (var i = 0; i < $('#uploadingPage .productionInfo .addPic .imgLists .imgArea').length; i++) {
            productImgArr.push(productImg[i].src);
        }

        var userId = Meteor.userId();
        var userPhone=Meteor.user().username;

        var isExitSpecificationData = {
            selector: {
                userId: userId,
                specification: specification,
                isRemoved: { $ne: true }
            },
            options: {}
        };       
        Meteor.call('getProductAll', isExitSpecificationData, function(err, resultData) {
            if (resultData !="") {
                // alert("您已上传过相同型号的产品");
                $('.uploadTipContainer').show();
                return;
            }
            clickSubmitButton();
        });

    });

    $('#uploadingPage .uploadTipContainer .successAlert .innerArea .alertOperationBtn .redBtn#saveContractTip').click(function(){
        clickSubmitButton();
         $('.uploadTipContainer').hide();
    });

    $('#uploadingPage .uploadTipContainer .successAlert .innerArea .alertOperationBtn button#cancleContrctTip').click(function(){
         $('.uploadTipContainer').hide();
    });

});

//选中
function selected(selectDiv) {
    if (!selectDiv.hasClass('redBtn')) {
        selectDiv.addClass('redBtn');
        selectDiv.siblings().removeClass('redBtn');
    }
}

//删除图片
function canclePic(e) {
    $(this).parent().remove();
    // console.log(imgAmount.length);
    if (imgAmount.length < 4) {
        $('#uploadingPage .productionInfo .addPic .imgLists .addNew').show();
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

//点击提交后执行的事件
function clickSubmitButton(){
    var productImg = $('.showImg'),
            productImgArr = [],
            userId = Meteor.userId(), //用户ID
            productName = $('#productionName').find('input').val(), //产品名称
            specification = $('#specification').find('input').val(), //规格型号
            unit = $('#uploadingPage .productionInfo .productionDetails .commonInputArea .unitsLists .commonRightArea .redBtn').find('p').text(), //单位
            storeNum = parseInt($('#storeNum').find('input').val()), //库存数量
            productCategories = $('#productCategories .currentSelectItem').find('input').val(), //产品类别
            brand = $('#brand .currentSelectItem').find('input').val(), //制造厂商、品牌
            price = parseInt($('#price').find('input').val()), //价格
            isDiscount = $('#uploadingPage .productionInfo .productionDetails .buyInBulk .redBtn').find('p').data('state'), //优惠
            // isInvoice = $('#uploadingPage .productionInfo .productionDetails .hasBill .redBtn').find('p').data('state'), //发票
            productId = $('#productId').find('input').val(), //产品序列号
            years = $('#years').find('input').val(), //年限
            productStatus = $('#uploadingPage .productionInfo .productionDetails .stateInfo .redBtn').find('p').text(), //产品状态
            substituteModel = $('#substituteModel').find('input').val(), //代替型号
            saleStatus = $('#uploadingPage .productionInfo .productionDetails .sellCondition .redBtn').find('p').text(), //待销售状况
            isRevenue = $('#uploadingPage .productionInfo .productionDetails .isRevenue .redBtn').find('p').data('state'), //是否含税
            storeType = $('#uploadingPage .productionInfo .productionDetails .inventory .commonRightArea .selectArea .currentSelectItem').find('input').val(), //库存类别
            finalPrice = isRevenue ? Math.round(price * 1.05) : Math.round(price * 1.08*1.05), //后台价格
            minPrice = 0, //最低价
            maxPrice = 0, //最高价
            replaceName = changeChar(productName), //字符替换后的字符
            replaceNumber = changeChar(specification), //字符替换后的字符
            checkStatus = '', //待审核
            identifyStatus = '', //待鉴定
            searchTimes = 0, //搜索次数
            saleAmount = 0; //产品销量

        // 表单验证
        if (productName === "") {
             Utility.alertMsg("产品名称不能为空");
            return;
        };

        if (specification === "") {
             Utility.alertMsg("规格型号不能为空");
            return;
        };
        if (storeNum === "") {
             Utility.alertMsg("库存数量不能为空");
            return;
        } else {
            if (!/^[0-9]*$/.test(storeNum)) {
                 Utility.alertMsg("库存数量请输入数字");
                return;
            }

        };

        if (price === "") {
             Utility.alertMsg("价格不能为空");
            return;
        } else {
            if (!/^[0-9]*$/.test(price)) {
                 Utility.alertMsg("价格请输入数字");
                return;
            }

        }





        // 图片处理
        for (var i = 0; i < $('#uploadingPage .productionInfo .addPic .imgLists .imgArea').length; i++) {
            productImgArr.push(productImg[i].src);
        }

        //最高价 & 最低价
        var specificationData = { selector: { specification: specification, isRemoved: { $ne: true } }, options: {} };
        // console.log(specificationData);

        var userId = Meteor.userId();
        var userPhone=Meteor.user().username;
        var isExitSpecificationData = {
            selector: {
                userId: userId,
                specification: specification,
                isRemoved: { $ne: true }
            },
            options: {}
        };
        //判断用户是否是第一次上传 || 信誉度高低  --> 改变checkStatus
          var judgeData = { selector: { userId: Meteor.userId() }, options: {} };
          Meteor.call('getProductLengthByUserId', judgeData, function(err, result) { //获取是否上传过产品
                    // console.log(result);
                    var first = result;

                    Meteor.call('getCreditNo', judgeData, function(err, result) {
                        if (result > 3 || first < 1) {
                            checkStatus = '待审核';
                            identifyStatus = '待鉴定';
                        } else {
                            checkStatus = '审核通过';
                            identifyStatus = '待鉴定';
                        }

                        data = {
                                userId: userId,
                                userPhone:userPhone,
                                productImgArr: productImgArr,
                                productName: productName,
                                specification: specification,
                                unit: unit,
                                storeNum: storeNum,
                                productCateory: productCategories,
                                brand: brand,
                                price: price,
                                isDiscount: isDiscount,
                                // isInvoice: isInvoice,
                                productId: productId,
                                years: years,
                                productStatus: productStatus,
                                substituteModel: substituteModel,
                                saleStatus: saleStatus,
                                storeType: storeType,
                                finalPrice: finalPrice,
                                checkStatus: checkStatus,
                                replaceName: replaceName,
                                replaceNumber: replaceNumber,
                                isRevenue: isRevenue,
                                checkStatus: checkStatus,
                                identifyStatus: identifyStatus,
                                searchTimes: searchTimes,
                                saleAmount: saleAmount
                            }
                        Meteor.call('insertProduct', data, function(err, result) {
                            console.log(err, result);
                            if (!err) {

                                var modelData = {
                                    selector: {
                                        specification: specification
                                    },
                                    options: {}
                                }

                                Meteor.call('insertModel', modelData, function(err, result) {
                                    if (result) {
                                    
                                         // Utility.alertMsg("上传成功");
                                        FlowRouter.go('/myUploading');
                                    }
                                })


                            } else if (err) {
                                 Utility.alertMsg("上传失败");
                            }
                        });
                    });
          });



}
Template.uploadingPage.helpers({
    uploadCallback: function() {
        return {
            finished: function(index, fileInfo, context) {
                var url = fileInfo.baseUrl + fileInfo.name,
                    addBtn = $('#uploadingPage .productionInfo .addPic .imgLists'),
                    imgAmount = $('#uploadingPage .productionInfo .addPic .imgLists .imgArea');

                addBtn.prepend('<div class="imgArea commonImgArea"><span><img src="' + url + '" alt="产品图片" class="showImg"></span><div class="cancleThisPic"></div></div>');
                //关闭当前上传图片
                $('#uploadingPage .productionInfo .addPic .imgLists .cancleThisPic').click(function(e) {
                    $(this).parent().remove();
                    if (imgAmount.length < 4) {
                        $('#uploadingPage .productionInfo .addPic .imgLists .addNew').show();
                    }
                });

                if (imgAmount.length > 2) {
                    $('#uploadingPage .productionInfo .addPic .imgLists .addNew').hide();
                }
                $('#uploadingPage .addNew .jqUploadclass').val('');
            }
        };
    }
});
