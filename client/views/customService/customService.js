var totalCount;
var count;

//返回顶部
Template.customService.scrollBottom = function() {
    Meteor.setTimeout(function() {
        var region = document.getElementById("mainRegion");
        region.scrollTop = region.scrollHeight;
    }, 200);
}

//订阅数据
Template.customService.onCreated(function() {
    var self = this;
    self.autorun(function() {
        var userId = Meteor.userId();
        var selector = {
            "$or": [{
                "senderId": userId
            }, {
                "receiverId": userId
            }]
        };
        self.subscribe('chat', selector, Session.get('customServiceOptions'));
        count = Chat.find().count();

        Meteor.call("getMessagesCount", function(err, result) {
            if (!err) {

                if (totalCount < result) {
                    //有新数据时返回底部
                    Template.customService.scrollBottom();
                }
                totalCount = result;

            } else {
                console.log(err);
            }
        })
    });
    var options = { sort: { timestamp: -1 }, limit: 20 };
    Session.set('customServiceOptions', options);

});

Template.customService.load = function() {
    //刷新加载15条
    var increase = 15;
    if (count == totalCount) {
        return false;
    }
    if (count + increase >= totalCount) {
        var thisLimit = totalCount;
    } else {
        var thisLimit = count + increase;
    }
    var options = { sort: { timestamp: -1 }, limit: thisLimit };
    Session.set('customServiceOptions', options);
}

Template.customService.onRendered(function() {

    var data={
        selector:{
            type:'电话',
            isRemoved:{$ne:true}
        },
        options:{

        }
    }

    Meteor.call('getChatPhone',data,function(err,result){
        if(err){
            console.log(err);
            return;
        }
        for(var i=0;i<result.length;i++){
            $('.customService .headText p').append('<a href="tel:'+result[i].name+'">'+result[i].name+'</a>')
        }
    })
    Template.customService.scrollBottom();
    $(".messages-content").scroll(function() {
        if ($('.messages-content')[0].scrollTop === 0) {
            Template.customService.load();
        }
    });

});

Template.customService.helpers({
    "messages": function() {
        var messages = Chat.find().fetch();
        var result = _.sortBy(messages, function(message) {
            return message.timestamp;
        });
        return result;
    }
    // "phoneList":function(){

    // }
});

Template.tpl_messages.helpers({
    "source": function() {
        return (Meteor.userId() == this.senderId);
    },
    "time": function() {
        var date = new Date(this.timestamp);

        var Hours = date.getHours() + "";
        Hours = '00'.substr(0, 2 - Hours.length) + Hours;

        var Minutes = date.getMinutes() + "";
        Minutes = '00'.substr(0, 2 - Minutes.length) + Minutes;

        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + Hours + ':' + Minutes;
    },
    //是否显示时间
    "isShow": function() {
        var messages = Chat.find().fetch();
        messages = _.sortBy(messages, function(message) {
            return message.timestamp;
        });
        if (this.$index == 0) {
            //默认第一条显示时间
            return true;
        } else {

            var prevData = messages[this.$index - 1];
            //两条信息是否为同一个人所发
            //  var isSame = true;            
            //  if(prevData) {
            //      isSame = (prevData.senderId==this.senderId)?true:false;
            //  }
            //  else {
            //      return true;
            //  }
            // if((isSame)) {
            //判断间隔时间
            var offsetTimeStamp = this.timestamp - prevData.timestamp;
            var time = 5 * 60 * 1000;
            if (offsetTimeStamp > time) {
                return true
            } else {
                return false;
            }
            // } else {
            //      //不同时显示时间
            //     return true;
            // }
        }
    }
});

Template.customService.events({
    "click .sendMessage a.link": function(e, template) {
        sendMessageClicked();
    },
    "keydown .sendMessage": function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            sendMessageClicked();
        }
    }
});

function sendMessageClicked() {
    var text = $('.sendMessage span').text();
    // var text = textarea.val();
    var data = {};
    if (!text.trim()) {
        return;
    }
    data.content = text;
    data.senderId = Meteor.userId();
    data.phone = Meteor.user().username;
    data.isRead = false;
    if (!Chat.findOne({ receiverId: { $exists: false }, senderId: Meteor.userId() }) && Chat.find().fetch().length > 0) {
        data.receiverId = Chat.findOne({ senderId: Meteor.userId() }).receiverId;
    }


    var userId = Meteor.userId();
    var updateUserData = {
        selector: { userId: userId },
        modifier: {
            chatWith: data.receiverId,
            lastChatTime: Date.now()
        }
    };

    //保存数据
    Meteor.call("insertChatMessage", data, function(err, result) {
        if (!err) {
            //Template.customService.scrollBottom();    
            Meteor.call('updateUserAuthenticate', updateUserData, function(err, result) {
                if (!err) {

                } else {
                    console.log(err);
                }
            });
        } else {
            console.log(err);
        }
    });

    // $(textarea).val("");
    $('.sendMessage span').text("");
}
