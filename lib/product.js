Product = new Mongo.Collection('product');
Product.schema = new SimpleSchema({
    userId: {
        type: String,
        label: '用户Id',
        min: 1,
        max: 20,
        optional: true
    },
    userPhone: {
        type: String,
        label: '用户的手机号码',
        min: 1,
        optional: true
    },
    productImgArr: {
        type: [String],
        label: '产品图片',
        min: 1,
        optional: true
    },
    productName: {
        type: String,
        label: '产品名称',
        min: 1,
        optional: true
    },
    timestamp: {
        type: Number,
        label: '时间戳',
        optional: true
    },
    specification: {
        type: String,
        label: '规格型号',
        min: 1,
        optional: true
    },
    unit: {
        type: String,
        label: '单位',
        min: 1,
        optional: true
    },
    storeNum: {
        type: Number,
        label: '库存数量',
        min: 1,
        optional: true
    },
    brand: {
        type: String,
        label: '品牌',
        min: 1,
        optional: true
    },
    productCateory: {
        type: String,
        label: '产品类别',
        min: 1,
        optional: true
    },
    price: {
        type: Number,
        label: '价格',
        min: 1,
        optional: true
    },
    finalPrice: {
        type: Number,
        label: '后台价格',
        min: 1,
        optional: true
    },
    minPrice: {
        type: Number,
        label: '最低价',
        min: 1,
        optional: true
    },
    maxPrice: {
        type: Number,
        label: '最高价',
        min: 1,
        optional: true
    },
    isDiscount: {
        type: Boolean,
        label: '批量是否打折',
        optional: true
    },
    isInvoice: {
        type: Boolean,
        label: '是否提供发票',
        optional: true
    },
    isRevenue: {
        type: Boolean,
        label: '是否含税',
        optional: true
    },
    productId: {
        type: String,
        label: '产品序列号',
        // min: 1,
        optional: true
    },
    years: {
        type: String,
        label: '年限',
        // min: 1,
        optional: true
    },
    productStatus: {
        type: String,
        label: '产品状态',
        min: 1,
        optional: true
    },
    substituteModel: {
        type: String,
        label: '代替型号',
        // min: 1,
        optional: true
    },
    saleStatus: {
        type: String,
        label: '待销售状况',
        min: 1,
        optional: true
    },
    storeType: {
        type: String,
        label: '库存类别',
        min: 1,
        optional: true
    },
    showArrange: {
        type: Boolean,
        label: '普通用户是否显示范围',
        optional: true
    },
    specialDesc: {
        type: String,
        label: '特殊说明',
        min: 1,
        optional: true
    },
    saleAmount: {
        type: Number,
        label: '销量',
        min: 0,
        optional: true
    },
    isRemoved: {
        type: Boolean,
        label: '是否删除',
        optional: true
    },
    checkStatus: {
        type: String,
        label: '审核的状态',
        min: 1,
        optional: true
    },
    replaceName: {
        type: String,
        label: '字符替换后的产品名',
        min: 1,
        optional: true
    },
    replaceNumber: {
        type: String,
        label: '字符替换后的型号',
        min: 1,
        optional: true
    },
    identifyStatus: {
        type: String,
        label: '鉴定的状态',
        min: 1,
        optional: true
    },
    isBatch: {
        type: Boolean,
        label: '是否是通过批量上传的产品',
        optional: true
    },
    searchTimes: {
        type: Number,
        label: '搜索次数',
        min: 0,
        optional: true
    }
});
Product.attachSchema(Product.schema);

/**产品表
 * userId: 'xxxx',  //用户Id(标记是谁上传的)
 * productImgArr: ['xxxxxx','xxxxxx','xxxxxx','xxxxxx'] //产品图片（最多四张）
 * productName: 'xxxxxx'  //产品名称
 * specification: 'xxxxx' //规格型号
 * unit: '个' //单位
 * storeNum: 100  //库存数量
 * brand: 'xxx' //下拉框（后台配置）
 * price: 120  //客户上传的价格
 * finalPrice: 130 //后台提交的价格
 * minPrice: 100 //最低价格
 * maxPrice: 150 //最高价格
 * isDiscount: true //批量购买是否优惠
 * isInvoice: true //能否提供发票
 * productId: 'xxxxx' //产品序列号
 * years: 2 //年限
 * productStatus: '正品' //产品状态说明
 * substituteModel: 'xxxxx'  //代替型号
 * saleStatus: '急于出手'  //待销售状况
 * storeType: '原装正品'  //库存类别
 * showArrange: true   //普通会员是否显示价格范围
 * specialDesc: 'xxxx'  //特殊说明
 * saleAmount: 12  //销量
 * productCateory:'XXX'  //产品类别
 * checkStatus： '待审核'  // 1.待审核 2.审核通过 3.审核不通过
 * identifyStatus： '待鉴定'   // 1.待鉴定 2.已鉴定
 * featuresType: [] //特长（对应用户表里的用户特长）
 */