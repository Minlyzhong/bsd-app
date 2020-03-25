define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var photoBrowserPhotos = [];
	var photoDatas = [];
	var photoBrowserPopup = '';
	var pageDataStorage = {}; 
	var pId;
	
	
	//获取申报详细
	var personalProcessDetailsPath = app.basePath + '/mobile/specialDeclare/';
	// //删除申报
	// var deleteHonorPath =  app.basePath + '/mobile/honor/';
	// //获取附件
	// var getPersonalHonorPath = app.basePath + '/mobile/honor/download/';
	
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		app.back2Home();;
		attrDefine(page);
		clickEvent(page);
	}
		
	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		photoBrowserPhotos = [];
		photoDatas = [];
		photoBrowserPopup = '';
		pageDataStorage = {}; 
		pId = pageData.pId;
		console.log(pageData);
		
		//加载数据
		loadProcessDetail(pId)
		
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {}
	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		

			//预算具体情况:
		// $$('.tcaomBudgetDetailsIcon').on('click',function(){
		// 	changeStateForText($$(this));
		// 	$('.tcaomBudgetDetails').slideToggle(200);
		// });
			
		// });
	}

	
	
	/*
	 * 加载数据
	 */
	function loadProcessDetail(pId){
		app.ajaxLoadPageContent(personalProcessDetailsPath+pId, {
			
		}, function(data) {
			var result = data.data;
			console.log(result)
			result.createdTime = result.createdTime.split(' ')[0];
			result.projectEndDate = result.projectEndDate.split(' ')[0];
			result.projectStartDate = result.projectStartDate.split(' ')[0];
	
			$$('#FundsName').val(result.projectName);
			$$('#beginTime').val(result.projectStartDate);
			$$('#endTime').val(result.projectEndDate);
			$$('#processUser').val(result.creatorName);
			$$('#fundsDetails').val(result.projectContent);
			$$('#fee').val(result.budget);
			$$('#fundsBudgetDetails').val(result.budgetDetailed);
			
			//加载图片
			showReadonlyPhotos(result.enclosures);
		});	
	}


	/**
	 * 显示已读相片
	 * @param {Object} picUrlList 需要显示的图片数组
	 */
	function showReadonlyPhotos(picUrlList) {
		$$.each(picUrlList, function(index, item) {
			var item = item.filePath;
			photoBrowserPhotos.push(app.filePath + item);
			var random = app.utils.generateGUID();
			$$('.weui_uploader').append(
				'<div class="weui_uploader_bd kpiPicture">' +
				'<div class="picContainer" id="img_' + random + '">' +
				'<img src="' + app.filePath + item + '" class="picSize" />' +
				'</div>' +
				'</div>');
			$$('#img_' + random).on('click', function(e) {
				e.stopPropagation();
				var picIndex = $$(this).parent().index();
				photoBrowserPopup = app.myApp.photoBrowser({
					photos: photoBrowserPhotos,
					theme: 'dark',
					backLinkText: '关闭',
					ofText: '/',
					type: 'popup',
				});
				photoBrowserPopup.open(picIndex - 1);
			});
		});
	}
	
	/*
	 * 删除
	 */
	function deleteHonor(honorId){
		app.ajaxLoadPageContent1(deleteHonorPath+honorId, {
			// honorId:honorId,
		}, function(data) {
			if(data.data == true){
				app.myApp.toast('删除成功', 'success').show(true);
				setTimeout(function() {
					//调用
					require(['js/pages/user/personalHonorList'], function(personalHonorList) {
						personalHonorList.refresh();
					});
				}, 1000);
				app.myApp.hidePreloader();
				app.myApp.getCurrentView().back();
			}
		},{
			type:'DELETE'
		});
	}
	/*
	 * 刷新
	 */
	function refresh(){
		app.myApp.getCurrentView().back();
	}
	
	/**
	 * 重置firstIn变量 
	 */
	function resetFirstIn() {
		firstIn = 1;
	}

	return {
		init: init,
		refresh:refresh,
		resetFirstIn: resetFirstIn,
	}
});