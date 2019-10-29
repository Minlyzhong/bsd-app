define(['app','hbs!js/hbs/dailyLearning'], function(app,dLTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageNo = 1;
	var loading = true;
	//获取每日一学接口
	var dailyLearningPath = app.basePath + '/mobile/course/content/list/';
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		app.back2Home();
		attrDefine(page);
		clickEvent(page);
		pushAndPull(page);
		ajaxLoadContent(false,pageNo);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageNo = 1;
		loading = true;
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {}
	
	function ajaxLoadContent(isLoadMore,pageNo){
		var dataResult=[];
		app.ajaxLoadPageContent1(dailyLearningPath+app.userId, {
			// userId:app.userId,
			pageNo:pageNo,
		}, function(data) {
			console.log(data);
			var result = data.data.reverse();
			$.each(result, function(index,item) {
				var dLResult = {
					contentId:0,
					catalogId:0,
					contentTitle:'',
					basePath:app.basePath,
					titlePic:'',
					isStudy:"",
				}
				dLResult.contentId = item.contentId;
				dLResult.catalogId = item.catalogId;
				dLResult.contentTitle = item.contentTitle;
				dLResult.titlePic = app.filePath + item.titlePic;
				dLResult.isStudy = item.isStudy.toString();
				dataResult.push(dLResult);
			});
			console.log(dataResult);
			if(result && result.length>0){
				if(isLoadMore){
					$$('.learningList').append(dLTemplate(dataResult));
				}else{
					$$('.learningList').html(dLTemplate(dataResult));
				}
				$$('.dailyLearningCard').on('click',function(){
					var contentId = $$(this).data('id');
					var catalogId = $$(this).data('cid');
					var isStudy = $$(this).data('isstudy');
					app.myApp.getCurrentView().loadPage('newsDetail.html?id=' + contentId +'&cid='+catalogId+'&isLearning='+isStudy+'&type=3');
				});	
				loading = false;
			}else{
				loading = true;
			}	
		});
	}
	
	
	/**
	 *	刷新 
	 */
	function refresh(){
		setTimeout(function() {
			pageNo = 1;
			loading = true;
			//这里写请求
			ajaxLoadContent(false,pageNo);
			app.myApp.pullToRefreshDone();
		}, 1000);
	}
	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		
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
				//这里写请求
				ajaxLoadContent(false,pageNo);
				app.myApp.pullToRefreshDone();
			}, 500);
		});
		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			//这里写请求
			ajaxLoadContent(true,pageNo);	
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