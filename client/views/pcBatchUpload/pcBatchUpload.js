Template.pcBatchUpload.onRendered(function(){
	$('#batchContainer p button.batchUpload').click(function(){
		var file = $('#batchContainer p input.productFile').get(0).files[0];
        if (!file) {
            return  Utility.alertMsg("您还没有上传excel");
        }
        var reader = new FileReader();
        var name = file.name;
        var type = Session.get('importXLSType');
        reader.onload = function(e) {
            var data = e.target.result,
            	result = [],
 				info = {},
 				arr = [],
				xls = [0xd0, 0x3c].indexOf(data.charCodeAt(0)) > -1;
            if(!xls){
                var workbook = XLSX.read(data, {type: 'binary'});
                workbook.SheetNames.forEach(function(sheetName) {
                    var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    if(roa.length > 0){
                        result.push(roa);
                    }
                });
            }
            else{
                var workbook = XLS.read(data, {type: 'binary'});
                workbook.SheetNames.forEach(function(sheetName) {
                    var roa = XLS.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    if(roa.length > 0){
                        result.push(roa);
                    }
                });
            }
            result = result[0];
            if(result.length === 0){
                return Utility.alertMsg("excel为空");
            }
            // result.forEach(function(item,index){
            for(var m = 0;m< result.length;m++){
            	var item = result[m],
            		index = m,
                    realData = {};
            	for(var i in item){
            		switch(i){
            			case '产品分类': realData.productCateory = item[i].trim();break;
            			case '产品名': realData.productName = item[i].trim();break;
            			case '产品序列号': realData.productId = item[i].trim();break;
            			case '产品状态': realData.productStatus = item[i].trim();break;
            			case '代替型号': realData.substituteModel = item[i].trim();break;
            			case '价格(含税)': realData.price = item[i].trim();break;
            			case '单位': realData.unit = item[i].trim();break;
            			case '品牌': realData.brand = item[i].trim();break;
            			case '年限': realData.years = item[i].trim();break;
            			case '库存数量': realData.storeNum = item[i].trim();break;
            			case '库存类型': realData.storeType = item[i].trim();break;
            			case '待销售状况': realData.saleStatus = item[i].trim();break;
            			case '批量是否打折': realData.isDiscount = item[i].trim();break;
            			case '规格型号': realData.specification = item[i].trim();break;
            		}
            	}
            	if(realData.isDiscount === 'TRUE'){
        			realData.isDiscount = true;
        		}
        		else if(realData.isDiscount === 'FALSE'){
        			realData.isDiscount = false;
        		}
        		else{
                    return  Utility.alertMsg('第'+(index+2)+'行批量购买是否打折的格式错误!');
        		}
        		if(realData.unit !== '个' && realData.unit !== '台' && realData.unit !== '包' && realData.unit !== '米' && realData.unit !== 'PCS' && realData.unit !== '其他'){
        			// console.log(realData.unit);
                    Utility.alertMsg('第'+(index+2)+'行的单位错误，，请仔细阅读下载模板上面的提示！'); 
        			return;
        		}
        		if(realData.saleStatus !=='急于出手' && realData.saleStatus !== '特价' && realData.saleStatus !== '常规库存'){
                    Utility.alertMsg('第'+(index+2)+'行的待销售状态错误!，请仔细阅读下载模板上面的提示！'); 
        			return;
        		}
        		if(realData.productStatus !== '正品' && realData.productStatus !== '备件' && realData.productStatus !== '其他'){
        
                    Utility.alertMsg('第'+(index+2)+'行的产品状态错误，请仔细阅读下载模板上面的提示！'); 
        			return;
        		}
        		if(realData.storeType !== '原装正品' && realData.storeType !== '原装开包' && realData.storeType !== '待定' && realData.storeType !== '其他' && realData.storeType !== '特定产品' && realData.storeType !== '迅创为仓库'){
                     Utility.alertMsg('第'+(index+2)+'行的库存类型错误，请仔细阅读下载模板上面的提示！');
        			return;
        		}
                if(realData.brand !== '西门子' && realData.brand !== '三菱' && realData.brand !== '松下' && realData.brand !== 'ABB' && realData.brand !== '欧姆龙' && realData.brand !== '施耐德' && realData.brand !== '台达'){
                    Utility.alertMsg('第'+(index+2)+'行的品牌错误，请仔细阅读下载模板上面的提示！');
                    return;
                }
                if(realData.productCateory !== 'PLC' && realData.productCateory !== '触摸屏' && realData.productCateory !== '变频器' && realData.productCateory !== '伺服驱动' && realData.productCateory !== '低压电器' && realData.productCateory !== '传感器'){
                    Utility.alertMsg('第'+(index+2)+'行的产品类别错误，请仔细阅读下载模板上面的提示！');
                    return;
                }
            	realData.isRevenue = true;
                realData.checkStatus = '审核通过';
                realData.isBatch = true;
            	realData.userId = Meteor.userId();
                realData.userPhone = Meteor.user().username;
                realData.replaceNumber = changeChar(realData.specification);
                realData.replaceName = changeChar(realData.productName);
            	arr.push(realData);
            };
            info.allData = arr;
            Meteor.call('batchUpload',info,function (err,result){
            	if(err){
            		console.log(err);
            		return;
            	}
            	if(result){
                    Utility.alertMsg("成功上传！");
                    $('#batchContainer .container p input').val('');
            	}
            });
        };
        reader.readAsBinaryString(file);
	});

    $('#batchContainer .container p button.getBack').click(function(){
        FlowRouter.go('/pcMyUploading')
    });
	
});

Template.pcBatchUpload.events({

});

//字符转换
function changeChar(words) {
    //去掉字符串中的空格
    var str1 = words.replace(/\s/g, '');
    //去掉字符串中的横杠
    var str2 = str1.replace(/-/g, '');
    //大写字母转换为小写字母
    var str3 = str2.toLowerCase();
    var str = str3.split(''),
        replaceName = '';

    for (var i = 0; i < str.length; i++) {
        switch (str[i]) {
            case '1':
                str[i] = 'i';
                break;
            case '0':
                str[i] = 'o';
                break;
            default:
                break;
        }
        replaceName = replaceName + str[i];
    }

    return replaceName;
}