/**
 * 修改个人信息板块逻辑与动画
 *
 * @author  Jane Zhang
 * @review
 */

Template.editPersonalPage.onRendered(function() {
    var userId = Meteor.userId(),
        data = { selector: { userId: userId, isRemoved: { $ne: true } }, options: { sort: { timestamp: -1 } } };
    var code = "";

    //获取 用户信息
    Meteor.call('getUserInfo', data, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }

        $("#editPersonalContainer .editPersonalFormArea .username input").val(result[0].userName);
        $("#editPersonalContainer .editPersonalFormArea .phone input").val(result[0].registerPhone);
        if (result[0].portrait) {
            $("#personalPortrait").attr('src', result[0].portrait);
        } else {
            $("#personalPortrait").attr('src', '/personal/protrait.png');
        }



    });

    //点击返回按钮

    $('#editPersonalContainer .editPersonalBar .editPersonalImage img').click(function() {
        FlowRouter.go('/personalPage');
    });

    // 发送验证码
    $('#editPersonalContainer .editPersonalFormArea .commonWidthArea .identifyBtn').click(function() {
        var editPassword = $("#editPersonalContainer .editPersonalFormArea .editPassword input").val(),
            ensurePassword = $("#editPersonalContainer .editPersonalFormArea .ensurePassword input").val();

        if (editPassword == "" || editPassword == null) {
            Utility.alertMsg("密码不能为空!");

        } else {
            if (ensurePassword != editPassword) {
                Utility.alertMsg("两次密码不一致!");
            } else {

               if(editPassword.length<6){
                Utility.alertMsg("密码的长度不能小于6位!");

               }else{
                var time = 60;
                code = randomNumber();
                Session.set('authCode', code);
                Meteor.call("sendSMS", $("#editPersonalContainer .editPersonalFormArea .username input").val(), code);

                var t = setInterval(function() {
                    time--;
                    $('#editPersonalContainer .editPersonalFormArea .commonWidthArea .identifyBtn').html(time + "秒");
                    if (time == 0) {
                        clearInterval(t);
                        $('#editPersonalContainer .editPersonalFormArea .commonWidthArea .identifyBtn').html("重新获取");
                        validCode = true;
                    }
                }, 1000);
            }

            }

        }


        // $("#editPersonalContainer .editPersonalFormArea .commonWidthArea .identifyInput").val(code);
        //alert(code);
    });

    //点击头像更换头像
    $('#editPersonalContainer .editPersonalPortrait .uploadPanel input[type="file"]').change(function(e) {
        Meteor.setTimeout(function() {
            $('#editPersonalContainer .editPersonalPortrait .upload-control.start').click();
        }, 200);
    });

    //点击保存按钮
    $('#editPersonalContainer .optionBtnGroup .editPersonalSaveBtn').click(function() {

        var editPassword = $("#editPersonalContainer .editPersonalFormArea .editPassword input").val(),
            ensurePassword = $("#editPersonalContainer .editPersonalFormArea .ensurePassword input").val(),
            identifyInput = $("#editPersonalContainer .editPersonalFormArea .commonWidthArea .identifyInput").val();

        var userId = Meteor.userId(),
            data = { _id: userId, newPassword: ensurePassword, options: { logout: false } };

        if (editPassword == "" || editPassword == null) {
            Utility.alertMsg("密码不能为空!");

        } else {
            if (ensurePassword != editPassword) {
                Utility.alertMsg("两次密码不一致!");
            } else {

                if (identifyInput == "" || identifyInput == null) {
                    Utility.alertMsg("验证码不能为空!");
                } else {

                    if (identifyInput != Session.get('authCode')) {

                        Utility.alertMsg("请输入正确的验证码!");

                    } else {
                        Meteor.call('updateUserInfo', data, function(err, result) {
                            if (!err) {
                                Utility.alertMsg("密码修改成功!");
                                FlowRouter.go('/personalPage');

                            } else {
                                Utility.alertMsg("密码修改失败!");
                            }
                        });
                    }



                }
            }

        }
    });

    //点击取消按钮
    $('#editPersonalContainer .optionBtnGroup .editPersonalCancelBtn').click(function() {
        FlowRouter.go('/personalPage');
    });

});

// 生成随机数 
function randomNumber() {
    var authCode = Math.floor(Math.random() * 9000) + 1000;
    return authCode;
}

Template.editPersonalPage.helpers({
    uploadCallback: function() {
        return {
            finished: function(index, fileInfo, context) {
                var url = fileInfo.baseUrl + fileInfo.name,
                    userId = Meteor.userId(),
                    data = {
                        selector: { userId: userId },
                        modifier: {
                            portrait: url
                        }
                    };

                Meteor.call('updateMember', data, function(err, result) {
                    if (err) {
                        return;
                    }

                    if (result) {
                        $("#personalPortrait").attr('src', url);
                    } else {
                        Utility.alertMsg("修改头像失败!");
                    }
                });
                $('#editPersonalContainer .editPersonalPortrait .jqUploadclass').val('');
            }
        };
    }
});
