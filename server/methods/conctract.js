//生成合同
new ValidatedMethod({
    name: 'insertContract',
    validate: Contract.schema.validator(),
    run: function(data) {
        data.timestamp = Date.now();
        //console.log(data);
        return Contract.insert(data);
    }
});

//修改合同
new ValidatedMethod({
    name: 'updateContract',
    validate: new SimpleSchema({
        selector: {
            type: Object,
            blackbox: true
        },
        modifier: {
            type: Object,
            blackbox: true
        }

    }).validator(),
    run: function(data) {
        var self = this;
        Contract.update(data.selector, { $set: data.modifier });
        return true;
    }
});

//生成订单编号
new ValidatedMethod({
    name: "createContractId",
    validate: null,
    run: function() {
        var self = this;
        var count = Contract.find().count() + 1 + "";
        count = '0000'.substr(0, 4 - count.length) + count;

        var nowDate = new Date();
        var currentMonth = nowDate.getMonth() + 1 + "";
        currentMonth = '00'.substr(0, 2 - currentMonth.length) + currentMonth;
        var currentDate = nowDate.getDate() + "";
        currentDate = '00'.substr(0, 2 - currentDate.length) + currentDate;
        var datetext = "" + nowDate.getFullYear() + currentMonth + currentDate;

        var ContractId = "GC" + datetext + count;
        return ContractId;
    }
})

//根据合同编号查找合同详情
new ValidatedMethod({
    name: 'getContractByContractNo',
    validate: new SimpleSchema({
        selector: {
            type: Object,
            blackbox: true
        },
        options: {
            type: Object,
            blackbox: true
        }
    }).validator(),
    run: function(data) {
        var self = this;
        if (!data.options) {
            data.options = {};
        }
        if (!data.selector) {
            data.selector = {};
        }
        var contractDetailData = Contract.find(data.selector, data.options).fetch();
        var productList = [];
        var totalPrice = 0;
        var result = null;

        if (Contract.find(data.selector, data.options).count() != 0) {

            var userId = contractDetailData[0].userId,
                userParams = { selector: { userId: userId, isRemoved: { $ne: true } }, options: { sort: { timestamp: -1 } } };
            var userData = UserInfo.find(userParams.selector, userParams.options).fetch();
            var tradeIdArray = contractDetailData[0].tradeIdArr;
            for (var i = 0; i < tradeIdArray.length; i++) {
                var tradeParam = { selector: { _id: tradeIdArray[i] }, options: { sort: { timestamp: -1 } } };
                var tradeItem = Trade.find(tradeParam.selector, tradeParam.options).fetch();

                if (Trade.find(tradeParam.selector, tradeParam.options).count() != 0) {
                    var productParam = { selector: { _id: tradeItem[0].productId }, options: { sort: { timestamp: -1 } } }
                    var productItem = Product.findOne(productParam.selector, productParam.options);
                    if (Product.find(productParam.selector, productParam.options).count() != 0) {

                        var finalPriceValue;

                        if (userData[0].level == "普通会员") {

                            if (userData[0].showArrange) {

                                var specificationData = { selector: { specification: productItem.specification, isRemoved: { $ne: true } }, options: {} };
                                var minPrice = Product.findOne(specificationData.selector, { skip: 0, limit: 1, sort: { price: 1 } }).price,
                                    maxPrice = Product.findOne(specificationData.selector, { skip: 0, limit: 1, sort: { price: -1 } }).price;
                                if (minPrice == maxPrice) {
                                    maxPrice = (maxPrice * 1.1).toFixed(2);
                                }
                                finalPriceValue = minPrice + "~" + maxPrice;
                            } else {

                                finalPriceValue = "*";
                            }
                        } else {

                            finalPriceValue = productItem.finalPrice;
                        }
                        var productListItem = {
                            picUrl: productItem.productImgArr[0],
                            productName: productItem.productName,
                            specification: productItem.specification,
                            brand: productItem.brand,
                            finalPrice: finalPriceValue,
                            num: tradeItem[0].num
                        };

                        productList.push(productListItem);
                        totalPrice = totalPrice + productItem.finalPrice * tradeItem[0].num;

                    }

                }
            }

            if (userData[0].level == "普通会员") {
                totalPrice = "*";
            }
            var goodsList = {
                product: productList,
                totalPrice: totalPrice
            };


            result = {
                companyName: contractDetailData[0].companyName,
                companyAddress: contractDetailData[0].companyAddress,
                agent: contractDetailData[0].agent,
                phone: contractDetailData[0].phone,
                fax: contractDetailData[0].fax,
                taxId: contractDetailData[0].taxId,
                accountPlace: contractDetailData[0].accountPlace,
                accountNo: contractDetailData[0].accountNo,
                receiver: contractDetailData[0].receiver,
                receivePhone: contractDetailData[0].receivePhone,
                receiveAddress: contractDetailData[0].receiveAddress,
                timestamp: contractDetailData[0].timestamp,
                contractStatus: contractDetailData[0].contractStatus,
                express: contractDetailData[0].express,
                goodsList: goodsList
            };
        }
        return result;
    }
});
//订阅我的合同列表
new ValidatedMethod({
    name: 'getMyContract',
    validate: new SimpleSchema({
        selector: {
            type: Object,
            blackbox: true
        },
        options: {
            type: Object,
            blackbox: true
        }
    }).validator(),
    run: function(data) {
        var self = this;
        if (!data.options) {
            data.options = {};
        }
        if (!data.selector) {
            data.selector = {};
        }


        var contractData = Contract.find(data.selector, data.options).fetch();

        var showContractData = [];

        if (Contract.find(data.selector, data.options).count() > 0) {

            var  userParams = { selector: { userId: data.selector.userId, isRemoved: { $ne: true } }, options: { sort: { timestamp: -1 } } };
             
            var userData = UserInfo.find(userParams.selector, userParams.options).fetch();
            for (var i = 0; i < contractData.length; i++) {
                var tradeParam = { selector: { _id: contractData[i].tradeIdArr[0] }, options: { sort: { timestamp: -1 } } };
                var tradeItem = Trade.find(tradeParam.selector, tradeParam.options).fetch();
                if (Trade.find(tradeParam.selector, tradeParam.options).count() != 0) {
                    var productParam = { selector: { _id: tradeItem[0].productId }, options: { sort: { timestamp: -1 } } };



                    var productItem = Product.findOne(productParam.selector, productParam.options);



                    if (Product.find(productParam.selector, productParam.options).count() != 0) {
                        var finalPriceValue;

                        if (userData[0].level == "普通会员") {

                            finalPriceValue = "****";

                            // if (userData[0].showArrange) {

                            //     var specificationData = { selector: { specification: productItem.specification, isRemoved: { $ne: true } }, options: {} };
                            //     var minPrice = Product.findOne(specificationData.selector, { skip: 0, limit: 1, sort: { price: 1 } }).price,
                            //         maxPrice = Product.findOne(specificationData.selector, { skip: 0, limit: 1, sort: { price: -1 } }).price;
                            //     if (minPrice == maxPrice) {
                            //         maxPrice = (maxPrice * 1.1).toFixed(2);
                            //     }
                            //     finalPriceValue = minPrice + "~" + maxPrice;
                            // } else {

                            //     finalPriceValue = "*";
                            // }
                        } else {

                            finalPriceValue = contractData[i].total;
                        }

                        var showContractItem = {
                            productImgSrc: productItem.productImgArr[0],
                            productName: productItem.productName,
                            specification: productItem.specification,
                            contractId: contractData[i].contractNo,
                            timestamp: contractData[i].timestamp,
                            price: finalPriceValue,
                            number: tradeItem[0].num,
                            contractStatus: contractData[i].contractStatus,
                            express: contractData[i].express
                        };

                        showContractData.push(showContractItem);
                    }

                }

            }

        }

        return showContractData;
       
    }
});

//订阅合同列表
new ValidatedMethod({
    name: 'getMyContractIsTipData',
    validate: new SimpleSchema({
        selector: {
            type: Object,
            blackbox: true
        },
        options: {
            type: Object,
            blackbox: true
        }
    }).validator(),
    run: function(data) {
        var self = this;
        if (!data.options) {
            data.options = {};
        }
        if (!data.selector) {
            data.selector = {};
        }


        var contractData = Contract.find(data.selector, data.options).fetch();

        return contractData;
    }
});
