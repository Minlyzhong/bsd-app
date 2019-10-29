define(['app',
	'hbs!js/hbs/signPeople',
	'hbs!js/hbs/signOutPeople'
], function(app, peopleTemplate, outPeopleTemplate) {
	var $$ = Dom7;
	var firstIn = 1;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('signReport/signPeople', [
//			'signReport/signMap',
//		]);
		app.back2Home();
		attrDefine(page);
		clickEvent(page);
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.signPeopleTitle').html(page.query.name);
		if(page.query.clickable == 1) {
			$$('.signPeopleList ul').html(peopleTemplate(JSON.parse(page.query.item)));
		} else {
			$$('.signPeopleList ul').html(outPeopleTemplate(JSON.parse(page.query.item)));
		}
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.signPeopleContent').on('click', function() {
			var index = $$(this).parents().index();
			var data = JSON.parse(page.query.item)[index];
			console.log(data);
			app.myApp.getCurrentView().loadPage('signMap.html?item=' + JSON.stringify(data));
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