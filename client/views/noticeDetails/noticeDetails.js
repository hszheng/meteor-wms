//日期格式化
Date.prototype.format = function(format)
{
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
        (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)if(new RegExp("("+ k +")").test(format))
        format = format.replace(RegExp.$1,
                RegExp.$1.length==1 ? o[k] :
                ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
};

Template.noticeDetails.onRendered(function() {
    var noticeId = FlowRouter.getParam('_id');
     var data = { selector:{_id:noticeId }, options: { sort: { timestamp: -1 } } };
    //返回首页
    $('#noticeDetailContainer .redBtnArea .redBtn button').click(function() {
        // FlowRouter.go(FlowRouter.current().oldRoute.path);
        FlowRouter.go('/');
    });

    //获取当前公告信息
    Meteor.call('getNoticeByNoticeId',data,function (err,result){
        if(err){
            console.log(err);
            return ;
        }
        var date=new Date(result[0].timestamp);
        var dateFormat=date.format("yyyy-MM-dd");

        //展示产品信息
        // $('#noticeTitleName').html(result[0].title);  //展示头部标题
        $('#noticeDetailContainer .noticeText a').text(result[0].title);         
        $('#noticeDetailContainer .noticeText .date').text(dateFormat);            
        $('#noticeDetailContainer .noticeText .content').html(result[0].content);     
        
       
    });


});
