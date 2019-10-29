define(['app',
	'hbs!js/hbs/SignAddDept'
], function(app, addDeptTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//查找子部门
	
	var findDeptPath = app.basePath + '/mobile/political/department/list';
	//模糊搜索部门
	
	var searchDeptPeoplePath = app.basePath + '/mobile/political/department/list';
	var oldContent = '';
	var deptList = [];
	var deptType = '';
	var deptSign = '';
	var deptNameSign = '';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		app.back2Home();
		showSendDept();
		clickEvent();
		attrDefine();
		pushAndPull(page);
		ajaxLoadContent(app.user.deptId,'','',false);
	}
	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageNo = 1;
		loading = true;
		//deptList = JSON.parse(pageData.deptList);
		deptType = pageData.deptType;
		oldContent = '';
		deptSign = '';
		deptNameSign = '';
		deptIdList = [];
	}

	/**
	 * 点击事件
	 */
	function clickEvent() {
		$$('.searchShowBtnRow .chooseLeader').on('click', chooseLeader);
		$$('#payPeopleSearch').on('focus', showSearchList);
		//$$('.editLeader').on('click', editLeader);
		$$('.payPeopleSearchBar .searchCancelBtn').on('click', hideSearchList);
		$$('#payPeopleSearch').on('keyup', keyupContent);
		$$('.addDeptSave').on('click', addDeptSave);
		$$('.payPeopleSearchBar .searchbar-clear').on('click', function() {
			oldContent = '';
			loading = true;
			pageNo = 1;
			$$(this).css('opacity', '0');
			$$('.payPeopleerSearchList ul').html("");
			$$('#payPeopleSearch').val("");
		});
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine() {

	}

	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent(parentId, elements, currentEle,isStart) {
		console.log(parentId);
		console.log(isStart);
		console.log(app.roleId);
		app.ajaxLoadPageContent(findDeptPath, {
//			parentId: parentId,
//			deptType: deptType,
			parentId: parentId,
			userId: app.userId
			// roleId:app.roleId,
			// isStart:isStart
		}, function(result) {
			var data = result;
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
		$$.each(deptData, function(index, item) {
			appendEle.find('ul').append(
				'<li>' +
				'<a href="#" data-deptId="' + item.did + '">' + item.label + '</a>' +
				'<div style="position: relative;float: right;bottom: 40px;right: 10px;">' +
				'<img src="img/notChooseDept.png" width="28" height= "28" data-deptId="' + item.did + '" data-deptName="' + item.label + '" />' +
				'</div>' +
				'</li>'
			);
		});
		$(".u-vmenu").vmenuModule();
		appendEle.find('a').on('click', function() {
			var deptId = $$(this).data('deptId');
			console.log(deptId);
			if(deptId && !deptIdList[deptId]) {
				ajaxLoadContent(deptId, $$($$(this).parent()[0]), $(this),true);
			}
		});
		appendEle.find('ul').find('img').on('click', function(e) {
			e.stopPropagation();
			var deptId = $$(this).data('deptId');
			var deptName = $$(this).data('deptName');
			if($$(this).attr('src') == 'img/chooseDept.png') {
				$$(this).attr('src', 'img/notChooseDept.png');
				deptSign = "";
				deptNameSign = "";
				showSendDept();
			} else {
				app.myApp.showPreloader('加载中...');
				$$.each($('.u-vmenu li img'), function(index, item) {
					$(item).attr('src','img/notChooseDept.png');
				});
				$$(this).attr('src', 'img/chooseDept.png');
				app.myApp.hidePreloader();
				var deptId = $$(this).data('deptId');
				var deptName = $$(this).data('deptName');
				deptSign = deptId;
				deptNameSign = deptName;
				showSendDept();
			}
		});
	}

	/**
	 * 显示搜索列表 
	 */
	function showSearchList() {
		$$(this).css('text-align', 'left');
		$$('.payPeopleSearchBar .searchCancelBtn').css('display', 'block');
		$$('.page-content.content').css('display', 'none');
		$$('.infinite-scroll').css('display', 'block');
		$$('.chooseBtnRow').css('display', 'flex');
		$$('.sendTo').css('display', 'none');
	}

	/**
	 * 隐藏搜索列表
	 */
	function hideSearchList() {
		oldContent = '';
		pageNo = 1;
		loading = true;
		$$('#payPeopleSearch').val("");
		$$('.payPeopleSearchBar #payPeopleSearch').css('text-align', 'center');
		$$('.payPeopleSearchBar .searchCancelBtn').css('display', 'none');
		$$('.payPeopleerSearchList ul').html("");
		$$('.page-content.content').css('display', 'block');
		$$('.infinite-scroll').css('display', 'none');
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
		searchDept(searchContent, false);
	}

	/**
	 * 搜索接受方 
	 * @param {Object} content 输入的关键字
	 * @param {Object} isLoadMore 是否加载更多
	 */
	function searchDept(content, isLoadMore) {
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
//			deptName: content,
//			pageNo: pageNo
			// deptId:app.user.deptId,
			// roleId:app.roleId,
			userId: app.userId,
			query: content,
			// isStart:false
		}, function(data) {
			console.log(data);
			var data = data;
			if(data.length > 0) {
				if(data.length == 20) {
					loading = false;
				}
				var searchList = data;
				$$('.payShowPeopleList ul').append(addDeptTemplate(data));
			} else if(isLoadMore) {

			} else {
				$$('.payShowPeopleList ul').html("");
				$$('.payPeopleNotFound').css('display', 'block');
			}
		});
	}

	/**
	 * 编辑已选发送到的用户 
	 */
//	function editLeader() {
//		var myPopup = app.myApp.popup(
//			'<div class="popup">' +
//			'<div class="navbar">' +
//			'<div class="navbar-inner">' +
//			'<div class="left close-popup"><a href="#" class="link icon-only"><i class="icon icon-eback"></i></a></div>' +
//			'<div class="center">需要发送的单位</div>' +
//			'<div class="right"></div>' +
//			'</div>' +
//			'</div>' +
//			'<div class="page-content">' +
//			'<div class="deptBtnRow rmBtnRow">' +
//			'<p style="margin: 0 10px;"><a href="#" class="button button-fill color-red rmLeader">移除</a></p>' +
//			'</div>' +
//			'<div class="list-block rmdeptList searchbar-found" style="margin: 0;">' +
//			'<ul>' +
//			'</ul>' +
//			'</div>' +
//			'</div>' +
//			'</div>'
//		);
//		$$('.rmdeptList ul').append(addDeptTemplate(deptNameSign));
//		//移除单位
//		$$('.rmBtnRow .rmLeader').on('click', function() {
//			var search = $$('.rmdeptList').find('input[name="payBox"]:checked');
//			if(search.length == 0) {
//				app.myApp.alert('请选择用户');
//			} else {
//				for(var i = search.length - 1; i >= 0; i--) {
//					var id = parseInt($$(search[i]).val());
//					$$('img[data-deptId="' + id + '"]').attr('src', 'img/notChooseDept.png');
//					for(var j = deptList.length - 1; j >= 0; j--) {
//						if(id == deptList[j].deptId) {
//							deptList.splice(j, 1);
//						}
//					}
//				}
//				app.myApp.closeModal(myPopup);
//				showSendDept();
//			}
//		});
//	}

	/**
	 * 选择发送到的用户 
	 */
	function chooseLeader() {
		var search = $$('.payPeopleerSearchList').find('input[name="payBox"]:checked');
		if(search.length == 0) {
			app.myApp.alert('请选择用户');
		} else {
			deptSign = $$(search).val();
			deptNameSign = $$(search).parent().find('.item-title span').html();
			$$('#sendLeader').val(deptNameSign);
			console.log(deptSign);
			$$.each($$('.u-vmenu li img'), function(index, item) {
				if($$(item).data('deptId') == deptSign){
					$(item).attr('src','img/chooseDept.png');
				}
			});
			hideSearchList();
			showSendDept();
		}
	}

	/**
	 * 显示接受用户 
	 */
	function showSendDept() {
		if(deptNameSign != ''){
			$$('#sendLeader').val(deptNameSign);	
		} else {
			$$('#sendLeader').val("");
		}
	}

	/**
	 * 点击确认 
	 */
	function addDeptSave() {
		if(deptNameSign == '') {
			app.myApp.confirm('还没选择单位<br />确认返回?', function() {
				backAction();
			});
		} else {
			backAction();
		}

		function backAction() {
			app.myApp.getCurrentView().back();
			var signReport = require('js/pages/signReport/signReport');
			signReport.getdeptName(deptNameSign,deptSign);
		}
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
			searchDept(oldContent, true);
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