/**
 * 购物车板块逻辑以及动画
 *
 * @author  Vivian Yang
 * @review
 */
Template.shoppingTrolley.onRendered(function() {
    //展示购物车商品详情
    var userId = Meteor.userId(),
        data = { selector: { userId: userId, isRemoved: { $ne: true } }, options: { sort: { timestamp: -1 } } },
        goodsInCar = [];
    var level = "游客",
        isShowArrange = false;
    var UserData = UserInfo.findOne();
    if (UserData) {
        level = UserData.level;
        isShowArrange = UserData.showArrange;
        Session.set('showArrange', UserData.showArrange);
    } else {
        level = '游客';
        Session.set('showArrange', false);
    }

    Meteor.call('getTradeByUserId', data, function(err, result) {
        var singlePrice = 0,
            totalPrice = 0,
            totalMinPrice = 0,
            totalMaxPrice = 0,
            priceRange = {},
            minPriceNum = 0,
            maxPriceNum = 0,
            singlePriceArr = [];
        if (err) {
            console.log(err);
            return;
        }
        if (result == "") {
            $("#shoppingTrolley .searchArea").css("display", 'block');
        } else {
            $("#shoppingTrolley .searchArea").css("display", 'none');
        }

        Session.set('allProduct', result);
         Session.set('allProductArr', null);

        for (var i = 0; i < result.length; i++) {

            var finialPrice = price(level, result[i].finalPrice * result[i].num, result[i].minPrice * result[i].num, result[i].maxPrice*result[i].num);

            $('#shoppingTrolley .productsLists').append('<div class="product" data-minprice="' + result[i].minPrice + '" data-maxprice="' + result[i].maxPrice + '" data-productid="' + result[i].productId + '"data-pic="' + result[i].picUrl + '"data-id="' + result[i]._id + '">' +
                '<div class="frameLeft">' +
                '<div class="selectAll">' +
                '<div class="leftArea">' +
                '<button class="cycleCheckBtn centerDiv" value="false"><img src="/select.png" alt="选择图标"></button>' +
                '</div>' +
                '<div class="clear"></div>' +
                '</div>' +
                '</div>' +
                '<div class="frameRight">' +
                '<h3><span class="leftName">' + result[i].productName + '</span><span></span><span class="deleteThisGoods"><img src="/delete.png" alt="删除"></span><div class="clear"></div></h3>' +
                '<p>' + result[i].specification + '  ' + result[i].brand + '</p>' +
                '<div class="bottomArea">' +
                '<div class="addBtnGroup">' +
                '<ul>' +
                '<li class="subtractBtn"><span>-</span></li>' +
                // '<li class="numberBtn"><span class="totalNum">' + result[i].num + '</span></li>' +
                '<li class="numberBtn"><input type="text" class="totalNum" value="' + result[i].num + '"></li>' +
                '<li class="addBtn"><span>+</span></li>' +
                '</ul>' +
                '</div>' +
                '<div class="button">显示图片</div>' +
                '<div class="grossAmount">' +
                '<span id="univalent">￥<b>' + finialPrice + '</b></span>' +
                '</div>' +
                '<div class="clear"></div>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '</div>');

            if (result[i].num == '1') {
                $('.product').eq(i).find('li.subtractBtn').addClass('grayBtn');
            }

            if (level == '游客' || level == '普通会员') {
                totalPrice = '***';
            } else {
                singlePrice = result[i].finalPrice;
                singlePriceArr.push(singlePrice);
                totalPrice = totalPrice + singlePrice * result[i].num;
            }

        }
        // console.log(singlePriceArr);
        $('#totalPrice').text(0);
        $('#selectProductNum').text(0);
        $('#deleteProductNum').text(0);

        $('#shoppingTrolley .productsLists .product').click(function() {
            var goodsId = $(this).data('productid');
            // console.log(goodsId);
            Session.set('goodsId', goodsId);
            FlowRouter.go('/goodsDetails/' + goodsId);
        });

        //输入数量Input事件
        $('#shoppingTrolley .productsLists .product .frameRight .bottomArea .addBtnGroup ul .numberBtn input').bind('input', function(event) {
            /* Act on the event */

            var numberStr = $(this).val();
            if (!/^[0-9]*$/.test(numberStr[numberStr.length - 1])) {
                numberStr = numberStr.substring(0, numberStr.length - 1);
                $(this).val(numberStr);
            }


            var numberValue = parseInt($(this).val());

            var curIndex = $(this).parents('.product').eq(0).index(),
                allProductTotal = $('#shoppingTrolley .productsLists .product'),
                minPriceValue = allProductTotal.eq(curIndex).data('minprice'),
                maxPriceValue = allProductTotal.eq(curIndex).data('maxprice');
            var singlePrice = parseInt($(this).parents('.bottomArea').eq(0).find('span#univalent > b').text());
            var oldTotalPrice = parseInt($('#totalPrice').text()) - singlePrice;

            if (level == '游客' || level == '普通会员') {

                if (isShowArrange) {

                    var minAllPrice = (numberValue * minPriceValue).toFixed(2);
                    var maxAllPrice = (numberValue * maxPriceValue).toFixed(2);
                    $(this).parents('.bottomArea').eq(0).find('span#univalent > b').text(minAllPrice + "-" + maxAllPrice);

                } else {
                    $(this).parents('.bottomArea').eq(0).find('span#univalent > b').text('***');
                }
                $('#totalPrice').text('***');
            } else {
                if (numberValue > 0) {
                    $(this).parents('.bottomArea').eq(0).find('span#univalent > b').text(numberValue * parseInt(singlePriceArr[curIndex]));
                    $('#totalPrice').text(oldTotalPrice + numberValue * parseInt(singlePriceArr[curIndex]));
                } else {
                    $(this).val(1);
                    $(this).parents('.bottomArea').eq(0).find('span#univalent > b').text(1 * parseInt(singlePriceArr[curIndex]));
                    $('#totalPrice').text(oldTotalPrice + 1 * parseInt(singlePriceArr[curIndex]));
                }
            }


        });

        $('#shoppingTrolley .productsLists .product .frameRight .bottomArea .addBtnGroup ul .numberBtn input').blur(function(event) {
            /* Act on the event */
            var numberValue = parseInt($(this).val()),
                allProductTotal = $('#shoppingTrolley .productsLists .product'),
                curIndex = $(this).parents('.product').eq(0).index(),
                curPostId = allProductTotal.eq(curIndex).data('id');

            var tradeData = { _id: curPostId, modifier: { num: numberValue } };
            console.log(tradeData);
            Meteor.call('updateTrade', tradeData, function(err, result) {
                console.log(err, result);
            });

        });

        //显示图片按钮点击
        $('#shoppingTrolley .productsLists .product .frameRight .bottomArea .button').click(function(event) {

            $('#shoppingTrolley .pictureContainer .successAlert .innerArea .imgShow').html("");

            var e = event || window.event;
            if (e && e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
            $('#shoppingTrolley .pictureContainer').css('display', 'block');

            var allProductTotal = $('#shoppingTrolley .productsLists .product'),
                curIndex = $(this).parents('.product').eq(0).index(),
                picUrl = allProductTotal.eq(curIndex).data('pic');
            var picArr = picUrl.split(',');
            if (picArr.length == 1 && picArr[0] == "") {
                $('#shoppingTrolley .pictureContainer .successAlert .innerArea .imgShow').append('<div class="text">无</div>');

            } else {

                if (picArr.length == 1) {
                    $('#shoppingTrolley .pictureContainer .successAlert ').css('height', '5.23rem');
                    $('#shoppingTrolley .pictureContainer .successAlert ').css('width', '5.23rem');
                    $('#shoppingTrolley .pictureContainer .successAlert .innerArea .imgShow').append('<img style="height:90%;width:85%;" src="' + picArr[0] + '">')
                } else {


                    if (picArr.length == 2) {
                        $('#shoppingTrolley .pictureContainer .successAlert ').css('height', '5.23rem');
                        $('#shoppingTrolley .pictureContainer .successAlert ').css('width', '8.466667rem');

                        for (var i = 0; i < picArr.length; i++) {
                            $('#shoppingTrolley .pictureContainer .successAlert .innerArea .imgShow').append('<img style="height:90%" src="' + picArr[i] + '">')
                        }
                    } else {
                        $('#shoppingTrolley .pictureContainer .successAlert ').css('height', '9.466667rem');
                        $('#shoppingTrolley .pictureContainer .successAlert ').css('width', '8.466667rem');
                        for (var i = 0; i < 4; i++) {
                            $('#shoppingTrolley .pictureContainer .successAlert .innerArea .imgShow').append('<img src="' + picArr[i] + '">')
                        }
                    }
                }
            }



        });

        $('#shoppingTrolley .pictureContainer .successAlert .innerArea .button').click(function() {
            $('#shoppingTrolley .pictureContainer').css('display', 'none');
        });

        //数量修改
        $('#shoppingTrolley .productsLists .product .frameRight .bottomArea .addBtnGroup ul li').click(function(event) {

            var e = event || window.event;
            if (e && e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
            var liIndex = $(this).index(),
                numArea = $(this).parent().find('li'),
                allProductTotal = $('#shoppingTrolley .productsLists .product'),
                curIndex = $(this).parents('.product').eq(0).index(),
                curPostId = allProductTotal.eq(curIndex).data('id'),
                minPriceValue=allProductTotal.eq(curIndex).data('minprice'),
                maxPriceValue=allProductTotal.eq(curIndex).data('maxprice'),

                checkBoxIsSeleted = $(this).parents('.product').eq(0).find('.leftArea button').val();

            var curAmount = parseInt(allProductTotal.eq(curIndex).find('input').val()) * parseInt(singlePriceArr[curIndex]),
                oldTotalPrice = parseInt($('#totalPrice').text());


            switch (liIndex) {
                case 0: //减一
                    var curNum = parseInt(numArea.eq(1).find('input').val()) - 1;

                    if (curNum == 1) {
                        $(this).addClass('grayBtn');
                        numArea.eq(1).find('input').val(1);
                        curNum == 1;
                        if (level == '游客' || level == '普通会员') {
                            if (isShowArrange) {
                                var minAllPrice = (parseInt(numArea.eq(1).find('input').val()) * minPriceValue).toFixed(2);
                                var maxAllPrice = (parseInt(numArea.eq(1).find('input').val()) * maxPriceValue).toFixed(2);
                                $(this).parents('.bottomArea').eq(0).find('span#univalent > b').text(minAllPrice + "-" + maxAllPrice);
                            } else {
                                $(this).parents('.bottomArea').eq(0).find('span#univalent > b').text('***');
                            }
                            $('#totalPrice').text('***');
                            // }else if (level == '普通会员') {
                            //     $(this).parents('.bottomArea').eq(0).find('span#univalent > b').text(singlePriceArr[curIndex].minPriceNum+'-'+singlePriceArr[curIndex].maxPriceNum);
                            //     console.log(curIndex);

                            //     $('#totalPrice').text('***');
                        } else {
                            $(this).parents('.bottomArea').eq(0).find('span#univalent > b').text(singlePriceArr[curIndex]);

                            if (checkBoxIsSeleted == "true") {
                                $('#totalPrice').text(oldTotalPrice - singlePriceArr[curIndex]);
                            }

                        }

                        var tradeData = { _id: curPostId, modifier: { num: 1 } };

                        Meteor.call('updateTrade', tradeData, function(err, result) {
                            console.log(err, result);
                        });
                        e.preventDefault();
                    } else if (curNum > 1) {
                        numArea.eq(0).removeClass('grayBtn');
                        numArea.eq(1).find('input').val(curNum);
                        if (level == '游客' || level == '普通会员') {
                            if (isShowArrange) {
                                var minAllPrice = (parseInt(numArea.eq(1).find('input').val()) * minPriceValue).toFixed(2);
                                var maxAllPrice = (parseInt(numArea.eq(1).find('input').val()) * maxPriceValue).toFixed(2);
                                $(this).parents('.bottomArea').eq(0).find('span#univalent > b').text(minAllPrice + "-" + maxAllPrice);
                            } else {
                                $(this).parents('.bottomArea').eq(0).find('span#univalent > b').text('***');
                            }
                            $('#totalPrice').text('***');
                           
                        } else {
                            $(this).parents('.bottomArea').eq(0).find('span#univalent > b').text(curAmount - singlePriceArr[curIndex]);
                            if (checkBoxIsSeleted == "true") {
                                $('#totalPrice').text(oldTotalPrice - singlePriceArr[curIndex]);
                            }
                        }

                        var tradeData = { _id: curPostId, modifier: { num: curNum } };

                        Meteor.call('updateTrade', tradeData, function(err, result) {
                            console.log(err, result);
                        });
                    }
                    break;
                case 1:
                    break;
                case 2:
                    var curNum = parseInt(numArea.eq(1).find('input').val()) + 1;
                    if (curNum > 1) {
                        numArea.eq(0).removeClass('grayBtn');
                        numArea.eq(1).find('input').val(curNum);
                        if (level == '游客' || level == '普通会员') {
                            if (isShowArrange) {
            
                                var minAllPrice = (parseInt(numArea.eq(1).find('input').val()) * minPriceValue).toFixed(2);
                                var maxAllPrice = (parseInt(numArea.eq(1).find('input').val()) * maxPriceValue).toFixed(2);
                                $(this).parents('.bottomArea').eq(0).find('span#univalent > b').text(minAllPrice + "-" + maxAllPrice);

                            } else {


                                $(this).parents('.bottomArea').eq(0).find('span#univalent > b').text('***');
                            }
                            $('#totalPrice').text('***');
                            // }else if (level == '普通会员') {
                            //     $(this).parents('.bottomArea').eq(0).find('span#univalent > b').text(singlePriceArr[curIndex].minPriceNum+'-'+singlePriceArr[curIndex].maxPriceNum);
                            //     console.log(curIndex);

                            //     $('#totalPrice').text('***');
                        } else {
                            $(this).parents('.bottomArea').eq(0).find('span#univalent > b').text(curAmount + singlePriceArr[curIndex]);
                            if (checkBoxIsSeleted == "true") {
                                $('#totalPrice').text(oldTotalPrice + singlePriceArr[curIndex]);
                            }

                        }

                        var tradeData = { _id: curPostId, modifier: { num: curNum } };
                        // console.log(curNum);
                        Meteor.call('updateTrade', tradeData, function(err, result) {
                            console.log(err, result);
                        });
                        e.preventDefault();

                    } else if (curNum == 1) {
                        $(this).addClass('grayBtn');
                        numArea.eq(1).find('input').val(1);
                        curNum == 1;
                        if (level == '游客' || level == '普通会员') {
                            if (isShowArrange) {
                                
                                var minAllPrice = (parseInt(numArea.eq(1).find('input').val()) * minPriceValue).toFixed(2);
                                var maxAllPrice = (parseInt(numArea.eq(1).find('input').val()) * maxPriceValue).toFixed(2);
                                $(this).parents('.bottomArea').eq(0).find('span#univalent > b').text(minAllPrice + "-" + maxAllPrice);
                            } else {

                                $(this).parents('.bottomArea').eq(0).find('span#univalent > b').text('***');
                            }
                            $('#totalPrice').text('***');

                            // }else if (level == '普通会员') {
                            //     $(this).parents('.bottomArea').eq(0).find('span#univalent > b').text((parseInt(singlePriceArr[curIndex].minPriceNum)*)+'-'+singlePriceArr[curIndex].maxPriceNum);
                            //     console.log(curIndex);

                            //     $('#totalPrice').text('***');
                        } else {
                            $(this).parents('.bottomArea').eq(0).find('span#univalent > b').text(singlePriceArr[curIndex]);
                            if (checkBoxIsSeleted == "true") {
                                $('#totalPrice').text(oldTotalPrice - singlePriceArr[curIndex]);
                            }
                        }
                    }
                    break;
            }
        });

        // 全选
        $('#selectAllBtn').click(function() {
            var flag = $('#selectAllBtn .cycleCheckBtn').val(), //全选
                selectNum = $('#shoppingTrolley .productsLists .selectAll .cycleCheckBtn').length,
                priceTotal = $('#shoppingTrolley .productsLists .product');

            if (flag === 'true') {
                $('#shoppingTrolley .selectAll .cycleCheckBtn').attr('value', 'false');
                $('#shoppingTrolley .selectAll .cycleCheckBtn').find('img').hide();

                if (level == '游客' || level == '普通会员') {
                    $('#selectProductNum').text(0);
                    $('#deleteProductNum').text(0);
                    $('#totalPrice').text('***');
                } else {
                    $('#selectProductNum').text(0);
                    $('#deleteProductNum').text(0);
                    $('#totalPrice').text(0);
                }

                flag = 'false';
            } else if (flag === 'false') {
                var productAmount = 0,
                    totalPrice = 0;

                $('#shoppingTrolley .selectAll .cycleCheckBtn').attr('value', 'true');
                $('#shoppingTrolley .selectAll .cycleCheckBtn').find('img').show();
                $('#selectProductNum').text(selectNum);
                $('#deleteProductNum').text(selectNum);

                if (level == '游客' || level == '普通会员') {
                     $('#totalPrice').text('***');
                    return;
                } else {
                    for (var i = 0; i < priceTotal.length; i++) {
                        productAmount = parseInt(priceTotal.eq(i).find('.numberBtn input').val()) * parseInt(singlePriceArr[i]);
                        // console.log(singlePriceArr[i]);
                        totalPrice = totalPrice + productAmount;
                    }
                    $('#totalPrice').text(totalPrice);
                }

                flag = 'true';
            }

        });

        //点击选中当前选项
        $('#shoppingTrolley .productsLists .cycleCheckBtn').click(function(event) {

            var e = event || window.event;
            if (e && e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
            var selectNum = $('#selectProductNum').text(),
                totalPrice = parseInt($('#totalPrice').text()),
                curIndex = $(this).parents('.product').eq(0).index(),
                allProductTotal = $('#shoppingTrolley .productsLists .product'),
                curSinglePrice = parseInt(allProductTotal.eq(curIndex).find('span.totalNum').text()) * parseInt(singlePriceArr[curIndex]);
            singlePrice = parseInt($(this).parents('.product').eq(0).find('span#univalent > b').text());
            // console.log(curIndex);
            if(Session.get('allProductArr')){
              var productArr = Session.get('allProductArr');
            }else{
                 var productArr = [];
            }
           
            var productIdItem = allProductTotal.eq(curIndex).data('id');



            if ($(this).val() === 'true') {

                $(this).find('img').hide();
                $(this).val(false);
                for (var i = 0; i < productArr.length; i++) {
                    if (productArr[i]._id == productIdItem) {
                        productArr.splice(i, 1);
                        Session.set('allProductArr', productArr);
                        break;
                    }
                }
                $('#selectAllBtn .cycleCheckBtn').attr('value', 'false');
                $('#selectAllBtn .cycleCheckBtn').find('img').hide();
                if (level == '游客' || level == '普通会员') {
                    $('#selectProductNum').text(selectNum - 1);
                    $('#deleteProductNum').text(selectNum - 1);
                    $('#totalPrice').text('***');
                } else {
                    $('#selectProductNum').text(selectNum - 1);
                    $('#deleteProductNum').text(selectNum - 1);
                    $('#totalPrice').text(totalPrice - singlePrice);
                }

            } else if ($(this).val() === 'false') {

                $(this).find('img').show();
                $(this).val(true);
                var allProduct = Session.get("allProduct");
                for (var i = 0; i < allProduct.length; i++) {
                    if (allProduct[i]._id == productIdItem) {
                        productArr.push(allProduct[i]);
                        Session.set('allProductArr', productArr);

                        break;
                    }
                }

                if (allProduct.length == productArr.length) {
                    $('#selectAllBtn .cycleCheckBtn').attr('value', 'true');
                    $('#selectAllBtn .cycleCheckBtn').find('img').show();
                }



                $('#selectProductNum').text(parseInt(selectNum) + 1);
                $('#deleteProductNum').text(parseInt(selectNum) + 1);
                if (level == '游客' || level == '普通会员') {
                    $('#totalPrice').text('***');
                } else {
                    $('#totalPrice').text(totalPrice + singlePrice);
                }
            }
        });

        //点击删除按钮删除选中的商品
        $('.deleteThisGoods').click(function(event) {

            var e = event || window.event;
            if (e && e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
            var curDiv = $(this),
                oldTotalPrice = $('#totalPrice').text(),
                totalNum = parseInt($('#selectProductNum').text()) - 1,
                curProductIndex = curDiv.parents('.product').index(),
                deleteDivPrice = $(this).parents('.product').eq(0).find('span#univalent > b').text();
                if(parseInt($('#selectProductNum').text())==0){
                    totalNum=0;
                }
                if(oldTotalPrice==0){
                 deleteDivPrice=0;   
                }
            $('#deleteAlert').show();
            $('#deleteAlert .alertOperationBtn button').click(function(e) {
                var buttonIndex = $(this).index();
                if (buttonIndex === 1) {
                    curDiv.closest('.product').remove();
                    var postId = curDiv.closest('.product').data('id'),
                        data = { _id: postId, modifier: { isRemoved: true } };
                    var productArr = [];

                    if(Session.get('allProductArr')){
                        productArr=Session.get('allProductArr');
                    }

                    for (var i = 0; i < productArr.length; i++) {
                        if (productArr[i]._id == postId) {
                            productArr.splice(i, 1);
                            Session.set('allProductArr', productArr);
                            break;
                        }
                    }

                    Meteor.call('updateTrade', data, function(err, result) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                    });

                    if (level == '游客' || level == '普通会员') {
                        $('#totalPrice').text('***');
                    } else {
                        singlePriceArr.splice(curProductIndex, 1);
                        $('#totalPrice').text(oldTotalPrice - deleteDivPrice);
                    }
                    $('#selectProductNum').text(totalNum);
                    $('#deleteProductNum').text(totalNum);

                    if (totalNum == 0) {
                        $('#totalPrice').text(0);
                        $("#shoppingTrolley .searchArea").css("display", 'block');
                    } else {
                        $("#shoppingTrolley .searchArea").css("display", 'none');
                    }
                    $('#deleteAlert').hide();
                } else {
                    $('#deleteAlert').hide();
                }
            });

        });
    });


    var createContractId;

    Meteor.call("createContractId", function(err, result) {
        if (!err) {
            createContractId = result;
        }

    });

    //结算
    $('#settleAccounts').click(function(e) {

        $('#settleAccounts').attr('disabled','true');

        var selectGoods = $('#shoppingTrolley .productsLists .product'),
            selectAndBuy = [],
            totalPrice = parseInt($('#selectProductNum').text()),
            allProduct = Session.get('allProduct'),
            data = {};

        Session.set('allProductArr', null);

        if (totalPrice === 0) {
            $('#settleAccounts').attr('disabled',false);
            Utility.alertMsg("请至少选择一件商品");
        } else {
            for (var i = 0; i < selectGoods.length; i++) {
                var obj = {};

                // console.log("购物车的数量");
                // console.log(selectGoods.eq(i).find('span.totalNum').text());

                //清空结算订单并且生成session
                if (selectGoods.eq(i).find('button').val() === 'true') {
                    // allProduct[i].num = selectGoods.eq(i).find('span.totalNum').text();
                    allProduct[i].num = selectGoods.eq(i).find('.numberBtn .totalNum').val();

                    selectAndBuy.push(allProduct[i]);

                    var tradeData = { _id: allProduct[i]._id, modifier: { num: allProduct[i].num, isRemoved: true } };

                    Meteor.call('updateTrade', tradeData, function(err, result) {
                        console.log(err, result);
                    });
                }
            }

            data = { product: selectAndBuy, totalPrice: totalPrice };
            Session.set('goodsList', data);
            // console.log(Session.get('goodsList'));

            var IdArr = [];
            var product = Session.get("goodsList").product;

            var totalPriceNumber = 0;
            _.each(product, function(element, index) {
                var productNumber = parseInt(element.num);
                IdArr.push(element._id);
                totalPriceNumber = totalPriceNumber + element.finalPrice * productNumber;
            });



            Session.set('contractId', createContractId);

            var contractData = {
                tradeIdArr: IdArr,
                userId: Meteor.userId(),
                contractNo: createContractId,
                total: totalPriceNumber,
                contractStatus: "编辑"
            }
            Meteor.call('insertContract', contractData, function(err, result) {

                if (err) {
                    console.log(err);
                    return;
                }

                $('#settleAccounts').attr('disabled',false);
                FlowRouter.go('/purchaseContract');
            });

        }
    });

    //删除点击
    $("#deleteBtn").click(function(e) {

        $("#deleteBtn").attr('disabled',true);

        var selectGoods = $('#shoppingTrolley .productsLists .product'),
            selectAndBuy = [],
            totalPrice = parseInt($('#deleteProductNum').text()),
            allProduct = Session.get('allProduct'),
            data = {};

        Session.set('allProductArr', null);

        if (totalPrice == 0) {
            $("#deleteBtn").attr('disabled',false);
            Utility.alertMsg("请至少选择一件商品");
        } else {
            $('#deleteAlert').show();
            $('#deleteAlert .alertOperationBtn button').click(function(e) {
                var buttonIndex = $(this).index();
                if (buttonIndex === 1) {
                    for (var i = 0; i < selectGoods.length; i++) {
                        var obj = {};

                        //清空结算订单并且生成session
                        if (selectGoods.eq(i).find('button').val() === 'true') {
                            allProduct[i].num = selectGoods.eq(i).find('span.totalNum').text();
                            selectAndBuy.push(allProduct[i]);

                            var tradeData = { _id: allProduct[i]._id, modifier: { num: allProduct[i].num, isRemoved: true } };

                            Meteor.call('updateTrade', tradeData, function(err, result) {
                                console.log(err, result);
                                if (err) {
                                    console.log(err);
                                    return;
                                }


                            });
                        }
                    }

                    Utility.alertMsg("删除成功");
                    Session.set("isShowAllSearchResult", true);
                    Session.set("isShowGoodsList", false);
                    $("#deleteBtn").attr('disabled',false);
                    setTimeout(function(){
                      FlowRouter.go('/searchResultPage');
                    },500)
                    
                } else {
                    $('#deleteAlert').hide();
                }

            });


        }
    })

    //查看商品点击
    $("#shoppingTrolley .searchArea .scanAllProduct button").click(function() {
        Session.set("isShowAllSearchResult", true);
        Session.set("isShowGoodsList", false);
        FlowRouter.go('/searchResultPage');
    })

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
                price = '' + min.toFixed(2) + '-' + max.toFixed(2);
            } else {
                price = '***';
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
