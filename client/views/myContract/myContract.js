//日期格式化
Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};
Template.myContract.onRendered(function() {

    //查找我的合同记录
    var userId = Meteor.userId();
    var data = { selector: { userId: userId, isRemoved: { $ne: true } }, options: { sort: { timestamp: -1 }, skip: 0, limit: 6 } };
    var totalPrice = 0;
    $("#contractTotalPrice").text(totalPrice);
    $("#contractDeleteProductNum").text(totalPrice);

    Meteor.call('getMyContract', data, function(err, result) {
        if (err) {
            console.log(err);
            return err;
        }
        $(".contractList .contractContainer .myContractList").html(" ");
        Session.set("contractResult", result);
        for (var i = 0; i < result.length; i++) {

            var date = new Date(result[i].timestamp);
            var dateFormat = date.format("yyyy-MM-dd");
            if (!result[i].express) {
                result[i].express = "无";
            }
            $(".contractList .contractContainer .myContractList").append('<div class="myCheck" data-id="' + result[i].contractId + '">' + '<div class="productInfo"> <div class="frameLeft"><div class="selectAll"><button class="cycleCheckBtn centerDiv" value="true"><img src="/select.png" alt="选择图标"></button></div></div>' + '<div class="frameRight"><div class="firstLine"><span class="model">' + result[i].productName + '</span>' + '<div class="unitPrice">￥<span class="price">' + result[i].price + '</span></div><div class="clear"></div></div>' + '<div class="secondLine"><span class="specification">规格型号：' + result[i].specification + '</span><span class="firm">发起时间：' + dateFormat + '</span></div>' + '<div class="thirdLine"> <div class="thirdLeft"><span class="format">合同编号：' + result[i].contractId + '</span><span class="express">物流信息：' + result[i].express + '</span></div><div class="ifThrough">' + result[i].contractStatus + '</div></div><div class="clear"></div></div></div></div>');
            // $(".contractList").append('<div class="myCheck" data-id="' + result[i].contractId + '">' + '<div class="productInfo"> <div class="frameLeft"><div class="selectAll"><button class="cycleCheckBtn centerDiv" value="true"><img src="/select.png" alt="选择图标"></button></div></div>' + '<div class="frameRight"><div class="firstLine"><span class="model">' + result[i].productName + '</span>' + '<div class="unitPrice">￥<span class="price">' + result[i].price + '</span>&nbsp;<span class="quantity">x' + result[i].number + '</span></div><div class="clear"></div></div>' + '<div class="secondLine"><span class="specification">规格型号：' + result[i].specification + '</span><span class="firm">发起时间：' + dateFormat + '</span></div>' + '<div class="thirdLine"> <div class="thirdLeft"><span class="format">合同编号：' + result[i].contractId + '</span><span class="express">物流信息：' + result[i].express + '</span></div><div class="ifThrough">' + result[i].contractStatus + '</div></div><div class="clear"></div></div></div></div>');
        }

        //点击每一项进入合同详情页
        $(".contractList .myCheck").off('click');
        $(".contractList .myCheck").on("click", function() {
            var contractNo = $(this).data('id');
            Session.set('contractId', contractNo);
            FlowRouter.go('/purchaseContract');

        });


        //点击每一列的复选框
        $(".contractList .myCheck .productInfo .frameLeft .selectAll .cycleCheckBtn").off("click");
        $(".contractList .myCheck .productInfo .frameLeft .selectAll .cycleCheckBtn").on('click', function(event) {
            var e = event || window.event;
            if (e && e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
            if ($(this).val() == "true") {
                totalPrice = totalPrice + 1;
                $(this).val(false);
                $(this).children('img').css("visibility", "visible");
                $("#contractTotalPrice").text(totalPrice);
                $("#contractDeleteProductNum").text(totalPrice);
                if (totalPrice == result.length) {
                    $('#contractSelectAllBtn .cycleCheckBtn').children('img').css("visibility", "visible");
                    $('#contractSelectAllBtn .cycleCheckBtn').val(false);
                }

            } else {
                $(this).val(true);
                totalPrice = totalPrice - 1;
                $(this).children('img').css("visibility", "hidden");
                $("#contractTotalPrice").text(totalPrice);
                $("#contractDeleteProductNum").text(totalPrice);
                $('#contractSelectAllBtn .cycleCheckBtn').children('img').css("visibility", "hidden");
                $('#contractSelectAllBtn .cycleCheckBtn').val(true);
            }

        });

    });

    //点击全选按钮
    $("#contractSelectAllBtn").click(function() {
        var flag = $('#contractSelectAllBtn .cycleCheckBtn').val(); //全选
        var result = $(".contractList .myCheck");

        if (flag == "true") {
            $(".contractList .myCheck .productInfo .frameLeft .selectAll .cycleCheckBtn").children('img').css("visibility", "visible");
            $('#contractSelectAllBtn .cycleCheckBtn').children('img').css("visibility", "visible");
            $('#contractSelectAllBtn .cycleCheckBtn').val(false);
            $(".contractList .myCheck .productInfo .frameLeft .selectAll .cycleCheckBtn").val(false);
            totalPrice = result.length;
            $("#contractTotalPrice").text(totalPrice);
            $("#contractDeleteProductNum").text(totalPrice);
        } else {
            $(".contractList .myCheck .productInfo .frameLeft .selectAll .cycleCheckBtn").children('img').css("visibility", "hidden");
            $('#contractSelectAllBtn .cycleCheckBtn').children('img').css("visibility", "hidden");
            $('#contractSelectAllBtn .cycleCheckBtn').val(true);
            $(".contractList .myCheck .productInfo .frameLeft .selectAll .cycleCheckBtn").val(true);
            totalPrice = 0;
            $("#contractTotalPrice").text(totalPrice);
            $("#contractDeleteProductNum").text(totalPrice);
        }
    });

    //点击删除按钮
    $("#contractDeleteBtn").click(function() {

        var totalPrice = parseInt($('#contractDeleteProductNum').text());
        if (totalPrice == 0) {
             Utility.alertMsg("请至少选择一项合同");
        } else {

            $(".myContractContainer").css("display", "block");
        }

    })

    // 点击弹出框取消按钮
    $("#cancleContractDelete").click(function() {
        $(".myContractContainer").css("display", "none");
    });

    //点击确定按钮
    $("#ensureContractDelete").click(function() {

        $(".myContractContainer").css("display", "none");

        var contractListObj = $(".contractList .myCheck");

        for (var i = 0; i < contractListObj.length; i++) {
            if (contractListObj.eq(i).find('button').val() == "false") {

                var contractNo = contractListObj.eq(i).data('id');
                var contractData = {
                    selector: { contractNo: contractNo },
                    modifier: {
                        isRemoved: true
                    }
                };
                Meteor.call('updateContract', contractData, function(err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }


                });
                contractListObj.eq(i).remove();

            }
        }
        totalPrice=0;
        $('#contractSelectAllBtn .cycleCheckBtn').children('img').css("visibility", "hidden");
        $("#contractTotalPrice").text(0);
        $("#contractDeleteProductNum").text(0);

    })


    //我的合同滚动到底部执行的事件
    var limitCount = 0;
    $('.contractContainer').scroll(function() {
        if ($('.myContractList').height() - ($('.contractContainer').outerHeight() + $('.contractContainer')[0].scrollTop) < 0) {
            limitCount = limitCount + 6;
            var data = { selector: { userId: userId, isRemoved: { $ne: true } }, options: { sort: { timestamp: -1 }, skip: limitCount, limit: limitCount + 6 } };
            if(userId){

                Meteor.call('getMyContract', data, function(err, result) {
                if (err) {
                    console.log(err);
                    return err;
                }

                if (result != "") {
                    var contractDataBefor = Session.get("contractResult");
                    var contractData = contractDataBefor.concat(result);
                    Session.set("contractResult", contractData);

                    for (var i = 0; i < result.length; i++) {
                        var date = new Date(result[i].timestamp);
                        var dateFormat = date.format("yyyy-MM-dd");
                        if (!result[i].express) {
                            result[i].express = "无";
                        }
                        $(".contractList .contractContainer .myContractList").append('<div class="myCheck" data-id="' + result[i].contractId + '">' + '<div class="productInfo"> <div class="frameLeft">' + '<div class="selectAll"><button class="cycleCheckBtn centerDiv" value="true"><img src="/select.png" alt="选择图标"></button></div></div>' + '<div class="frameRight"><div class="firstLine"><span class="model">' + result[i].productName + '</span>' + '<div class="unitPrice">￥<span class="price">' + result[i].price + '</span></div><div class="clear"></div></div>' + '<div class="secondLine"><span class="specification">规格型号：' + result[i].specification + '</span><span class="firm">发起时间：' + dateFormat + '</span></div>' + '<div class="thirdLine"> <div class="thirdLeft"><span class="format">合同编号：' + result[i].contractId + '</span><span class="express">物流信息：' + result[i].express + '</span></div><div class="ifThrough">' + result[i].contractStatus + '</div></div><div class="clear"></div></div></div></div>');
                    }
                }


                //点击每一项进入合同详情页
                $(".contractList .myCheck").off('click');
                $(".contractList .myCheck").on("click", function() {
                    var contractNo = $(this).data('id');
                    Session.set('contractId', contractNo);
                    FlowRouter.go('/purchaseContract');

                });


                //点击每一列的复选框
                $(".contractList .myCheck .productInfo .frameLeft .selectAll .cycleCheckBtn").off("click");
                $(".contractList .myCheck .productInfo .frameLeft .selectAll .cycleCheckBtn").on('click', function(event) {
                 
                    var e = event || window.event;
                    if (e && e.stopPropagation) {
                        e.stopPropagation();
                    } else {
                        e.cancelBubble = true;
                    }
                    if ($(this).val() == "true") {
                        totalPrice = totalPrice + 1;
                        $(this).val(false);
                        $(this).children('img').css("visibility", "visible");
                        $("#contractTotalPrice").text(totalPrice);
                        $("#contractDeleteProductNum").text(totalPrice);
                        if (totalPrice == result.length) {
                            $('#contractSelectAllBtn .cycleCheckBtn').children('img').css("visibility", "visible");
                            $('#contractSelectAllBtn .cycleCheckBtn').val(false);
                        }

                    } else {
                        $(this).val(true);
                        totalPrice = totalPrice - 1;
                        $(this).children('img').css("visibility", "hidden");
                        $("#contractTotalPrice").text(totalPrice);
                        $("#contractDeleteProductNum").text(totalPrice);
                        $('#contractSelectAllBtn .cycleCheckBtn').children('img').css("visibility", "hidden");
                        $('#contractSelectAllBtn .cycleCheckBtn').val(true);
                    }

                });

            });

            }
            

        }
    });

    //返回按钮点击跳转到个人信息页面
    $('.contractList .withdraw').click(function() {
        FlowRouter.go('/personalPage');
    });



});
