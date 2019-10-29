define(['app'
], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page);
		clickEvent(page);
		app.back2Home();
	}

	/**
	 * 初始化模块变量
	 */
	function initData(page) {
		if(app.roleId != 1){
			$$('.partyCommitteeEntrance').css('display','none');
		}else if(app.roleId != 1 && app.roleId != 6){
			$$('.branchEntrance').css('display','none');
		}
	}
	/*
	 * 点击事件
	 */
	function clickEvent(page){
		//党委考核结果
		$$('.partyCommitteeEntrance').click(function(){
			app.myApp.getCurrentView().loadPage('assessmentResultPartyCommittee.html');
		});
		//支部考核结果
		$$('.branchEntrance').click(function(){
			app.myApp.getCurrentView().loadPage('assessmentResultBranch.html');
		});
		//个人考核结果
		$$('.personalEntrance').click(function(){
			app.myApp.getCurrentView().loadPage('assessmentResultPersonal.html');
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