/**
 * 新增收获地址板块逻辑以及动画
 *
 * @author  Vivian Yang
 * @review
 */

Template.addAddress.onRendered(function() {


    //返回按钮

    $('#returnMyAddress').click(function() {

        var userId = Meteor.userId(), //用户id
            receiver = $('#consignee').val(),
            contactPhone = parseInt($('#tel').val()), //联系电话
            area = $('#province').val(), //省市区
            address = $('#detailedAddress').val(), //详细地址
            data = {
                userId: userId,
                receiver: receiver,
                contactPhone: contactPhone,
                area: area,
                address: address
            };
        if (receiver != "" && contactPhone != "" && area != "" && address != "") {
            var result = confirm('是否保存当前所填信息？');
            if (result) {
                Meteor.call('insertAddress', data, function(err, result) {
                    console.log(err);
                    if (!err) {
                         // Utility.alertMsg("保存地址成功 ！");
                        
                            // 跳转回首页
                            FlowRouter.go('/addressList');
                    } else if (err) {
                        Utility.alertMsg("保存地址失败 ！");
                    }
                });
            } else {
               
                    // 跳转回首页
                    FlowRouter.go('/addressList');
            }
        } else {
            
                // 跳转回首页
                FlowRouter.go('/addressList');
        }



    });

    //点击新增地址
    $('.addAddress .action .button.primary').click(function() {
        var userId = Meteor.userId(), //用户id
            receiver = $('#consignee').val(), //收货地址
            contactPhone = parseInt($('#tel').val()), //联系电话
            area = $('#province').val(), //省市区
            address = $('#detailedAddress').val(), //详细地址
            data = {
                userId: userId,
                receiver: receiver,
                contactPhone: contactPhone,
                area: area,
                address: address
            }
        if (userId !== '') {
            if (receiver !== '') {
                if (contactPhone !== '' && /^1[345678][0-9]{9}$/.test(contactPhone)) {
                    if (area !== '') {
                        if (address !== '') {
                            Meteor.call('insertAddress', data, function(err, result) {
                                console.log(err);
                                if (!err) {
                                    // Utility.alertMsg("保存成功!");
                                    if (FlowRouter.current().oldRoute) {
                                        // 跳转回原来的页面
                                        FlowRouter.go(FlowRouter.current().oldRoute.path);
                                    } else {
                                        // 跳转回首页
                                        FlowRouter.go('/addressList');
                                    }
                                } else if (err) {
                                    Utility.alertMsg("保存失败!");
                                }
                            });
                        } else {
                            Utility.alertMsg("地址不能为空!");
                        }
                    } else {
                        Utility.alertMsg("请选择您所在的省！");
                    }
                } else {
                    Utility.alertMsg("联系电话格式不正确!");
                }
            } else {
                Utility.alertMsg("收件人不能为空!");
            }
        } else {
            Utility.alertMsg("请先登录!");
            FlowRouter.go('/login');
        }


    });

    //获得详细地址框的焦点
    $('.addAddress textarea').keydown(function(event) {
        /* Act on the event */
        $('.addAddress textarea').attr('placeholder', '');
        if (event.keyCode == 8) {
            if ($('.addAddress textarea').val().length == 1) {
                $('.addAddress textarea').attr('placeholder', '详细地址');
            }
            if ($('.addAddress textarea').val().length == 0) {
                $('.addAddress textarea').attr('placeholder', '详细地址');
            }
        }

    });

});
