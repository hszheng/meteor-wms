Template.authenticate.onRendered(function() {


    //获取当前用户信息
    var userData = Session.get("userInfo");
    if (userData[0].type) {

        $(".authenticateInfo .withdraw").text("信息修改");
        $(".authenticateInfo .corporateInfo .firmAttest").text("申请修改");
        $(".authenticateInfo .personalInfo .personalAttest").text("申请修改");
        $('.authenticateInfo .personalInfo .basicInfo .fullName').css("disabled", true);
        $('.authenticateInfo .personalInfo .contactInfo .cellphone').css("disabled", true);

        if (userData[0].type == "企业") {
            $('.authenticateInfo .corporateInfo .infoUnit .unit').val(userData[0].name); //单位名称
            $('.authenticateInfo .corporateInfo .infoUnit .license').val(userData[0].registrationNo); //税务登记号/营业执照
            $('.authenticateInfo .corporateInfo .introduction .preface').val(userData[0].companyIntroduction); //公司简介
            $('.authenticateInfo .corporateInfo .introduction .landline').val(userData[0].landLine); //座机
            $('.authenticateInfo .corporateInfo .introduction .fax').val(userData[0].fax); //传真
            $('.authenticateInfo .corporateInfo .account .name').val(userData[0].accountName); //户名
            $('.authenticateInfo .corporateInfo .account .bank').val(userData[0].accountPlace); //开户行
            $('.authenticateInfo .corporateInfo .account .account').val(userData[0].accountNo); //账号
            $('.authenticateInfo .corporateInfo .account .address').val(userData[0].companyAddress); //单位地址
            $('.authenticateInfo .corporateInfo .headman .principal').val(userData[0].principalName); //负责人
            $('.authenticateInfo .corporateInfo .headman .phone').val(userData[0].principalPhone); //手机号码
            $('.authenticateInfo .corporateInfo .headman .mailbox').val(userData[0].email); //邮箱
            $('.authenticateInfo .corporateInfo .headman .QQ').val(userData[0].qq); //qq
            $('.authenticateInfo .corporateInfo .headman .weChat').val(userData[0].wechat); //微信
            $('.authenticateInfo .corporateInfo .otherInfo .certificate').val(userData[0].licenseNo); //代理证书编号
            var featuresArr = userData[0].features;
            for (var i = 0; i < featuresArr.length; i++) {
                if (featuresArr[i] == "商务") {

                    $(".authenticateInfo .corporateInfo .pattern .method .business").addClass('select');
                }
                if (featuresArr[i] == "OEM") {

                    $(".authenticateInfo .corporateInfo .pattern .method .OME").addClass('select');
                }
                if (featuresArr[i] == "技术") {
                    $(".authenticateInfo .corporateInfo .pattern .method .technology").addClass('select');
                }
                if (featuresArr[i] == "项目") {
                    $(".authenticateInfo .corporateInfo .pattern .method .project").addClass('select');
                }
                if (featuresArr[i] == "维修") {
                    $(".authenticateInfo .corporateInfo .pattern .method .service").addClass('select');
                }
                if (featuresArr[i] == "其他") {
                    $(".authenticateInfo .corporateInfo .pattern .method .other").addClass('select');
                }
            }
        } else {

            $('.authenticateInfo .userType .enterprise').removeClass('select');
            $(".authenticateInfo .userType .personal").addClass('select');
            $('.authenticateInfo .corporateInfo').css('display', 'none');
            $('.authenticateInfo .personalInfo').css('display', 'block');

            $('.authenticateInfo .personalInfo .basicInfo .fullName').val(userData[0].name); //名字
            $('.authenticateInfo .personalInfo .basicInfo .idCard').val(userData[0].idNumber); //身份证号
            $('.authenticateInfo .personalInfo .contactInfo .cellphone').val(userData[0].contactPhone); //手机号
            $('.authenticateInfo .personalInfo .contactInfo .contactAdd').val(userData[0].address); //联系地址
            $('.authenticateInfo .personalInfo .contactInfo .postbox').val(userData[0].email); //邮箱
            $('.authenticateInfo .personalInfo .contactInfo .tencent').val(userData[0].qq); //qq
            $('.authenticateInfo .personalInfo .contactInfo .letter').val(userData[0].wechat); //微信
            $('.authenticateInfo .personalInfo .pesalAccount .names').val(userData[0].accountName); //户名
            $('.authenticateInfo .personalInfo .pesalAccount .banks').val(userData[0].accountPlace), //开户银行
                $('.authenticateInfo .personalInfo .pesalAccount .accounts').val(userData[0].accountNo); //账号
            $('.authenticateInfo .personalInfo .introduction .substance').val(userData[0].introduction); //自我介绍
            var featuresArr = userData[0].features;
            for (var i = 0; i < featuresArr.length; i++) {
                if (featuresArr[i] == "商务") {

                    $(".authenticateInfo .personalInfo .specialty .oneself .business").addClass('select');
                }
                if (featuresArr[i] == "OEM") {

                    $(".authenticateInfo .personalInfo .specialty .oneself .OME").addClass('select');
                }
                if (featuresArr[i] == "技术") {
                    $(".authenticateInfo .personalInfo .specialty .oneself .technology").addClass('select');
                }
                if (featuresArr[i] == "项目") {
                    $(".authenticateInfo .personalInfo .specialty .oneself .project").addClass('select');
                }
                if (featuresArr[i] == "维修") {
                    $(".authenticateInfo .personalInfo .specialty .oneself .service").addClass('select');
                }
                if (featuresArr[i] == "其他") {
                    $(".authenticateInfo .personalInfo .specialty .oneself .other").addClass('select');
                }
            }

        }
    }


    //返回按钮 至个人信息页面
    $('.authenticateInfo .withdraw').click(function() {
        FlowRouter.go('/personalPage');
    });

    //选择企业认证
    $('.authenticateInfo .userType .enterprise').click(function() {
        if (!userData[0].type) {
            $('.authenticateInfo .userType .personal').removeClass('select');
            $(this).addClass('select');
            $('.authenticateInfo .personalInfo').css('display', 'none');
            $('.authenticateInfo .corporateInfo').css('display', 'block');
        }

    });
    //选择个人认证
    $('.authenticateInfo .userType .personal').click(function() {
        if (!userData[0].type) {
            $('.authenticateInfo .userType .enterprise').removeClass('select');
            $(this).addClass('select');
            $('.authenticateInfo .corporateInfo').css('display', 'none');
            $('.authenticateInfo .personalInfo').css('display', 'block');
        }

    });
    // 选择公司销售主要模式
    $('.authenticateInfo .corporateInfo .pattern .method div').click(function() {

        if (!userData[0].type) {
            if ($(this).hasClass("select")) {
                $(this).removeClass('select');
            } else {
                $(this).addClass('select');
            }
        }

    });
    //选择个人特长
    $('.authenticateInfo .personalInfo .specialty .oneself div').click(function() {
        if (!userData[0].type) {
            if ($(this).hasClass("select")) {
                $(this).removeClass('select');
            } else {
                $(this).addClass('select');
            }
        }

    });
    //企业点击认证
    $('.authenticateInfo .corporateInfo .firmAttest').click(function() {
        if ($('.authenticateInfo .corporateInfo .infoUnit .unit').val() === "") {
            Utility.alertMsg("单位名称不能为空!");
            return;
        }
        if ($('.authenticateInfo .corporateInfo .infoUnit .license').val() === "") {
            Utility.alertMsg("税务登记号/营业执照不能为空");
            return;
        }
        // if ($('.authenticateInfo .corporateInfo .introduction .preface').val() === "") {
        //     alert('公司简介不能为空');
        //     return;
        // }
        if ($('.authenticateInfo .corporateInfo .introduction .landline').val() === "") {
            Utility.alertMsg("座机不能为空!");
            return;
        }
        if ($('.authenticateInfo .corporateInfo .introduction .fax').val() === "") {
            Utility.alertMsg("传真不能为空!");
            return;
        }
        // if ($('.authenticateInfo .corporateInfo .account .name').val() === "") {
        //     alert('户名不能为空');
        //     return;
        // }
        // if ($('.authenticateInfo .corporateInfo .account .bank').val() === "") {
        //     alert('开户行不能为空');
        //     return;
        // }
        // if ($('.authenticateInfo .corporateInfo .account .account').val() === "") {
        //     alert('帐号不能为空');
        //     return;
        // }
        if ($('.authenticateInfo .corporateInfo .account .address').val() === "") {
            Utility.alertMsg("单位地址不能为空!");
            return;
        }
        if ($('.authenticateInfo .corporateInfo .headman .principal').val() === "") {
            Utility.alertMsg("负责人不能为空!");
            return;
        }
        // if ($('.authenticateInfo .corporateInfo .headman .beeline').val() === "") {
        //     alert('直线不能为空');
        //     return;
        // }
        if ($('.authenticateInfo .corporateInfo .headman .phone').val() === "") {
            Utility.alertMsg("手机号码不能为空!");
            return;
        }
        // if ($('.authenticateInfo .corporateInfo .headman .mailbox').val() === "") {
        //     alert('邮箱不能为空');
        //     return;
        // }
        // if ($('.authenticateInfo .corporateInfo .headman .QQ').val() === "") {
        //     alert('QQ不能为空');
        //     return;
        // }
        if ($('.authenticateInfo .corporateInfo .headman .weChat').val() === "") {
            Utility.alertMsg("微信不能为空!");
            return;
        }
        if ($('.authenticateInfo .corporateInfo .pattern .method div').hasClass('select') === false) {
            Utility.alertMsg("公司销售主营模式最少要选一项!");
            return;
        }

        /* 申请认证*/

        var userId = Meteor.userId();

        var unit = $('.authenticateInfo .corporateInfo .infoUnit .unit').val(), //单位名称
            license = $('.authenticateInfo .corporateInfo .infoUnit .license').val(), //税务登记号/营业执照
            preface = $('.authenticateInfo .corporateInfo .introduction .preface').val(), //公司简介
            landline = $('.authenticateInfo .corporateInfo .introduction .landline').val(), //座机
            fax = $('.authenticateInfo .corporateInfo .introduction .fax').val(), //传真
            accountName = $('.authenticateInfo .corporateInfo .account .name').val(), //户名
            bank = $('.authenticateInfo .corporateInfo .account .bank').val(), //开户行
            account = $('.authenticateInfo .corporateInfo .account .account').val(), //账号
            address = $('.authenticateInfo .corporateInfo .account .address').val(), //单位地址
            principal = $('.authenticateInfo .corporateInfo .headman .principal').val(), //负责人
            beeline = $('.authenticateInfo .corporateInfo .headman .beeline').val(), //直线
            phone = $('.authenticateInfo .corporateInfo .headman .phone').val(), //手机号码
            mailbox = $('.authenticateInfo .corporateInfo .headman .mailbox').val(), //邮箱
            qq = $('.authenticateInfo .corporateInfo .headman .QQ').val(), //qq
            wechat = $('.authenticateInfo .corporateInfo .headman .weChat').val(), //微信
            certificate = $('.authenticateInfo .corporateInfo .otherInfo .certificate').val(), //代理证书编号
            features = []; //公司销售主营模式


        for (var i = 1; i < $('.select').length; i++) {
            features.push($('.select').eq(i).html());
        }

        if (userData[0].type) {

            var data = {
                selector: { userId: userId },
                modifier: {
                    name: unit,
                    registrationNo: license,
                    companyIntroduction: preface,
                    landLine: landline,
                    fax: fax,
                    accountName: accountName,
                    accountPlace: bank,
                    accountNo: account,
                    companyAddress: address,
                    principalName: principal,
                    principalPhone: phone,
                    email: mailbox,
                    qq: qq,
                    wechat: wechat,
                    licenseNo: certificate,
                    features: features
                }
            };

            Meteor.call('updateUserAuthenticate', data, function(err, result) {
                if (!err) {
                    FlowRouter.go('/personalPage');
                }else{
                    return Utility.alertMsg("修改信息失败!");
                }
            });

        } else {

            var createUserNoSelectorData = {
                selector: {
                    type: "企业",
                    identifyStatus: { $ne: '未认证' }
                },
                options: { sort: { timestamp: -1 } }
            };
            Meteor.call("createUserNo", createUserNoSelectorData, function(err, result) {

                var userNoStr = "QY" + result;
                var data = {
                    selector: { userId: userId },
                    modifier: {
                        type: "企业",
                        name: unit,
                        registrationNo: license,
                        companyIntroduction: preface,
                        landLine: landline,
                        fax: fax,
                        accountName: accountName,
                        accountPlace: bank,
                        accountNo: account,
                        companyAddress: address,
                        principalName: principal,
                        principalPhone: phone,
                        email: mailbox,
                        qq: qq,
                        wechat: wechat,
                        licenseNo: certificate,
                        features: features,
                        userNo: userNoStr,
                        identifyStatus: "待认证"

                    }
                };

                Meteor.call('updateUserAuthenticate', data, function(err, result) {
                    if (!err) {

                        var addressData = {
                            userId: userData[0].userId,
                            receiver: principal,
                            contactPhone: parseInt(phone),
                            area: " ",
                            address: address
                        };
                        Meteor.call('insertAddress', addressData, function(err, result) {


                            if (!err) {
                                FlowRouter.go('/personalPage');
                            } else {
                                console.log(err);
                                 return Utility.alertMsg("提交认证失败!");
                            }

                        });

                    }
                });

            });

        }

    });
    //个人特长认证
    $('.authenticateInfo .personalInfo .personalAttest').click(function() {
        if ($('.authenticateInfo .personalInfo .basicInfo .fullName').val() === "") {
            Utility.alertMsg("姓名不能为空!");
            return;
        }
        if ($('.authenticateInfo .personalInfo .contactInfo .cellphone').val() === "") {
            Utility.alertMsg("手机号不能为空!");
            return;
        }
        if ($('.authenticateInfo .personalInfo .contactInfo .contactAdd').val() === "") {
            Utility.alertMsg("联系地址不能为空!");
            return;
        }
        if ($('.authenticateInfo .personalInfo .contactInfo .letter').val() === "") {
            Utility.alertMsg("微信不能为空!");
            return;
        }
        if ($('.authenticateInfo .personalInfo .specialty .oneself div').hasClass('select') === false) {
            Utility.alertMsg("个人特长最少选一项!");
            return;
        }


        /* 申请认证*/
        var userId = Meteor.userId();

        var fullName = $('.authenticateInfo .personalInfo .basicInfo .fullName').val(), //名字
            idCard = $('.authenticateInfo .personalInfo .basicInfo .idCard').val(), //身份证号
            cellphone = $('.authenticateInfo .personalInfo .contactInfo .cellphone').val(), //手机号
            contactAdd = $('.authenticateInfo .personalInfo .contactInfo .contactAdd').val(), //联系地址
            postbox = $('.authenticateInfo .personalInfo .contactInfo .postbox').val(), //邮箱
            qq = $('.authenticateInfo .personalInfo .contactInfo .tencent').val(), //qq
            wechat = $('.authenticateInfo .personalInfo .contactInfo .letter').val(), //微信
            names = $('.authenticateInfo .personalInfo .pesalAccount .names').val(), //户名
            banks = $('.authenticateInfo .personalInfo .pesalAccount .banks').val(), //开户银行
            accounts = $('.authenticateInfo .personalInfo .pesalAccount .accounts').val(), //账号
            substance = $('.authenticateInfo .personalInfo .introduction .substance').val(), //自我介绍
            features = [];


        for (var i = 1; i < $('.select').length; i++) {
            features.push($('.select').eq(i).html());
        }


        if (userData[0].type) {
            var data = {
                selector: { userId: userId },
                modifier: {
                    idNumber: idCard,
                    name: fullName,
                    contactPhone: cellphone,
                    address: contactAdd,
                    email: postbox,
                    qq: qq,
                    wechat: wechat,
                    accountName: names,
                    accountNo: accounts,
                    accountPlace: banks,
                    introduction: substance,
                    features: features

                }
            };

            Meteor.call('updateUserAuthenticate', data, function(err, result) {
                if (!err) {
                    FlowRouter.go('/personalPage');
                }else{
                    return Utility.alertMsg("修改信息失败!");
                }
            });

        } else {
            var createUserNoSelectorData = {
                selector: {
                    type: "个人",
                    identifyStatus: { $ne: '未认证' }
                },
                options: { sort: { timestamp: -1 } }
            };
            Meteor.call("createUserNo", createUserNoSelectorData, function(err, result) {

                var userNoStr = "GR" + result;

                var userId = Meteor.userId();


                var data = {
                    selector: { userId: userId },
                    modifier: {
                        type: "个人",
                        idNumber: idCard,
                        name: fullName,
                        contactPhone: cellphone,
                        address: contactAdd,
                        email: postbox,
                        qq: qq,
                        wechat: wechat,
                        accountName: names,
                        accountNo: accounts,
                        accountPlace: banks,
                        introduction: substance,
                        features: features,
                        userNo: userNoStr,
                        identifyStatus: "待认证"

                    }
                };

                Meteor.call('updateUserAuthenticate', data, function(err, result) {
                    if (!err) {

                        var addressData = {
                            userId: userData[0].userId,
                            receiver: fullName,
                            contactPhone: parseInt(cellphone),
                            area: " ",
                            address: contactAdd
                        };
                        Meteor.call('insertAddress', addressData, function(err, result) {



                            if (!err) {
                                FlowRouter.go('/personalPage');
                            } else {
                                console.log(err);
                                return Utility.alertMsg("提交认证失败!");
                            }

                        });


                    }
                });

            });
        }

    });
});
