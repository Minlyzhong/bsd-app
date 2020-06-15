define(['app','hbs!js/hbs/userMessageList'], function(app,personalMessageListTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageNo = 1;
	var pageNo1 = 1;
	var loading = true;
	//搜索自己的留言列表
	var showMsgListPath = app.basePath + '/mobile/voice/list';
	var NewRecordKey ='';
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		app.back2Home();
		attrDefine(page);
		// clickEvent(page);
		pushAndPull(page);
		loadHonorList(false);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		pageNo = 1;
		firstIn = 0;
		count = 0;
		photoBrowserPhotos = [];
		photoDatas = [];
		photoBrowserPopup = '';
		pageDataStorage = {}; 
		var NewRecordKey ='';
		$$('.personalHonorTitle').html(pageData.appName);
		$$('.subordBranch').html("所属组织 : "+app.userDetail.deptName);
	}
	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {

	}
	
	/*
	 * 读取数据
	 */
	function loadHonorList(isLoadMore){
		console.log('-----22');
		app.ajaxLoadPageContent(showMsgListPath, {
			// userId: app.userId,
			pageNo: pageNo,
			pageSize: 10,
			
		}, function(result) {
			var result = result.data.records;
			console.log(result);

			if(result.length > 0 ){
				$$.each(result, function(index, item){
					item.createTime = app.getnowdata(item.createTime); 
					item.memo = item.memo || null; 
					if(item.memo){
						item.hasMemo = 1;
					}else{
						item.hasMemo = 0;
					}
					
				})
				
				if(isLoadMore){
					$$('.MessageList ul').append(personalMessageListTemplate(result));
					loading = false;
				}else{
					
					$$('.MessageList ul').html(personalMessageListTemplate(result));
					// loading = true;
					loading = false;
				}
				
			}else if(result.length <=0 && pageNo == 1){
					loading = true;
				$$('.MessageList ul').html("<div style='text-align: center;margin-top:10px;'>暂无历史留言</div>");
			}
			// else{
			// 	loading = true;
			// 	$$('.MessageList ul').html("");
			// }
			
		});
	}
	/*
	 * 读取搜索数据
	 */
	// function loadRecord1(isLoadMore, page){
	// 	app.ajaxLoadPageContent(showMsgListPath, {
	// 		// userId: app.userId,
	// 		pageNo: pageNo,
	// 		pageSize: 20,
	// 		query: NewRecordKey
	// 	}, function(result) {
	// 		var result = result.data.records;
	// 		console.log(result);
	// 		if(result.length > 0){
	// 			$$.each(result, function(index, item){
	// 				item.createTime = app.getnowdata(item.createTime); 
	// 			})
				
	// 			if(isLoadMore){
	// 				$$('.firstShowPeopleList ul').append(personalMessageListTemplate(result));
	// 				loading = false;
	// 			}else{
					
	// 				$$('.firstShowPeopleList ul').html(personalMessageListTemplate(result));
	// 				loading = true;
	// 			}
	// 		}else{
	// 			loading = true;
	// 			$$('.firstShowPeopleList ul').html("");
	// 		}
			
	// 	});
	// }
	/**
	 *	刷新 
	 */
	function refresh(){
		setTimeout(function() {
			pageNo = 1;
			loading = true;
			//这里写请求
			loadHonorList(false);
			app.myApp.pullToRefreshDone();
		}, 1000);
	}
	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//下拉刷新
		var ptrContent = $$(page.container).find('.pull-to-refresh-content');
		ptrContent.on('refresh', function(e) {
			setTimeout(function() {
				pageNo = 1;
				loading = true;
				loadHonorList(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});

		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		loadMoreContent.on('infinite', function() {
			// 如果正在加载，则退出
			if(loading) return;
			loading = true;
			pageNo += 1;
			loadHonorList(true);
		});
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