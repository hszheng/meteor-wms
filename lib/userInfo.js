UserInfo = new Mongo.Collection('userInfo');
UserInfo.schema = new SimpleSchema({
    userId: {
        type: String,
        label: '用户Id',
        min: 1,
        max: 20
    },
    userName: {
        type: String,
        label: '用户名',
        min: 1,
        max: 20
    },
    portrait: {
        type: String,
        label: '头像路径',
        min: 1,
        optional: true
    },
    registerPhone: {
        type: String,
        label: '注册手机号码',
        min: 1,
        max: 20
    },
    type: {
        type: String,
        label: '类型',
        min: 1,
        max: 20,
        optional: true
    },
    timestamp: {
        type: Number,
        label: '时间戳',
        optional: true
    },
    userNo: {
        type: String,
        label: '客户编号',
        min: 1,
        optional: true
    },
    level: {
        type: String,
        label: '等级',
        min: 1
    },
    creditNo: {
        type: Number,
        label: '信誉度',
        min: 1
    },
    name: {
        type: String,
        label: '名称',
        min: 1,
        optional: true
    },
    idNumber: {
        type: String,
        label: '身份证号',
        min: 1,
        optional: true
    },
    contactPhone: {
        type: String,
        label: '联系电话',
        min: 1,
        optional: true
    },
    address: {
        type: String,
        label: '联系地址',
        min: 1,
        optional: true
    },
    email: {
        type: String,
        label: '邮箱',
        min: 1,
        optional: true
    },
    qq: {
        type: String,
        label: 'QQ',
        min: 1,
        optional: true
    },
    wechat: {
        type: String,
        label: '微信号',
        min: 1,
        optional: true
    },
    accountName: {
        type: String,
        label: '账户名',
        min: 1,
        optional: true
    },
    accountPlace: {
        type: String,
        label: '开户行',
        min: 1,
        optional: true
    },
    accountNo: {
        type: String,
        label: '账号',
        min: 1,
        optional: true
    },
    introduction: {
        type: String,
        label: '自我介绍',
        min: 1,
        optional: true
    },
    features: {
        type: [String],
        label: '特长',
        min: 1,
        optional: true
    },
    vipTimestamp: {
        type: Number,
        label: '会员升级时间',
        min: 1,
        optional: true
    },
    registrationNo: {
        type: String,
        label: '税务登记号',
        min: 1,
        optional: true
    },
    companyIntroduction: {
        type: String,
        label: '公司简介',
        min: 1,
        optional: true
    },
    landLine: {
        type: String,
        label: '座机',
        min: 1,
        optional: true
    },
    fax: {
        type: String,
        label: '传真',
        min: 1,
        optional: true
    },
    companyAddress: {
        type: String,
        label: '单位地址',
        min: 1,
        optional: true
    },
    principalName: {
        type: String,
        label: '负责人',
        min: 1,
        optional: true
    },
    principalPhone: {
        type: String,
        label: '座机号或者手机号',
        min: 1,
        optional: true
    },
    licenseNo: {
        type: String,
        label: '代理证书编号',
        min: 1,
        optional: true
    },
    allTradeMoney: {
        type: Number,
        label: '交易总金额',
        min: 1,
        optional: true
    },
    allTradeNum: {
        type: Number,
        label: ' 交易历史数量',
        min: 1,
        optional: true
    },
    isRemoved: {
        type: Boolean,
        label: '是否删除',
        optional: true
    },
    identifyStatus: {
        type: String,
        label: '认证的状态',
        min: 1,
        optional: true
    },
    vipStatus: {
        type: String,
        label: '会员的状态',
        min: 1,
        optional: true
    },
    showArrange: {
        type: Boolean,
        label: '普通用户是否显示范围',
        optional: true
    },
    specialDesc: {
        type: [String],
        label: '特殊说明',
        min: 1,
        optional: true
    },
    chatWith: {
        type: String,
        label: '和后台聊天人员绑定',
        min: 1,
        optional: true
    },
    lastChatTime: {
        type: Number,
        label: '最后一次聊天时间',
        min: 1,
        optional: true
    },

    upgradeLevel: {
        type: String,
        label: '待升级的等级',
        min: 1,
        optional: true
    },
    isRead: {
        type: Boolean,
        label: '是否已读',
        optional: true
    }
});
UserInfo.attachSchema(UserInfo.schema);

/**用户表（用来存一些会员的信息）
 *
 * userName:'xxxx',  //用户名
 * registerPhone: 'xxxxxx',  //注册手机号码
 * type: '公司',  //会员类型1.企业 2.个人
 * userNo: 'kh00000001', //客户编号
 * level: '游客', //1.游客 2.普通会员 3.vip会员 4.超级会员
 * timestamp: 1111111  //注册时间
 * creditNo: 4 //信誉度：1.特优、2.良好、3.中、4.低、5.警告
 * allTradeMoney: 110 //交易总金额
 * allTradeNum: 100 //历史交易数量
 * identifyStatus: '待认证' //1.待认证。2.未认证 3.认证失败 4.通过认证
 * vipStatus: '待审核'  //1.待审核（微信支付完成） 2.审核通过（通过审核） 3.未升级（审核失败）
 * upgradeLeve: '超级会员' //待审核的会员升级（用户微信支付玩需要升的等级）
 * showArrange:  '用来判断是否显示范围'   //普通用户是否显示范围
 */

/**type: '个人'
 * 
 * name: 'xxx', //姓名
 * idNumber: 'xxxx', //身份证号
 * contanctPhone: '18824920361', //联系电话
 * address: 'xxxxxxxxxxx' ,//联系地址
 * email: 'xxxxx@qq.com', //邮箱地址
 * qq: '111111111', //QQ号码
 * wechat: 'xxxxxx', //微信号
 * accountName: '张三', //账户名
 * accountPlace: 'xxxxxx', //开户行
 * accountNo: 'xxxxxx',  //账号
 * introduction: 'xxxxxx', //自我介绍
 * features: ［］,  //特长
 * vipTimestamp: 111111 //充值成为会员的时间
 */

/**type: '企业'
 *
 * name: 'xxxxx', //公司名称
 * registrationNo: 'xxxxx', //税务登记号
 * companyIntroduction: 'xxxx', //公司简介
 * landLine: 'xxxx',  //座机
 * fax: 'xxxxx', //传真
 * accountName: '张三', //账户名
 * accountPlace: 'xxxxxx', //开户行
 * accountNo: 'xxxxxx',  //账号
 * companyAddress: 'xxxxx', //单位地址
 * principalName: 'xxxxx', //负责人
 * principalPhone: 'xxxx', //座机号或者手机号 
 * email: 'xxxxx@qq.com', //邮箱地址
 * qq: '111111111', //QQ号码
 * wechat: 'xxxxxx', //微信号
 * licenseNo: 'xxxxx', //代理证书编号
 * salesModel: 'xxxxx' //公司销售主营模式
 */
