define(['app',
		'hbs!js/hbs/contactsPeople',
	],
	function(app, contactsPeopleTemplate) {
		var $$ = Dom7;
		var firstIn = 1;
		var pageDataStorage = {};
		var pageNo = 1;
		var searchNo = 1;
		var loading = false;
		var searchLoading = true;
		//选择部门人员
		var findDeptPeoplePath = app.basePath + '/mobile/user/findDeptPeople/';
		//模糊搜索部门人员
		var searchDeptPeoplePath = app.basePath + '/mobile/user/searchDeptPeople';
		var deptName = '';
		var oldContent = '';
		var deptId = 0;
		var type='';
		var url='';
		var params={};
		var searchParams={};

		/**
		 * 页面初始化 
		 * @param {Object} page 页面内容
		 */
		function init(page) {
//			app.pageStorageClear('contacts/contactsShowPeople', [
//				'contacts/contactsUserInfo',
//			]);
//			if(firstIn) {
				initData(page.query);
//			} else {
//				loadStorage();
//			}
			app.back2Home();
			clickEvent();
			attrDefine();
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
			deptName = pageData.deptName;
			deptId = pageData.deptId;
			oldContent = '';
			
			type='';
			url='';
			params={};
			searchParams={};
			if(pageData.type){
				type= pageData.type
			}
			console.log(pageData)
			console.log(type)
			ajaxLoadContent();
		}

		/**
		 * 读取缓存数据 
		 */
		function loadStorage() {
			handleContent(pageDataStorage['content']);
		}

		/**
		 * 点击事件
		 */
		function clickEvent() {
			$$('#contactsShowPeopleSearch').on('focus', showSearchList);
			$$('.contactsShowPeopleSearchBar .searchCancelBtn').on('click', hideSearchList);
			$$('#contactsShowPeopleSearch').on('keyup', keyupContent);
			$$('.contactsShowPeopleSearchBar .searchbar-clear').on('click', clearContent);
		}

		/**
		 * 显示搜索列表 
		 */
		function showSearchList() {
			$$(this).css('text-align', 'left');
			$$('.contactsShowPeopleSearchBar .searchCancelBtn').css('display', 'block');
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
			$$('#contactsShowPeopleSearch').val("");
			$$('.contactsShowPeopleSearchBar #contactsShowPeopleSearch').css('text-align', 'center');
			$$('.contactsShowPeopleSearchBar .searchCancelBtn').css('display', 'none');
			$$('.contactsShowPeopleList ul').html("");
			$$('.infinite-scroll.search').css('display', 'none');
			$$('.infinite-scroll.content').css('display', 'block');
			$$('.searchShowBtnRow').css('display', 'none');
			$$('.contactsShowPeopleSearchBar .searchbar-clear').css('opacity', '0');
			$$('.contactsPeopleNotFound').css('display', 'none');
		}

		/**
		 * 输入文字时 
		 */
		function keyupContent() {
			var searchContent = $$('#contactsShowPeopleSearch').val();
			if(!searchContent) {
				oldContent = '';
				$$('.contactsShowPeopleSearchBar .searchbar-clear').css('opacity', '0');
				$$('.contactsShowPeopleList ul').html("");
			} else {
				$$('.contactsShowPeopleSearchBar .searchbar-clear').css('opacity', '1');
			}
			searchPeople(searchContent, false);
		}

		/**
		 * 清空输入框 
		 */
		function clearContent() {
			oldContent = '';
			searchNo = 1;
			searchLoading = true;
			$$(this).css('opacity', '0');
			$$('.contactsShowPeopleList ul').html("");
			$$('#contactsShowPeopleSearch').val("");
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
			$$('.contactsPeopleNotFound').css('display', 'none');
			if(!content) {
				return;
			}
			if(type && type == 'partyDynamic'){
				searchDeptPeoplePath = app.basePath +'/mobile/partyAm/findDeptPeople'
				searchParams = {
					current: pageNo,
					deptId: deptId,
					query: content
				} 
			}else{
				searchDeptPeoplePath = app.basePath +'/mobile/user/searchDeptPeople'
				searchParams = {
					// userName: content,
					// deptId: deptId,
					// pageNo: searchNo,
					// type: 1,
					name:content
				}
			}
			app.ajaxLoadPageContent(searchDeptPeoplePath, searchParams, function(data) {
				var data = data.data.records;
				
				console.log(data);
				if(data.length > 0) {
					if(data.length == 10) {
						searchLoading = false;
					}
					$$('.contactsShowPeopleList ul').append(contactsPeopleTemplate(data));
					$$('.contactsShowPeopleList ul .item-content').on('click', function() {
						app.myApp.getCurrentView().loadPage('contactsUserInfo.html?userId=' + $$(this).data('id')+'&userName='+$$(this).data('username'));
					});
				} else if(isLoadMore) {

				} else {
					$$('.contactsShowPeopleList ul').html("");
					$$('.contactsPeopleNotFound').css('display', 'block');
				}
			});
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
		function ajaxLoadContent() {
			console.log(type)
			if(type && type == 'partyDynamic'){
				url = app.basePath +'/mobile/partyAm/findDeptPeople'
				params = {
					current: pageNo,
					deptId: deptId
				} 
			}else{
				url = findDeptPeoplePath+deptId
				params = {
					// deptId: deptId,
					current: pageNo,
					size: 10
				}
			}
			app.ajaxLoadPageContent(url, params, function(result) {
				var data = result.data.records;
				console.log(data);
				pageDataStorage['content'] = data;
				handleContent(data);
			});
		}

		/**
		 * 加载数据
		 */
		function handleContent(data) {
			if(data.length) {
				if(data.length == 10) {
					loading = false;
				}
				var deptList = data;
				var leaderList = [];
				console.log('加载数据data')
				console.log(data)
				$$('.list-pay-search ul').append(contactsPeopleTemplate(data));
				$$('.list-pay-search ul .item-content').on('click', function() {
					app.myApp.getCurrentView().loadPage('contactsUserInfo.html?userId=' + $$(this).data('id') +'&userName='+$$(this).data('userName'));
				});
			} else {
				app.myApp.alert('该单位暂无工作人员');
			}
		}

		/**
		 * 上下拉操作 
		 */
		function pushAndPull(page) {
			//加载更多
			var loadMoreContent = $$(page.container).find('.infinite-scroll.content');
			loadMoreContent.on('infinite', function() {
				if(loading) return;
				loading = true;
				pageNo += 1;
				ajaxLoadContent();
			});
			var loadMoreSearch = $$(page.container).find('.infinite-scroll.search');
			loadMoreSearch.on('infinite', function() {
				if(searchLoading) return;
				searchLoading = true;
				searchNo += 1;
				searchPeople(oldContent, true);
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