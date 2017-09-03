//Select UI
Template.selectAddress.onRendered(function() {
    //选择地址
    //提交地址选项
    $('.withdraw').click(function() {

        var box = $('.selectShippingAdd .deliveryInfo.selected').first();
        //获得收货信息
        var name = box.find('.name').first().text().trim();
        var phone = box.find('.phone').first().text().trim();
        var address = box.find('.address').first().text().trim();

        if (name != "") {

            var info = {};
            info.name = name;
            info.phone = phone;
            info.address = address;

            Session.set("currentAddress", info);

        }

        FlowRouter.go("/purchaseContract")
    });
    //新建地址
    $(".freshAddress").click(function() {
        FlowRouter.go("/addAddress")
    });
    //获取我的收货地址信息
    var userId = Meteor.userId(),
        data = { selector: { userId: userId, isRemoved: { $ne: true } }, options: { sort: { timestamp: -1 } } };

    Meteor.call('getAddress', data, function(err, result) {
        if (!err) {

            var data = {};
            data.addressList = result;
            var template = Blaze.toHTMLWithData(Template.tplDeliveryInfo, data);
            $("#Mount").html(template);
            $(".selectShippingAdd .deliveryInfo").click(function() {
                var src = $(this).children('.electoral').attr('src');
                $(this).siblings().children('.electoral').attr('src', '/purchaseContract/elect2.png');
                $(this).children('.electoral').attr('src', '/purchaseContract/elect1.png');
                $(this).addClass('selected').siblings().removeClass('selected');

                var box = $('.selectShippingAdd .deliveryInfo.selected').first();
                //获得收货信息
                var name = box.find('.name').first().text().trim();
                var phone = box.find('.phone').first().text().trim();
                var address = box.find('.address').first().text().trim();

                var info = {};
                info.name = name;
                info.phone = phone;
                info.address = address;
                Session.set("currentAddress", info);

                setTimeout(function() {
                    FlowRouter.go("/purchaseContract");
                }, 100);

            });
        }
    });


});
