/**
 * 前台公用方法
 *
 * @author  Vincent Zheng
 * @review
 */

'use strict';

/**
 * 公共方法对象
 * 
 * @type {Object}
 */
window.Utility = {};

/**
 * 打印log
 * 
 * @param  {Object} log log信息
 * 
 * @return {Void}
 */
Utility.writeLog = function(log) {
    console.log(log);
};



Tracker.autorun(function () {
    Meteor.subscribe('uploadFiles', Session.get('currentUploadFileId'));
});

/**
 * 上传文件
 * 
 * @param  {Object}   file     文件对象
 * @param  {Function} callback 回调函数
 * 
 * @return {Void}
 */
Utility.uploadFile = function(file, callback) {
    UploadFiles.insert(file, function(err, fileObj) {
        Session.set('currentUploadFileId', fileObj._id);
        var originalUrl = HOST + '/cfs/files/uploadFiles/' + fileObj._id + '/' + fileObj.original.name,
            cursor = UploadFiles.find(fileObj._id),
            liveQuery = cursor.observe({
                changed: function(newImage, oldImage) {
                    if (newImage.isUploaded()) {
                        liveQuery.stop();
                        setTimeout(function() {
                            callback && callback(originalUrl);
                        }, 500);
                    }
                }
            });
    });
};


/**
 * 获取URL中参数的值
 * 
 * @param  {String} key 参数名
 * 
 * @return {String} 参数值
 */
Utility.parse = function(key) {
    var result = '',
        tmp = [];
    location.search
        .substr(1)
        .split('&')
        .forEach(function(item) {
            tmp = item.split('=');
            if (tmp[0] === key) {
                result = decodeURIComponent(tmp[1]);
            }
        });
    return result;
};

Utility.alertMsg = function(msg) {
    $(".weui_dialog_alert").css("display", "block");
    $(".weui_dialog_bd").text(msg);

    $(".weui_dialog_ft").click(function(){
        $(".weui_dialog_alert").css("display", "none");
    })
}


