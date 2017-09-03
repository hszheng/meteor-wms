/**
 * 个人首页板块逻辑与动画
 *
 * @author  Jane Zhang
 * @review
 */

Template.personalPage.onRendered(function() {
    var userId = Meteor.userId(),
        data = { selector: { userId: userId, isRemoved: { $ne: true } }, options: { sort: { timestamp: -1 } } };

    //获取 用户信息
    Meteor.call('getUserInfo', data, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }
        Session.set("userInfo", result);

        if (result[0].type) {

            $("#personalContainer .personalGroup .personalInforText p").text(result[0].type + "   " + result[0].name);
        }


        $("#personalContainer .personalGroup .personalInforText h3").text(result[0].userName);
        $("#personalContainer .personalList .personalListItem .itemText1").text(result[0].level);

        $("#personalContainer .personalList .personalListItem .personalIdentifyText").text(result[0].identifyStatus);
        if ($("#personalContainer .personalList .personalListItem .personalIdentifyText").text() == "待认证") {
            $("#personalContainer .personalList .personalListItem h4 .identifyTextDate").css("visibility", "visible");
        }

        if (result[0].level == "游客") {
            $("#personalContainer .personalList .personalListItem .itemText2").hide();
        } else {

            if (result[0].vipTimestamp) {
                var dateNow = new Date();
                var vipEndDate = new Date(result[0].vipTimestamp);
                var dayNumber = parseInt((vipEndDate.getTime() - dateNow.getTime()) / (24 * 60 * 60 * 1000));
                if (dayNumber > 0) {
                    $("#personalContainer .personalList .personalListItem .itemText2").text("(还有" + dayNumber + "天到期)");
                } else {
                    $("#personalContainer .personalList .personalListItem .itemText2").hide();
                    var data = {
                        selector: { userId: userId },
                        modifier: {
                            level: '普通会员',
                            vipTimestamp: null
                        }
                    };

                    Meteor.call('updateMember', data, function(err, result) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        $("#personalContainer .personalList .personalListItem .itemText1").text('普通用户');
                    })
                }


            } else {
                $("#personalContainer .personalList .personalListItem .itemText2").hide();
            }

        };
        if (result[0].portrait) {
            $("#portraitImg").attr('src', result[0].portrait);
        } else {
            $("#portraitImg").attr('src', '/personal/protrait.png');
        }



    });

    // 点击我的个人信息 跳转到修改个人信息页面
    $("#personalContainer .personalGroup").click(function() {


        // FlowRouter.go('/editPersonalPage');
        FlowRouter.go('/authenticate');


    });

    //点击 未认证  跳转到
    $("#personalContainer .personalList .item1").click(function() {
        if ($("#personalContainer .personalList .personalListItem .personalIdentifyText").text() == "未认证") {
            FlowRouter.go('/authenticate');
        } else {
            Utility.alertMsg($("#personalContainer .personalList .personalListItem .personalIdentifyText").text());
        }
    });

    //点击 会员等级  跳转到
    $("#personalContainer .personalList .item2").click(function() {

        if ($("#personalContainer .personalList .personalListItem .personalIdentifyText").text() == "未认证") {
            Utility.alertMsg("请先进行认证");
        } else {
            if ($("#personalContainer .personalList .personalListItem .personalIdentifyText").text() == "待认证") {
                Utility.alertMsg("请等待通过认证");
            } else {
                FlowRouter.go('/memberUpdatePage');
            }

        }

    });

    //点击 我的合同  跳转到
    $("#personalContainer .personalList .item3").click(function() {
        FlowRouter.go('/myContract');
    });

    //点击 我的收货地址  跳转到
    $("#personalContainer .personalList .item4").click(function() {
        FlowRouter.go('/addressList');
    });

    //点击 我的上传  跳转到
    $("#personalContainer .personalList .item5").click(function() {
        FlowRouter.go('/myUploading');
    });

    //点击 上传产品  跳转到
    $("#personalContainer .personalList .item6").click(function() {
        if ($("#personalContainer .personalList .personalListItem .personalIdentifyText").text() == "认证失败") {
            Utility.alertMsg("对不起，您已经认证失败");
        } else {
            FlowRouter.go('/uploadingPage');
        }

    });

    //点击修改密码跳转到
    $("#personalContainer .personalList .item7").click(function() {
        FlowRouter.go('/editPersonalPage');
    });

    //点击 退出登录  跳转到
    $("#personalContainer .personalList .item8").click(function() {

        $("#personalContainer .personalAlertContainer").css("display", "block");

    });

    //退出登录弹出框点击
    $("#personalAlertCancle").click(function() {
        $("#personalContainer .personalAlertContainer").css("display", "none");
    });
    $("#personalAlertSave").click(function() {

        $("#personalContainer .personalAlertContainer").css("display", "none");
        Meteor.logout();
        setTimeout(function() {
            FlowRouter.go('/login');
        }, 200);
    })


});

function firm() {
    //利用对话框返回的值 （true 或者 false）  
    if (confirm("你确定提交吗？")) {
        Utility.alertMsg("您点击了确定");
    } else {
        Utility.alertMsg("您点击了取消");
    }

}
