Template.pcLogin.onRendered(function() {
    $('.pcLogin .treadle .carry').click(function() {
        var userName = $('.pcLogin .treadle .userName').val();
        var password = $('.pcLogin .treadle .password').val();
        if (userName === "") {
            Utility.alertMsg("用户名不能为空！");
            return;
        }
        if (password === "") {
            Utility.alertMsg("密码不能为空！");
            return;
        }
        if (Meteor.userId()) {
            Utility.alertMsg("您已经登录！不能重复登录");
            return;
        }

        var data = {
            selector: {
                username: userName

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
                    Meteor.loginWithPassword(userName, password, function(err) { //验证用户名和密码
                        if (err) {
                            Utility.alertMsg("账号或密码错误！");
                            return;
                        } else {
                            Meteor.logoutOtherClients();
                            // Utility.alertMsg("yyyy");
                            var username = Meteor.user().username; //获取用户的用户名
                            $('.pcHeader .head .userIogin').html(username);
                            FlowRouter.go('/pcMyUploading');
                        }
                    });
                }
            }
        })

    });
});
