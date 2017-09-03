Template.home.onCreated(function() {
    var self = this;
});
Template.home.onRendered(function() {
    //判断弹出框是否显示
    Meteor.call('isShowAlert', function(err, result) {
        if (err) {
            console.log(err);
            return alert(err)
        }

        if (result) {

            $('.fullPopup').css("display", "block");
        } else {
            $('.fullPopup').hide();
        }
    })




    // 搜索框点击 跳转至 搜索页面

    $("#homeContainer .searchInputArea .innerInput input").focus(function() {
        Session.set("isShowGoodsList", false);
        FlowRouter.go('/searchPage');
    });

    //查找公告记录
    var data = { selector: { isRemoved: { $ne: true } }, options: { sort: { timestamp: -1 }, skip: 0, limit: 5, fields: { content: 0 } } };

    Meteor.call('getNotice', data, function(err, result) {
        if (err) {
            console.log(err);
            return ;
        }

        for (var i = 0; i < result.length; i++) {
            var date = new Date(result[i].timestamp);
            $("#homeContainer .noticeList").append('<div class="noticeItem" data-id="' + result[i]._id + '">  <p><span class="title">' + result[i].title + '</span><span class="date">' + (date.getMonth() + 1) + '月' + date.getDate() + '日</span><div class="clear"></div></p>');
        };


        //点击进入详情页
        $('#homeContainer .noticeList .noticeItem').click(function(e) {
            var noticeId = $(this).data('id');
            FlowRouter.go('/noticeDetails/' + noticeId);
        });
    })

    $('#homeContainer .homeNotice h1 span').click(function(e) {
        var noticeData = {};
        if ($(e.currentTarget).hasClass('showAll')) {
            $(e.currentTarget).removeClass('showAll');
            if($("#homeContainer .homeNotice h1 span").eq(0).hasClass('close')){
                $("#homeContainer .homeNotice h1 span").eq(0).removeClass('close');
                $("#homeContainer .homeNotice h1 span").eq(0).addClass('open');
            }
            noticeData = { selector: { isRemoved: { $ne: true } }, options: { sort: { timestamp: -1 }, fields: { content: 0 } } };
        } else {
            if($("#homeContainer .homeNotice h1 span").eq(0).hasClass('open')){
                $("#homeContainer .homeNotice h1 span").eq(0).removeClass('open');
                $("#homeContainer .homeNotice h1 span").eq(0).addClass('close');
            }
            $(e.currentTarget).addClass('showAll');
            noticeData = { selector: { isRemoved: { $ne: true } }, options: { sort: { timestamp: -1 }, limit: 5, fields: { content: 0 } } }
        }
        Meteor.call('getNotice', noticeData, function(err, result) {
            if (err) {
                console.log(err);
                return;
            }

            $("#homeContainer .noticeList").html('');
            for (var i = 0; i < result.length; i++) {
                var date = new Date(result[i].timestamp);
                $("#homeContainer .noticeList").append('<div class="noticeItem" data-id="' + result[i]._id + '">  <p><span class="title">' + result[i].title + '</span><span class="date">' + (date.getMonth() + 1) + '月' + date.getDate() + '日</span><div class="clear"></div></p>');
            };


            //点击进入详情页
            $('#homeContainer .noticeList .noticeItem').click(function(e) {
                var noticeId = $(this).data('id');
                FlowRouter.go('/noticeDetails/' + noticeId);
            });
        })
    });

    //查找品牌产品分类

    var productCategorySelector = {
        selector: {

            type: "产品",
            isRemoved: { $ne: true }
        },
        options: {
            sort: { timestamp: 1 },
            skip: 0,
            limit: 10
        }
    };

    Meteor.call('getProductCategories', productCategorySelector, function(err, result) {
        for (var i = 0; i < result.length; i++) {
            $('#homeContainer .productCategory .productItemLists').append('<div class="item"><button>' + result[i].name + '</button></div>');
        }

        $('#homeContainer .productCategory .productItemLists').append('<div class="clear"></div>');

        $("#homeContainer .productCategory .productItemLists .item button").off('click');

        $("#homeContainer .productCategory .productItemLists .item button").on("click", function() {
            var productCategoryName = $(this).text();
            Session.set("productCategoryName", productCategoryName);
            FlowRouter.go('/searchResultPage');
        });

        $("#homeContainer .brandCategory .productItemLists .item button").off('click');
        $("#homeContainer .brandCategory .productItemLists .item button").on('click', function() {
            var productBrandName = $(this).text();
            Session.set("productBrandName", productBrandName);
            FlowRouter.go('/searchResultPage');
        })
    });

    var productCategorySelector = {
        selector: {

            type: "品牌",
            isRemoved: { $ne: true }
        },
        options: {
            sort: { timestamp: 1 },
            skip: 0,
            limit: 10
        }
    };
    Meteor.call('getProductCategories', productCategorySelector, function(err, result) {
        for (var i = 0; i < result.length; i++) {
            $('#homeContainer .brandCategory .productItemLists').append('<div class="item"><button>' + result[i].name + '</button></div>');
        }

        $('#homeContainer .brandCategory .productItemLists').append('<div class="clear"></div>');

        $("#homeContainer .productCategory .productItemLists .item button").off('click');

        $("#homeContainer .productCategory .productItemLists .item button").on("click", function() {
            var productCategoryName = $(this).text();
            Session.set("productCategoryName", productCategoryName);
            FlowRouter.go('/searchResultPage');
        });
        $("#homeContainer .brandCategory .productItemLists .item button").off('click');
        $("#homeContainer .brandCategory .productItemLists .item button").on('click', function() {
            var productBrandName = $(this).text();
            Session.set("productBrandName", productBrandName);
            FlowRouter.go('/searchResultPage');
        })
    });


    //点击产品分类显示全部

    $("#homeContainer .productCategory h1 span").click(function(e) {
        var productCategorySelector = {};
        if ($(e.currentTarget).hasClass('showAll')) {
            $(e.currentTarget).removeClass('showAll');
            if($("#homeContainer .productCategory h1 span").eq(0).hasClass('close')){
                $("#homeContainer .productCategory h1 span").eq(0).removeClass('close');
                $("#homeContainer .productCategory h1 span").eq(0).addClass('open');
            }
            productCategorySelector = {
                selector: {
                    type: "产品",
                    isRemoved: { $ne: true }
                },
                options: {
                    sort: { timestamp: 1 }
                }
            };
        } else {

            $(e.currentTarget).addClass('showAll');
            if($("#homeContainer .productCategory h1 span").eq(0).hasClass('open')){
                $("#homeContainer .productCategory h1 span").eq(0).removeClass('open');
                $("#homeContainer .productCategory h1 span").eq(0).addClass('close');
            }
            productCategorySelector = {
                selector: {
                    type: "产品",
                    isRemoved: { $ne: true }
                },
                options: {
                    sort: { timestamp: 1 },
                    limit: 10
                }
            };
        }
        Meteor.call('getProductCategories', productCategorySelector, function(err, result) {
            $('#homeContainer .productCategory .productItemLists').html("");
            for (var i = 0; i < result.length; i++) {


                $('#homeContainer .productCategory .productItemLists').append('<div class="item"><button>' + result[i].name + '</button></div>');

            }

            $('#homeContainer .productCategory .productItemLists').append('<div class="clear"></div>');

            $("#homeContainer .productCategory .productItemLists .item button").off('click');

            $("#homeContainer .productCategory .productItemLists .item button").on("click", function() {
                var productCategoryName = $(this).text();
                Session.set("productCategoryName", productCategoryName);
                FlowRouter.go('/searchResultPage');
            });

            $("#homeContainer .brandCategory .productItemLists .item button").off('click');
            $("#homeContainer .brandCategory .productItemLists .item button").on('click', function() {
                var productBrandName = $(this).text();
                Session.set("productBrandName", productBrandName);
                FlowRouter.go('/searchResultPage');
            })
        });


    })

    //点击品牌分类显示全部
    $("#homeContainer .brandCategory h1 span").click(function(e) {
        var productCategorySelector = {};
        if ($(e.currentTarget).hasClass('showAll')) {
            $(e.currentTarget).removeClass('showAll');
            if($("#homeContainer .brandCategory h1 span").eq(0).hasClass('close')){
                $("#homeContainer .brandCategory h1 span").eq(0).removeClass('close');
                $("#homeContainer .brandCategory h1 span").eq(0).addClass('open');
            }
            productCategorySelector = {
                selector: {
                    type: "品牌",
                    isRemoved: { $ne: true }
                },
                options: {
                    sort: { timestamp: 1 }
                }
            };
        } else {

            $(e.currentTarget).addClass('showAll');
            if($("#homeContainer .brandCategory h1 span").eq(0).hasClass('open')){
                $("#homeContainer .brandCategory h1 span").eq(0).removeClass('open');
                $("#homeContainer .brandCategory h1 span").eq(0).addClass('close');
            }
            productCategorySelector = {
                selector: {
                    type: "品牌",
                    isRemoved: { $ne: true }
                },
                options: {
                    sort: { timestamp: 1 },
                    limit: 10
                }
            };
        }
        Meteor.call('getProductCategories', productCategorySelector, function(err, result) {
            $('#homeContainer .brandCategory .productItemLists').html("");
            for (var i = 0; i < result.length; i++) {


                $('#homeContainer .brandCategory .productItemLists').append('<div class="item"><button>' + result[i].name + '</button></div>');

            }

            $('#homeContainer .brandCategory .productItemLists').append('<div class="clear"></div>');

            $("#homeContainer .productCategory .productItemLists .item button").off('click');

            $("#homeContainer .productCategory .productItemLists .item button").on("click", function() {
                var productCategoryName = $(this).text();
                Session.set("productCategoryName", productCategoryName);
                FlowRouter.go('/searchResultPage');
            });

            $("#homeContainer .brandCategory .productItemLists .item button").off('click');
            $("#homeContainer .brandCategory .productItemLists .item button").on('click', function() {
                var productBrandName = $(this).text();
                Session.set("productBrandName", productBrandName);
                FlowRouter.go('/searchResultPage');
            })
        });
    })


    /* 点击稍后按钮关闭弹出框*/
    $('#homeContainer .fullPopup .popup .popupBtn .laterBtn').click(function() {
        $('.fullPopup').hide();


    });

    /* 点击前往更新按钮 跳转至我的上传页面*/

    $('#homeContainer .fullPopup .popup .popupBtn .updateBtn').click(function() {
        FlowRouter.go('/myUploading');

    });
    /*点击全部商品按钮  跳转至 搜索页面 */
    $('#homeContainer .gotoSearchResult').click(function() {
        Session.set("isShowAllSearchResult", true);
        Session.set("isShowGoodsList", false);
        FlowRouter.go('/searchResultPage');
    });


    //判断合同提示框是否显示

    var userId = Meteor.userId();
    var contarctSelectorData = {
        selector: {
            userId: userId,
            contractStatus: { $in: ["已同意", "不同意"] },
            isTip: true,
            isRemoved: { $ne: true }
        },
        options: { sort: { timestamp: -1 } }
    };
    Meteor.call("getMyContractIsTipData", contarctSelectorData, function(err, result) {

        if (err) {
            console.log(err);
            return;
        }
        if (result == "" || result == null) {

        } else {
            Session.set("contractIsTipData", result);
            var agreeContractNoStr = "",
                noAgreeContractNoStr = "";
            for (var i = 0; i < result.length - 1; i++) {
                if (result[i].contractStatus == "已同意") {
                    agreeContractNoStr = agreeContractNoStr + result[i].contractNo + ",";
                } else {
                    noAgreeContractNoStr = noAgreeContractNoStr + result[i].contractNo + ",";
                }
            }
            if (result[result.length - 1].contractStatus == "已同意") {
                agreeContractNoStr = agreeContractNoStr + result[result.length - 1].contractNo;
            } else {
                noAgreeContractNoStr = noAgreeContractNoStr + result[result.length - 1].contractNo;
            }

            if (noAgreeContractNoStr.length == 0) {
                $("#contractIsTipText").text("您的合同:" + agreeContractNoStr + "已通过审核，请尽快付款");
            } else {
                if (agreeContractNoStr.length == 0) {
                    $("#contractIsTipText").text("您的合同:" + noAgreeContractNoStr + "未通过审核");
                } else {
                    $("#contractIsTipText").text("您的合同:" + agreeContractNoStr + "已通过审核，请尽快付款 !" + "您的合同:" + noAgreeContractNoStr + "未通过审核");
                }
            }

            $("#homeContainer .contractTipContainer").css("display", "block");

        }

    })


    //合同提示框取消按钮
    $("#cancleContrctTip").click(function() {
        $("#homeContainer .contractTipContainer").css("display", "none");
        var contractData = Session.get("contractIsTipData");
        if (contractData) {

            for (var i = 0; i < contractData.length; i++) {
                var contractSelectorData = {
                    selector: { contractNo: contractData[i].contractNo },
                    modifier: {
                        isTip: false
                    }
                };
                Meteor.call('updateContract', contractSelectorData, function(err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                });
            }

        }
    })

    //合同提示框确定按钮
    $("#saveContractTip").click(function() {
        var contractData = Session.get("contractIsTipData");
        $("#homeContainer .contractTipContainer").css("display", "none");
        if (contractData) {

            for (var i = 0; i < contractData.length; i++) {
                var contractSelectorData = {
                    selector: { contractNo: contractData[i].contractNo },
                    modifier: {
                        isTip: false
                    }
                };
                Meteor.call('updateContract', contractSelectorData, function(err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                });
            }

        }
    })




});

Template.home.events({
    'change input': function(e) {
        Utility.uploadFile(e.currentTarget.files[0], function(url) {
            // console.log(url);
        });
    }
});
