/**
 * 底部菜单板块逻辑以及动画
 *
 * @author  Vivian Yang
 * @review
 */
//订阅数据
Template.footer.onCreated(function() {
    var self = this;
    var userId = Meteor.userId();
    if (userId) {
        var selector = {
            "receiverId": userId,
            isRemoved: { $ne: true }
        };
        var options = { sort: { timestamp: -1 } };
        self.subscribe('chat', selector, options);
        self.autorun(function() {
            var currentCount = Session.get('chatCount');
            var newCount = Chat.find(selector, options).count();
            if (currentCount && currentCount != "") {
                if ((newCount - currentCount) > 0) {
                    $('#bottomContainer .bottonNavBar .menuListContainer li .toast').css('display', 'block');
                    $('#bottomContainer .bottonNavBar .menuListContainer li .toast').text(newCount - currentCount);
                }
            }

        });

    }



});
Template.footer.onRendered(function() {
    var userId = Meteor.userId();
    var selector = {
        "receiverId": userId,
        isRemoved: { $ne: true }
    };
    var options = { sort: { timestamp: -1 } };
    var count = Chat.find(selector, options).count();
    Session.set('chatCount', count)
    $('#bottomContainer .bottonNavBar .menuListContainer li').click(function(e) {
        var menuIndex = $(this).index(),
            bgPic = $('#bottomContainer .bottonNavBar .menuListContainer');
        switch (menuIndex) {
            case 0:
                if (!Session.get('chatCount') || Session.get('chatCount') == "") {
                    count = Chat.find(selector, options).count();
                    Session.set('chatCount', count)
                };
                FlowRouter.go('/');
                break;
            case 1:
                if (!Session.get('chatCount') || Session.get('chatCount') == "") {
                    count = Chat.find(selector, options).count();
                    Session.set('chatCount', count)
                };
                FlowRouter.go('/shoppingTrolley');
                break;
            case 2:
                if (!Session.get('chatCount') || Session.get('chatCount') == "") {
                    var count = Chat.find(selector, options).count();
                    Session.set('chatCount', count)
                };
                FlowRouter.go('/personalPage');
                break;
            case 3:
                if (Session.get('chatCount') || Session.get('chatCount') == "") {
                    Session.set('chatCount', "")
                };
                $('#bottomContainer .bottonNavBar .menuListContainer li .toast').css('display', 'none');
                FlowRouter.go('/customService');
                break;
            default:
                break;
        }
    });
});
