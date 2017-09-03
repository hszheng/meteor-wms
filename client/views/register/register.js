/**
 * 注册板块逻辑以及动画
 *
 * @author  Vivian Yang
 * @review
 */

Template.register.onRendered(function() {
    // 发送验证码
    $('#registerContainer .registFormArea .shortInput .sendCode').click(function(e) {
        if ($(e.currentTarget).hasClass('already')) {
            return;
        }
        var userName = $('#registerContainer .registFormArea .longInput .tel').val(),
            nowCode = randomNumber(),
            password = randomWord(true, 8, 10);
        Session.set('authCode', nowCode);
        Session.set('password', password);

        if (userName !== '') {
            if (userName && /^1[345678][0-9]{9}$/.test(userName)) {

                var data = {
                    selector: {
                        registerPhone: userName,
                        isRemoved: { $ne: true }
                    },
                    options: { sort: { timestamp: -1 } }
                };

                Meteor.call('getUserInfo', data, function(err, result) {

                    if (err) {
                        console.log(err);
                        return;
                    }

                    if (result == "") {
                        var time = 60,
                            code = $('#registerContainer .registFormArea .shortInput button');
                        $(e.currentTarget).addClass('already');
                        Meteor.call("sendSMS", userName, nowCode + '，您的初始密码是' + password);
                        var t = setInterval(function() {
                            time--;
                            code.html(time + "秒");
                            if (time == 0) {
                                clearInterval(t);
                                code.html("重新获取");
                                $(e.currentTarget).removeClass('already');
                                validCode = true;
                            }
                        }, 1000);
                    } else {
                        
                         Utility.alertMsg("该手机号已注册，请返回登陆页面");
                    }
                })




            } else {
                 Utility.alertMsg("验证码发送失败，请输入正确的手机号码");
            }
        } else {
             Utility.alertMsg("手机号码不能为空");
        }
    });

    //点击注册按钮进行信息验证并注册
    $('#registerContainer .operationBtn .submitBtn').click(function() {
        register();
    });

    // 按enter键注册
    $('#registerContainer').keydown(function(event) {
        if (event.keyCode == 13) {
            register();
        }

    });

    $('#registerContainer .operationBtn .cancle').click(function(){
        FlowRouter.go('/login');
    })


    //自适应高度
    var curHeight = $(window).height();
    $('#registerContainer').height(curHeight - 54);
});


// 生成随机数 
function randomNumber() {
    var authCode = Math.floor(Math.random() * 9000) + 1000;
    // alert(authCode);
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
    // console.log(str);
    return str;
}

function register() {
    var longInputArea = $('#registerContainer .registFormArea .commonInput'),
        shortInputArea = $('#registerContainer .registFormArea .shortInput input'),
        userName = $('#registerContainer .registFormArea .longInput .tel').val(),
        password = Session.get('password'),
        authCode = $('#registerContainer .registFormArea .shortInput .authCode').val(),
        inputIndex = $('#registerContainer .registFormArea .commonInput'),
        level = '普通会员',
        creditNo = 4,
        identifyStatus = '未认证',
        obj = { username: userName, password: password, registerPhone: userName, level: level, creditNo: creditNo, identifyStatus: identifyStatus };

    // console.log($('#registerContainer .registFormArea .shortInput .authCode').val());
    if (/^1[345678][0-9]{9}$/.test(userName)) {
        if (authCode == Session.get('authCode')) {
            Accounts.createUser(obj, function(err) {
                if (err) {
                    
                     Utility.alertMsg("注册失败");
                    console.log(err);
                    return;
                } else {
                     Utility.alertMsg("注册成功，请修改您的密码");
                    // if (FlowRouter.current().oldRoute) {
                    //     // 跳转回原来的页面
                    //     FlowRouter.go(FlowRouter.current().oldRoute.path);
                    // } else {
                    // 跳转回首页
                    FlowRouter.go('/editPersonalPage');
                    // }
                }
            });
        } else {
            
             Utility.alertMsg("验证码错误");
        }
    } else {
         Utility.alertMsg("手机号格式不正确");
    }
}
