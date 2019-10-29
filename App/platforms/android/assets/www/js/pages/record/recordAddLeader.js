define(['app',
	'hbs!js/hbs/payPeople',
	'hbs!js/hbs/recordRmLeader',
	'js/pages/record/recordNew'
], function(app, payPeopleTemplate, recordRmLeaderTemplate, recordNew) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//查找子部门
//	var findDeptPath = app.basePath + 'extWorkLog/findDept';
	var findDeptPath = app.basePath + '/mobile/political/department/list';
	//选择部门人员
	var findDeptPeoplePath = app.basePath + '/mobile/user/findDeptPeople/';
	//模糊搜索部门人员
	var searchDeptPeoplePath = app.basePath + '/mobile/user/searchDeptPeople';
	//用于判断该部门是否请求过数据
	var deptIdList = {};
	var oldContent = '';
	var leaderList = [];
	var deptType = '';
	var searchList = [];

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('record/recordAddLeader', [
//			'record/recordShowPeople'
//		]);
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
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
		deptIdList = {};
		oldContent = '';
		leaderList = JSON.parse(pageData.leaderList);
		deptType = pageData.deptType;
		showSendLeader();
		searchList = [];
		// findDept(app.user.deptId, '', '',0);
		findDept(-1, '', '',0);
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		$$('.u-vmenu').html(pageDataStorage['dept']);
		var appendEle = pageDataStorage['appendEle'] || $$('.u-vmenu');
		appendEle.find('a').on('click', function() {
			var deptId = $$(this).data('deptId');
			if(deptId && !deptIdList[deptId]) {
				findDept(deptId, $$($$(this).parent()[0]), $(this),1);
			}
		});
		appendEle.find('ul').find('img').on('click', function(e) {
			e.stopPropagation();
			var deptId = $$(this).data('deptId');
			var deptName = $$(this).data('deptName');
			if(deptId) {
				findDeptPeople(deptId, deptName);
			}
		});
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.searchBtnRow .chooseLeader').on('click', chooseLeader);
		$$('.searchBtnRow .allChoose').on('click', allChoose);
		$$('#payPeopleSearch').on('focus', showSearchList);
		$$('.editLeader').on('click', editLeader);
		$$('.payPeopleSearchBar .searchCancelBtn').on('click', hideSearchList);
		$$('#payPeopleSearch').on('keyup', keyupContent);
		$$('.payDetail').on('click', payDetail);
		$$('.payPeopleSearchBar .searchbar-clear').on('click', clearContent);
	}

	/**
	 * 选择发送到的用户 
	 */
	function chooseLeader() {
//		var search = $$('.payPeopleerSearchList').find('input[name="payBox"]:checked');
//		if(search.length == 0) {
//			app.myApp.alert('请选择用户');
//		} else {
//			$$.each(search, function(index, item) {
//				//判断是否是选中的状态
//				var id = $$(item).val();
//				for(var i = 0; i < searchList.length; i++) {
//					console.log(searchList[i].userId)
//					if(id == searchList[i].userId) {
//						leaderList.push(searchList[i]);
//						console.log(leaderList);
//					}
//				}
//			});
//			hideSearchList();
//			showSendLeader();
//		}
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
			hideSearchList();
			showSendLeader();
		}
	}

	/**
	 * 显示接受用户 
	 */
	function showSendLeader() {
		var tempArr = [];
		var showLeaderList = [];
		//筛选重复数据
		$$.each(leaderList, function(index, item) {
			if($.inArray(item.userId, tempArr) == -1) {
				tempArr.push(item.userId);
				showLeaderList.push(item);
			}
		});
		leaderList = showLeaderList;
		var leaderHtml = '';
		if(leaderList.length > 0) {
			$$('.editLeader').css('display', 'block');
			try {
				$$.each(leaderList, function(index, item) {
					if(index > 1) {
						throw(' ');
					}
					leaderHtml += item.userName + '，';
				})
				$$('#sendLeader').val(leaderHtml);
			} catch(e) {
				$$('#sendLeader').val(leaderHtml + '等' + leaderList.length + '人');
				return; //在这里return  
			}
		} else {
			$$('.editLeader').css('display', 'none');
			$$('#sendLeader').val("");
		}
	}

	/**
	 * 全选反选 
	 */
	function allChoose() {
		$$.each($$('.payPeopleerSearchList').find('input[name="payBox"]'), function(index, item) {
			if(!$$(item)[0].checked) {
				$$(item)[0].checked = true;
			} else {
				$$(item)[0].checked = false;
			}
		});
	}

	/**
	 * 显示搜索列表 
	 */
	function showSearchList() {
		$$(this).css('text-align', 'left');
		$$('.payPeopleSearchBar .searchCancelBtn').css('display', 'block');
		$$('.payContent').css('display', 'none');
		$$('.infinite-scroll.paySearch').css('display', 'block');
		$$('.chooseBtnRow').css('display', 'flex');
		$$('.sendTo').css('display', 'none');
	}

	/**
	 * 编辑已选发送到的用户 
	 */
	function editLeader() {
		var myPopup = app.myApp.popup(
			'<div class="popup">' +
			'<div class="navbar">' +
			'<div class="navbar-inner">' +
			'<div class="left close-popup"><a href="#" class="link icon-only"><i class="icon icon-eback"></i></a></div>' +
			'<div class="center">需要发送的用户</div>' +
			'<div class="right"></div>' +
			'</div>' +
			'</div>' +
			'<div class="page-content">' +
			'<div class="deptBtnRow rmBtnRow">' +
			'<p style="margin: 0 10px;"><a href="#" class="button button-fill allChoose">全选/反选</a></p>' +
			'<p style="margin: 0 10px;"><a href="#" class="button button-fill color-red rmLeader">移除</a></p>' +
			'</div>' +
			'<div class="list-block rmLeaderList searchbar-found" style="margin: 0;">' +
			'<ul>' +
			'</ul>' +
			'</div>' +
			'</div>' +
			'</div>'
		);
		$$('.rmLeaderList ul').append(recordRmLeaderTemplate(leaderList));
		//全选反选
		$$('.rmBtnRow .allChoose').on('click', function() {
			$$.each($$('.rmLeaderList').find('input[name="payBox"]'), function(index, item) {
				if(!$$(item)[0].checked) {
					$$(item)[0].checked = true;
				} else {
					$$(item)[0].checked = false;
				}
			});
		});
		//移除人员
		$$('.rmBtnRow .rmLeader').on('click', function() {
			var search = $$('.rmLeaderList').find('input[name="payBox"]:checked');
			if(search.length == 0) {
				app.myApp.alert('请选择用户');
			} else {
				for(var i = search.length - 1; i >= 0; i--) {
					var id = parseInt($$(search[i]).val());
					for(var j = leaderList.length - 1; j >= 0; j--) {
						if(id == leaderList[j].userId) {
							leaderList.splice(j, 1);
						}
					}
				}
				//					$$('.rmBack').click();
				app.myApp.closeModal(myPopup);
				showSendLeader();
			}
		});
	}

	/**
	 * 隐藏搜索列表
	 */
	function hideSearchList() {
		oldContent = '';
		loading = true;
		pageNo = 1;
		$$('#payPeopleSearch').val("");
		$$('.payPeopleSearchBar #payPeopleSearch').css('text-align', 'center');
		$$('.payPeopleSearchBar .searchCancelBtn').css('display', 'none');
		$$('.payPeopleerSearchList ul').html("");
		$$('.payContent').css('display', 'block');
		$$('.infinite-scroll.paySearch').css('display', 'none');
		$$('.chooseBtnRow').css('display', 'none');
		$$('.sendTo').css('display', 'block');
		$$('.payPeopleSearchBar .searchbar-clear').css('opacity', '0');
		$$('.payPeopleNotFound').css('display', 'none');
	}

	/**
	 * 输入文字时 
	 */
	function keyupContent() {
		var searchContent = $$('#payPeopleSearch').val();
		if(!searchContent) {
			oldContent = '';
			$$('.payPeopleSearchBar .searchbar-clear').css('opacity', '0');
			$$('.payPeopleerSearchList ul').html("");
		} else {
			$$('.payPeopleSearchBar .searchbar-clear').css('opacity', '1');
		}
		searchPeople(searchContent, false);
	}

	/**
	 * 搜索接受方 
	 * @param {Object} content 输入的关键字
	 */
	function searchPeople(content, isLoadMore) {
		if(!isLoadMore) {
			content = content.trim();
			if(content != oldContent) {
				oldContent = content;
				$$('.payPeopleerSearchList ul').html("");
				pageNo = 1;
			} else {
				return;
			}
		}
		$$('.payPeopleNotFound').css('display', 'none');
		if(!content) {
			return;
		}
		app.ajaxLoadPageContent(searchDeptPeoplePath, {
			// userId: app.userId,
			// userName: content,
			// pageNo: pageNo,
			// type: 0,
			// deptId: app.user.deptId
			name:content
		}, function(data) {
			var data = data.data;
			console.log(data);
			if(data.length > 0) {
				if(data.length == 10) {
					loading = false;
				}
				searchList.push(data);
				$$('.payPeopleerSearchList ul').append(payPeopleTemplate(data));
			} else if(isLoadMore) {

			} else {
				$$('.payPeopleerSearchList ul').html("");
				$$('.payPeopleNotFound').css('display', 'block');
			}
		});
	}

	/**
	 * 点击确认 
	 */
	function payDetail() {
		if(!leaderList.length) {
			app.myApp.confirm('还没选择用户<br />确认返回?', function() {
				backAction();
			});
		} else {
			backAction();
		}

		function backAction() {
			app.myApp.getCurrentView().back();
			recordNew.addLeaderBack(leaderList);
		}
	}

	/**
	 * 清空按钮
	 */
	function clearContent() {
		oldContent = '';
		loading = true;
		pageNo = 1;
		$$(this).css('opacity', '0');
		$$('.payPeopleerSearchList ul').html("");
		$$('#payPeopleSearch').val("");
	}

	/**
	 * 加载部门 
	 */
	function findDept(parentId, elements, currentEle,type) {
		app.ajaxLoadPageContent(findDeptPath, {
			parentId: parentId,
//			deptType: deptType,
			// type:type,
			userId: app.userId
		}, function(result) {
			var data = result;

			console.log('加载部门');
			console.log(data);
			deptIdList[parentId] = 1;
			if(data.length) {
				handleData(data, elements);
				if(elements) {
					currentEle.click();
				}
			} else {
				app.myApp.alert('该单位已经是最后一级');
			}
		});
	}

	/**
	 *  处理返回的数据
	 * @param {Object} data 返回的数据
	 * @param {Object} elements 点击的页面元素
	 */
	function handleData(data, elements) {
		var deptData = data;
		//elements不为空，则为该元素追加数据；否则为主表格追加
		var appendEle = elements || $$('.u-vmenu');
		if(elements) {
			appendEle.append('<ul>');
		} else {
			appendEle.append('<ul style="padding: 0px;margin: 5px;">');
		}
		console.log('处理返回的数据')
		console.log(data)
		$$.each(deptData, function(index, item) {
			appendEle.find('ul').append(
				'<li>' +
				'<a href="#" data-deptId="' + item.id + '">' + item.label + '</a>' +
				'<div style="position: relative;float: right;bottom: 40px;right: 10px;">' +
				'<img src="img/icon/icon-user.png" data-deptId="' + item.id + '" data-deptName="' + item.label + '" />' +
				'</div>' +
				'</li>'
			);
		});
		$(".u-vmenu").vmenuModule();
		pageDataStorage['dept'] = $$('.u-vmenu').html();
		pageDataStorage['appendEle'] = appendEle;
		appendEle.find('a').on('click', function() {
			var deptId = $$(this).data('deptId');
			if(deptId && !deptIdList[deptId]) {
				findDept(deptId, $$($$(this).parent()[0]), $(this),1);
			}
		});
		appendEle.find('ul').find('img').on('click', function(e) {
			e.stopPropagation();
			var deptId = $$(this).data('deptId');
			var deptName = $$(this).data('deptName');
			if(deptId) {
				findDeptPeople(deptId, deptName);
			}
		});
	}

	/**
	 *  选择缴纳的人数
	 * @param {Object} deptId 部门ID
	 */
	function findDeptPeople(deptId, deptName) {
		app.myApp.getCurrentView().loadPage('recordShowPeople.html?deptName=' + deptName + '&deptId=' + deptId + '&backPage=recordAddLeader');
		return;
	}

	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll.paySearch');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			searchPeople(oldContent, true);
		});
	}

	/**
	 *  赋值leaderList 
	 */
	function setLeaderList(list) {
		leaderList = leaderList.concat(list);
		showSendLeader();
	}

	/**
	 * 重置firstIn变量 
	 */
	function resetFirstIn() {
		firstIn = 1;
	}

	return {
		init: init,
		setLeaderList: setLeaderList,
		resetFirstIn: resetFirstIn,
	}
});