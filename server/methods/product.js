new ValidatedMethod({
    name: 'insertProduct',
    validate: Product.schema.validator(),
    run: function(data) {
        var self = this;
        data.timestamp = Date.now();
         var modelData=Model.findOne({specification:data.specification});
        if (modelData){
          data.searchTimes=modelData.clickTime;
        }
        return Product.insert(data);
    }
});

//更新我上传的产品
new ValidatedMethod({
    name: 'updateProduct',
    validate: new SimpleSchema({
        _id: {
            type: String
        },
        modifier: {
            type: Object,
            blackbox: true
        }
    }).validator(),
    run: function(data) {
        var self = this;
        var modelData=Model.findOne({specification:data.modifier.specification});
        if (modelData){
          data.modifier.searchTimes=modelData.clickTime;
        }else{
          data.modifier.searchTimes=0;
        }
        Product.update(data._id, { $set: data.modifier });
        return true;
    }
});

//更新搜索次数
new ValidatedMethod({
    name: 'updateProductSearchTimes',
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
        var resultData = Product.findOne(data.selector, data.options);

        var resultAll = Product.find(data.selector, data.options).fetch();
        for (var i = 0; i < resultAll.length; i++) {
            var updateData = {
                selector: { _id: resultAll[i]._id },
                modifier: {
                    searchTimes: resultData.searchTimes + 1,
                }
            };
            Product.update(updateData.selector, { $set: updateData.modifier });
        }



        return true;
    }
});

//订阅我的所有产品
new ValidatedMethod({
    name: 'getProduct',
    validate: new SimpleSchema({
        level: {
            type: String
        },
        isShowArrange: {
            type: Boolean
        },
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

        var productDataThree = [];

        if (data.level == "普通会员" || data.level=="游客") {
            // if (data.isShowArrange) {
                var productData = Product.find(data.selector, { sort: data.options.sort }).fetch();
                var productOne = _.groupBy(productData, function(item) {
                    return item.specification;
                })
                var productDataTwo = [];
                for (key in productOne) {
                    productDataTwo.push(productOne[key][0]);
                }
                var productDataLength = data.options.limit;
                if (productDataTwo.length < data.options.limit) {
                    productDataLength = productDataTwo.length;
                }

               

                for (var i = 0; i < productDataLength; i++) {



                     var storeNumValue=0;
                    _.each(productOne[productDataTwo[i].specification],function(item){
                       storeNumValue=storeNumValue+item.storeNum;
                    })
                    // console.log("库存数量 "+storeNumValue);
                    var specificationData = { selector: { specification: productDataTwo[i].specification, isRemoved: { $ne: true } }, options: {} };
                    var minPrice = Product.findOne(specificationData.selector, { skip: 0, limit: 1, sort: { price: 1 } }).price,
                        maxPrice = Product.findOne(specificationData.selector, { skip: 0, limit: 1, sort: { price: -1 } }).price;
                    if (minPrice == maxPrice) {
                        maxPrice = (maxPrice * 1.1).toFixed(2);
                    }
                    productDataTwo[i].minPrice = minPrice;
                    productDataTwo[i].maxPrice = maxPrice;
                    productDataTwo[i].storeNum=storeNumValue;
                    productDataThree.push(productDataTwo[i]);

                }

                // console.log(productDataThree);
            // } else {
            //      productDataThree = Product.find(data.selector, data.options).fetch();
            // }
        } else {
          productDataThree = Product.find(data.selector, data.options).fetch();
        }

         // var productDataThree = Product.find(data.selector, data.options).fetch();
        return productDataThree;
    }
});

//我上传的产品
new ValidatedMethod({
    name: 'getProductAll',
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

        var productDataThree = Product.find(data.selector, data.options).fetch();


        return productDataThree;
    }
});

//订阅品牌、制造厂商、产品类别
new ValidatedMethod({
    name: 'getProductCategories',
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
        if (!data.selector) {
            data.selector = {};
        }
        return Setting.find(data.selector, data.options).fetch();
    }
});

//通过产品ID查看产品详情
new ValidatedMethod({
    name: 'getProductByProductId',
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

        var productData = Product.findOne(data.selector, data.options);
        var specificationData = { selector: { specification: productData.specification, isRemoved: { $ne: true } }, options: {} };
        var minPrice = Product.findOne(specificationData.selector, { skip: 0, limit: 1, sort: { price: 1 } }).price,
            maxPrice = Product.findOne(specificationData.selector, { skip: 0, limit: 1, sort: { price: -1 } }).price;
        if (minPrice == maxPrice) {
            maxPrice = (maxPrice * 1.1).toFixed(2);
        }
        productData.minPrice = minPrice;
        productData.maxPrice = maxPrice;
        return productData;
    }
});


//根据搜索关键字搜索产品
new ValidatedMethod({
    name: 'getProductListsByKeywords',
    validate: new SimpleSchema({
        level: {
            type: String
        },
        isShowArrange: {
            type: Boolean
        },
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

        self.unblock();
        if (!data.options) {
            data.options = {};
        }
        if (!data.selector) {
            data.selector = {};
        }
        var productDataThree = [];
        if (data.level == "普通会员" || data.level=="游客") {
            // if (data.isShowArrange) {

                var productData = Product.find(data.selector,{sort:data.options.sort}).fetch();
                // console.log(productData);
                var productOne = _.groupBy(productData, function(item) {
                    return item.specification;
                })
                var productDataTwo = [];
                for (key in productOne) {
                    productDataTwo.push(productOne[key][0]);
                }
                var productDataLength = data.options.limit;
                if (productDataTwo.length < data.options.limit) {
                    productDataLength = productDataTwo.length;
                }
                for (var i = 0; i < productDataLength; i++) {

                    var storeNumValue=0;
                    _.each(productOne[productDataTwo[i].specification],function(item){
                       storeNumValue=storeNumValue+item.storeNum;
                    })
                    var specificationData = { selector: { specification: productDataTwo[i].specification, isRemoved: { $ne: true } }, options: {} };
                    var minPrice = Product.findOne(specificationData.selector, { skip: 0, limit: 1, sort: { price: 1 } }).price,
                        maxPrice = Product.findOne(specificationData.selector, { skip: 0, limit: 1, sort: { price: -1 } }).price;
                    if (minPrice == maxPrice) {
                        maxPrice = (maxPrice * 1.1).toFixed(2);
                    }
                    productDataTwo[i].minPrice = minPrice;
                    productDataTwo[i].maxPrice = maxPrice;
                    productDataTwo[i].storeNum=storeNumValue;
                    productDataThree.push(productDataTwo[i]);
                }

                if(_.isEqual(data.options.sort,{timestamp:-1})){
                      productDataThree=_.sortBy(productDataThree,'timestamp');
                      productDataThree=productDataThree.reverse();
                }
                if(_.isEqual(data.options.sort,{searchTimes:-1})){
                    productDataThree=_.sortBy(productDataThree,'searchTimes');
                      productDataThree=productDataThree.reverse();
                }
                if(_.isEqual(data.options.sort,{finalPrice:-1})){
                    productDataThree=_.sortBy(productDataThree,'finalPrice');
                    productDataThree=productDataThree.reverse();
                }
                if(_.isEqual(data.options.sort,{finalPrice:1})){
                    productDataThree=_.sortBy(productDataThree,'finalPrice');
                }

                

            // } else {
            //      productDataThree = Product.find(data.selector, data.options).fetch();
            // }

        } else {
             productDataThree = Product.find(data.selector, data.options).fetch();
        }
        return productDataThree;

    }
});


//返回所有产品中的最高价最低价
new ValidatedMethod({
    name: 'getPriceRange',
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
        var self = this,
            products = null,
            minPrice = 0,
            maxPrice = 0,
            priceRange = [];

        if (!data.selector) {
            data.selector = {};
        }
        products = Product.find(data.selector).fetch();

        if (products.length < 1) {
            priceRange = [];
        } else {
            var minPrice = Product.findOne(data.selector, { skip: 0, limit: 1, sort: { price: 1 } }).price,
                maxPrice = Product.findOne(data.selector, { skip: 0, limit: 1, sort: { price: -1 } }).price;

            priceRange.push(minPrice);
            priceRange.push(maxPrice);
        }
        return priceRange;
    }
});

//获取我的所有产品的数量
new ValidatedMethod({
    name: 'getProductLengthByUserId',
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

        return Product.find(data.selector, data.options).count();
    }
});

new ValidatedMethod({
    name: 'batchUpload',
    validate: new SimpleSchema({
        allData: {
            type: [Object],
            blackbox: true
        }
    }).validator(),
    run: function(data) {
        var self = this,
            all = data.allData,
            modael = null;
        // console.log(all);
        _.each(all, function(item, index) {
            model = Model.findOne({ specification: item.specification });
            if (!model) {
                Model.insert({ specification: item.specification, timestamp: Date.now(), clickTime: 0 });
                item.searchTimes = 0;
            } else {
                item.searchTimes = model.clickTime;
            }
            item.timestamp = Date.now();
            item.productImgArr = [];
            item.finalPrice = parseInt(item.price * 1.05);
            item.isBatch = true;

            Product.insert(item);
        });
        return true;
    }
});

new ValidatedMethod({
    name: 'getProductAndCount',
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
        var self = this,
            all = {};
        if (!data.options) {
            data.options = {};
        }
        if (!data.selector) {
            data.selector = {};
        }
        var productData = Product.find(data.selector, data.options).fetch(),
            allCount = Product.find(data.selector).count(),
            passCount = Product.find({ userId: data.selector.userId, checkStatus: "审核通过" ,isRemoved:{$ne:true}}).count();
        all.productData = productData;
        all.allCount = allCount;
        all.passCount = passCount;

        // for(var i=0;i<productData.length;i++){

        //     var modelData = {
        //         selector: {
        //             specification: productData[i].specification,
        //             isRemove: { $ne: true }
        //         },
        //         options: { sort: { timestamp: -1 } }
        //     };

        //    var modelReturnData=Model.find(modelData.selector, modelData.options).fetch();
        //    productData[i].searchTimes=modelReturnData[0].clickTime;


        // }

        // return Product.find(data.selector, data.options).fetch();
        return all;
    }
});
