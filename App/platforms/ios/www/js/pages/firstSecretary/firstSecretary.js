define(['app',
	'hbs!js/hbs/contactsPeople',
	'hbs!js/hbs/villageList',
], function(app, firstPeopleTemplate, firstVillageTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var searchNo = 1;
	var searchNo1 = 1;
	var loading = false;
	var searchLoading = true;
	var searchLoading1 = true;
	//获取第一书记
	var findDeptPeoplePath = app.basePath + 'firstSecretary/loadFirstSecretaryUsers';
	//模糊搜索第一书记
	var searchDeptPeoplePath = app.basePath + 'firstSecretary/searchFirstSecretaryUsers';
	//模糊模糊各村的详细信息
	/*
	 * villageName:村的名字
	 */
	var findPoorVilByNamePath = app.basePath + 'poorVillage/findPoorVilByName';

	//获取贫困村
	var findDeptPath = app.basePath + 'poorVillage/findVillageTree';
	//获取贫困村下的第一书记
	var findChildPath = app.basePath + 'poorVillage/findPagerOfFirstSecretary';
	var deptName = '';
	var oldContent = '';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		//		app.pageStorageClear('firstSecretary/firstSecretary', [
		//			'firstSecretary/firstSecretaryDetail',
		//		]);
		//		if(firstIn) {
		initData(page.query);
		console.log(page.query.appName);
		$$(".pageTitle").html(page.query.appName);
		//		} else {
		//			loadStorage();
		//		}
		app.back2Home();
		handleDict();
		clickEvent();
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
		searchNo = 1;
		searchLoading = true;
		oldContent = '';
		findDept();
//		ajaxLoadContent(false);
	}

	/**
	 * 读取缓存数据 
	 */
//	function loadStorage() {
//		handleContent(pageDataStorage['content'], false);
//	}
	
	/**
	 *  加载查询类型
	 */
	function handleDict() {
		$$("#firstSecretarySearchType").append("<option value='0' selected>人员搜索 </option>");
		$$("#firstSecretarySearchType").append("<option value='1' >村落搜索 </option>");
		$$('#firstSecretarySearchType').change(function() {
			var typeVal = $$('#firstSecretarySearchType').val();
			if(typeVal == 0) {
				$$('.villageName').css('display','none');
				$$('.secretaryName').css('display','block');
			}else{
				$$('.villageName').css('display','block');
				$$('.secretaryName').css('display','none');
			}
		});
	}
	/**
	 * 获取部门 
	 */
	function findDept() {
		app.ajaxLoadPageContent(findDeptPath, {
				
		}, function(data) {
			console.log(data);
			handleData(data);
		});
	}
	
	/**
	 * 根据镇查找村
	 * @param {Object} deptId
	 * @param {Object} element 需要追加内容的元素
	 * @param {Object} currentEle 需要点击的元素
	 */
	function findDept2(deptId,element, currentEle) {
		app.ajaxLoadPageContent(findDeptPath, {
			id:deptId
		},function(data) {
			console.log(data);
			handleChild2(data,element,currentEle);
		});
	}
	function handleChild2(data, element, currentEle) {
		element.append('<ul>');
		$$.each(data, function(index,item) {
			element.find('ul').append('<li>' +
				'<a href="#" data-level="' + item.hasChild + '" data-deptId="' + item.id + '">' +
				'<span class="firstTitle">' + item.text +
				'</span>' +
				'<span class="infoBtn" style="float: right;margin-top: -53px;margin-right: 30px;;position: relative;">' +
				'<img src="img/newIcon/icon_branch_information.png" style="width: 28px;padding-top:2px"/>' +
				'</span	>' +
				'</a>'+
				'</li>'
			);
		});	
		$(".firstMenu").vmenuModule();
		//当前元素点击打开
		currentEle.click();
		$('.firstMenu').find('a').on('click', function() {
			var level = $$(this).data('level');
			var deptId = $$(this).data('deptId');
//			console.log(level);
			console.log(deptId);
			if(level == 'true') {
				findChild(deptId, $$($$(this).parent()[0]), $(this));
			}
		});
		pageDataStorage['element'] = element;
		element.find('.infoBtn img').on('click', function(e) {
			e.stopPropagation();
			console.log($$(this).parent().parent().data('deptId'));
			app.myApp.getCurrentView().loadPage('firstSecretaryOwnDaily2.html?vilId='+$$(this).parent().parent().data('deptId')+ '&userId=&userName=');
		});
	}
	
	
	
	
	/**
	 *  处理返回的数据
	 * @param {Object} data 返回的数据
	 */
	function handleData(data) {
		var deptData = data;
		$('.firstMenu').append('<ul style="padding: 0px;margin: 5px;">');
		$$.each(deptData, function(index, item) {
			$('.firstMenu>ul').append('<li class="li_' + index + '">' +
				'<a href="#" data-level="' + item.hasChild + '" data-deptId="' + item.id + '">' +
				'<span class="firstTitle">' + item.text +
				'</span>' +
				'</a>'
			);
			if(item.hasChild) {
				$('.firstMenu .li_' + index).append('<ul>');
				$$.each(item.children, function(_, cItem) {
					$('.firstMenu .li_' + index +'>ul').append('<li>' +
						'<a href="#" data-level="' + cItem.hasChild + '" data-deptId="' + cItem.id +'">' +
						'<span class="firstTitle">' + cItem.text +
						'</span>' +
						'</a>'
					);
				});
			}
		});
		//autostart: ture/false,//初次加载是否将菜单全部展开
		$(".firstMenu").vmenuModule({
			autostart: true
		});
//		console.log(parseInt(localStorage.getItem('userId')));
		console.log(app.userId);
//		console.log(app.user.id);
		$('.firstMenu').find('a').on('click', function() {
			var level = $$(this).data('level');
			var deptId = $$(this).data('deptId');

			if(level == 'false') {
				findDept2(deptId, $$($$(this).parent()[0]), $(this));
			}
		});
	}
	
	/**
	 * 获取贫困村第一书记
	 * @param {Object} poorVilId
	 * @param {Object} element 需要追加内容的元素
	 * @param {Object} currentEle 需要点击的元素
	 */
	function findChild(poorVilId, element, currentEle) {
		app.ajaxLoadPageContent(findChildPath, {
			poorVilId: poorVilId
		}, function(data) {
			console.log(data.data);
			if(data.data.length!=0){
				handleChild(data.data, element, currentEle, poorVilId);
			}
		});
	}

	/**
	 * 加载贫困村第一书记
	 * @param {Object} data 数据
	 * @param {Object} element 需要追加内容的元素
	 * @param {Object} currentEle 需要点击的元素
	 */
	function handleChild(data, element, currentEle, poorVilId) {
		console.log(data.length);
		if(element.children('ul').length<=0){
			element.append('<ul>');
			$$.each(data, function(index, item) {
				element.find('ul').append('<li>' +
					'<a href="#" class="vilClass" data-no="' + item.no + '" data-id="' + item.id + '" data-vilId="' + poorVilId + '">' +
					'<span class="firstTitle">' + item.userName + '--' + item.deptName +
					'</span>' +
					'</a>'
				);
			});
		}
		$(".firstMenu").vmenuModule();
		currentEle.click();
		element.find('.vilClass').on('click', function() {
			app.myApp.getCurrentView().loadPage('firstSecretaryDetail.html?isVil=' + $$(this).data('vilId') + '&userId=' + $$(this).data('id'));
		});
	}

	/**
	 * 点击事件
	 */
	function clickEvent() {
		$$('#firstShowPeopleSearch').on('focus', showSearchList);
		$$('.firstShowPeopleSearchBar .searchCancelBtn').on('click', hideSearchList);
		//$$('#firstShowPeopleSearch').on('keyup', keyupContent);
		$$('.firstSecretarySearch .searchBtn').on('click', keyupContent);
		//$$('.firstShowPeopleSearchBar .searchbar-clear').on('click', clearContent);
		
		$$('.firstSecretarySearch .resetBtn').on('click',function(){
			$$('#villageName').val('');
			$$('#secretaryName').val('');

		})
	
		$$('.firstSecretarySearchClose').on('click',function(){
			oldContent = '';
			searchNo = 1;
			searchLoading = true;
			searchNo1 = 1;
			searchLoading1 = true;
			$$('.firstSecretarySearch').css('display','none');
			$$('#firstShowPeopleSearch').val("");
			$$('.firstShowPeopleSearchBar #firstShowPeopleSearch').css('text-align', 'center');
			$$('.firstShowPeopleSearchBar .searchCancelBtn').css('display', 'none');
			$$('.firstShowPeopleList ul').html("");
			$$('.infinite-scroll.search').css('display', 'none');
			$$('.infinite-scroll.content').css('display', 'block');
			$$('.searchShowBtnRow').css('display', 'none');
			$$('.firstShowPeopleSearchBar .searchbar-clear').css('opacity', '0');
			$$('.firstPeopleNotFound').css('display', 'none');
			$$('.firstShowVillageNotFound').css('display', 'none');
		})
	}

	/**
	 * 显示搜索列表 
	 */
	function showSearchList() {
		$$('.firstSecretarySearch').css('display','block');
		$$(this).css('text-align', 'left');
		//$$(this).css('position', 'fixed');
		$$('.firstShowPeopleSearchBar .searchCancelBtn').css('display', 'block');
		$$('.infinite-scroll.search').css('display', 'block');
		$$('.infinite-scroll.content').css('display', 'none');
		$$('.firstShowPeopleList ul').html("");
		$$('.firstShowVillageList ul').html("");
		//$$('.searchShowBtnRow').css('display', 'flex');
	}

	/**
	 * 隐藏搜索列表
	 */
	function hideSearchList() {
		
		oldContent = '';
		searchNo = 1;
		searchLoading = true;
		searchNo1 = 1;
		searchLoading1 = true;
		$$('#firstShowPeopleSearch').val("");
		$$('.firstShowVillageList ul').html("");
		$$('.firstShowPeopleSearchBar #firstShowPeopleSearch').css('text-align', 'center');
		$$('.firstShowPeopleSearchBar .searchCancelBtn').css('display', 'none');
		$$('.firstShowPeopleList ul').html("");
		$$('.infinite-scroll.search').css('display', 'none');
		$$('.infinite-scroll.content').css('display', 'block');
		$$('.searchShowBtnRow').css('display', 'none');
		$$('.firstShowPeopleSearchBar .searchbar-clear').css('opacity', '0');
		$$('.firstPeopleNotFound').css('display', 'none');
		$$('.firstShowVillageNotFound').css('display', 'none');
	}

	/**
	 * 输入文字时 
	 */
	function keyupContent() {
//		var searchContent = $$('#firstShowPeopleSearch').val();
		$$('.firstSecretarySearch').css('display','none');
		$$('#firstShowPeopleSearch').val("");
		$$('.firstShowPeopleSearchBar #firstShowPeopleSearch').css('text-align', 'center');
		$$('.firstShowPeopleSearchBar .searchCancelBtn').css('display', 'block');
		$$('.infinite-scroll.search').css('display', 'block');
		$$('.infinite-scroll.content').css('display', 'none');
		$$('.searchShowBtnRow').css('display', 'none');
		$$('.firstShowPeopleSearchBar .searchbar-clear').css('opacity', '0');
		$$('.firstPeopleNotFound').css('display', 'none');
		$$('.firstShowVillageNotFound').css('display', 'none');
		var searchContent = $$('#secretaryName').val();
		var searchVillageContent = $$('#villageName').val();
//		if(!searchContent) {
//			oldContent = '';
//			$$('.firstShowPeopleSearchBar .searchbar-clear').css('opacity', '0');
//			$$('.firstShowPeopleList ul').html("");
//		} else {
//			$$('.firstShowPeopleSearchBar .searchbar-clear').css('opacity', '1');
//		}
		console.log(searchContent);
		console.log(searchVillageContent);
		if($$('#firstSecretarySearchType').val() == 0){
			searchPeople(searchContent, false);
		}else{
			searchVillage(searchVillageContent, false);
		}
		
	}

	/**
	 * 清空输入框 
	 */
	function clearContent() {
		oldContent = '';
		searchNo = 1;
		searchLoading = true;
		searchNo1 = 1;
		searchLoading1 = true;
		$$(this).css('opacity', '0');
		$$('.firstShowPeopleList ul').html("");
		$$('#firstShowPeopleSearch').val("");
	}

	/**
	 * 搜索接受方 
	 * @param {Object} content 输入的关键字
	 * @param {Object} isLoadMore 是否加载更多
	 */
	function searchPeople(content, isLoadMore) {
		if(!isLoadMore) {
			content = content.trim();
//			if(content != oldContent) {
//				oldContent = content;
//			} else {
//				return;
//			}
	}
		$$('.firstShowPeopleList').css('display', 'block');
		$$('.firstShowVillageList').css('display', 'none');
		$$('.firstPeopleNotFound').css('display', 'none');
		if(!content) {
			return;
		}
		app.ajaxLoadPageContent(searchDeptPeoplePath, {
			userName: content,
			pageNo: searchNo,
		}, function(data) {
			console.log(data);
			if(data.length > 0) {
				if(data.length == 10) {
					searchLoading = false;
				}
				$('.firstShowPeopleList ul').html('');
				$$('.firstShowPeopleList ul').append(firstPeopleTemplate(data));
				$$('.firstShowPeopleList ul .item-content').on('click', function() {
					app.myApp.getCurrentView().loadPage('firstSecretaryDetail.html?isVil=0&userId=' + $$(this).data('id'));
				});
			} else if(isLoadMore) {

			} else {
				$$('.firstShowPeopleList ul').html("");
				$$('.firstPeopleNotFound').css('display', 'block');
			}
		});
	}
	
	/*
	 * 查询村落的
	 */
	function searchVillage(content, isLoadMore) {
		if(!isLoadMore) {
			content = content.trim();
//			if(content != oldContent) {
//				oldContent = content;
//			} else {
//				return;
//			}
	}
		$$('.firstShowPeopleList').css('display', 'none');
		$$('.firstShowVillageList').css('display', 'block');
		$$('.firstShowVillageNotFound').css('display', 'none');
		if(!content) {
			return;
		}
		app.ajaxLoadPageContent(findPoorVilByNamePath, {
			villageName: content,
			pageNo: searchNo1,
		}, function(data) {
			if(data.length > 0) {
				if(data.length == 10) {
					searchLoading1 = false;
				}
				$('.firstShowVillageList ul').html('');
				$$('.firstShowVillageList ul').append(firstVillageTemplate(data));
				$$('.firstShowVillageList ul .item-content').on('click', function() {
					app.myApp.getCurrentView().loadPage('firstSecretaryOwnDaily2.html?vilId='+$$(this).data('deptId')+ '&userId=&userName=');
				});
			} else if(isLoadMore) {

			} else {
				$$('.firstShowVillageList ul').html("");
				$$('.firstShowVillageNotFound').css('display', 'block');
			}
		});
	}
//
//	/**
//	 * 异步请求页面数据 
//	 */
//	function ajaxLoadContent(isLoadMore) {
//		app.ajaxLoadPageContent(findDeptPeoplePath, {
//			pageNo: pageNo,
//		}, function(result) {
//			var data = result;
//			console.log(data);
//			if(isLoadMore) {
//				pageDataStorage['content'] = pageDataStorage['content'].concat(data);
//			} else {
//				pageDataStorage['content'] = data;
//			}
//			handleContent(data);
//		});
//	}
//
//	/**
//	 * 加载数据
//	 */
//	function handleContent(data) {
//		if(data.length) {
//			if(data.length == 10) {
//				loading = false;
//			}
//			var deptList = data;
//			var leaderList = [];
//			$$('.list-pay-search ul').append(firstPeopleTemplate(data));
//			$$('.list-pay-search ul .item-content').on('click', function() {
//				app.myApp.getCurrentView().loadPage('firstSecretaryDetail.html?isVil=0&userId=' + $$(this).data('id'));
//			});
//		} else {
//			app.myApp.alert('该单位暂无工作人员');
//		}
//	}

	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//加载更多
//		var loadMoreContent = $$(page.container).find('.infinite-scroll.content');
//		loadMoreContent.on('infinite', function() {
//			if(loading) return;
//			loading = true;
//			pageNo += 1;
//			ajaxLoadContent(true);
//		});
		var loadMoreSearch = $$(page.container).find('.infinite-scroll.search');
		loadMoreSearch.on('infinite', function() {
//			console.log($$('#firstSecretarySearchType').val());
//			console.log($$('#secretaryName').val());
			if($$('#firstSecretarySearchType').val() == 0){
				if(searchLoading) return;
				searchLoading = true;
				searchNo += 1;
				//searchPeople(oldContent, true);
				searchPeople($$('#secretaryName').val(), true);
			}else{
				if(searchLoading1) return;
				searchLoading1 = true;
				searchNo1 += 1;
				searchVillage($$('#secretaryName').val(), true);
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