define(['app',
	'hbs!js/hbs/shykaddDept'
], function(app, addDeptTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//查找子部门
	var findChlidPath = app.basePath + 'orgDept/findChlid';
	var oldContent = '';
	var deptList = [];
	var deptType = '';
	
	var deptId = 0;
	var deptName = '';
	var getDeptName = '';
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		app.back2Home();
		//showSendDept();
		clickEvent();
		attrDefine();
		pushAndPull(page);
		ajaxLoadContent(0, '', '');
	}
	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageNo = 1;
		loading = true;
		//deptList = JSON.parse(pageData.deptList);
		//deptType = pageData.deptType;
		getDeptName = pageData.deptName;
		deptName = '';
		deptId = 0;
		oldContent = '';
		deptIdList = [];
	}

	/**
	 * 点击事件
	 */
	function clickEvent() {
		$$('.searchShowBtnRow .chooseLeader').on('click', chooseLeader);
		//$$('.searchShowBtnRow .allChoose').on('click', allChoose);
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
	function ajaxLoadContent(parentId, elements, currentEle) {
		app.ajaxLoadPageContent(findChlidPath, {
			
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
				'<a href="#" data-deptId="' + item.deptId + '">' + item.deptName + '</a>' +
				'<div class="chooseParent" style="position: relative;float: right;bottom: 40px;right: 10px;">' +
				'<img src="img/notChooseDept.png" class="chooseDeptName" width="28" height= "28" data-deptId="' + item.deptId + '" data-deptName="' + item.deptName + '" />' +
				'</div>' +
				'</li>'
			);
		});
		$(".u-vmenu").vmenuModule();
//		appendEle.find('a').on('click', function() {
//			var deptId = $$(this).data('deptId');
//			if(deptId && !deptIdList[deptId]) {
//				ajaxLoadContent(deptId, $$($$(this).parent()[0]), $(this));
//			}
//		});
		for(var i=0;i<=$(".chooseParent").children().length-1;i++){
			if($($(".chooseParent").children()[i]).attr('data-deptName') == getDeptName){
				$($(".chooseParent").children()[i]).attr('src', 'img/chooseDept.png');
				$$('#shykDeptName').val(getDeptName);
			}
		}
		appendEle.find('ul').find('img').on('click', function(e) {
			e.stopPropagation();
			var deptId1 = $$(this).data('deptId');
			var deptName1 = $$(this).data('deptName');
			if($$(this).attr('src') == 'img/chooseDept.png') {
				$$(this).attr('src', 'img/notChooseDept.png');
				$$('#shykDeptName').val('');
				deptName = '';
			} else {
				for(var i=0;i<=$(".chooseParent").children().length-1;i++){
					$($(".chooseParent").children()[i]).attr('src','img/notChooseDept.png');
				}
				$$(this).attr('src', 'img/chooseDept.png');
				$$('#shykDeptName').val(deptName1);
				deptName = deptName1;
				deptId = deptId1;
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
	
	function chooseLeader() {
		var search = $$('.payPeopleerSearchList').find('input[name="payBox"]:checked');
		console.log(search);
		if(search.length == 0) {
			app.myApp.alert('请选择部门');
		} else {
			deptName = search.val();
			$$('#shykDeptName').val(deptName);
			console.log(deptName);
			hideSearchList();
			for(var i=0;i<=$(".chooseParent").children().length-1;i++){
				console.log($($(".chooseParent").children()[i]).attr('data-deptName') == deptName);
				$($(".chooseParent").children()[i]).attr('src', 'img/notChooseDept.png');
				if($($(".chooseParent").children()[i]).attr('data-deptName') == deptName){
					$($(".chooseParent").children()[i]).attr('src', 'img/chooseDept.png');
				}
			}
		}
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
		app.ajaxLoadPageContent(findChlidPath, {
			query: content,
		}, function(data) {
			console.log(data);
			if(data.length > 0) {
				$$('.payShowPeopleList ul').append(addDeptTemplate(data));
			} else if(isLoadMore) {

			} else {
				$$('.payShowPeopleList ul').html("");
				$$('.payPeopleNotFound').css('display', 'block');
			}
		});
	}

	/**
	 * 点击确认 
	 */
	function addDeptSave() {
		$$('#rankDeptName').val(deptName);
		backAction();
		
//		if(!deptList.length) {
//			app.myApp.confirm('还没选择单位<br />确认返回?', function() {
//				backAction();
//			});
//		} else {
//			backAction();
//		}
		function backAction() {
			app.myApp.getCurrentView().back();
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