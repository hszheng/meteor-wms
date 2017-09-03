/**
 * 客户端启动后执行的逻辑代码。
 *
 * @author  Vincent Zheng
 * @review
 */

'use strict';
Meteor.startup(function() {
    $(document).ready(function() {
        // 宽度铺满全屏
        // if (navigator.userAgent.toLowerCase().search(/(iphone)|(ipad)|(ipod)|(android)|(blackberry)|(iemobile)/) !== -1) {
        // 手机端才缩放
        if ($('body').width() > 750) {

            if (!/^\/pc/.test(location.pathname)) {
                $('html').css('font-size', (700 / 10) + 'px');
                $('body').css('width','700px');
                $('body').css('margin','0 auto');
            }
        } else {


            if (!/^\/pc/.test(location.pathname)) {
                $('html').css('font-size', ($('body').width() / 10) + 'px');
            }
        }
        // $('html').css('font-size', (750 / 10) + 'px');
    });

       var code = Utility.parse('code'),
        redirect_uri = encodeURIComponent(location.href);
        if (code) {
            Meteor.call('getUserInfoByCode', code, function(err, result) {
                if (!err && result) {
                    Session.set('WechatUserInfo', result);
                }
            });
        } else {

            location.assign('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + APPID +
                '&redirect_uri=' + redirect_uri + '&response_type=code&scope=snsapi_userinfo&state=professional_edition#wechat_redirect');
        }

        // 微信接口
        Meteor.call('getWechatConfig', location.href.split('#')[0], function(err, result) {
            console.log(err);
            console.log(result);
            wx.config({
                debug: true,
                appId: result.appId,
                timestamp: result.timestamp,
                nonceStr: result.nonceStr,
                signature: result.signature,
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone',
                    'hideMenuItems',
                    'showMenuItems',
                    'hideAllNonBaseMenuItem',
                    'showAllNonBaseMenuItem',
                    'translateVoice',
                    'startRecord',
                    'stopRecord',
                    'onVoiceRecordEnd',
                    'playVoice',
                    'onVoicePlayEnd',
                    'pauseVoice',
                    'stopVoice',
                    'uploadVoice',
                    'downloadVoice',
                    'chooseImage',
                    'previewImage',
                    'uploadImage',
                    'downloadImage',
                    'getNetworkType',
                    'openLocation',
                    'getLocation',
                    'hideOptionMenu',
                    'showOptionMenu',
                    'closeWindow',
                    'scanQRCode',
                    'openProductSpecificView',
                    'addCard',
                    'chooseCard',
                    'openCard'
                ]
            });
        });
    
});
