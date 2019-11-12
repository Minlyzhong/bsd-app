define(['app','hbs!js/hbs/stepList'], function(app, stepTemp) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {}; 
	var pId;
	var eventId;
	var pTitle =''; 
	var list1 =[];
	var list2 =[];
	var photoBrowserPhotos = [];
	var photoDatas = [];
	var photoBrowserPopup = '';
	var step = 0;
	//获取申报详细
	var personalProcessDetailsPath = app.basePath + '/mobile/specialDeclare/';
	//根据项目ID获取四议列表
	var meetingDetailsPath = app.basePath + '/mobile/specialDeclare/fourMeetingList';
	// 根据项目ID获取两公开列表
	var meetingShowPath = app.basePath + '/mobile/specialDeclare/resolutionPublicityList';
	
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
		list2 =[];
		list1 =[];
		pageDataStorage = {}; 
		photoBrowserPhotos = [];
		photoDatas = [];
		photoBrowserPopup = '';
		console.log(pageData);
		eventId = pageData.pId;
		
		pTitle = pageData.pTitle;
		step = pageData.step;
		//加载数据
		loadProcessDetail(eventId);
		loadHonorDetail(eventId);
		
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {}
	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		// $$('.ownDetail').click(function(){
		// 	app.myApp.getCurrentView().loadPage('processOwnDetail.html?pId='+eventId);
		// });
		
	
	}
	/*
	 * 加载数据
	 */
	function loadProcessDetail(eventId){
		app.ajaxLoadPageContent(personalProcessDetailsPath+eventId, {
			
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
		console.log(picUrlList);
		$$.each(picUrlList, function(index, item) {
			var item = item.filePath;
			photoBrowserPhotos.push(app.filePath + item);
			var random = app.utils.generateGUID();
			$$('.weui_uploader1').append(
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
	 * 加载数据
	 */
	function loadHonorDetail(eventId){
		app.myApp.showPreloader('加载中...');
		app.ajaxLoadPageContent(meetingDetailsPath, {
			eventId:eventId,
		}, function(data) {
			if(data.code == 0 ){
				var result = data.data;
				list1 = [{meetingName:'党支部会议提议', index:1, step:step, isWriter:0},{meetingName:'“两委”会商议', index:2, step:step, isWriter:0},{meetingName:'党员大会审议', index:3, step:step,isWriter:0},{meetingName:'村民代表大会决议', index:4 , step:step, isWriter:0}];
				$$.each(result, function(index, item){
					console.log(item)
					
					if(item == ''){
						list1[index].isWriter = 0;
					}else{
						
						item.meetingTime = item.meetingTime.split(' ')[0];

						list1[index].id = item.id;
						list1[index].isWriter = 1;
						list1[index].time = item.meetingTime;
						list1[index].modifer = item.record;

					}
				})
				console.log(list1)

				loadShowPath(eventId);
			}else{
				app.myApp.hidePreloader();
				app.myApp.toast('加载失败,请稍后再试','error').show(true);
			}
			
			
	
			

		});	


		
	}

	function loadShowPath(eventId){
		app.ajaxLoadPageContent(meetingShowPath, {
			eventId:eventId,
		}, function(data) {
			app.myApp.hidePreloader();
			if(data.code == 0){

				var showResult = data.data;

				list2 = [{meetingName:'会议决议公示', index:5, step:step, isWriter:0},{meetingName:'实施结果公示', index:6, step:step, isWriter:0}]
	
				$$.each(showResult, function(index, item){
					console.log(item)
					
					if(item == ''){
						list2[index].isWriter = 0;
					}else{
						item.createdDate = item.createdDate.split(' ')[0];
						
						list2[index].id = item.id;
						list2[index].isWriter = 1;
						list2[index].modifer = item.creatorName;
						list2[index].time = item.createdDate;
					}
				})
	
				
	
				var list = list1.concat(list2);
				console.log(list);
				$$('.precessList ul').append(stepTemp(list));
			
				
				$$('.precessList li').click(function(){
					
					var type = $$(this).data('type');
					
					if(type > step){
						app.myApp.toast('上一流程还没填写','error').show(true);
						return;
					}
					var name = $$(this).data('name');
					var pId = $$(this).data('id');
					var isWriter = $$(this).data('isWriter');
					console.log(type);
					console.log(isWriter);
					// 注意只有roleId 是 支部的能填写, 其他人只能看填写的内容
					if(type <= 4 && isWriter == 0){
						app.myApp.getCurrentView().loadPage('processDetailEdit.html?type='+type+'&name='+name+'&pId='+pId+'&pTitle='+pTitle+'&eventId='+eventId);
					}else if(type <= 4 && isWriter == 1){
						app.myApp.getCurrentView().loadPage('processDetailEditDone.html?type='+type+'&name='+name+'&pId='+pId+'&pTitle='+pTitle+'&eventId='+eventId);
					}else if(type > 4 && isWriter == 0){
						app.myApp.getCurrentView().loadPage('processAddResult.html?type='+type+'&name='+name+'&pId='+pId+'&pTitle='+pTitle+'&eventId='+eventId);
					}else if(type > 4 && isWriter == 1){
						app.myApp.getCurrentView().loadPage('processShowResult.html?type='+type+'&name='+name+'&eventId='+eventId+'&pId='+pId);
					}
					
		
				});	
			}
			

		});	
	}
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