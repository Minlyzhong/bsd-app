define(['app',
	'hbs!js/hbs/assessInformationLost'
], function(app, tdjTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//获取未参与考核的党支部列表
	var findCompPagerOfPartyOffDZB = app.basePath + '/mobile/partyAm/findCompPagerOfPartyOffDZB/';
	//获取未参与三会一课的党支部列表
	var findCompRateOfThreePlusX = app.basePath + '/mobile/partyAm/getOneDepartmentCompletionStatus';
	//var topicId = 0;
	var deptId = 0;
	
	var CompRateOfThreePlusXAppName;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		app.back2Home();
		attrDefine(page);
		pushAndPull(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		//topicId = pageData.topicId;
		deptId = pageData.deptId;
		CompRateOfThreePlusXAppName = pageData.CompRateOfThreePlusXAppName;
		//console.log(topicId)
		if(CompRateOfThreePlusXAppName == undefined){
			ajaxLoadContent(false);
		}else{
			ajaxLoadContent1(false);
		}
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		handleParty(pageDataStorage['party'], false);
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		//var head = page.query.head;
		//var rege = new RegExp("equal", "g"); //g,表示全部替换。
		//$$('.atdjHead').html(head.replace(rege, '='));
	}

	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent(isLoadMore) {
		console.log('1');
		app.ajaxLoadPageContent(findCompPagerOfPartyOffDZB+deptId, {
			// deptId: deptId,
			current: pageNo,
			size: 20,
		}, function(data) {
			var result = data.data.records;
			console.log(result);
			if(isLoadMore) {
				pageDataStorage['party'] = pageDataStorage['party'].concat(result);
			} else {
				pageDataStorage['party'] = result;
			}
			console.log(result.length);
			handleParty(result, isLoadMore);
		});
	}
	
	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent1(isLoadMore) {
		console.log(pageNo);
		app.ajaxLoadPageContent(findCompRateOfThreePlusX, {
			// userId: app.userId,
			deptId: deptId,
			current: pageNo,
			size: 10,
		}, function(data) {
			var result = data.data;
			console.log(result);
			if(isLoadMore) {
				pageDataStorage['party'] = pageDataStorage['party'].concat(result);
			} else {
				pageDataStorage['party'] = result;
			}
			console.log(result.length);
			handleParty(result, isLoadMore);
		});
	}

	/**
	 * 加载数据 
	 */
	function handleParty(result, isLoadMore) {
		if(result) {
			if(isLoadMore) {
				$$('.atdjList ul').append(tdjTemplate(result));
			} else {
				$$('.atdjList ul').html(tdjTemplate(result));
			}
			//$$('.atdjList .item-content').off('click', loadPage);
			//$$('.atdjList .item-content').on('click', loadPage);
			if(result.length == 20) {
				loading = false;
			}
		}
	}
	
	/**
	 * 页面跳转 
	 * @param {Object} type
	 */
	function loadPage() {
//		var regn = new RegExp("\n", "g"); //g,表示全部替换。
//		var regt = new RegExp("\t", "g"); //g,表示全部替换。
//		var rege = new RegExp("=", "g"); //g,表示全部替换。
//		var head = $$('.atdjHead').html();
//		head = head.replace(regn, '').replace(regt, '').replace(rege, 'equal');
		var name = $$(this).data('name');
		var id = $$(this).data('id');
//		app.myApp.getCurrentView().loadPage('assessTDJDetail.html?head=' + head + '&id=' + id + '&name=' + name + '&deptId=' + deptId + '&topicId=' + topicId);
	}

	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			//这里写请求
			if(CompRateOfThreePlusXAppName == undefined){
				console.log('1');
				ajaxLoadContent(true);
			}else{
				ajaxLoadContent1(true);
			}
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