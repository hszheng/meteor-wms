/**
 * 服务端的配置文件。
 * 如果配置信息定义了全局变量，则使用全部字母大写的方式命名，使用下划线连接，例如：SYS_ROUTES。
 *
 * @author  Vincent Zheng
 * @review
 */

'use strict';

var self = this;

/**
 * 文件保存路径
 * 
 * @type {String}
 */
self.UPLOAD_FILE_PATH = '/data/uploadFiles';
// self.UPLOAD_FILE_PATH = '/Users/yangchunboy/Documents/file';

/**
 * 短信接口账号
 * 
 * @type {String}
 */
self.MSG_ACCOUNT = '006089';

/**
 * 短信接口密码
 * 
 * @type {String}
 */
self.MSG_PASSWORD = 'Sd123456';

/**
 * 微信公众号ID
 * 
 * 
 * @type {String}
 */

self.APPID = 'wx8363e823b125fe17';

/**
 * 微信公众号secret
 * 
 * 
 * @type {String}
 */

self.APP_SECRET = '0d12da95fc5466d0fd349ff3a96865ad';

// self.PARSESTRING = Npm.require('xml2js').parseString;