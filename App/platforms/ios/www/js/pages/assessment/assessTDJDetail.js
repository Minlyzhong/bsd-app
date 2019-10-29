define(['app',
	'hbs!js/hbs/assessTDJDetail',
	'hbs!js/hbs/assessTDJNot'
], function(app, listTemplate, notTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	var pageNotNo = 1;
	var NotLoading = true;
	//获取支部已完成的考核清单
	var findCompletionOfTopicPath = app.basePath + 'statHelper/findCompletionOfTopic';
	var deptId = 0;
	var topicId = 0;
	var id = 0;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('assessment/assessTDJDetail', [
//			'assessment/assessJDDetail'
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
		pageNotNo = 1;
		NotLoading = true;
		deptId = pageData.deptId;
		topicId = pageData.topicId;
		id = pageData.id;
		loadPaper(false);
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		handlePaper(pageDataStorage['paper'], false);
		if(pageDataStorage['not']) {
			handleNot(pageDataStorage['not'], false);
		}
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.atdjd .pageTitle').html(page.query.name);
		var head = page.query.head;
		var rege = new RegExp("equal", "g"); //g,表示全部替换。
		$$('.atdjdHead').html(head.replace(rege, '='));
		$$($$('.atdjdTab div')[0]).addClass('active');
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.atdjdTab div').on('click', tabClick);
	}

	/**
	 * 点击选项卡 
	 */
	function tabClick() {
		$$('.atdjdTab div').removeClass('active');
		$$(this).addClass('active');
		var index = $$(this).data('index');
		if(index == '0') {
			$$('.paperList').css('display', 'block');
			$$('.notList').css('display', 'none');
		} else {
			$$('.paperList').css('display', 'none');
			$$('.notList').css('display', 'block');
			if(!pageDataStorage['not']) {
				//加载未完成的
				loadNot(false);
			}
		}
	}

	/**
	 *  个人考核明细
	 */
	function loadPaper(isLoadMore) {
		app.ajaxLoadPageContent(findCompletionOfTopicPath, {
			deptId: id,
			knowledgePaperId: topicId,
			page: pageNo,
			limit: 10,
			type: 1,
		}, function(result) {
			var data = result.data;
			console.log(data);
			if(isLoadMore) {
				pageDataStorage['paper'] = pageDataStorage['paper'].concat(data);
			} else {
				pageDataStorage['paper'] = data;
			}
			handlePaper(data, isLoadMore);
		});
	}

	/**
	 *  加载个人考核明细
	 * @param {Object} data
	 */
	function handlePaper(data, isLoadMore) {
		if(data.length) {
			if(isLoadMore) {
				$$('.atdjdList ul').append(listTemplate(data));
			} else {
				$$('.atdjdList ul').html(listTemplate(data));
			}
			$$('.atdjdList .item-content').on('click', function() {
				var _topicId = $$(this).data("id");
				var title = $$(this).data('title');
				app.myApp.getCurrentView().loadPage('assessJDDetail.html?topicId=' + _topicId + '&title=' + title);
			});
			if(data.length == 10) {
				loading = false;
			}
		}
	}
	
	/**
	 * 读取未完成数据 
	 */
	function loadNot(isLoadMore){
		app.ajaxLoadPageContent(findCompletionOfTopicPath, {
			deptId: id,
			knowledgePaperId: topicId,
			page: pageNo,
			limit: 10,
			type: 0,
		}, function(result) {
			var data = result.data;
			console.log(data);
			if(isLoadMore) {
				pageDataStorage['not'] = pageDataStorage['not'].concat(data);
			} else {
				pageDataStorage['not'] = data;
			}
			handleNot(data, isLoadMore);
		});
	}
	
	/**
	 * 加载未完成数据 
	 */
	function handleNot(data, isLoadMore) {
		if(data.length) {
			if(isLoadMore) {
				$$('.assessNotList ul').append(notTemplate(data));
			} else {
				$$('.assessNotList ul').html(notTemplate(data));
			}
			if(data.length == 10) {
				loading = false;
			}
		}
	}

	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll.paperList');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			//这里写请求
			loadPaper(true);
		});
		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll.notList');
		loadMoreContent.on('infinite', function() {
			if(NotLoading) return;
			NotLoading = true;
			pageNotNo += 1;
			//这里写请求
			loadNot(true);
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