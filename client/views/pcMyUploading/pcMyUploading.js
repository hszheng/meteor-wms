/**
 * PC端我的上传板块逻辑以及动画
 *
 * @author  Vivian Yang
 * @review
 */

Template.pcMyUploading.onRendered(function(){
	var userId = Meteor.userId(),
		data = {selector:{userId: userId,isRemoved:{$ne:true}},options:{sort:{timestamp:-1}}};
		// myAllProductions = [];

	//查询所有产品
	Meteor.call('getProductAll',data,function (err,result){
		if(err){
			console.log(err);
			return;
		}
		// _.each(result,function(item,index){
  //           myAllProductions.push(item);
  //       });

        //加载我的所有产品
		for (var i = 0; i < result.length; i++) {
			$('#pcMyUploading .productions').append(''+
				'<div class="production" data-id="'+result[i]._id+'">'+
					'<div class="productLeftArea">'+
						'<div class="imageArea">'+
							'<span><img src="'+result[i].productImgArr[0]+'" alt=""></span>'+
						'</div>'+
						'<div class="detailsArea">'+
							'<h3>'+result[i].productName+'</h3>'+
							'<p>规格型号：'+result[i].specification+'</p>'+
							'<p>库存：'+result[i].storeNum+'</p>'+
							'<h3 class="priceArea">￥'+result[i].price+'</h3>'+
						'</div>'+
						'<div class="clear"></div>'+
					'</div>'+
					'<div class="productRightArea">'+
						'<div class="operationBtn">'+
							'<button id="edit">修改</button>'+
							'<button id="delete">删除</button>'+
							'<div class="clear"></div>'+
						'</div>'+
						'<div class="clear"></div>'+
					'</div>'+
					'<div class="clear"></div>'+
				'</div>');
		};
		
		//点击产品进入产品详情页
		$('#pcMyUploading .productions .production .productRightArea .operationBtn #edit').click(function(e){
			var postId = $(this).parents('.production').eq(0).data('id');
			Session.set('postId',postId);
			FlowRouter.go('/pcEditUploading/'+postId);
		});

		//删除按钮提示是否删除
		$('#pcMyUploading .productions .production .productRightArea .operationBtn #delete').click(function(){
			var curDiv = $(this),
				curProductIndex = curDiv.parents('.production').index();
			$('#deleteAlert').show();
			$('#deleteAlert .alertOperationBtn button').click(function(e){
				var buttonIndex = $(this).index();

				if (buttonIndex === 1) {
					curDiv.parents('.production')[0].remove();
					var	postId = curDiv.parents('.production').eq(0).data('id'),
						data = {_id:postId,modifier:{isRemoved:true}};
						
					Meteor.call('updateTrade',data,function (err,result){
						if(err){
							console.log(err);
							return alert('err');
						}
					});
					$('#deleteAlert').hide();
				}else{
					$('#deleteAlert').hide();
				}
			});
		});
		
	});

	//点击上传按钮跳转到上传页面
	$('#pcMyUploading .uploadingBtnArea .redBtn .submitUploading').click(function(){
		FlowRouter.go('/pcUploading');
	});

	$('#pcMyUploading .uploadingBtnArea .redBtn .batchUpload').click(function(){
		Meteor.call('judgeCredit',{userId:Meteor.userId()},function (err,result){
			if(err){
				return;
			}
			if(result){
				Utility.alertMsg("您不符合批量上传的资格！");
			}
			else{
				FlowRouter.go('/pcBatchUpload');
			}
		});
		
	});
});