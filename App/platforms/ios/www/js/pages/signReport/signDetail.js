define(['app',
	'hbs!js/hbs/signDetail'
], function(app, signDetailTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	var resultData = [];
	var title = '';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('signReport/signDetail', [
//			'signReport/signPeople',
//		]);
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
		attrDefine(page);
		clickEvent(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		title = pageData.title.trim();
		if(title != '正常打卡') {
			title = title.substring(0, 2);
		}
		resultData = [];
		handleDetail(JSON.parse(pageData.item), title);
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		$$('.signDetailList ul').html(signDetailTemplate(resultData));
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.signDetailTitle').html(title);
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.signDetailContent').on('click', function() {
			var id = parseInt($$(this).data('id'));
			var clickable = 1;
			var name = $$(this).data('name');
			if(title == '缺勤') {
				clickable = 0;
			}
			var data = JSON.parse(page.query.item);
			app.myApp.getCurrentView().loadPage('signPeople.html?item=' + JSON.stringify(data[id]) + '&name=' + name + '&clickable=' + clickable);
		});
	}

	/**
	 * 加载考勤明细 
	 */
	function handleDetail(data, title) {
		for(var key in data) {
			var peopleObj = {};
			peopleObj.id = key;
			peopleObj.name = data[key][0].name;
			peopleObj.title = title + '次数';
			peopleObj.count = data[key].length;
			resultData.push(peopleObj);
		}
		$$('.signDetailList ul').html(signDetailTemplate(resultData));
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