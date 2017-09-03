Template.memberUpdatePage.onRendered(function() {


    //返回按钮
    $("#memberContainer .redBtnArea .redBtn .redBtnSubmit").click(function() {
        if (FlowRouter.current().oldRoute) {
            // 跳转回原来的页面
            FlowRouter.go(FlowRouter.current().oldRoute.path);
        } else {
            // 跳转回个人信息的页面
            FlowRouter.go('/personalPage');
        }
    });

    var updateLevelName = " ",
        isAgree = false;

    var userInfo = Session.get("userInfo");
    //普通会员选择框点击
    $("#memberContainer .memberList .ordinaryItem").click(function() {

        if (userInfo[0].vipTimestamp) {
            Utility.alertMsg("您已经是" + userInfo[0].level + "，请选择更高级别");

        } else {
            $("#memberContainer .memberList .memberItem .ordinaryMember img").css('display', 'block');
            $("#memberContainer .memberList .memberItem .vipMember img").css('display', 'none');
            $("#memberContainer .memberList .memberItem .superMember img").css('display', 'none');
            updateLevelName = "普通会员";
            Session.set('updateLevelName',updateLevelName);

        }

    });

    //vip会员选择框点击
    $("#memberContainer .memberList .vipItem").click(function() {

        if (userInfo[0].level == "普通会员") {
            $("#memberContainer .memberList .memberItem .ordinaryMember img").css('display', 'none');
            $("#memberContainer .memberList .memberItem .vipMember img").css('display', 'block');
            $("#memberContainer .memberList .memberItem .superMember img").css('display', 'none');
            updateLevelName = "vip会员";
            Session.set('updateLevelName',updateLevelName);
        } else {
              Utility.alertMsg("您已经是" + userInfo[0].level + "，请选择更高级别");
        }

    });

    //超级会员选择框点击
    $("#memberContainer .memberList .superItem").click(function() {

        if (userInfo[0].level == "超级会员") {
              Utility.alertMsg("您已经是" + userInfo[0].level);
        } else {
            $("#memberContainer .memberList .memberItem .ordinaryMember img").css('display', 'none');
            $("#memberContainer .memberList .memberItem .vipMember img").css('display', 'none');
            $("#memberContainer .memberList .memberItem .superMember img").css('display', 'block');
            updateLevelName = "超级会员";
            Session.set('updateLevelName',updateLevelName);
        }

    });

    // 同意会员 点击
    $("#memberContainer .memberAgree .cycleCheckBtn").click(function() {

        if (userInfo[0].level != "超级会员") {
            $("#memberContainer .memberAgree .cycleCheckBtn img").css('display', 'block');
            isAgree = true;
        }

    })

    //升级会员点击
    $("#memberContainer .memberBtn").click(function() {
        // alert('!!!!!!!!!!!!');
        if (isAgree) {

            if (updateLevelName == " ") {

                  Utility.alertMsg("请选择您要升的等级");
            } else {
                var money = parseInt($('#memberContainer .memberList .memberItem .cycleCheckBtn img:visible').data('id')) * 100;
                var orderNo = Date.now() + '';
                createOrder(orderNo,money);
            }

        } else {

             Utility.alertMsg("请先同意会员说明");
        }

    });

});


/**
 * 创建订单
 * 
 * @param  {String} shipId 订单号
 * @param  {Number} fee    支付金额(单位：分)
 * 
 * @return {Void}
 */
function createOrder(shipId, fee) {
    // alert('pppppppp');
    var data = {
        appid: APPID,
        body: '升级会员',
        mch_id: MCH_ID, // 商户号
        nonce_str: random_string(32),
        notify_url: WECHAT_PAY_NOTIFY,
        openid: Session.get('WechatUserInfo').openid, // 用户标识
        out_trade_no: shipId,
        // spbill_create_ip: myip,
        total_fee: fee,
        trade_type: 'JSAPI',
    };
    // alert(data);
    // console.log(data);
    var arr = [];
    // alert('13');
    for (var item in data) {
        arr.push(item + '=' + data[item]);
    }
    var preurl = arr.sort().join('&') + '&key=' + PARTNER_KEY;
    var str = preurl;
    data.sign = $.md5(str).toUpperCase();
    // alert('0000000');
    Meteor.call('sendHttpPost', initUnifiedOrderXML(data), 'https://api.mch.weixin.qq.com/pay/unifiedorder', function (err, result) {
        // alert(result.result_code[0]);
        if (result.return_code[0] == 'SUCCESS' && result.result_code[0] == 'SUCCESS') {
            // alert('yes');
            onBridgeReady('prepay_id=' + result.prepay_id[0]);
        } else {
            alert('请求失败,原因：' + result.return_msg[0]);
        }
    })
}

/**
 * 随机字符串
 * 
 * @param  {Number} len 随机字符串的长度
 * 
 * @return {String}     长度为len的随机字符串
 */
function random_string(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

/**
 * 将订单信息转换为XML格式
 * 
 * @param  {Object} data 订单信息
 * 
 * @return {String}      xml字符串
 */
function initUnifiedOrderXML(data) {
    return '<xml>' +
        '<appid>' + data.appid + '</appid>' +
        '<body>' + data.body + '</body>' +
        '<mch_id>' + data.mch_id + '</mch_id>' +
        '<nonce_str>' + data.nonce_str + '</nonce_str>' +
        '<notify_url>' + data.notify_url + '</notify_url>' +
        '<openid>' + data.openid + '</openid>' +
        '<out_trade_no>' + data.out_trade_no + '</out_trade_no>' +
        '<total_fee>' + data.total_fee + '</total_fee>' +
        '<trade_type>JSAPI</trade_type>' +
        '<sign>' + data.sign + '</sign>' +
        '</xml>';
}

/**
 * 跳转到支付界面，并且监控是否支付成功
 * 
 * @param  {String} package 订单号信息
 * @return {Void}
 */
function onBridgeReady(packageStr) {
    var nonceStr = random_string(32);
    var timestamp = Math.floor(Date.now() / 1000) + '';
    var str = decodeURIComponent('appId=' + APPID + '&nonceStr=' + nonceStr + '&package=' + packageStr + '&signType=MD5&timeStamp=' + timestamp + '&key=' + PARTNER_KEY);
    var signature = $.md5(str).toUpperCase();

    WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
            "appId": APPID, //公众号名称，由商户传入     
            "timeStamp": timestamp, //时间戳，自1970年以来的秒数     
            "nonceStr": nonceStr, //随机串     
            "package": packageStr,
            "signType": "MD5", //微信签名方式：     
            "paySign": signature //微信签名 
        },
        function (res) {

            if (res.err_msg == "get_brand_wcpay_request:ok") {
                var userId = Meteor.userId();
                var data = {
                    selector: { userId: userId },
                    modifier: {
                        vipStatus: "待审核",
                        upgradeLevel: Session.get('updateLevelName'),
                        isRead:false
                    }
                };
                var logs = {userId: userId,vip:Session.get('updateLevelName')};
                Meteor.call('updateMember', data, function(err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    if (result) {
                        Utility.alertMsg("您的会员升级申请已提交，请等待审核");
                        FlowRouter.go('/personalPage');
                    } else {
                         Utility.alertMsg("会员升级失败");
                    }
                });

                Meteor.call('insertLog',logs,function (err,result){
                    if(err){
                        return;
                    }
                });
                
            } // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
            else if (res.err_msg == "get_brand_wcpay_request:fail") {
                alert('支付失败');
            }
            // else alert(JSON.stringify(res));
        }
    );
}
