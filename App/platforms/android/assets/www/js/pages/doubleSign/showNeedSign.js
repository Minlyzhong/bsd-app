define(['app',
	'hbs!js/hbs/addSign',
], function(app, payPeopleTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	var searchNo = 1;
	var searchLoading = true;
	//获取下一步签字列表
	var findDeptPeoplePath = app.basePath + '/mobile/dbSign/applyList';
	//模糊获取下一步签字列表
	// var searchDeptPeoplePath = app.basePath + '/mobile/dbSign/applyList';
	var deptName = '';
	var oldContent = '';
	var backPage = '';
	var deptId = 0;
	var state = 0;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		app.back2Home();
		clickEvent();
		attrDefine();
		pushAndPull(page);
		ajaxLoadContent(false);
		$$('.chooseHostButton').css("margin-left",(window.screen.width-60)+'px');
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		oldContent = '';
		deptName = pageData.deptName;
		deptId = pageData.deptId;
		if(pageData.state){
			state = pageData.state;
		}
		
		
		pageNo = 1;
		loading = true;
		searchLoading = true;
		searchNo = 1;
	}

	/**
	 * 点击事件
	 */
	function clickEvent() {
		$$('#payShowPeopleSearch').on('focus', showSearchList);
		$$('.payShowPeopleSearchBar .searchCancelBtn').on('click', hideSearchList);
		$$('#payShowPeopleSearch').on('keyup', keyupContent);
		$$('.payShowPeopleSearchBar .searchbar-clear').on('click', function() {
			oldContent = '';
			searchNo = 1;
			searchLoading = true;
			$$(this).css('opacity', '0');
			$$('.payShowPeopleList ul').html("");
			$$('#payShowPeopleSearch').val("");
		});
		//全选反选
//		$$('.payShowBtnRow .allChoose').on('click', function() {
//			$$.each($$('.list-pay-search').find('input[name="payBox"]'), function(index, item) {
//				if(!$$(item)[0].checked) {
//					$$(item)[0].checked = true;
//				} else {
//					$$(item)[0].checked = false;
//				}
//			});
//		});
		//选择人员
		$$('.chooseLeader').on('click', function() {
			var leaderList = [];
			var search = $$('.list-pay-search').find('input[name="payBox"]:checked');
			console.log(search);
			if(search.length == 0) {
				app.myApp.alert('请选择用户');
			} else {
				$$.each(search, function(index, item) {
					var userObj = {
						userId: parseInt($$(item).val()),
						name: $$(item).parent().find('.item-title span').html(),
						deptName: $$(item).parent().find('.item-title p').html(),
						deptId: $$(item).data('deptId'),
						// tenantId: $$(item).data('tenantId')

					}
					leaderList = [];
					leaderList.push(userObj);					
				});
				var payPeople = require('js/pages/doubleSign/doubleSignAdd');
				console.log(leaderList.length);
				console.log(leaderList);
				payPeople.addSignBack(leaderList[0]);
				app.myApp.getCurrentView().back();
			}
		});
		// $$('.searchShowBtnRow .chooseLeader').on('click', chooseLeader);
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine() {
		$$('.deptName').html(deptName);
	}

	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent(isLoadMore) {
		app.ajaxLoadPageContent(findDeptPeoplePath, {
			// deptId: deptId,
			userId:app.user.userId,
			current: pageNo,
			size:20,
			type:state
			// type:1
		}, function(result) {
			var data = result.data;
			console.log(data);
			if(data.length) {
				if(data.length == 20) {
					loading = false;
				}
				$$('.list-pay-search ul').append(payPeopleTemplate(data));
				loading = false;
			} else if(isLoadMore) {

			} else {
				app.myApp.alert('该单位暂无工作人员');
			}
		});
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
	// function searchPeople(content, isLoadMore) {
	// 	if(!isLoadMore) {
	// 		content = content.trim();
	// 		if(content != oldContent) {
	// 			oldContent = content;
	// 		} else {
	// 			return;
	// 		}
	// 	}
	// 	$$('.payPeopleNotFound').css('display', 'none');
	// 	if(!content) {
	// 		return;
	// 	}
	// 	app.ajaxLoadPageContent(searchDeptPeoplePath, {
	// 		name: content,
	// 		userId:app.user.userId,
	// 		type:state
	// 		// deptId: deptId,
	// 		// pageNo: searchNo
	// 	}, function(result) {
	// 		var data = result.data;
	// 		console.log(data);
	// 		if(data.length > 0) {
	// 			if(data.length == 10) {
	// 				searchLoading = false;
	// 			}
	// 			var searchList = data;
	// 			$$('.payShowPeopleList ul').append(payPeopleTemplate(data));
	// 		} else {
	// 			$$('.payShowPeopleList ul').html("");
	// 			$$('.payPeopleNotFound').css('display', 'block');
	// 		}
	// 	});
	// }

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
				leaderList = [];
				leaderList.push(userObj);
			});
			var payPeople = require('js/pages/doubleSignAdd/' + backPage);
			payPeople.setLeaderList(leaderList);
			app.myApp.getCurrentView().back();
		}
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
			ajaxLoadContent(true);
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