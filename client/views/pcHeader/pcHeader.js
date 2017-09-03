/**
 * PC端登录板块逻辑以及动画
 *
 * @author  Vivian Yang
 * @review
 */

Template.pcHeader.onRendered(function(){

});

Template.pcHeader.events({
	//点击登录
	// 'click .pcHeader .head .userIogin .quit':function(){
	// 	if (Meteor.userId()) {
	// 		FlowRouter.go('/pcLogin');
	// 	}
	// }

	//点击登出
	'click .pcHeader .head .userIogin .quit':function(){
		Meteor.logout();
        setTimeout(function(){
          FlowRouter.go('/pcLogin');
        },200);
		
	}

    
});

Template.pcHeader.helpers({
    isLogin: function() {
        if (Meteor.userId()) { //判断是否有登录
            return false;
        } else {
            return true;
        }
    },
    userName: function() {
        if (Meteor.user()) { //判断是否有登录
            return Meteor.user().username;
        } else {
            return '';
        }
    }
});