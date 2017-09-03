/**
 * 首页--搜索查看全部商品板块逻辑以及动画
 *
 * @author  Vivian Yang
 * @review
 */

Template.searchPage.onRendered(function() {


    $(".searchAndResultPage .searchInputArea .searchInputBtnArea .innerInput input").focus();

    //点击查看全部产品
    $('#searchPageContainer .searchArea .scanAllProduct button').click(function() {
        Session.set("isShowAllSearchResult", true);
        Session.set("isShowGoodsList", false);
        // Session.set("homeSearchRankSpecification", null);
        FlowRouter.go('/searchResultPage');
    });

    //设置顾客信息
    var UserData = UserInfo.findOne();
    if (UserData) {
        level = UserData.level;
        Session.set("searchPageUser", UserData);
        Session.set("searchUserLevel", UserData.level);
        Session.set('showArrange', UserData.showArrange);
    } else {
        level = '游客';
        Session.set("searchPageUser", null);
        Session.set("searchUserLevel", level);
        Session.set('showArrange', false);
    }

    //返回按钮
    $('.searchAndResultPage .searchInputArea .backBtn').click(function() {
        Session.set("isShowGoodsList", false);
        FlowRouter.go('/');
    });



    //确定按钮
    $('.searchAndResultPage .searchInputArea .ensure').click(function() {

        Session.set("isShowGoodsList", false);

        var keywords = $('#keywords').val();
        if (keywords == "") {
            Session.set("isShowAllSearchResult", true)
        } else {
            Session.set('searchKey', keywords);
        }
        FlowRouter.go('/searchResultPage');

    });

    //输入搜索条件
    $('#searchPageBtn').click(function() {
        Session.set("isShowGoodsList", false);
        var keywords = $('#keywords').val();
        Session.set('searchKey', keywords);

        FlowRouter.go('/searchResultPage');
    });

    //输入搜索条件模糊查询数据
    $('#keywords').keyup(function() {
        var searchKey = $('#keywords').val(),
            userId = Meteor.userId(),
            user = { selector: { userId: userId }, options: {} },
            data = {};
        $('#resultArea').show();
        // if (searchKey.length > 1) {
        //     $('#resultArea').show();
        // }

        var selectData = searchCondition();

        Meteor.call('getProductListsByKeywords', selectData, function(err, result) {
            // console.log(result);
            $('#resultArea').html('');
            if (result == '') {
                $('#resultArea').append('<div class="result"><p></p></div>');
            } else {

                for (var i = 0; i < result.length; i++) {
                    $('#resultArea').append('<div class="result" data-spec="' + result[i].specification + '" data-name="' + result[i]._id + '" data-searchtime="' + result[i].searchTimes + '"><p>' + result[i].specification + '</p></div>');

                }
                //点击进入详情页
                $('#resultArea .result').off('click');
                $('#resultArea .result').on('click',function(e) {

                    Session.set("isShowGoodsList", false);

                    var specification = $(this).data('spec').toString();
                    Session.set("homeSearchRankSpecification", specification);
                    FlowRouter.go('/searchResultPage');
                });

            }
        });

    });


});

function searchCondition() {
    var inputSearchKey = $('#keywords').val();
    var searchKey = changeChar(inputSearchKey);
    var userData = Session.get("searchPageUser");
    var data;
    if (userData) {

        if (userData.identifyStatus == "未认证" || userData.identifyStatus == "待认证") {
            data = {
                selector: {
                    checkStatus: '审核通过',
                    isRemoved: { $ne: true },
                    storeType: { $in: ["原装正品", "迅创为仓库"] },
                    $or: [{ productName: { $regex: searchKey } },
                        { replaceName: { $regex: searchKey } },
                        { productCateory: { $regex: searchKey } },
                        { replaceNumber: { $regex: searchKey } },
                        { brand: { $regex: searchKey } },
                        { specification: { $regex: searchKey } }
                    ]
                },
                options: {
                    sort: { saleAmount: -1 }
                }
            }; //模糊查询输入的关键字

        } else {

            if (userData.vipTimestamp) {

                if (userData.level == "普通会员") {

                    for (var i = 0; i < userData.features.length; i++) {
                        if (userData.features[i] == "OEM" || userData.features[i] == "商务") {
                            data = {
                                selector: {
                                    checkStatus: '审核通过',
                                    isRemoved: { $ne: true },
                                    storeType: { $in: ["原装正品", "迅创为仓库"] },
                                    // $or: [
                                    //     { userId: Meteor.userId() },
                                    //     { storeType: { $in: ["原装正品", "迅创为仓库"] } }
                                    // ],
                                    $or: [
                                        { productName: { $regex: searchKey } },
                                        { replaceName: { $regex: searchKey } },
                                        { productCateory: { $regex: searchKey } },
                                        { replaceNumber: { $regex: searchKey } },
                                        { brand: { $regex: searchKey } },
                                        { specification: { $regex: searchKey } }
                                    ]
                                },
                                options: {
                                    sort: { saleAmount: -1 }
                                }
                            }; //模糊查询输入的关键字
                        }

                        if (userData.features[i] == "技术" || userData.features[i] == "项目") {
                            data = {
                                selector: {
                                    checkStatus: '审核通过',
                                    isRemoved: { $ne: true },
                                    storeType: { $in: ["原装正品", "原装开包", "迅创为仓库"] },
                                    // $or: [
                                    //     { userId: Meteor.userId() },
                                    //     { storeType: { $in: ["原装正品", "原装开包", "迅创为仓库"] } }
                                    // ],
                                    $or: [{ productName: { $regex: searchKey } },
                                        { replaceName: { $regex: searchKey } },
                                        { productCateory: { $regex: searchKey } },
                                        { replaceNumber: { $regex: searchKey } },
                                        { brand: { $regex: searchKey } },
                                        { specification: { $regex: searchKey } }
                                    ]
                                },
                                options: {
                                    sort: { saleAmount: -1 }
                                }
                            }; //模糊查询输入的关键字
                        }


                        if (userData.features[i] == "维修" || userData.features[i] == "其他") {
                            data = {
                                selector: {
                                    checkStatus: '审核通过',
                                    isRemoved: { $ne: true },
                                    storeType: { $in: ["原装正品", "原装开包", "待定", "迅创为仓库"] },
                                    // $or: [
                                    //     { userId: Meteor.userId() },
                                    //     { storeType: { $in: ["原装正品", "原装开包", "待定", "迅创为仓库"] } }
                                    // ],
                                    $or: [{ productName: { $regex: searchKey } },
                                        { replaceName: { $regex: searchKey } },
                                        { productCateory: { $regex: searchKey } },
                                        { replaceNumber: { $regex: searchKey } },
                                        { brand: { $regex: searchKey } },
                                        { specification: { $regex: searchKey } }
                                    ]
                                },
                                options: {
                                    sort: { saleAmount: -1 }
                                }
                            }; //模糊查询输入的关键字
                        }
                    }

                }

                if (userData.level == "vip会员") {
                    for (var i = 0; i < userData.features.length; i++) {
                        if (userData.features[i] == "OEM" || userData.features[i] == "商务") {
                            data = {
                                selector: {
                                    checkStatus: '审核通过',
                                    isRemoved: { $ne: true },
                                    storeType: { $in: ["原装正品", "其他", "迅创为仓库"] },
                                    // $or: [
                                    //     { userId: Meteor.userId() },
                                    //     { storeType: { $in: ["原装正品", "其他", "迅创为仓库"] } }
                                    // ],
                                    $or: [{ productName: { $regex: searchKey } },
                                        { replaceName: { $regex: searchKey } },
                                        { productCateory: { $regex: searchKey } },
                                        { replaceNumber: { $regex: searchKey } },
                                        { brand: { $regex: searchKey } },
                                        { specification: { $regex: searchKey } }
                                    ]
                                },
                                options: {
                                    sort: { saleAmount: -1 }
                                }
                            }; //模糊查询输入的关键字
                        }

                        if (userData.features[i] == "技术" || userData.features[i] == "项目") {
                            data = {
                                selector: {
                                    checkStatus: '审核通过',
                                    isRemoved: { $ne: true },
                                    storeType: { $in: ["原装正品", "原装开包", "其他", "迅创为仓库"] },
                                    // $or: [
                                    //     { userId: Meteor.userId() },
                                    //     { storeType: { $in: ["原装正品", "原装开包", "其他", "迅创为仓库"] } }
                                    // ],
                                    $or: [{ productName: { $regex: searchKey } },
                                        { replaceName: { $regex: searchKey } },
                                        { productCateory: { $regex: searchKey } },
                                        { replaceNumber: { $regex: searchKey } },
                                        { brand: { $regex: searchKey } },
                                        { specification: { $regex: searchKey } }
                                    ]
                                },
                                options: {
                                    sort: { saleAmount: -1 }
                                }
                            }; //模糊查询输入的关键字
                        }


                        if (userData.features[i] == "维修" || userData.features[i] == "其他") {
                            data = {
                                selector: {
                                    checkStatus: '审核通过',
                                    isRemoved: { $ne: true },
                                    storeType: { $in: ["原装正品", "原装开包", "待定", "其他", "迅创为仓库"] },
                                    // $or: [
                                    //     { userId: Meteor.userId() },
                                    //     { storeType: { $in: ["原装正品", "原装开包", "待定", "其他", "迅创为仓库"] } }
                                    // ],
                                    $or: [{ productName: { $regex: searchKey } },
                                        { replaceName: { $regex: searchKey } },
                                        { productCateory: { $regex: searchKey } },
                                        { replaceNumber: { $regex: searchKey } },
                                        { brand: { $regex: searchKey } },
                                        { specification: { $regex: searchKey } }
                                    ]
                                },
                                options: {
                                    sort: { saleAmount: -1 }
                                }
                            }; //模糊查询输入的关键字
                        }
                    }

                }
                if (userData.level == "超级会员") {
                    for (var i = 0; i < userData.features.length; i++) {
                        if (userData.features[i] == "OEM" || userData.features[i] == "商务") {
                            data = {
                                selector: {
                                    checkStatus: '审核通过',
                                    isRemoved: { $ne: true },
                                    storeType: { $in: ["原装正品", "其他", "特定产品", "迅创为仓库"] },
                                    // $or: [
                                    //     { userId: Meteor.userId() },
                                    //     { storeType: { $in: ["原装正品", "其他", "特定产品", "迅创为仓库"] } }
                                    // ],
                                    $or: [{ productName: { $regex: searchKey } },
                                        { replaceName: { $regex: searchKey } },
                                        { productCateory: { $regex: searchKey } },
                                        { replaceNumber: { $regex: searchKey } },
                                        { brand: { $regex: searchKey } },
                                        { specification: { $regex: searchKey } }
                                    ]
                                },
                                options: {
                                    sort: { saleAmount: -1 }
                                }
                            }; //模糊查询输入的关键字
                        }

                        if (userData.features[i] == "技术" || userData.features[i] == "项目") {

                            data = {
                                selector: {
                                    checkStatus: '审核通过',
                                    isRemoved: { $ne: true },
                                    storeType: { $in: ["原装正品", "原装开包", "其他", "特定产品", "迅创为仓库"] },
                                    // $or: [
                                    //     { userId: Meteor.userId() },
                                    //     { storeType: { $in: ["原装正品", "原装开包", "其他", "特定产品", "迅创为仓库"] } }
                                    // ],
                                    $or: [

                                        { productName: { $regex: searchKey } },
                                        { replaceName: { $regex: searchKey } },
                                        { productCateory: { $regex: searchKey } },
                                        { replaceNumber: { $regex: searchKey } },
                                        { brand: { $regex: searchKey } },
                                        { specification: { $regex: searchKey } }
                                    ]
                                },
                                options: {
                                    sort: { saleAmount: -1 }
                                }
                            }; //模糊查询输入的关键字
                        }


                        if (userData.features[i] == "维修" || userData.features[i] == "其他") {

                            data = {
                                selector: {
                                    checkStatus: '审核通过',
                                    isRemoved: { $ne: true },
                                    storeType: { $in: ["原装正品", "原装开包", "待定", "其他", "特定产品", "迅创为仓库"] },
                                    // $or: [
                                    //     { userId: Meteor.userId() },
                                    //     { storeType: { $in: ["原装正品", "原装开包", "待定", "其他", "特定产品", "迅创为仓库"] } }
                                    // ],
                                    $or: [{ productName: { $regex: searchKey } },
                                        { replaceName: { $regex: searchKey } },
                                        { productCateory: { $regex: searchKey } },
                                        { replaceNumber: { $regex: searchKey } },
                                        { brand: { $regex: searchKey } },
                                        { specification: { $regex: searchKey } }
                                    ]
                                },
                                options: {
                                    sort: { saleAmount: -1 }
                                }
                            }; //模糊查询输入的关键字
                        }
                    }

                }

            } else {

                data = {
                    selector: {
                        checkStatus: '审核通过',
                        isRemoved: { $ne: true },
                        storeType: { $in: ["原装正品", "迅创为仓库"] },
                        $or: [{ productName: { $regex: searchKey } },
                            { replaceName: { $regex: searchKey } },
                            { productCateory: { $regex: searchKey } },
                            { replaceNumber: { $regex: searchKey } },
                            { brand: { $regex: searchKey } },
                            { specification: { $regex: searchKey } }
                        ]
                    },
                    options: {
                        sort: { saleAmount: -1 }
                    }
                }; //模糊查询输入的关键字
            }


        }
    } else {
        data = {
            selector: {
                checkStatus: '审核通过',
                isRemoved: { $ne: true },
                storeType: { $in: ["原装正品", "迅创为仓库"] },
                $or: [{ productName: { $regex: searchKey } },
                    { replaceName: { $regex: searchKey } },
                    { productCateory: { $regex: searchKey } },
                    { replaceNumber: { $regex: searchKey } },
                    { brand: { $regex: searchKey } },
                    { specification: { $regex: searchKey } }
                ]
            },
            options: {
                sort: { saleAmount: -1 }
            }
        }; //模糊查询输入的关键字

    }
    var level = Session.get("searchUserLevel");
    var isShowArrange = Session.get('showArrange');
    var searchData = {
        level:level,
        isShowArrange:isShowArrange,
        selector: data.selector,
        options: {
            sort: { timestamp: -1 },
            skip: 0,
            limit: 8
        }
    }
    return searchData;
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
