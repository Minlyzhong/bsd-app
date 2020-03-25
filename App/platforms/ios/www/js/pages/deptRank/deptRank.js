define(['app',
	'hbs!js/hbs/deptRank'
], function(app, rankTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//支部排名
	var loadDeptRankPath = app.basePath + '/mobile/partyAm/deptBranchRank';
	//模糊搜索支部名称
	var searchDeptNamePath = app.basePath + '/mobile/partyAm/deptBranchRank';
	var deptName = '';
	//	var deptId = 0;
	var deptDate = '';
	var state = 0;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('deptRank/deptRank', [
//			'deptRank/deptRankDetail',
//			'deptRank/deptRankChart'
//		]);
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
		state = 0;
		deptName = '';
		//		deptId = 0;
		deptDate = app.utils.getCurTime().split(' ')[0];
		ajaxLoadContent(false);
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		$$('.deptRankRow').find('a').removeClass('active');
		if(state == 0) {
			$$('.desc').addClass('active');
		} else {
			$$('.asc').addClass('active');
		}
		handleRank(pageDataStorage['rank'], false);
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		console.log(deptName);
		$$('.deptR .pageTitle').html(page.query.appName);
		$$('#deptRankName').val(deptName);
		$$('#deptRankDate').val(deptDate);
		addCalendar('deptRankDate');
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$('.deptR').click(hideSearch);
		$$('#deptRankSearch').on('click', searchIconClick);
		$$('.deptRankSearchBtn').on('click', searching);
		$$('.deptRankCloseBtn').on('click', searchIconClick);
		$$('.deptRankResetBtn').on('click', searchReset);
		$$('#deptRankName').on('click', deptRankNameBox);
		$$('#deptRankName').on('keyup', deptRankNameSearch);
		$$('.companyRow').find('a').on('click', deptRankRow);
	}

	/**
	 * 点击搜索框里的按钮组
	 */
	function deptRankRow() {
		$$('.deptRankRow').find('a').removeClass('active');
		$$(this).addClass('active');
		state = $$(this).data('value');
	}

	/**
	 * 点击空白处隐藏搜索框 
	 */
	function hideSearch(e) {
		var con1 = $('.deptRankSearch'); // 设置目标区域
		var con2 = $('#deptRankSearch');
		var con3 = $('.searchBox');
		if(!con1.is(e.target) && con1.has(e.target).length === 0 &&
			!con2.is(e.target) && con2.has(e.target).length === 0 &&
			!con3.is(e.target) && con3.has(e.target).length === 0) {
			$$('.searchBox').hide();
			$('.deptRankSearch').slideUp(200);
		}
	}

	/**
	 * 点击输入框 弹出下拉框 
	 */
	function deptRankNameBox() {
		$('.deptRankNameBox').toggle();
		if($$('#deptRankName').val() == '' &&
			$$('.deptRankNameBox').css('display') == 'block' &&
			$$('.deptRankNameBox ul').html().trim() == "") {
			deptName = $$('#deptRankName').val()
			deptRankNameSearch();
		}
	}

	/**
	 * 模糊查询 
	 */
	function deptRankNameSearch() {
		deptName = $$(this).val();
		$$('.deptRankNameBox').show();
		var content = $$(this).val();
		app.ajaxLoadPageContent(searchDeptNamePath, {
			query: content,
			deptId: app.user.deptId,
			userId: app.userId
		}, function(data) {
			var data = data.data.records;
			console.log(data);
			if(data.length > 0) {
				var html = '';
				$$.each(data, function(index, item) {
					html += '<li data-id = "' + item.id + '">' + item.deptName + '</li>'
				});
				$$('.deptRankNameBox ul').html(html);
				$$('.searchBox li').off('click', clickSearchBox);
				$$('.searchBox li').on('click', clickSearchBox);
			} else {
				$$('.deptRankNameBox ul').html("");
			}
		});
	}

	/**
	 *  点击下拉框  隐藏
	 */
	function clickSearchBox() {
		$$('.searchBox').hide();
		//		deptId = $$(this).data('id');
		$$('#deptRankName').val($$(this).html());
	}

	/**
	 * 点击查询图标 
	 */
	function searchIconClick() {
		$$('.searchBox').hide();
		$('.deptRankSearch').slideToggle(200);
	}

	/**
	 * 清空搜索条件 
	 */
	function searchReset() {
		$$('.deptRankSearch input').val('');
		deptDate = '';
		addCalendar('deptRankDate');
	}

	/**
	 * 开始搜索 
	 */
	function searching() {
		deptDate = $$('#deptRankDate').val();
		if(!deptDate) {
			app.myApp.alert('请选择查询时间');
			return;
		}
		$$('.searchBox').hide();
		$('.deptRankSearch').slideUp(200);
		pageNo = 1;
		ajaxLoadContent(false);
	}

	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent(isLoadMore) {
		app.ajaxLoadPageContent(loadDeptRankPath, {
			current: pageNo,
			// userId: app.userId,
			deptId: app.user.deptId,
			date: deptDate,
			query: $$('#deptRankName').val(),
			sortType: state
		}, function(data) {
			console.log(data);
			var data = data.data.records;
			if(isLoadMore) {
				pageDataStorage['rank'] = pageDataStorage['rank'].concat(data);
			} else {
				pageDataStorage['rank'] = data;
			}
			handleRank(data, isLoadMore);
		});
	}

	/**
	 * 处理排名信息 
	 */
	function handleRank(data, isLoadMore) {
		if(data) {
			if(isLoadMore) {
				$$('.deptRankList ul').append(rankTemplate(data));
			} else {
				$$('.deptRankList ul').html(rankTemplate(data));
			}
			$$('.deptRankList .item-content').off('click', rankListClick);
			$$('.deptRankList .item-content').on('click', rankListClick);
			$$('.deptRankList .reviewed').off('click', rankChartClick);
			$$('.deptRankList .reviewed').on('click', rankChartClick);
			if(data.length == 10) {
				loading = false;
			}
		}
	}

	/**
	 * 点击排名列表
	 */
	function rankListClick() {
		var score = $$(this).data('score');
		if(score == 0) {
			app.myApp.alert('该党支部没有考核记录');
			return;
		}
		var empId = $$(this).data('id');
		var empName = $$(this).data('name');
		app.myApp.getCurrentView().loadPage('deptRankDetail.html?deptId=' + empId + '&title=' + empName);
	}

	/**
	 * 点击曲线图
	 */
	function rankChartClick(e) {
		e.stopPropagation();
		var empName = $$(this).parents('a').data('name');
		var deptId = $$(this).parents('a').data('id');
		app.myApp.getCurrentView().loadPage('deptRankChart.html?title=' + empName + '&deptId=' + deptId);
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
			//这里写请求
			ajaxLoadContent(true);
		});
	}

	//初始化日历
	function addCalendar(contentID) {
		calID = app.myApp.calendar({
			input: '#' + contentID,
			toolbarCloseText: '完成',
			headerPlaceholder: '选择的日期',
			monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
			dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
			dateFormat: 'yyyy-mm-dd',
			closeOnSelect: true,
			maxDate: new Date(),
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