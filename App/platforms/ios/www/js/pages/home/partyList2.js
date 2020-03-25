define(['app',
	'hbs!js/hbs/partySmallList'
], function(app, template) {
	var $$ = Dom7;
	var firstIn = 1;

	var catId = 0;
	var List=[];

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		app.back2Home();
		clickEvent();
		attrDefine(page.query.title);
		pushAndPull(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		List = pageData.List;
		console.log(JSON.parse(List));
		ajaxLoadContent();
	}

	/**
	 * 点击事件
	 */
	function clickEvent() {
		$$('.SmallList').on('click',function(){
		var id = $$(this).data('id');
		var title = $$(this).data('title');
		var curl = $$(this).data('cUrl');
		var icon = $$(this).data('icon');
		console.log('curl')
		console.log(curl)
		if(curl != '' && curl != undefined){
			app.myApp.getCurrentView().loadPage(curl+'?appName='+title);
		}
		if(curl == undefined && curl != ''){
			app.myApp.getCurrentView().loadPage('partyList.html?id='+id+'&title='+title);
		}
		});
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(title) {
		$$('.party-titleSmall').html(title);
	}

	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent() {
		partyGetList(false);
	}
	function partyGetList(isLoadMore) {
		
		$$('.partySmallList ul').html(template(JSON.parse(List)));
		// $$('.partySmallList ul li').style.backgroundImage="url(../../../../../img/newIcon/background.png)"
	}

	
	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//下拉刷新	
		var ptrContent = $$(page.container).find('.partyPage');
		ptrContent.on('refresh', function(e) {
			setTimeout(function() {
				app.myApp.pullToRefreshDone();
			}, 500);
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
		resetFirstIn: resetFirstIn,
	}
});