define(['app',
	'hbs!js/hbs/assessDemandHistory'
], function(app, historyTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//模糊搜索部门名称
	var searchDeptNamePath = app.basePath + 'queryKnowledge/searchDeptName';
	//模糊搜索考核项名称
	var searchTopicPath = app.basePath + 'queryKnowledge/searchDeptTopic';
	//模糊搜索考核清单名称
	var searchTestPaperPath = app.basePath + 'queryKnowledge/searchDeptPaper';
	//搜索考核记录
	var searchAssessPath = app.basePath + 'queryKnowledge/loadDeptReportDetial';
	var beginDate = '';
	var endDate = '';
	var deptId = 0;
	var deptName = '';
	var tpId = 0;
	var tpName = '';
	var topicId = 0;
	var topicName = '';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('assessDemand/assessDemand', [
//			'assessDemand/assessDemandPeopleList',
//			'assessDemand/assessDemandDetail'
//		]);
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
		attrDefine(page);
		clickEvent(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		deptId = app.user.deptId;
		deptName = app.user.deptName;
		tpId = 0;
		tpName = '';
		topicId = 0;
		topicName = '';
		beginDate = new Date().getFullYear() + '-01-01';
		endDate = app.utils.getCurTime().split(' ')[0];
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		$$('#demandBeginDate').val(beginDate);
		$$('#demandEndDate').val(endDate);
		$$('#demandDeptName').val(deptName);
		$$('#demandTestPaper').val(tpName);
		$$('#demandTopic').val(topicName);
		var data = pageDataStorage['search'];
		if(data) {
			handleSearch(data);
		}
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.assessDemandPage .pageTitle').html(page.query.appName);
		$$('#demandDeptName').val(app.user.deptName);
		$$('#demandBeginDate').val(beginDate);
		$$('#demandEndDate').val(endDate);
		addCalendar('demandBeginDate');
		addCalendar('demandEndDate');
		loadHistoryList();
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('#demandDeptName').on('click', deptNameBox);
		$$('#demandDeptName').on('keyup', deptNameSearch);
		$$('#demandTestPaper').on('click', testPaperBox);
		$$('#demandTestPaper').on('keyup', testPaperSearch);
		$$('#demandTopic').on('click', topicBox);
		$$('#demandTopic').on('keyup', topicSearch);
		$$('.demandSearchBtn').on('click', searching);
		$$('.demandCloseBtn').on('click', searchIconClick);
		$$('.demandResetBtn').on('click', searchReset);
		$$('.searchIcon').on('click', searchIconClick);
		$('.assessDemandPage').click(hideSearch);
		$$('.demandCard .notReview').on('click', resultClose);
		$$('.dynamicReportList .grid').on('click', demandResult);
	}

	/**
	 * 点击查询结果 
	 */
	function demandResult() {
		var type = parseInt($$(this).data('type'));
		var count = parseInt($$($$(this).find('span')[0]).html());
		if(!count) {
			app.myApp.alert('暂无数据！');
			return;
		}
		switch(type) {
			case 0:
				app.myApp.getCurrentView().loadPage(
					'assessDemandPeopleList.html?deptName=' + deptName + '&deptId=' + deptId +
					'&begin=' + beginDate + '&end=' + endDate + '&tpId=' + tpId + '&topicId=' + topicId);
				break;
			case 1:
				app.myApp.getCurrentView().loadPage(
					'assessDemandDetail.html?deptName=' + deptName + '&deptId=' + deptId +
					'&begin=' + beginDate + '&end=' + endDate + '&tpId=' + tpId + '&topicId=' + topicId + '&isCount=1');
				break;
			case 2:
				app.myApp.getCurrentView().loadPage(
					'assessDemandDetail.html?deptName=' + deptName + '&deptId=' + deptId +
					'&begin=' + beginDate + '&end=' + endDate + '&tpId=' + tpId + '&topicId=' + topicId + '&isCount=0');
				break;
			default:
				break;
		}
	}

	/**
	 * 关闭查询结果
	 */
	function resultClose() {
		$$('.demandCard').css('display', 'none');
		$$('.demandHistory').css('display', 'block');
		loadHistoryList();
	}

	/**
	 * 初始化历史查询列表 
	 */
	function loadHistoryList() {
		var historySearch = JSON.parse(localStorage.getItem('historyDemand')) || [];
		if(historySearch.length > 0) {
			$$('.demandHistoryList').html(historyTemplate(historySearch));
			$$('.demandHistoryList a').off('click', historyClick);
			$$('.demandHistoryList a').on('click', historyClick);
			$$('.demandHistoryList .notReview').on('click', function(e) {
				e.stopPropagation();
				var index = $$(this).parents('.cardLink').index();
				historySearch.splice(index, 1);
				localStorage.setItem('historyDemand', JSON.stringify(historySearch));
				loadHistoryList();
			});
		} else {
			$$('.demandHistoryList').html("");
		}
	}

	function historyClick() {
		deptId = $$(this).data('deptId');
		deptName = $$(this).data('deptName');
		beginDate = $$(this).data('begin');
		endDate = $$(this).data('end');
		topicId = $$(this).data('topicId');
		topicName = $$(this).data('topicName') || '';
		tpId = $$(this).data('tpId');
		tpName = $$(this).data('tpName') || '';
		$$('#demandBeginDate').val(beginDate);
		$$('#demandEndDate').val(endDate);
		$$('#demandDeptName').val(deptName);
		$$('#demandTestPaper').val(tpName);
		$$('#demandTopic').val(topicName);
		app.ajaxLoadPageContent(searchAssessPath, {
			startTime: beginDate,
			endTime: endDate,
			deptId: deptId,
			testpaperId: tpId,
			topicId: topicId
		}, function(data) {
			console.log(data);
			pageDataStorage['search'] = data;
			handleSearch(data);
		});
	}

	/**
	 * 点击空白处隐藏搜索框 
	 */
	function hideSearch(e) {
		var con1 = $('.demandSearch'); // 设置目标区域
		var con2 = $('.searchIcon');
		var con3 = $('.searchBox');
		if(!con1.is(e.target) && con1.has(e.target).length === 0 &&
			!con2.is(e.target) && con2.has(e.target).length === 0 &&
			!con3.is(e.target) && con3.has(e.target).length === 0) {
			$('.demandSearch').slideUp(200);
			$$('.searchBox').hide();
		}
	}

	/**
	 * 点击输入框 弹出下拉框 
	 */
	function deptNameBox() {
		$$('.topicBox').hide();
		$$('.testPaperBox').hide();
		$('.deptNameBox').toggle();
		if($$('#demandDeptName').val() == '' && $$('.deptNameBox').css('display') == 'block') {
			deptNameSearch();
		}
	}

	function testPaperBox() {
		if(deptId == 0) {
			app.myApp.alert('单位名称有误，不能选择考核项');
			$$('#demandTestPaper').blur();
			return;
		}
		$$('.topicBox').hide();
		$$('.deptNameBox').hide();
		$('.testPaperBox').toggle();
		if($$('#demandTestPaper').val() == '' && $$('.testPaperBox').css('display') == 'block') {
			testPaperSearch();
		}
	}

	function topicBox() {
		if(tpId == 0) {
			app.myApp.alert('考核项有误，不能选择考核清单');
			$$('#demandTopic').blur();
			return;
		}
		$$('.deptNameBox').hide();
		$$('.testPaperBox').hide();
		$('.topicBox').toggle();
		if($$('#demandTopic').val() == '' && $$('.topicBox').css('display') == 'block') {
			topicSearch();
		}
	}

	/**
	 * 模糊查询 
	 */
	function deptNameSearch() {
		deptId = 0;
		tpId = 0;
		$$('#demandTestPaper').val("");
		topicId = 0;
		$$('#demandTopic').val("");
		$$('.deptNameBox').show();
		var content = $$(this).val();
		//		if(content == '') {
		//			return;
		//		}
		app.ajaxLoadPageContent(searchDeptNamePath, {
			deptName: content,
			deptId: app.user.deptId,
			userId: app.userId
		}, function(data) {
			console.log(data);
			if(data.length > 0) {
				var html = '';
				$$.each(data, function(index, item) {
					html += '<li data-type = "deptName" data-id = "' + item.id + '">' + item.deptName + '</li>'
				});
				$$('.deptNameBox ul').html(html);
				$$('.searchBox li').off('click', clickSearchBox);
				$$('.searchBox li').on('click', clickSearchBox);
			} else {
				$$('.deptNameBox ul').html("");
			}
		});
	}

	function testPaperSearch() {
		tpId = 0;
		topicId = 0;
		$$('#demandTopic').val("");
		$$('.testPaperBox').show();
		var content = $$(this).val();
		//		if(content == '') {
		//			return;
		//		}
		app.ajaxLoadPageContent(searchTestPaperPath, {
			title: content,
			deptId: deptId
		}, function(data) {
			console.log(data);
			if(data.length > 0) {
				var html = '';
				$$.each(data, function(index, item) {
					html += '<li data-type = "testPaper" data-id = "' + item.id + '">' + item.title + '</li>'
				});
				$$('.testPaperBox ul').html(html);
				$$('.searchBox li').off('click', clickSearchBox);
				$$('.searchBox li').on('click', clickSearchBox);
			} else {
				$$('.testPaperBox ul').html("");
			}
		});
	}

	function topicSearch() {
		topicId = 0;
		$$('.topicBox').show();
		var content = $$(this).val();
		//		if(content == '') {
		//			return;
		//		}
		app.ajaxLoadPageContent(searchTopicPath, {
			title: content,
			testpaperId: tpId
		}, function(data) {
			console.log(data);
			if(data.length > 0) {
				var html = '';
				$$.each(data, function(index, item) {
					html += '<li data-type = "topic" data-id = "' + item.id + '">' + item.title + '</li>'
				});
				$$('.topicBox ul').html(html);
				$$('.searchBox li').off('click', clickSearchBox);
				$$('.searchBox li').on('click', clickSearchBox);
			} else {
				$$('.topicBox ul').html("");
			}
		});
	}

	/**
	 *  点击下拉框  隐藏
	 */
	function clickSearchBox() {
		$$('.searchBox').hide();
		var type = $$(this).data('type');
		var name = $$(this).html();
		var id = $$(this).data('id');
		if(type == 'deptName') {
			$$('#demandTestPaper').val('');
			$$('#demandTopic').val('');
			$$('#demandDeptName').val(name);
			deptId = id;
		} else if(type == 'testPaper') {
			$$('#demandTopic').val('');
			$$('#demandTestPaper').val(name);
			tpId = id;
		} else {
			$$('#demandTopic').val(name);
			topicId = id;
		}
	}

	/**
	 * 开始搜索 
	 */
	function searching() {
		$$('.searchBox').hide();
		beginDate = $$('#demandBeginDate').val();
		endDate = $$('#demandEndDate').val();
		deptName = $$('#demandDeptName').val();
		tpName = $$('#demandTestPaper').val();
		topicName = $$('#demandTopic').val();
		if(!beginDate || !endDate || !deptId) {
			app.myApp.alert('请选择单位名称，开始时间，结束时间');
			return;
		}
		$('.demandSearch').slideUp(200);
		app.ajaxLoadPageContent(searchAssessPath, {
			startTime: beginDate,
			endTime: endDate,
			deptId: deptId,
			testpaperId: tpId,
			topicId: topicId
		}, function(data) {
			console.log(data);
			pageDataStorage['search'] = data;
			handleSearch(data);
		});
		var historySearch = JSON.parse(localStorage.getItem('historyDemand')) || [];
		historySearch.unshift({
			deptId: deptId,
			deptName: deptName,
			tpId: tpId,
			tpName: tpName,
			topicId: topicId,
			topicName: topicName,
			begin: beginDate,
			end: endDate
		});
		localStorage.setItem('historyDemand', JSON.stringify(historySearch));
	}

	function handleSearch(data) {
		$$('.demandHistory').css('display', 'none');
		$$('.demandCard').css('display', 'block');
		$$('.demandTitle').html(deptName);
		$$('.demandTime').html('考核时间：' + $$('#demandBeginDate').val() + ' 至 ' + $$('#demandEndDate').val());
		$$('.demandTp').html('考核项：' + tpName);
		$$('.demandTopic').html('考核清单：' + topicName);
		$$('.people').html(data.users);
		$$('.detialTotal').html(data.total);
		$$('.detialPoint').html(data.point);
	}

	/**
	 * 清空搜索条件 
	 */
	function searchReset() {
		$$('.demandSearch input').val('');
		$$('.searchBox').hide();
		deptId = 0;
		tpId = 0;
		topicId = 0;
	}

	/**
	 * 点击查询图标 
	 */
	function searchIconClick() {
		$('.demandSearch').slideToggle(200);
		$$('.searchBox').hide();
	}

	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent() {
		app.ajaxLoadPageContent('UrlPath', {

		}, function(data) {
			console.log(data);
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
			//minDate: new Date((new Date().getFullYear() - 1) + '-12-31'),
			onClose: function(p) {
				var b = $$('#demandBeginDate').val();
				var e = $$('#demandEndDate').val();
				if(!e){
					return;
				}
				if(b > e) {
					app.myApp.alert('结束时间不能早于开始时间,请重新选择');
					$$('#demandEndDate').val('');
				}
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