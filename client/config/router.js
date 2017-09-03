/**
 * 所有的route。
 *
 * @author  Vincent Zheng
 * @review
 */

'use strict';

FlowRouter.route('/', {
    name: 'home',
    subscriptions: function (params, queryParams) {
        var self = this;
    },
    action: function (params, queryParams) {
        // if (!Meteor.userId()) {
            BlazeLayout.render('basicLayout', {
                top: 'header',
                main: 'home',
                bottom: 'footer'
            });
        // } else {
        //     FlowRouter.go('/login');
        // }
    }
});


//登录
FlowRouter.route('/login', {
    name: 'login',
    action: function (params, queryParams) {
        if (Meteor.userId()) {
            if (FlowRouter.current().oldRoute) {
                // 跳转回原来的页面
                FlowRouter.go(FlowRouter.current().oldRoute.path);
            } else {
                // 跳转回首页
                FlowRouter.go('/');
            }
        } else {
            BlazeLayout.render('basicLayout', {
                main: 'login',
                bottom: 'footer'
            });
        }
    }
});

//注册
FlowRouter.route('/register', {
    name: 'register',
    action: function (params, queryParams) {
        if (Meteor.userId()) {
            if (FlowRouter.current().oldRoute) {
                // 跳转回原来的页面
                FlowRouter.go(FlowRouter.current().oldRoute.path);
            } else {
                // 跳转回首页
                FlowRouter.go('/');
            }
        } else {
            BlazeLayout.render('basicLayout', {
                main: 'register',
                bottom: 'footer'
            });
        }
    }
});

//我的上传
FlowRouter.route('/myUploading', {
    name: 'myUploading',
    action: function (params, queryParams) {
        if (Meteor.userId()) {
            // BlazeLayout.render('basicLayout', {
            //     main: 'myUploading',
            //     bottom: 'footer'
            // });
            identify('myUploading');
        } else {
            FlowRouter.go('/login');
        }
    }
});


//上传页面
FlowRouter.route('/uploadingPage', {
    name: 'uploadingPage',
    action: function (params, queryParams) {
        if (Meteor.userId()) {
            // BlazeLayout.render('basicLayout', {
            //     main: 'uploadingPage',
            //     bottom: 'footer'
            // });
            identify('uploadingPage');
        } else {
            FlowRouter.go('/login');
        }
    }
});

//我的作品详情+修改页面
FlowRouter.route('/editUploadingPage/:_id', {
    name: 'editUploadingPage',
    action: function (params, queryParams) {
        if (Meteor.userId()) {
            // BlazeLayout.render('basicLayout', {
            //     main: 'editUploadingPage',
            //     bottom: 'footer'
            // });
            identify('editUploadingPage');
        } else {
            FlowRouter.go('/login');
        }
    }
});

//首页搜索
FlowRouter.route('/searchPage',{
    name: 'searchPage',
    action: function(params,queryParams){
        BlazeLayout.render('basicLayout',{
            main: 'searchPage',
            bottom: 'footer'
        });
    }
});

//搜索详情页
FlowRouter.route('/searchResultPage',{
    name: 'searchResultPage',
    action:  function(params,queryParams){
        BlazeLayout.render('basicLayout',{
            main: 'searchResultPage',
            bottom: 'footer'
        });
    }
})

//个人中心首页
FlowRouter.route('/personalPage',{
    name: 'personalPage',
    action:  function(params,queryParams) {
        if (Meteor.userId()) {
            BlazeLayout.render('basicLayout',{
                main: 'personalPage',
                bottom: 'footer'
            });
        } else {
            FlowRouter.go('/login');
        }
    }
});

//修改个人信息 
FlowRouter.route('/editPersonalPage',{
    name: 'editPersonalPage',
    action:  function(params,queryParams){
        if (Meteor.userId()) {
            BlazeLayout.render('basicLayout',{
                main: 'editPersonalPage',
                bottom: 'footer'
            });
        } else {
            FlowRouter.go('/login');
        }
    }
});

// 我的合同详情
FlowRouter.route('/purchaseContract',{
    name: 'purchaseContract',
    action:  function(params,queryParams){
        if (Meteor.userId()) {
            var user = UserInfo.findOne();
            if(user.identifyStatus !== '认证失败'){
                BlazeLayout.render('basicLayout',{
                    main: 'purchaseContract',
                    // bottom: 'footer'
                });
            }           
        } else {
            FlowRouter.go('/login');
        }
    }
});

//商品详情页
FlowRouter.route('/goodsDetails/:_id',{
    name: 'goodsDetails',
    action: function(params,queryParams){
        BlazeLayout.render('basicLayout',{
            main: 'goodsDetails'
        });
    }
});

// 选择收货地址
FlowRouter.route('/selectAddress',{
    name: 'selectAddress',
    action:  function(params,queryParams){
        if (Meteor.userId()) {
            BlazeLayout.render('basicLayout',{
                main: 'selectAddress',
                bottom: 'footer'
            });
        } else {
            FlowRouter.go('/login');
        }
    }
});

//购物车
FlowRouter.route('/shoppingTrolley',{
    name: 'shoppingTrolley',
    action: function(params,queryParams){
        if (Meteor.userId()) {
            // BlazeLayout.render('basicLayout',{
            //     main: 'shoppingTrolley',
            //     bottom: 'footer'
            // });
            identify('shoppingTrolley');
        } else {
            FlowRouter.go('/login');
        }
    }
});

// 我的合同列表
FlowRouter.route('/myContract',{
    name: 'myContract',
    action:  function(params,queryParams){
        if (Meteor.userId()) {
            // BlazeLayout.render('basicLayout',{
            //     main: 'myContract',
            //     bottom: 'footer'
            // });
            identify('myContract');
        } else {
            FlowRouter.go('/login');
        }
    }
});

// 我的合同详情查看
FlowRouter.route('/contractDetails',{
    name: 'contractDetails',
    action:  function(params,queryParams){
        if (Meteor.userId()) {
            BlazeLayout.render('basicLayout',{
                main: 'contractDetails',
                // bottom: 'footer'
            });
        } else {
            FlowRouter.go('/login');
        }
    }
});

// 我的合同详情查看
FlowRouter.route('/authenticate',{
    name: 'authenticate',
    action:  function(params,queryParams){
        if (Meteor.userId()) {
            var user = UserInfo.findOne();
            if(user.identifyStatus !== '认证失败'){
                BlazeLayout.render('basicLayout',{
                    main: 'authenticate',
                    // bottom: 'footer'
                });
            }
            
        } else {
            FlowRouter.go('/login');
        }
    }
});

// 新增收货地址
FlowRouter.route('/addAddress',{
    name: 'addAddress',
    action:  function(params,queryParams){
        if (Meteor.userId()) {
            BlazeLayout.render('basicLayout',{
                main: 'addAddress',
                bottom: 'footer'
            });
        } else {
            FlowRouter.go('/login');
        }
    }
});

// 更改收货地址
FlowRouter.route('/editAddress/:_id',{
    name: 'editAddress',
    action:  function(params,queryParams){
        if (Meteor.userId()) {
            BlazeLayout.render('basicLayout',{
                main: 'editAddress',
                bottom: 'footer'
            });
        } else {
            FlowRouter.go('/login');
        }
    }
});


//地址列表
FlowRouter.route('/addressList',{
    name: 'addressList',
    action: function(params,queryParams){
        if (Meteor.userId()) {
            BlazeLayout.render('basicLayout', {
                main: 'addressList',
                bottom: 'footer'
            });
        } else {
            FlowRouter.go('/login');
        }
    }
});


//客服customService
FlowRouter.route('/customService',{
    name: 'customService', 
    action: function(params,queryParams){
        if (Meteor.userId()) {
            BlazeLayout.render('basicLayout',{
                main:"customService",
                bottom:'footer'
            });
        } else {
            FlowRouter.go('/login');
        }
    }
});

//公告详情
FlowRouter.route('/noticeDetails/:_id',{
    name: 'noticeDetails',
    action: function(params,queryParams){
        BlazeLayout.render('basicLayout',{
            main:"noticeDetails",
            bottom:'footer'
        })
    }
});

//会员升级页面
FlowRouter.route('/memberUpdatePage',{
    name: 'memberUpdatePage',
    action: function(params,queryParams){
        if (Meteor.userId()) {
            // BlazeLayout.render('basicLayout',{
            //     main:"memberUpdatePage",
            //     bottom:'footer'
            // });
            identify('memberUpdatePage');
        } else {
            FlowRouter.go('/login');
        }
    }
});


//pc端路由

// pc--登录
FlowRouter.route('/pcLogin',{
    name: 'pcLogin',
    action:  function(params,queryParams){
        if (!Meteor.userId()) {
           BlazeLayout.render('basicLayout',{
                top: 'pcHeader',
                main: 'pcLogin'
            });
        } else {
            FlowRouter.go('/pcMyUploading');
        }
        
    }
});

//pc--我的上传列表
FlowRouter.route('/pcMyUploading',{
    name: 'pcMyUploading',
    action:  function(params,queryParams){
        if (Meteor.userId()) {
            BlazeLayout.render('basicLayout',{
                top: 'pcHeader',
                main: 'pcMyUploading'
            });
        } else {
            FlowRouter.go('/pcLogin');
        }
    }
});

//pc--上传产品
FlowRouter.route('/pcUploading',{
    name: 'pcUploading',
    action:  function(params,queryParams){
        if (Meteor.userId()) {
            var user = UserInfo.findOne();
            if(user.identifyStatus !== '认证失败'){
                BlazeLayout.render('basicLayout',{
                    top: 'pcHeader',
                    main: 'pcUploading'
                });
            }
            
        } else {
            FlowRouter.go('/pcLogin');
        }
    }
});

//pc--修改产品
FlowRouter.route('/pcEditUploading/:id',{
    name: 'pcEditUploading',
    action:  function(params,queryParams){
        if (Meteor.userId()) {
            BlazeLayout.render('basicLayout',{
                top: 'pcHeader',
                main: 'pcEditUploading'
            });
        } else {
            FlowRouter.go('/pcLogin');
        }
        
    }
});

//pc--批量上传
FlowRouter.route('/pcBatchUpload',{
    name: 'pcBatchUpload',
    action:  function(params,queryParams){
        if (Meteor.userId()) {
            var user = UserInfo.findOne();
            if(user.identifyStatus !== '认证失败'){
                BlazeLayout.render('basicLayout',{
                    top: 'pcHeader',
                    main: 'pcBatchUpload'
                });
            }
            else{
                BlazeLayout.render('basicLayout',{
                    top: 'pcHeader',
                    main: 'pcMyUploading'
                });
            }
            
        } else {
            FlowRouter.go('/pcLogin');
        }
        
    }
});


function identify(routeName){
    var user = UserInfo.findOne();
    if(user.identifyStatus !== '认证失败'){
        BlazeLayout.render('basicLayout',{
            main: routeName,
            bottom: 'footer'
        });
    } 
}