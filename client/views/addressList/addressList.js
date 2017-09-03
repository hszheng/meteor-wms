/**
 * 展示我的收获地址板块逻辑以及动画
 *
 * @author  Vivian Yang
 * @review
 */

Template.addressList.onRendered(function(){
	//获取我的收货地址信息
	var userId = Meteor.userId(),
		data = {selector:{userId: userId,isRemoved:{$ne:true}},options:{sort:{timestamp:-1}}};
    
	Meteor.call('getAddress',data,function (err,result){
		if(err){
			console.log(err);
			return ;
		}
		//console.log(result);
        var data = {};
        data.addressList = result;
        var template = Blaze.toHTMLWithData(Template.tplAddressList,data);
        $("#deliveryBox").html(template);
        $("#deliveryBox .deliveryInfo").click(function(){
            var id = $(this).data("id");
            FlowRouter.go('/editAddress/' + id);           
        });
	});

	//点击新建按钮跳转到新建页面
	$('#submit-region button').click(function(){
		FlowRouter.go('/addAddress');
	});

	//点击顶部按钮返回个人中心
	$('.contractDetails .withdraw').click(function(){
		FlowRouter.go('/personalPage');
	});
});