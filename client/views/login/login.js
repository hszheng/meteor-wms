/**
 * 登录板块逻辑以及动画
 *
 * @author  Vivian Yang
 * @review
 */

Template.login.onRendered(function() {
    //点击注册按钮跳转至注册页面
    $('#loginContainer .operationBtn .register').click(function() {
        FlowRouter.go('/register');
    });

    // 登录按钮
    $('#loginContainer .operationBtn .login').click(function() {
        login();
    });

    //忘记密码
    $('#loginContainer .operationBtn .forgetPassword').click(function() {
        $('#loginContainer .forgetPasswordContainer').css('display', 'block');
    });

    //取消按钮
    $('#loginContainer .forgetPasswordContainer .successAlert .innerArea .forgetPasswordBtnArea .cancel').click(function() {
        $('#loginContainer .forgetPasswordContainer').css('display', 'none');
    });

    //发送验证码按钮
    $('#loginContainer .forgetPasswordContainer .successAlert .innerArea .identifyArea .identifyBtn').click(function() {

        var phoneInputValue = $('#loginContainer .forgetPasswordContainer .successAlert .innerArea .phoneArea input').val();

        if (phoneInputValue == "") {
            $('#loginContainer .forgetPasswordContainer .successAlert .innerArea .phoneArea p').text("请输入您的账号");
            $('#loginContainer .forgetPasswordContainer .successAlert .innerArea .phoneArea p').css('visibility', 'visible');
        } else {

            var data = {
                selector: {
                    registerPhone: phoneInputValue,
                    isRemoved: { $ne: true }
                },
                options: { sort: { timestamp: -1 } }
            };

            Meteor.call('getUserInfo', data, function(err, result) {

                Session.set("forgetPasswordUser", result[0]);
                if (result == "") {
                    $('#loginContainer .forgetPasswordContainer .successAlert .innerArea .phoneArea p').css('visibility', 'visible');
                } else {

                    $('#loginContainer .forgetPasswordContainer .successAlert .innerArea .phoneArea p').css('visibility', 'hidden');
                    var time = 60;
                    code = randomNumber();
                    Session.set('authCode', code);
                    var password = randomWord(true, 8, 10);
                    Session.set('forgetPassword', password);
                    Meteor.call("sendSMS", phoneInputValue, code + ',您的密码是:' + password);

                    var t = setInterval(function() {
                        time--;
                        $('#loginContainer .forgetPasswordContainer .successAlert .innerArea .identifyArea .identifyBtn').html(time + "秒");
                        if (time == 0) {
                            clearInterval(t);
                            $('#loginContainer .forgetPasswordContainer .successAlert .innerArea .identifyArea .identifyBtn').html("重新获取");
                            validCode = true;
                        }
                    }, 1000);
                }

            });


        }

    });

    //确定按钮
    $('#loginContainer .forgetPasswordContainer .successAlert .innerArea .forgetPasswordBtnArea .ensure').click(function() {
        var identifyInput = $("#loginContainer .forgetPasswordContainer .successAlert .innerArea .identifyArea .identifyInput").val();
        if (identifyInput == "" || identifyInput == null) {
            Utility.alertMsg("验证码不能为空!");
        } else {
            if (identifyInput != Session.get('authCode')) {

                Utility.alertMsg("请输入正确的验证码!");

            } else {

                var userId = Session.get("forgetPasswordUser").userId,
                    ensurePassword = Session.get('forgetPassword');
                var data = { _id: userId, newPassword: ensurePassword, options: { logout: false } };
                Meteor.call('updateUserInfo', data, function(err, result) {
                    if (!err) {
                        Utility.alertMsg("密码修改成功!");
                        $('#loginContainer .forgetPasswordContainer').css('display', 'none');
                        Session.set('isTurnEditPass', true);
                    } else {
                        Utility.alertMsg("密码修改失败!");
                    }
                });
            }
        }

    })

    //按enter键登录
    $('#loginContainer').keydown(function(event) {
        if (event.keyCode == 13) {
            login();
        }

    })

    //自适应高度
    var curHeight = $(window).height();
    $('#loginContainer').height(curHeight - 54);
});
// 生成随机数 
function randomNumber() {
    var authCode = Math.floor(Math.random() * 9000) + 1000;
    return authCode;
}
//生成随机密码
function randomWord(randomFlag, min, max) {
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    // 随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
    }
    for (var i = 0; i < range; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
}

function login() {
    var username = $('#loginContainer .loginFormArea .username input').val(), //获取用户输入的用户名
        password = $('#loginContainer .loginFormArea .password input').val(); //获取用户输入的密码

    if (username !== '') { //判断用户输入的用户名是否为空
        if (password !== '') { //判断用户输入的密码是否为空
            if (!Meteor.userId()) {
                var data = {
                    selector: {
                        username: username

                    },
                    options: {}
                }
                Meteor.call('getMeteorUser', data, function(err, result) {

                    if (err) {
                        console.log(err);
                        Utility.alertMsg("账号或密码错误!");
                        return;
                    }
                    if (result == "") {
                        Utility.alertMsg("账号或密码错误!");
                        return;

                    } else {
                        if (result[0].type) {
                            Utility.alertMsg("账号或密码错误!");
                            return;
                        } else {

                            Meteor.loginWithPassword(username, password, function(err) { //验证用户名和密码
                                if (err) {
                                    Utility.alertMsg("账号或密码错误!");
                                    console.log(err);
                                    return;
                                } else {
                                    Meteor.logoutOtherClients();
                                    // Utility.alertMsg("登录成功!");
                                    if (Session.get('isTurnEditPass')) {
                                        // Utility.alertMsg("请修改您的密码");
                                        FlowRouter.go('/editPersonalPage');
                                    } else {
                                        var username = Meteor.user().username; //获取用户的用户名
                                        FlowRouter.go('/');
                                    }
                                }
                            });

                        }
                    }



                })

            } else {
                Utility.alertMsg("您已经登录了!");
                FlowRouter.go('/');
            }
        } else {
            Utility.alertMsg("密码不能为空!");
        }
    } else {
        Utility.alertMsg("用户名不能为空!");
    }
}
