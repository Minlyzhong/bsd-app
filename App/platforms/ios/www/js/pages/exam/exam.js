define(['app',
	'hbs!js/hbs/exam'
], function(app, examTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//搜索所有试卷
	var loadAllSubjectPath = app.basePath + 'exam/loadAllSubject';
	var content = '';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('exam/exam', [
//			'exam/examDetail',
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
		content = '';
		ajaxLoadContent(false);
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		handleExam(pageDataStorage['exam'], false);
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.examPage .pageTitle').html(page.query.appName);
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$('.examPage').click(cancelSearch);
		$$('#examSearch').on('keyup', searching).on('focus', clearList);
		$$('.examSearchBar .clear').on('click', clearSearch);
	}

	/**
	 * 进行搜索
	 */
	function searching() {
		$$('.examSearchBar .clear').css({
			opacity: '1',
			pointerEvents: 'auto'
		});
		var content = $$('#examSearch').val();
		if(!content) {
			return;
		}
		ajaxLoadContent(false, content);
	}

	/**
	 * 清空列表 
	 */
	function clearList() {
		$$('.examList ul').html('');
	}

	/**
	 * 取消搜索
	 */
	function cancelSearch(e) {
		var con = $('.examSearchBar .searchbar-input'); // 设置目标区域
		if(!con.is(e.target) && con.has(e.target).length === 0) {
			$$('.examSearchBar .searchbar-cancel').click();
			$$('.examSearchBar .clear').css('opacity', 0);
			handleExam(pageDataStorage['exam'], false);
		}
	}

	/**
	 * 清空搜索 
	 */
	function clearSearch() {
		$$('#examSearch').val('').focus();
	}

	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent(isLoadMore, content) {
		var content = arguments[1] ? arguments[1] : '';
		app.ajaxLoadPageContent(loadAllSubjectPath, {
			pageNo: pageNo,
			title: content,
		}, function(data) {
			console.log(data);
			if(!content) {
				if(isLoadMore) {
					pageDataStorage['exam'] = pageDataStorage['exam'].concat(data);
				} else {
					pageDataStorage['exam'] = data;
				}
			}
			handleExam(data, isLoadMore);
		});
	}

	/**
	 * 处理考试题目 
	 * @param {Object} data 试卷数据
	 * @param {Object} isLoadMore
	 */
	function handleExam(data, isLoadMore) {
		if(data.length > 0) {
			$$.each(data, function(index, item) {
				item.index = index;
			});
			if(isLoadMore) {
				$$('.examList ul').append(examTemplate(data));
			} else {
				$$('.examList ul').html(examTemplate(data));
			}
			$$('.examList .swipeAction').off('click', examListSwipe);
			$$('.examList .swipeAction').on('click', examListSwipe);
			$$('.examList .item-content').off('click', examListClick);
			$$('.examList .item-content').on('click', examListClick);
			if(data.length == 20) {
				loading = false;
			}
		} else {
			$$('.examList ul').html('无试卷内容');
		}
	}

	/**
	 * 滑动点击事件
	 */
	function examListSwipe() {
		var name = $$(this).parents('li').data('name'),
			time = $$(this).parents('li').data('time'),
			count = $$(this).parents('li').data('count'),
			point = $$(this).parents('li').data('point');
		if(!parseInt(count)) {
			app.myApp.alert('该试卷未出题');
			return;
		}
		app.myApp.alert('试卷标题: ' + name + '<br />考试时长: ' + time + '分钟<br />总分: ' + point + '分<br />试题数量: ' + count + '道');
	}

	/**
	 * 试题点击事件 
	 */
	function examListClick() {
		var id = $$(this).parents('li').data('id'),
			name = $$(this).parents('li').data('name'),
			count = $$(this).parents('li').data('count'),
			time = $$(this).parents('li').data('time'),
			point = $$(this).parents('li').data('point'),
			userName = $$(this).parents('li').data('userName'),
			subjectTypeName = $$(this).parents('li').data('subjectTypeName');
		if(!parseInt(count)) {
			app.myApp.alert('该试卷未出题');
			return;
		}
		console.log(subjectTypeName);
		app.myApp.getCurrentView().loadPage('examDetail.html?id=' + id +
			'&name=' + name + '&time=' + time + '&count=' + count +
			'&point=' + point + '&userName=' + userName + '&subjectTypeName=' + subjectTypeName);
	}

	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//下拉刷新
		var ptrContent = $$(page.container).find('.pull-to-refresh-content');
		ptrContent.on('refresh', function(e) {
			setTimeout(function() {
				pageNo = 1;
				loading = true;
				//这里写请求
				ajaxLoadContent(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});

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