/**
 * 客户端的配置文件。
 * 如果配置信息定义了全局变量，则使用全部字母大写的方式命名，使用下划线连接，例如：SYS_ROUTES。
 *
 * @author  Vincent Zheng
 * @review
 */

'use strict';

/**
 * 配置Active Route
 * 
 * @type {String}
 */
ActiveRoute.configure({
    activeClass: 'active',
    caseSensitive: true,
    disabledClass: 'disabled',
    regex: 'false'
});

/**
 * 配置not found页面
 * 
 * @type {Object}
 */
FlowRouter.notFound = {
    action: function () {
        BlazeLayout.render('basicLayout', {
            top: 'header',
            main: 'notFound',
            bottom: 'footer'
        });
    }
};

/**
 * 服务器HOST
 * 
 * @type {String}
 */

window.HOST = 'http://www.gkxhc168.cc';


window.APPID = 'wx8363e823b125fe17';

window.SECRET = '0d12da95fc5466d0fd349ff3a96865ad';

window.MCH_ID = '1315943701';

window.PARTNER_KEY = 'QWERTYUIOP1234567890ASDFGHJKLZXC';

window.WECHAT_PAY_NOTIFY = 'http://www.gkxhc168.cc/pay_notify';
// window.HOST = 'http://192.168.1.127:3000';

