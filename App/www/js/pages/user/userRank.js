define(['app',
	'hbs!js/hbs/userRank'
], function(app, rankTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//用户信息接口
	var userPath = app.basePath + '/mobile/political/score/board/list';
	var searchNo = 1;
	var searchLoading = true;
	var oldContent = '';
	var loading1 = true;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		app.back2Home();
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
		getUserInfo(false);
	}

	//用户信息
	function getUserInfo(isLoadMore) {
		app.ajaxLoadPageContent(userPath, {
			current : pageNo,
			size : 10,
			// userName:,
		}, function(data) {
			console.log(data);
			allInfo = data.data.records;
			if(allInfo.length && allInfo.length > 0) {
				//$$('.userRank-List ul').append(rankTemplate(allInfo));
				handleParty(allInfo, isLoadMore);
			} else {
				app.myApp.alert('暂无排名！');
			}
		
		});
	}
	/**
	 * 加载数据 
	 */
	function handleParty(result, isLoadMore) {
		if(result) {
			$$('.userRank-List ul').append(rankTemplate(result));
			if(result.length == 10) {
				loading = false;
			}
		}
	}
	
	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		loadMoreContent.on('infinite', function() {
			//console.log($$('#userRankSearch').val() == '');
			if($$('#userRankSearch').val() == ''){
				if(loading) return;
				loading = true;
				pageNo += 1;
				getUserInfo(true);
			}else{
				if(loading1) return;
				loading1 = true;
				searchNo += 1;
				searchPeople($$('#userRankSearch').val(), true);
			}
			
		});
	}
	/**
	 * 点击事件
	 */
	function clickEvent() {
		$$('#userRankSearch').on('focus', showSearchList);
		$$('.userRankSearchBar .searchCancelBtn').on('click', hideSearchList);
		$$('#userRankSearch').on('keyup', keyupContent);
		$$('.userRankSearchBar .searchbar-clear').on('click', clearContent);
	}
	
	/**
	 * 显示搜索列表 
	 */
	function showSearchList() {
		$$(this).css('text-align', 'left');
		$$('.userRankSearchBar .searchCancelBtn').css('display', 'block');
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
		$$('#userRankSearch').val("");
		$$('.userRankSearchBar #userRankSearch').css('text-align', 'center');
		$$('.userRankSearchBar .searchCancelBtn').css('display', 'none');
		$$('.userRankPeopleList ul').html("");
		$$('.infinite-scroll.search').css('display', 'none');
		$$('.infinite-scroll.content').css('display', 'block');
		$$('.searchShowBtnRow').css('display', 'none');
		$$('.userRankSearchBar .searchbar-clear').css('opacity', '0');
		$$('.userRankNotFound').css('display', 'none');
	}
	
	/**
	 * 输入文字时 
	 */
	function keyupContent() {
		var searchContent = $$('#userRankSearch').val();
		if(!searchContent) {
			oldContent = '';
			$$('.userRankSearchBar .searchbar-clear').css('opacity', '0');
			$$('.userRankPeopleList ul').html("");
		} else {
			$$('.userRankSearchBar .searchbar-clear').css('opacity', '1');
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
		$$('.userRankPeopleList ul').html("");
		$$('#userRankSearch').val("");
	}
	
	function searchPeople(content, isLoadMore) {
		if(!isLoadMore) {
			content = content.trim();
			if(content != oldContent) {
				oldContent = content;
			} else {
				return;
			}
		}
		$$('.userRankNotFound').css('display', 'none');
		if(!content) {
			return;
		}
		app.ajaxLoadPageContent(userPath, {
			userName : content,
			current : searchNo,
			size : 10,
		}, function(data) {
			// console.log(data.data);
			var data = data.data.records;
			if(data.length > 0) {
				if(data.length == 10) {
					searchLoading = false;
				}
				console.log($$('.-content1').length<=0);
				if($$('.-content1').length<=0){
					var str = '<li>';
					str +=	'<div class="link item-content -content1">'
					str +=		'<div class="item-inner">'
					str +=			'<div class="discuss-row item-subtitle" style="padding: 3px 0px 0px 0px; text-align: center; color:#36689a">'
					str +=				'<div style="min-width: 15%;">排名</div>'
					str +=				'<div style="min-width: 20%;">总积分</div>'
					str +=				'<div style="min-width: 35%;">用户名</div>'
					str +=				'<div style="min-width: 30%;">所属支部</div>'
					str +=			'</div>'
					str +=		'</div>'
					str +=	'</div>'
					str +=	'</li>'
					$$('.userRankPeopleList ul').append(str);
				}
				//$$('.userRankPeopleList ul').append(rankTemplate(data.data));
				handleParty1(data, isLoadMore)
			} else if(isLoadMore) {
				
			} else {
				$$('.userRankPeopleList ul').html("");
				$$('.userRankNotFound').css('display', 'block');
			}
		});
		
	}
	/**
	 * 加载数据 
	 */
	function handleParty1(result, isLoadMore) {
		if(result) {
			console.log('11');
			$$('.userRankPeopleList ul').append(rankTemplate(result));
			if(result.length == 10) {
				loading1 = false;
			}
		}
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