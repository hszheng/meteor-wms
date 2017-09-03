Template.editAddress.onRendered(function() {
    var id = FlowRouter.getParam("_id");
    var data = { selector: { _id: id, isRemoved: { $ne: true } }, options: { sort: { timestamp: -1 } } };


    $('#editAddressReturn').click(function() {
       
            // 跳转回首页
            FlowRouter.go('/addressList');
    });

    Meteor.call('getAddress', data, function(err, result) {
        var data = result[0];
        var form = $("#supplementForm")[0];
        form.name.value = data.receiver;
        form.phone.value = data.contactPhone;
        if(data.area){
           form.area.value = data.area;
        }
        form.address.value = data.address;
    });

      $('#editAddress textarea').keydown(function(event) {
        /* Act on the event */
        $('#editAddress textarea').attr('placeholder', '');
        if (event.keyCode == 8) {
            if ($('#editAddress textarea').val().length == 1) {
                $('#editAddress textarea').attr('placeholder', '详细地址');
            }
            if ($('#editAddress textarea').val().length == 0) {
                $('#editAddress textarea').attr('placeholder', '详细地址');
            }
        }

    });

    //保存
    $(".action .save").click(function() {
            var form = $("#supplementForm")[0];
            var obj = {
                'receiver': form.name.value,
                'contactPhone': form.phone.value,
                'area': form.area.value,
                'address': form.address.value
            };

            if (form.name.value !== '') {
                if (form.phone.value !== '' && /^1[345678][0-9]{9}$/.test(form.phone.value)) {
                    if (form.area.value !== '') {
                        if (form.address.value !== '') {
                            Meteor.call("updateAddress", { id: id, obj: obj }, function(err, result) {
                                if (!err) {
                                    // Utility.alertMsg("保存成功!");
                                    FlowRouter.go('/addressList');
                                } else {
                                    console.log(err);
                                }
                            });
                        } else {
                            Utility.alertMsg("地址不能为空!");
                        }
                    } else {
                        Utility.alertMsg("请输入您所在的省市区!");
                    }
                } else {
                    Utility.alertMsg("联系电话格式不正确!");
                }
            } else {
                Utility.alertMsg("收件人不能为空!");
            }
        

    })
//删除
$(".action .delete").click(function() {
    Meteor.call("deleteAddress", { id: id, }, function(err, result) {
        if (!err) {
            // Utility.alertMsg("删除成功!");
            FlowRouter.go('/addressList');
        } else {
            console.log(err);
        }
    });
})
});
