//同意合同UI显示
Template.purchaseContract.onRendered(function() {
    $('.contractDetails .provision .electoral').click(function() {
        // 点击是否同意条款
        var src = $(this).attr('src');
        if (src === "/purchaseContract/elect2.png") {
            $(this).attr('src', '/purchaseContract/elect1.png');
            //是
            $(this).closest('.provision').addClass('selected');
        } else {
            //否
            $(this).attr('src', '/purchaseContract/elect2.png');
            $(this).closest('.provision').removeClass('selected');
        }
    });

    $('.shoppingTrolley').click(function() {
        FlowRouter.go('/shoppingTrolley');
    });

    //说明扩展按钮点击
    $(".contractDetails .explanation .explanationText").click(function() {

        if ($(".contractDetails .explanation .explanationText span").hasClass('close')) {

            $(".contractDetails .explanation .explanationDetailText").css("display", "block");
            $(".contractDetails .explanation .explanationText span").removeClass('close');

            $(".contractDetails .explanation .explanationText span").addClass('open');


        } else {
            $(".contractDetails .explanation .explanationText span").removeClass('open');
            $(".contractDetails .explanation .explanationText span").addClass('close');
            $(".contractDetails .explanation .explanationDetailText").css("display", "none");
        }


    })

    //卖方详细信息扩展
    $(".contractDetails .sellerInfo h3 ").click(function() {

        if ($(".contractDetails .sellerInfo h3 span").hasClass('close')) {
            $(".contractDetails .sellerInfo .sellerInfoDetail").css("display", "block");
            $(".contractDetails .sellerInfo h3 span").removeClass('close');
            $(".contractDetails .sellerInfo h3 span").addClass('open');

        } else {
            $(".contractDetails .sellerInfo h3 span").removeClass('open');
            $(".contractDetails .sellerInfo h3 span").addClass('close');
            $(".contractDetails .sellerInfo .sellerInfoDetail").css("display", "none");
        }

    })

    var userId = Meteor.userId();
    var userData = { selector: { userId: userId, isRemoved: { $ne: true } }, options: { sort: { timestamp: -1 } } };
    Meteor.call('getUserInfo', userData, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }

        //保存用户信息

        Session.set("contractDetailsUser", result[0]);
        if (!Session.get("isUseSessionData")) {

            if (result[0].type == "企业") {

                var formJson = {
                    //表单
                    companyName: result[0].name,
                    companyAddress: result[0].companyAddress,
                    agent: result[0].principalName,
                    phone: result[0].landLine,
                    fax: result[0].fax,
                    taxId: result[0].registrationNo,
                    accountPlace: result[0].accountPlace,
                    accountNo: result[0].accountNo,
                }

                Session.set("formInfo", formJson);

                var info = {};
                info.name = result[0].principalName;
                info.phone = result[0].principalPhone;
                info.address = result[0].companyAddress;
                Session.set("currentAddress", info);
            } else {

                var formJson = {
                    //表单
                    companyName: result[0].name,
                    companyAddress: result[0].address,
                    agent: result[0].name,
                    phone: result[0].contactPhone,
                    fax: "",
                    taxId: "",
                    accountPlace: result[0].accountPlace,
                    accountNo: result[0].accountNo,
                }

                Session.set("formInfo", formJson);

                var info = {};
                info.name = result[0].name;
                info.phone = result[0].contactPhone;
                info.address = result[0].address;
                Session.set("currentAddress", info);
            }
        }

    });

    var createContractId = Session.get('contractId');
    $(".createContractId").text(createContractId);




    var data = { selector: { contractNo: createContractId }, options: { sort: { timestamp: -1 } } };

    Meteor.call('getContractByContractNo', data, function(err, result) {

        if (err) {
            console.log(err);
            return err;
        }
        if (result.companyName) {
            $(".contractDetails .contractInfo .buyer .patron").text(result.companyName);
        }
        if (result.timestamp) {
            var nowDate = new Date(result.timestamp);
            var datetext = nowDate.getFullYear() + "年" + (nowDate.getMonth() + 1) + "月" + nowDate.getDate() + "日";
            $(".signingWhile").first().text(datetext);

        } else {
            var nowDate = new Date();
            var datetext = nowDate.getFullYear() + "年" + (nowDate.getMonth() + 1) + "月" + nowDate.getDate() + "日";
            $(".signingWhile").first().text(datetext);
        }

        if (result.express) {
            $('.contractDetails .express').text("物流信息：" + result.express);
        } else {
            $('.contractDetails .express').hide();
        }


        if (!Session.get("isUseSessionData")) {

            if (result.companyName) {
                var formJson = {
                    //表单
                    companyName: result.companyName,
                    companyAddress: result.companyAddress,
                    agent: result.agent,
                    phone: result.phone,
                    fax: result.fax,
                    taxId: result.taxId,
                    accountPlace: result.accountPlace,
                    accountNo: result.accountNo,
                }

                Session.set("formInfo", formJson);
            }

            if (result.receiver) {

                var info = {};
                info.name = result.receiver;
                info.phone = result.receivePhone;
                info.address = result.receiveAddress;
                Session.set("currentAddress", info);

            }

        }

        if (result.contractStatus != "编辑") {
            $('#supplementForm input').attr("disabled", "disabled");
            $('.contractDetails .deliveryInfo').css('border-bottom-style', 'none');
            $('.contractDetails .deliveryInfo .receipt').hide();
            $('.contractDetails .provision').hide();
            $('.contractDetails .agreeParent').hide();
            $('.contractDetails').css('height', '30rem');
        }
        Session.set('goodsList', result.goodsList);

    });




    $(".withdraw").click(function(event) {

        Session.set("isUseSessionData", false);

        if (FlowRouter.current().oldRoute) {
            // 跳转回原来的页面
            FlowRouter.go(FlowRouter.current().oldRoute.path);
        } else {
            // 跳转回个人中心
            FlowRouter.go('/personalPage');
        }

    });

    //点击会员说明
    $("#memberDescription").click(function() {
        $('.contractDetails .memberDescContainer').css('display', 'block');
    });

    //关闭会员说明
    $('.contractDetails .memberDescContainer .successAlert .innerArea .button').click(function() {
        $('.contractDetails .memberDescContainer').css('display', 'none');
    })

    // 点击同意合同
    $('.contractDetails .agree').click(function() {
        var src = $('.contractDetails .provision img').attr('src');
        var contractDetailsUser = Session.get("contractDetailsUser");
        if ($('input[name=name]').val() === "") {
            Utility.alertMsg("单位名称不能为空");
            return;
        }
        if ($('input[name=address]').val() === "") {
            Utility.alertMsg("单位地址不能为空");
            return;
        }
        if ($('input[name=agent]').val() === "") {
            Utility.alertMsg("委托代理人不能为空");
            return;
        }
        if ($('input[name=phone]').val() === "") {
            Utility.alertMsg("电话不能为空");
            return;
        }
        // if ($('input[name=fax]').val() === "") {
        //     alert('传真不能为空');
        //     return;
        // }
        if (contractDetailsUser.type == "企业") {
            if ($('input[name=taxId]').val() === "") {
                Utility.alertMsg("税号不能为空");
                return;
            }
        }

        if ($('input[name=accountPlace]').val() === "") {
            Utility.alertMsg("开户银行不能为空");
            return;
        }
        if ($('input[name=account]').val() === "") {
            Utility.alertMsg("账号不能为空");
            return;
        }
        if (src === "/purchaseContract/elect2.png") {
            Utility.alertMsg("必须同意遵守条款才能同意进入下一步");
            return;
        }

        //提交表单数据    
        if ($(".contractDetails .provision").first().hasClass('selected')) {

            if (!Session.get("currentAddress").name) {
                Utility.alertMsg("必须选择收货地址");
                return false;
            } else {
                var IdArr = [];
                var product = Session.get("goodsList").product;
                _.each(product, function(element, index) {
                    IdArr.push(element._id);
                    // console.log(element._id);
                });
                // console.log(IdArr);
                var form = $('#supplementForm')[0];
                var formJson = {
                        //表单
                        companyName: form.name.value,
                        companyAddress: form.address.value,
                        agent: form.agent.value,
                        phone: form.phone.value,
                        fax: form.fax.value,
                        taxId: form.taxId.value,
                        accountPlace: form.accountPlace.value,
                        accountNo: form.account.value,
                        //地址
                        receiver: Session.get("currentAddress").name,
                        receivePhone: Session.get("currentAddress").phone,
                        receiveAddress: Session.get("currentAddress").address,

                        //tradeId
                        // tradeIdArr: IdArr,
                        // userId: Meteor.userId(),
                        // contractNo: createContractId,
                        contractStatus: "待审核"
                    }
                    //console.log(formJson);
                var contractData = {
                    selector: { contractNo: createContractId },
                    modifier: {
                        companyName: form.name.value,
                        companyAddress: form.address.value,
                        agent: form.agent.value,
                        phone: form.phone.value,
                        fax: form.fax.value,
                        taxId: form.taxId.value,
                        accountPlace: form.accountPlace.value,
                        accountNo: form.account.value,
                        //地址
                        receiver: Session.get("currentAddress").name,
                        receivePhone: Session.get("currentAddress").phone,
                        receiveAddress: Session.get("currentAddress").address,
                        isRead: false,
                        contractStatus: "待审核"
                    }
                }

                Meteor.call('updateContract', contractData, function(err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    Session.set("isUseSessionData", false);

                    $('.contractDetails .purchaseAlertContainer').css("display", "block");

                    $("#purchaseAlertSave").click(function() {
                        $('.contractDetails .purchaseAlertContainer').css("display", "none");
                        FlowRouter.go('/myContract');
                        // FlowRouter.go('/customService');
                    });

                    $("#purchaseAlertCancle").click(function() {
                        $('.contractDetails .purchaseAlertContainer').css("display", "none");
                        FlowRouter.go('/myContract');
                    });

                });
            }
        } else {
            Utility.alertMsg("必须同意协议");
            return false;
        }

    });
    //点击选择收货地址
    $('.contractDetails .deliveryInfo .receipt').click(function() {
        var form = $('#supplementForm')[0];
        var formJson = {
                //表单
                companyName: form.name.value,
                companyAddress: form.address.value,
                agent: form.agent.value,
                phone: form.phone.value,
                fax: form.fax.value,
                taxId: form.taxId.value,
                accountPlace: form.accountPlace.value,
                accountNo: form.account.value,
            }
            //console.log(formJson);
        Session.set("formInfo", formJson);
        Session.set("isUseSessionData", true);
        FlowRouter.go('/selectAddress');
    });
});

//显示产品信息
Template.purchaseContract.helpers({
        "goodsList": function() {
            //return goodsList;
            return Session.get("goodsList") || "";
        },
        "currentAddress": function() {
            return Session.get("currentAddress") || "";
        },
        "formInfo": function() {
            return Session.get("formInfo") || "";
        }

    })
    //大写数字
    //壹贰叁肆伍陆柒捌玖拾佰仟万
UI.registerHelper("amountCn", function(n) {
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
        return "****";
    var unit = "仟佰拾亿仟佰拾万仟佰拾元角分",
        str = "";
    n += "00";
    var p = n.indexOf('.');
    if (p >= 0)
        n = n.substring(0, p) + n.substr(p + 1, 2);
    unit = unit.substr(unit.length - n.length);
    for (var i = 0; i < n.length; i++)
        str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
    return str.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
});
