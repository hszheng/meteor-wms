/**
 * 搜索板块逻辑以及动画
 *
 * @author  Vivian Yang
 * @review
 */

Template.searchResultPage.onCreated(function() {
    var self = this;
    var selector = { type: '电话', isRemoved: { $ne: true } };
    var options = {};
    self.subscribe('setting', selector, options);



});
Template.searchResultPage.onRendered(function() {
    var userId = Meteor.userId(),
        user = { selector: { userId: userId }, options: {} },
        categoriesData = { selector: { type: { $in: ['产品', '品牌'] }, isRemoved: { $ne: true } }, options: { sort: { timestamp: -1 } } },
        data = {},
        goodsArea = $('#searchResultPage .goodsLists'),
        flag = false,
        priceFlag = true,
        level = '';
    var UserData = UserInfo.findOne();
    if (UserData) {
        level = UserData.level;
        Session.set("searchResultUserLevel", UserData.level);
        Session.set('showArrange', UserData.showArrange);
    } else {
        level = '游客';
        Session.set("searchResultUserLevel", "游客");
        Session.set('showArrange', false);
    }


    //搜索框失去焦点事件
    $("#searchKeyWords").blur(function(event) {
        setTimeout(function() {
            $('#searchResultArea').hide();
        }, 200);

    });


    //如果从详情页返回
    if (Session.get("isShowGoodsList")) {
        var result = Session.get("nowData");
        showSearchData(result);
    };

    //如果从首页产品、品牌点进去  显示筛选结果
    if (Session.get("productCategoryName")) {

        var data = searchCondition();

        var searchSelectorData = {
            level: data.level,
            isShowArrange: data.isShowArrange,
            selector: {
                checkStatus: '审核通过',
                isRemoved: { $ne: true },
                productCateory: Session.get("productCategoryName"),
                storeType: data.selector.storeType

            },
            options: {
                sort: { timestamp: -1 },
                skip: 0,
                limit: 10
            }
        };

        Session.set("searchDataSelector", searchSelectorData);
        Meteor.call('getProduct', searchSelectorData, function(err, resultData) {
            $('#searchResultPage .searchArea').hide();
            Session.set('nowData', resultData);
            showSearchData(resultData);

        });
    }

    if (Session.get("productBrandName")) {

        var data = searchCondition();

        var searchSelectorData = {
            level: data.level,
            isShowArrange: data.isShowArrange,
            selector: {
                checkStatus: '审核通过',
                isRemoved: { $ne: true },
                brand: Session.get("productBrandName"),
                storeType: data.selector.storeType

            },
            options: {
                sort: { timestamp: -1 },
                skip: 0,
                limit: 10
            }
        };
        Session.set("searchDataSelector", searchSelectorData);
        Meteor.call('getProduct', searchSelectorData, function(err, resultData) {
            $('#searchResultPage .searchArea').hide();
            Session.set('nowData', resultData);
            showSearchData(resultData);

        });
    }

    // 如果从其他地方进去显示全部搜索结果
    if (Session.get("isShowAllSearchResult")) {

        var data = searchCondition();
        Session.set("searchDataSelector", data);
        Meteor.call('getProduct', data, function(err, resultData) {
            $('#searchResultPage .searchArea').hide();
            Session.set('nowData', resultData);
            showSearchData(resultData);

        });


    }

    //从搜索页面点击型号搜索
    if (Session.get("homeSearchRankSpecification")) {
        var data = searchCondition();

        var searchRankSelectorData = {
            level: data.level,
            isShowArrange: data.isShowArrange,
            selector: {
                checkStatus: '审核通过',
                isRemoved: { $ne: true },
                specification: Session.get("homeSearchRankSpecification"),
                storeType: data.selector.storeType

            },
            options: {
                sort: { timestamp: -1 },
                skip: 0,
                limit: 10
            }
        }; //模糊查询输入的关键字

        Session.set("searchDataSelector", searchRankSelectorData);
        Meteor.call('getProduct', searchRankSelectorData, function(err, resultData) {
            $('#searchResultPage .searchArea').hide();
            Session.set('nowData', resultData);
            showSearchData(resultData);

        });

    }

    if (Session.get('searchKey')) {
        var data = searchCondition();
        var searchData = searchCondition();

        // 价格搜索
        $('#searchResultPage #priceRange').click(function() {
            $('#searchResultPage #saleAmount button').removeClass('redBtn');
            $('#searchResultPage #priceRange button').addClass('redBtn');
            searchData = {
                level: data.level,
                isShowArrange: data.isShowArrange,
                selector: data.selector,
                options: { sort: { finialPrice: -1 } }
            };
        });

        Session.set("searchDataSelector", searchData);
        Meteor.call('getProductListsByKeywords', searchData, function(err, result) {

            if (err) {
                console.log(err);
                return;
            }
            Session.set('searchKey', '');

            Session.set('nowData', result);
            Session.set("searchPageGoodsListData", result);
            showSearchData(result);


        });
    }




    //根据搜索按钮 条件显示商品
    $('.searchAndResultPage .searchInputArea .searchInputBtnArea .ensure').click(function() {
        Session.set("limitCount", 10);
        $('#searchResultArea').hide();
        var data = searchCondition();
        Session.set("searchDataSelector", data);
        Meteor.call('getProductListsByKeywords', data, function(err, result) {

            if (err) {
                console.log(err);
                return;
            }
            Session.set('nowData', result);
            Session.set("searchPageGoodsListData", result);
            showSearchData(result);


        });

    });

    //点击筛选框确定按钮显示数据
    $('#searchResultPage .sortMenu .filtrateArea .optionBtn .innerArea .ensureBtn').click(function() {
        Session.set("limitCount", 10);
        var productCategoriesName = $('#screenProduct').find('button.redBtn').text(),
            brandName = $('#screenBrand').find('button.redBtn').text();
        $('#searchResultPage .sortMenu .menuListArea .filter').find('button').removeClass('buttonBorder');
        $('#searchResultPage .sortMenu .menuListArea .filter').find('button').css('color', '#999');
        $('#searchResultPage .sortMenu .menuListArea .filter').find('span').addClass('close');
        $('#searchResultPage .sortMenu .menuListArea .filter').find('span').removeClass('open');
        $('#searchResultPage .sortMenu .menuListArea .filter').find('img').attr('src', 'arrows.png');
        flag = false;
        var data = searchCondition();
        Session.set("searchDataSelector", data);
        Meteor.call('getProductListsByKeywords', data, function(err, result) {
            Session.set('nowData', result);
            showSearchData(result);
        });

        $('#searchResultPage .sortMenu .filtrateArea').toggle();
        $('#searchResultPage .goodsContainer').show();


    });

    //点击筛选框重置按钮
    $('#searchResultPage .sortMenu .filtrateArea .optionBtn .innerArea .resetBtn').click(function() {

        Session.set("limitCount", 10);
        $('#screenBrand .chooseItemLists .item').find('button').removeClass('redBtn');
        $('#screenProduct .chooseItemLists .item').find('button').removeClass('redBtn');
        var productCategoriesName = $('#screenProduct').find('button.redBtn').text(),
            brandName = $('#screenBrand').find('button.redBtn').text();
        $('#searchResultPage .sortMenu .menuListArea .filter').find('button').removeClass('buttonBorder');
        $('#searchResultPage .sortMenu .menuListArea .filter').find('button').css('color', '#999');
        $('#searchResultPage .sortMenu .menuListArea .filter').find('span').addClass('close');
        $('#searchResultPage .sortMenu .menuListArea .filter').find('span').removeClass('open');
        $('#searchResultPage .sortMenu .menuListArea .filter').find('img').attr('src', 'arrows.png');
        flag = false;
        var data = searchCondition();
        // searchData = { selector: { checkStatus: '审核通过', storeType: data.selector.storeType, isRemoved: { $ne: true }, brand: { $regex: brandName }, productCateory: { $regex: productCategoriesName } }, options: { sort: { timestamp: -1 } } }; //模糊查询输入的关键字
        Session.set("searchDataSelector", data);
        Meteor.call('getProductListsByKeywords', data, function(err, result) {
            Session.set('nowData', result);
            showSearchData(result);

        });

        $('#searchResultPage .sortMenu .filtrateArea').toggle();
        $('#searchResultPage .goodsContainer').show();


    });



    //点击筛选显示隐藏筛选条件
    $('#searchResultPage .sortMenu .menuListArea .filter').click(function() {

        Session.set("limitCount", 10);
        var productCategoriesName = $('#screenProduct').find('button.redBtn').text(),
            brandName = $('#screenBrand').find('button.redBtn').text();

        if (flag === false) {
            $(this).find('button').addClass('buttonBorder');
            $(this).find('button').css('color', '#e53939');
            $(this).find('span').addClass('open');
            $(this).find('span').removeClass('close');
            $(this).find('img').attr('src', 'arrowsDown.png');
            flag = true;
            $('#searchResultPage .goodsContainer').hide();
        } else {
            $(this).find('button').removeClass('buttonBorder');
            $(this).find('button').css('color', '#999');
            $(this).find('span').addClass('close');
            $(this).find('span').removeClass('open');
            $(this).find('img').attr('src', 'arrows.png');
            flag = false;
            $('#searchResultPage .goodsContainer').show();
            var data = searchCondition();
            // searchData = { selector: { checkStatus: '审核通过', storeType: data.selector.storeType, isRemoved: { $ne: true }, brand: { $regex: brandName }, productCateory: { $regex: productCategoriesName } }, options: { sort: { timestamp: -1 } } }; //模糊查询输入的关键字
            Session.set("searchDataSelector", data);
            Meteor.call('getProductListsByKeywords', data, function(err, result) {
                Session.set('nowData', result);
                showSearchData(result);

            });
        }

        $('#searchResultPage .sortMenu .filtrateArea').toggle();

    });

    //输入搜索条件模糊查询数据
    $('#searchKeyWords').keyup(function() {
        var searchKey = $('#searchKeyWords').val(),
            data = {};

        $('#searchResultArea').show();
        $('#searchResultArea').html('');
        var data = searchCondition();
        Meteor.call('getProductListsByKeywords', data, function(err, result) {
            Session.set('nowData', result);

            if (result == '') {
                $('#searchResultArea').append('<div class="result"><p></p></div>');
            } else {
                for (var i = 0; i < result.length; i++) {
                    $('#searchResultArea').append('<div class="result" data-spec="' + result[i].specification + '" data-name="' + result[i]._id + '" data-searchtime="' + result[i].searchTimes + '"><p>' + result[i].specification + '</p></div>');

                }
                $('#searchResultArea .result').off('click');
                $('#searchResultArea .result').on('click', function(e) {

                    Session.set("limitCount", 10);

                    $('#searchResultArea .result').hide();
                    var goodsId = $(this).data('name'),
                        searchTimes = $(this).data('searchtime'),
                        specification = $(this).data('spec').toString();

                    // if (searchTimes == 'undefined') {
                    //     data = { _id: goodsId, modifier: { searchTimes: 1 } };
                    // } else {
                    //     data = { _id: goodsId, modifier: { searchTimes: searchTimes + 1 } };
                    // }
                    // Meteor.call('updateProduct', data, function(err, result) {
                    //     console.log(err, result);
                    // });

                    $('#searchResultArea').hide();

                    var storeData = searchCondition();

                    var searchSelectorData = {
                        level: storeData.level,
                        isShowArrange: storeData.isShowArrange,
                        selector: {
                            checkStatus: '审核通过',
                            isRemoved: { $ne: true },
                            specification: specification,
                            storeType: storeData.selector.storeType

                        },
                        options: {
                            sort: { timestamp: -1 },
                            skip: 0,
                            limit: 10
                        }
                    }; //模糊查询输入的关键字
                    Session.set("searchDataSelector", searchSelectorData);
                    Meteor.call('getProduct', searchSelectorData, function(err, resultData) {
                        $('#searchResultPage .searchArea').hide();
                        Session.set('nowData', resultData);
                        showSearchData(resultData);

                    });


                });
            }
        });
    });

    //返回主页
    $('#searchResultPage .backBtn').click(function() {

        Session.set('searchKey', '');
        Session.set("homeSearchRankSpecification", null);
        FlowRouter.go('/');
    });

    //获取品牌 & 产品
    Meteor.call('getProductCategories', categoriesData, function(err, result) {
        var liIndex = $('#productCategories #optionsItem li');
        if (err) {
            console.log(err);
            return;
        }
        // console.log(result);
        for (var i = 0; i < result.length; i++) {
            if (result[i].type === '产品') {
                $('#screenProduct .chooseItemLists').prepend('<div class="item"><button>' + result[i].name + '</button></div>');
            } else if (result[i].type === '品牌') {
                $('#screenBrand .chooseItemLists').prepend('<div class="item"><button>' + result[i].name + '</button></div>');
            }
        }

        //点击选择类型
        $('#screenProduct .chooseItemLists .item').click(function(e) {
            $(this).find('button').addClass('redBtn');
            $(this).siblings().find('button').removeClass('redBtn');
        });
        $('#screenBrand .chooseItemLists .item').click(function(e) {
            $(this).find('button').addClass('redBtn');
            $(this).siblings().find('button').removeClass('redBtn');
        });
    });

    //按照价格排序
    $('#searchResultPage #priceRange').click(function() {
        Session.set("limitCount", 10);

        $('#searchResultPage #saleAmount button').removeClass('redI');
        $('#searchResultPage #priceRange button').addClass('redI');

        var data = Session.get("searchDataSelector");

        var searchData = {
            level: data.level,
            isShowArrange: data.isShowArrange,
            selector: data.selector,
            options: {
                sort: { finalPrice: -1 },
                skip: 0,
                limit: 10
            }
        };
        if (priceFlag === true) {
            searchData = {
                level: data.level,
                isShowArrange: data.isShowArrange,
                selector: data.selector,
                options: {
                    sort: { finalPrice: -1 },
                    skip: 0,
                    limit: 10
                }
            };
            $(this).find('img').attr('src', '/downPrice.png');
            priceFlag = false;

        } else if (priceFlag === false) {
            searchData = {
                level: data.level,
                isShowArrange: data.isShowArrange,
                selector: data.selector,
                options: {
                    sort: { finalPrice: 1 },
                    skip: 0,
                    limit: 10
                }
            };
            // var nowData = _.sortBy(Session.get('nowData'), 'finalPrice');
            $(this).find('img').attr('src', '/upPrice.png');
            priceFlag = true;
        }



        if (level == '游客' || level == '普通会员') {

        } else {

            Session.set("searchDataSelector", searchData);
            Meteor.call('getProductListsByKeywords', searchData, function(err, result) {
                // $("#searchResultPage .goodsLists").html('');
                Session.set('nowData', result);
                showSearchData(result);
            });
        }
    });

    //按照搜索次数排序
    $('#searchResultPage #saleAmount').click(function() {

        Session.set("limitCount", 10);

        var data = Session.get("searchDataSelector");

        var searchData = {
            level: data.level,
            isShowArrange: data.isShowArrange,
            selector: data.selector,
            options: {
                sort: { searchTimes: -1 },
                skip: 0,
                limit: 10
            }
        };


        if ($('#searchResultPage #saleAmount button').hasClass('redI')) {
            $('#searchResultPage #saleAmount button').removeClass('redI');
            searchData = {
                level: data.level,
                isShowArrange: data.isShowArrange,
                selector: data.selector,
                options: {
                    sort: { timestamp: -1 },
                    skip: 0,
                    limit: 10
                }
            };
        } else {
            $('#searchResultPage #saleAmount button').addClass('redI');
            $('#searchResultPage #priceRange button').removeClass('redI');
            $('#searchResultPage #priceRange img').attr('src', '/price.png');
            searchData = {
                level: data.level,
                isShowArrange: data.isShowArrange,
                selector: data.selector,
                options: {
                    sort: { searchTimes: -1 },
                    skip: 0,
                    limit: 10
                }
            };
        }
        Session.set("searchDataSelector", searchData);
        Meteor.call('getProductListsByKeywords', searchData, function(err, result) {
            // $("#searchResultPage .goodsLists").html('');
            Session.set('nowData', result);
            showSearchData(result);
        });
    });

    Session.set("limitCount", 10);

    //滚动条滚动到底部的事件
    $('.goodsContainer').scroll(function(e) {

        if ($('.goodsLists .goods').length < Session.get('limitCount')) {
            return
        };
        if (($('.goodsLists').outerHeight() - ($('.goodsContainer').height() + $('.goodsContainer')[0].scrollTop)) < 5) {
            var data = Session.get("searchDataSelector");
            var limitCount = Session.get('limitCount');
            var searchData = {
                level: data.level,
                isShowArrange: data.isShowArrange,
                selector: data.selector,
                options: {
                    sort: data.options.sort,
                    skip: 0,
                    limit: limitCount + 10
                }
            };

            Meteor.call('getProductListsByKeywords', searchData, function(err, result) {
                // $("#searchResultPage .goodsLists").html('');
                showSearchData(result);
                Session.set('nowData', result);
                limitCount = limitCount + 10;
                Session.set("limitCount", limitCount);
            });




        }
    });

});

Template.searchResultPage.onDestroyed(function() {
    Session.set("isShowAllSearchResult", false);
    Session.set("productCategoryName", null);
    Session.set("productBrandName", null);
    Session.set("homeSearchRankSpecification", null)
})


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
};

function searchCondition() {
    var inputSearchKey = $('#searchKeyWords').val();
    var productCategoriesName = $('#screenProduct').find('button.redBtn').text(),
        brandName = $('#screenBrand').find('button.redBtn').text();

    if (Session.get('searchKey')) {
        inputSearchKey = Session.get('searchKey');
    }
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
                    brand: { $regex: brandName },
                    productCateory: { $regex: productCategoriesName },
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
                                    brand: { $regex: brandName },
                                    productCateory: { $regex: productCategoriesName },
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
                                    brand: { $regex: brandName },
                                    productCateory: { $regex: productCategoriesName },
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
                                    brand: { $regex: brandName },
                                    productCateory: { $regex: productCategoriesName },
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
                                    brand: { $regex: brandName },
                                    productCateory: { $regex: productCategoriesName },
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
                                    brand: { $regex: brandName },
                                    productCateory: { $regex: productCategoriesName },
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
                                    brand: { $regex: brandName },
                                    productCateory: { $regex: productCategoriesName },
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
                                    brand: { $regex: brandName },
                                    productCateory: { $regex: productCategoriesName },
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
                                    brand: { $regex: brandName },
                                    productCateory: { $regex: productCategoriesName },
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
                                    brand: { $regex: brandName },
                                    productCateory: { $regex: productCategoriesName },
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
                        brand: { $regex: brandName },
                        productCateory: { $regex: productCategoriesName },
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
                brand: { $regex: brandName },
                productCateory: { $regex: productCategoriesName },
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
    var level = Session.get("searchResultUserLevel");
    var isShowArrange = Session.get('showArrange');

    if ($('#searchResultPage #saleAmount button').hasClass('redI')) {
        var searchData = {
            level: level,
            isShowArrange: isShowArrange,
            selector: data.selector,
            options: {
                sort: { searchTimes: -1 },
                skip: 0,
                limit: 10
            }
        }
    } else {
        if ($('#searchResultPage #priceRange button').hasClass('redI')) {

            if ($('#searchResultPage #priceRange button img').attr("src") == "/downPrice.png") {
                var searchData = {
                    level: level,
                    isShowArrange: isShowArrange,
                    selector: data.selector,
                    options: {
                        sort: { finalPrice: -1 },
                        skip: 0,
                        limit: 10
                    }
                }
            } else {
                var searchData = {
                    level: level,
                    isShowArrange: isShowArrange,
                    selector: data.selector,
                    options: {
                        sort: { finalPrice: 1 },
                        skip: 0,
                        limit: 10
                    }
                }
            }
        } else {
            var searchData = {
                level: level,
                isShowArrange: isShowArrange,
                selector: data.selector,
                options: {
                    sort: { timestamp: -1 },
                    skip: 0,
                    limit: 10
                }
            }
        }
    }

    return searchData;
}
//显示查找的数据
function showSearchData(result) {
    var phoneData = Setting.find().fetch();
    var level = Session.get("searchResultUserLevel");
    $('#searchResultPage .goodsLists').html('');
    if (result == "") {
        $('#searchResultPage .goodsLists').append('<div class="noneResult">' +
            '<p class="noneGoods">暂未找到匹配的商品，请联系客服，客服电话:</p>' +
            '<img src="/productions/error.jpg"/></div>');
        for (var i = 0; i < phoneData.length; i++) {
            $('#searchResultPage .goodsContainer .goodsLists .noneResult .noneGoods').append('<a href="tel:' + phoneData[i].name + '">' + phoneData[i].name + '</a>')
        }
    } else {

        for (var i = 0; i < result.length; i++) {
            var finialPrice = price(level, result[i].finalPrice, result[i].minPrice, result[i].maxPrice);
            $("#searchResultPage .goodsLists").append('<div class="goods" data-clicktimes="'+result[i].searchTimes+'" data-spec="' + result[i].specification + '" data-id="' + result[i]._id + '">' +
                '<div class="goodsInfoLeft">' +
                '<h3 class="productName">' + result[i].productName + '</h3>' +
                '<p>' + result[i].specification + '<span class="serachClickTimes">搜索次数:  ' + result[i].searchTimes + '</span></p>' +
                '</div>' +
                '<div class="goodsInfoRight">' +
                '<h3>￥<i class="redI">' + finialPrice + '</i></h3>' +
                '<p>库存: ' + result[i].storeNum + '</p>' +
                '</div>' +
                '<div class="clear"></div>' +
                '</div>');

        }
        //点击进入详情页
        $('#searchResultPage .goodsLists .goods').off('click');
        $('#searchResultPage .goodsLists .goods').on('click', function(e) {
            var goodsId = $(this).data('id');
            var specification = "" + $(this).data('spec');
            var searchTimes = parseInt($(this).data('clicktimes'));
            var modelData = {
                searchtimes: searchTimes,
                selector: {
                    specification: specification
                },
                options: {}
            };

            Meteor.call("updateModel", modelData, function(err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
            })

           updateProductSearchData = {
                selector: {
                    specification: specification
                },
                options: {}
            };

            Meteor.call('updateProductSearchTimes', updateProductSearchData, function(err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
            })
            Session.set('goodsId', goodsId);
            Session.set("isShowGoodsList", true);
            FlowRouter.go('/goodsDetails/' + goodsId);
        });
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
