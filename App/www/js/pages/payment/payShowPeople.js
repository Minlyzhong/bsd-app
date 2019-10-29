define(['app',
	'hbs!js/hbs/payPeople',
], function(app, payPeopleTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var deptName = '';
	var oldContent = '';
	var backPage = '';
	var deptId = 0;
	var pageNo = 1;
	var loading = false;
	var searchNo = 1;
	var searchLoading = false;
	//选择部门人员
	var findDeptPeoplePath = app.basePath + 'payment/payPeople';
	//模糊搜索部门人员
	var searchDeptPeoplePath = app.basePath + 'payment/paySearchPeople';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
		attrDefine(page);
		clickEvent(page);
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
		oldContent = '';
		deptName = pageData.deptName;
		deptId = pageData.deptId;
		backPage = pageData.backPage;
		searchLoading = true;
		searchNo = 1;
		ajaxLoadContent();
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {

	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.deptName').html(deptName);
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('#payShowPeopleSearch').on('focus', showSearchList);
		$$('.payShowPeopleSearchBar .searchCancelBtn').on('click', hideSearchList);
		$$('#payShowPeopleSearch').on('keyup', keyupContent);
		$$('.payShowPeopleSearchBar .searchbar-clear').on('click', clearContent);
		//全选反选
		$$('.payShowBtnRow .allChoose').on('click', payAllChoose);
		//选择人员
		$$('.payShowBtnRow .chooseLeader').on('click', payChooseLeader);
		$$('.searchShowBtnRow .chooseLeader').on('click', chooseLeader);
		$$('.searchShowBtnRow .allChoose').on('click', allChoose);
	}

	/**
	 * 人员全选 
	 */
	function payAllChoose() {
		$$.each($$('.list-pay-search').find('input[name="payBox"]'), function(index, item) {
			if(!$$(item)[0].checked) {
				$$(item)[0].checked = true;
			} else {
				$$(item)[0].checked = false;
			}
		});
	}

	/**
	 * 人员选择 
	 */
	function payChooseLeader() {
		var leaderList = [];
		var search = $$('.list-pay-search').find('input[name="payBox"]:checked');
		if(search.length == 0) {
			app.myApp.alert('请选择用户');
		} else {
			$$.each(search, function(index, item) {
				var userObj = {
					userId: parseInt($$(item).val()),
					userName: $$(item).parent().find('.item-title span').html(),
					deptName: $$(item).parent().find('.item-title p').html()
				}
				leaderList.push(userObj);
			});
			var payPeople = require('js/pages/payment/' + backPage);
			payPeople.setLeaderList(leaderList);
			app.myApp.getCurrentView().back();
		}
	}

	/**
	 * 显示搜索列表 
	 */
	function showSearchList() {
		$$(this).css('text-align', 'left');
		$$('.payShowPeopleSearchBar .searchCancelBtn').css('display', 'block');
		$$('.infinite-scroll.search').css('display', 'block');
		$$('.infinite-scroll.content').css('display', 'none');
		$$('.searchShowBtnRow').css('display', 'flex');
	}

	/**
	 * 隐藏搜索列表
	 */
	function hideSearchList() {
		oldContent = '';
		searchNo = 1;
		searchLoading = true;
		$$('#payShowPeopleSearch').val("");
		$$('.payShowPeopleSearchBar #payShowPeopleSearch').css('text-align', 'center');
		$$('.payShowPeopleSearchBar .searchCancelBtn').css('display', 'none');
		$$('.payShowPeopleList ul').html("");
		$$('.infinite-scroll.search').css('display', 'none');
		$$('.infinite-scroll.content').css('display', 'block');
		$$('.searchShowBtnRow').css('display', 'none');
		$$('.payShowPeopleSearchBar .searchbar-clear').css('opacity', '0');
		$$('.payPeopleNotFound').css('display', 'none');
	}

	/**
	 * 输入文字时 
	 */
	function keyupContent() {
		var searchContent = $$('#payShowPeopleSearch').val();
		if(!searchContent) {
			oldContent = '';
			$$('.payShowPeopleSearchBar .searchbar-clear').css('opacity', '0');
			$$('.payShowPeopleList ul').html("");
		} else {
			$$('.payShowPeopleSearchBar .searchbar-clear').css('opacity', '1');
		}
		searchPeople(searchContent, false);
	}

	/**
	 * 搜索接受方 
	 * @param {Object} content 输入的关键字
	 * @param {Object} isLoadMore 是否加载更多
	 */
	function searchPeople(content, isLoadMore) {
		if(!isLoadMore) {
			content = content.trim();
			if(content != oldContent) {
				oldContent = content;
			} else {
				return;
			}
		}
		$$('.payPeopleNotFound').css('display', 'none');
		if(!content) {
			return;
		}
		app.ajaxLoadPageContent(searchDeptPeoplePath, {
			userName: content,
			deptId: deptId,
			pageNo: searchNo
		}, function(data) {
			console.log(data);
			if(data.length > 0) {
				if(data.length == 10) {
					searchLoading = false;
				}
				var searchList = data;
				$$('.payShowPeopleList ul').append(payPeopleTemplate(data));
			} else if(isLoadMore) {

			} else {
				$$('.payShowPeopleList ul').html("");
				$$('.payPeopleNotFound').css('display', 'block');
			}
		});
	}

	/**
	 * 选择发送到的用户 
	 */
	function chooseLeader() {
		var leaderList = [];
		var search = $$('.payPeopleerSearchList').find('input[name="payBox"]:checked');
		if(search.length == 0) {
			app.myApp.alert('请选择用户');
		} else {
			$$.each(search, function(index, item) {
				var userObj = {
					userId: parseInt($$(item).val()),
					userName: $$(item).parent().find('.item-title span').html(),
					deptName: $$(item).parent().find('.item-title p').html()
				}
				leaderList.push(userObj);
			});
			var payPeople = require('js/pages/' + backPage);
			payPeople.setLeaderList(leaderList);
			app.myApp.getCurrentView().back();
		}
	}

	/**
	 * 全选反选 
	 */
	function allChoose() {
		$$.each($$('.payShowPeopleList').find('input[name="payBox"]'), function(index, item) {
			if(!$$(item)[0].checked) {
				$$(item)[0].checked = true;
			} else {
				$$(item)[0].checked = false;
			}
		});
	}

	/**
	 * 清空按钮 
	 */
	function clearContent() {
		oldContent = '';
		searchNo = 1;
		searchLoading = true;
		$$(this).css('opacity', '0');
		$$('.payShowPeopleList ul').html("");
		$$('#payShowPeopleSearch').val("");
	}

	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent() {
		app.ajaxLoadPageContent(findDeptPeoplePath, {
			deptId: deptId,
			pageNo: pageNo,
		}, function(result) {
			var data = result;
			console.log(data);
			if(data.length) {
				if(data.length == 10) {
					loading = false;
				}
				var deptList = data;
				$$('.list-pay-search ul').append(payPeopleTemplate(data));
			} else {
				app.myApp.alert('该单位暂无工作人员');
			}
		});
	}

	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//加载更多
		var loadMoreSearch = $$(page.container).find('.infinite-scroll.search');
		loadMoreSearch.on('infinite', function() {
			if(searchLoading) return;
			searchLoading = true;
			searchNo += 1;
			searchPeople(oldContent, true);
		});
		var loadMoreContent = $$(page.container).find('.infinite-scroll.content');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			ajaxLoadContent();
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