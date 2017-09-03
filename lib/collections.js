// /**
//  * 定义项目中使用的所有的collections。
//  *
//  * @author  Sven Wang
//  * @review
//  */

// UserInfo = new Mongo.Collection('userInfo');
// UserInfo.schema = new SimpleSchema({
//     userName: {
//         type: String,
//         label: '用户Id',
//         min: 1,
//         max: 20
//     },
//     registerPhone: {
//         type: String,
//         label: '注册手机号码',
//         min: 1,
//         max: 20
//     },
//     type: {
//         type: String,
//         label: '类型',
//         min: 1,
//         max: 20,
//         optional: true
//     },
//     timestamp: {
//         type: Number,
//         label: '时间戳',
//         optional: true
//     },
//     userNo: {
//         type: String,
//         label: '客户编号',
//         min: 1
//     },
//     level: {
//         type: String,
//         label: '等级',
//         min: 1
//     },
//     creditNo: {
//         type: Number,
//         label: '信誉度',
//         min: 1
//     },
//     name: {
//         type: String,
//         label: '名称',
//         min: 1
//     },
//     idNumber: {
//         type: String,
//         label: '身份证号',
//         min: 1,
//         optional: true
//     },
//     contactPhone: {
//         type: String,
//         label: '联系电话',
//         min: 1,
//         optional: true
//     },
//     address: {
//         type: String,
//         label: '联系地址',
//         min: 1,
//         optional: true
//     },
//     email: {
//         type: String,
//         label: '邮箱',
//         min: 1,
//         optional: true
//     },
//     qq: {
//         type: String,
//         label: 'QQ',
//         min: 1,
//         optional: true
//     },
//     wechat: {
//         type: String,
//         label: '微信号',
//         min: 1,
//         optional: true
//     },
//     accountName: {
//         type: String,
//         label: '账户名',
//         min: 1,
//         optional: true
//     },
//     accountPlace: {
//         type: String,
//         label: '开户行',
//         min: 1,
//         optional: true
//     },
//     accountNo: {
//         type: String,
//         label: '账号',
//         min: 1,
//         optional: true
//     },
//     introduction: {
//         type: String,
//         label: '自我介绍',
//         min: 1,
//         optional: true
//     },
//     features: {
//         type: [String],
//         label: '特长',
//         min: 1,
//         optional: true
//     },
//     vipTimestamp: {
//         type: Number,
//         label: '会员升级时间',
//         min: 1,
//         optional: true
//     },
//     registrationNo: {
//         type: String,
//         label: '税务登记号',
//         min: 1,
//         optional: true
//     },
//     companyIntroduction: {
//         type: String,
//         label: '公司简介',
//         min: 1,
//         optional: true
//     },
//     landLine: {
//         type: String,
//         label: '座机',
//         min: 1,
//         optional: true
//     },
//     fax: {
//         type: String,
//         label: '传真',
//         min: 1,
//         optional: true
//     },
//     companyAddress: {
//         type: String,
//         label: '单位地址',
//         min: 1,
//         optional: true
//     },
//     principalName: {
//         type: String,
//         label: '负责人',
//         min: 1,
//         optional: true
//     },
//     principalPhone: {
//         type: String,
//         label: '座机号或者手机号',
//         min: 1,
//         optional: true
//     },
//     licenseNo: {
//         type: String,
//         label: '代理证书编号',
//         min: 1,
//         optional: true
//     },
//     salesModel: {
//         type: String,
//         label: '公司销售主营模式',
//         min: 1,
//         optional: true
//     }
   
// });
// UserInfo.attachSchema(UserInfo.schema);

// /**用户表（用来存一些会员的信息）
//  *
//  * userName:'xxxx',  //用户名
//  * registerPhone: 'xxxxxx',  //注册手机号码
//  * type: '公司',  //会员类型1.企业 2.个人
//  * userNo: 'kh00000001', //客户编号
//  * level: '游客', //1.游客 2.普通会员 3.vip会员 4.超级会员
//  * timestamp: 1111111  //注册时间
//  * creditNo: 4 //信誉度：1.特优、2.良好、3.中、4.低、5.警告
//  */

// /**type: '个人'
//  * 
//  * name: 'xxx', //姓名
//  * idNumber: 'xxxx', //身份证号
//  * contanctPhone: '18824920361', //联系电话
//  * address: 'xxxxxxxxxxx' ,//联系地址
//  * email: 'xxxxx@qq.com', //邮箱地址
//  * qq: '111111111', //QQ号码
//  * wechat: 'xxxxxx', //微信号
//  * accountName: '张三', //账户名
//  * accountPlace: 'xxxxxx', //开户行
//  * accountNo: 'xxxxxx',  //账号
//  * introduction: 'xxxxxx', //自我介绍
//  * features: ［］,  //特长
//  * vipTimestamp: 111111 //充值成为会员的时间
//  */

// /**type: '企业'
//  *
//  * name: 'xxxxx', //公司名称
//  * registrationNo: 'xxxxx', //税务登记号
//  * companyIntroduction: 'xxxx', //公司简介
//  * landLine: 'xxxx',  //座机
//  * fax: 'xxxxx', //传真
//  * accountName: '张三', //账户名
//  * accountPlace: 'xxxxxx', //开户行
//  * accountNo: 'xxxxxx',  //账号
//  * companyAddress: 'xxxxx', //单位地址
//  * principalName: 'xxxxx', //负责人
//  * principalPhone: 'xxxx', //座机号或者手机号 
//  * email: 'xxxxx@qq.com', //邮箱地址
//  * qq: '111111111', //QQ号码
//  * wechat: 'xxxxxx', //微信号
//  * licenseNo: 'xxxxx', //代理证书编号
//  * salesModel: 'xxxxx' //公司销售主营模式
//  */

// Address = new Mongo.Collection('address');
// Address.schema = new SimpleSchema({
//     userId: {
//         type: String,
//         label: '用户Id',
//         min: 1,
//         max: 20
//     },
//     receiver: {
//         type: String,
//         label: '收件人',
//         min: 1,
//         max: 20
//     },
//     contactPhone: {
//         type: Number,
//         label: '联系电话',
//         min: 1,
//         max: 20,
//         optional: true
//     },
//     timestamp: {
//         type: Number,
//         label: '时间戳',
//         optional: true
//     },
//     address: {
//         type: String,
//         label: '地址',
//         min: 1
//     },
//     area: {
//         type: String,
//         label: '所在区域',
//         min: 1
//     }
// });
// Address.attachSchema(Address.schema);

// /**地址表（纪录用户的收货地址）
//  *
//  * userId: 'xxxxxxx', //用户id(用来确定是谁的收货地址)
//  * receiver: 'xxxxx' //收货人
//  * contactPhone: '1111111' //联系电话
//  * area: 'xxxx'  //所在区域
//  * address: 'xxxxxxx' //详细地址
//  * timestamp: qqqqqq  //时间
//  */

// Product = new Mongo.Collection('product');
// Product.schema = new SimpleSchema({
//     userId: {
//         type: String,
//         label: '用户Id',
//         min: 1,
//         max: 20
//     },
//     productImgArr: {
//         type: [String],
//         label: '产品图片',
//         min: 1
//     },
//     productName: {
//         type: Number,
//         label: '产品名称',
//         min: 1,
//         optional: true
//     },
//     timestamp: {
//         type: Number,
//         label: '时间戳',
//         optional: true
//     },
//     specification: {
//         type: String,
//         label: '规格型号',
//         min: 1,
//         optional: true
//     },
//     unit: {
//         type: String,
//         label: '单位',
//         min: 1,
//         optional: true
//     },
//     storeNum: {
//         type: Number,
//         label: '库存数量',
//         min: 1,
//         optional: true
//     },
//     brand: {
//         type: String,
//         label: '品牌',
//         min: 1,
//         optional: true
//     },
//     price: {
//         type: Number,
//         label: '价格',
//         min: 1,
//         optional: true
//     },
//     finalPrice: {
//         type: Number,
//         label: '后台价格',
//         min: 1,
//         optional: true
//     },
//     minPrice: {
//         type: Number,
//         label: '最低价',
//         min: 1,
//         optional: true
//     },
//     maxPrice: {
//         type: Number,
//         label: '最高价',
//         min: 1,
//         optional: true
//     },
//     isDiscount: {
//         type: Boolean,
//         label: '批量是否打折',
//         optional: true
//     },
//     isInvoice: {
//         type: Boolean,
//         label: '是否提供发票',
//         optional: true
//     },
//     productId: {
//         type: String,
//         label: '产品序列号',
//         min: 1,
//         optional: true
//     },
//     years: {
//         type: String,
//         label: '年限',
//         min: 1,
//         optional: true
//     },
//     productStatus: {
//         type: String,
//         label: '产品状态',
//         min: 1,
//         optional: true
//     },
//     substituteModel: {
//         type: String,
//         label: '代替型号',
//         min: 1,
//         optional: true
//     },
//     saleStatus: {
//         type: String,
//         label: '待销售状况',
//         min: 1,
//         optional: true
//     },
//     storeType: {
//         type: String,
//         label: '库存类别',
//         min: 1,
//         optional: true
//     }
// });
// Product.attachSchema(Product.schema);

// /**产品表
//  * userId: 'xxxx',  //用户Id(标记是谁上传的)
//  * productImgArr: ['xxxxxx','xxxxxx','xxxxxx','xxxxxx'] //产品图片（最多四张）
//  * productName: 'xxxxxx'  //产品名称
//  * specification: 'xxxxx' //规格型号
//  * unit: '个' //单位
//  * storeNum: 100  //库存数量
//  * brand: 'xxx' //下拉框（后台配置）
//  * price: 120  //客户上传的价格
//  * finalPrice: 130 //后台提交的价格
//  * minPrice: 100 //最低价格
//  * maxPrice: 150 //最高价格
//  * isDiscount: true //批量购买是否优惠
//  * isInvoice: true //能否提供发票
//  * productId: 'xxxxx' //产品序列号
//  * years: 2 //年限
//  * productStatus: '正品' //产品状态说明
//  * substituteModel: 'xxxxx'  //代替型号
//  * saleStatus: '急于出手'  //待销售状况
//  * storeType: '原装正品'  //库存类别
//  */

// Setting = new Mongo.Collection('setting');
// Setting.schema = new SimpleSchema({
//     type: {
//         type: String,
//         label: '类型',
//         min: 1,
//     },
//     name: {
//         type: String,
//         label: '名字',
//         min: 1,
//         max: 20
//     },
//     timestamp: {
//         type: Number,
//         label: '时间戳',
//         optional: true
//     }
// });
// Setting.attachSchema(Setting.schema);

// /**设置表（后台配置品牌和产品）
//  *
//  * type: '品牌' //类型：1.品牌，2.产品
//  * name: 'xxxx' //名字
//  * timestamp: 1111 //时间
//  * 
//  */

// Contract = new Mongo.Collection('contract');
// Contract.schema = new SimpleSchema({
//     userId: {
//         type: String,
//         label: '用户ID',
//         min: 1,
//     },
//     tradeIdArr: {
//         type: [String],
//         label: '交易ID的属猪'
//     },
//     timestamp: {
//         type: Number,
//         label: '时间戳',
//         optional: true
//     },
//     total: {
//         type: Number,
//         label: '总价钱',
//         min: 1,
//         optional: true
//     },
//     companyName: {
//         type: String,
//         label: '单位名称',
//         min: 1,
//         optional: true
//     },
//     companyAddress: {
//         type: String,
//         label: '单位地址',
//         min: 1,
//         optional: true
//     },
//     agent: {
//         type: String,
//         label: '委托代理人',
//         min: 1,
//         optional: true
//     },
//     phone: {
//         type: String,
//         label: '电话',
//         min: 1,
//         optional: true
//     },
//     fax: {
//         type: String,
//         label: '传真',
//         min: 1,
//         optional: true
//     },
//     taxId: {
//         type: String,
//         label: '税号',
//         min: 1,
//         optional: true
//     },
//     accountPlace: {
//         type: String,
//         label: '开户银行',
//         min: 1,
//         optional: true
//     },
//     accountNo: {
//         type: String,
//         label: '账号',
//         min: 1,
//         optional: true
//     },
//     receiver: {
//         type: String,
//         label: '收件人',
//         min: 1,
//         optional: true
//     },
//     receivePhone: {
//         type: String,
//         label: '收件人号码',
//         min: 1,
//         optional: true
//     },
//     receiveAddress: {
//         type: String,
//         label: '收货地址',
//         min: 1,
//         optional: true
//     }
// });
// Contract.attachSchema(Contract.schema);


// /**合同
//  *
//  * userId: 'xxx' //用户id
//  * tradeIdArr: ['xxxx','xxxxx']  //用来存储生成合同交易的_id
//  * total: 100  //总价钱（合计价钱）
//  * companyName: 'xxxxx' //单位名称
//  * companyAddress: 'xxxxx' //单位地址
//  * agent: '李斯' //委托代理人
//  * phone: '110' //电话
//  * fax: 'xxx'  //传真
//  * taxId: 'xxxx' //税号
//  * accountPlace: 'xxxx' //开户银行
//  * accountNo: 'xxxx'  //账号
//  * receiver: 'xxx'  //收件人
//  * receivePhone: '110' //收件人号码
//  * receiveAddress: 'xxxxx' //收货地址
//  * timestamp: 111111 //时间
//  */


// Trade = new Mongo.Collection('trade');
// Trade.schema = new SimpleSchema({
//     userId: {
//         type: String,
//         label: '用户Id',
//         min: 1,
//     },
//     productId: {
//         type: String,
//         label: '产品ID',
//         min: 1
//     },
//     timestamp: {
//         type: Number,
//         label: '时间戳',
//         optional: true
//     },
//     productName: {
//         type: String,
//         label: '产品名称',
//         min: 1,
//         optional: true
//     },
//     specification: {
//         type: String,
//         label: '规格型号',
//         min: 1,
//         optional: true
//     },
//     num: {
//         type: Number,
//         label: '数量',
//         min: 1,
//         optional: true
//     }
// });
// Trade.attachSchema(Trade.schema);

// /**交易表（主要用于储存购物车里面的商品信息）
//  *
//  * userId: 'xxxx'  //用户id
//  * productId: 'xxxx' //产品表
//  * productName: 'xxxxxx'  //产品名称
//  * specification: 'xxxxx' //规格型号
//  * num: 10 //数量
//  * timestamp: 1111  //时间
//  */

// Chat = new Mongo.Collection('chat');
// Chat.schema = new SimpleSchema({
//     senderId: {
//         type: String,
//         label: '发送用户Id',
//         min: 1,
//     },
//     receiverId: {
//         type: String,
//         label: '接收ID',
//         min: 1
//     },
//     timestamp: {
//         type: Number,
//         label: '时间戳',
//         optional: true
//     },
//     content: {
//         type: String,
//         label: '聊天内容',
//         min: 1,
//         optional: true
//     },
//     isRead: {
//         type: Boolean,
//         label: '是否已读',
//         min: 1,
//         optional: true
//     }
// });
// Chat.attachSchema(Chat.schema);

// /**聊天表
//  *
//  * senderId: 'xxxxxx' //发送者id
//  * receiverId: 'xxxxx' //接收者id
//  * content: 'xxxxxx‘  //聊天内容
//  * timestamp: 111111  //时间
//  * isRead: false  //已读和未读
//  */


// Notice = new Mongo.Collection('notice');
// Notice.schema = new SimpleSchema({
//     bannerUrl: {
//         type: String,
//         label: 'banner图的路径',
//         min: 1,
//     },
//     title: {
//         type: String,
//         label: '标题',
//         min: 1
//     },
//     timestamp: {
//         type: Number,
//         label: '时间戳',
//         optional: true
//     },
//     content: {
//         type: String,
//         label: '详细信息',
//         min: 1,
//         optional: true
//     }
// });
// Notice.attachSchema(Notice.schema);

// /**公告表（通过banner图来发布一些消息）
//  *
//  * bannerUrl: 'xxxxx' //banner图的路径
//  * title: 'xxxx'  //标题
//  * content: 'xxxxx'  //内容
//  * 
//  * 
//  */

// var mongoUrl = 'mongodb://192.168.1.8:27017/gongxiaocun';//本地数据库
// // var mongoUrl = 'mongodb://127.0.0.1:27017/gongxiaocun';//连接服务器上的数据库
// UploadFiles = new FS.Collection('uploadFiles', {
//     stores: [
//         // new FS.Store.GridFS('uploadFilesThumbs', {
//         //     mongoUrl: mongoUrl,
//         //     transformWrite: function(fileObj, readStream, writeStream) {
//         //         gm(readStream, fileObj.name()).resize('400', '400').stream().pipe(writeStream);
//         //     }
//         // }),
//         new FS.Store.GridFS('uploadFiles', {
//             mongoUrl: mongoUrl
//         })
//     ]
// });