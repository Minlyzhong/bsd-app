define(['app',
	'hbs!js/hbs/firstSecretaryOwnDaily'
], function(app, vilRecordCardTemplate) {
	var $$ = Dom7;
	var pageNo = 1;
	var loading = true;
	//加载工作日志
	//var loadLogPath = app.basePath + 'extWorkLog/checkOwnWorkLog';
	var loadLogPath = app.basePath + 'extWorkLog/findWorkLogOfUser';
	//获取贫困村详细信息
	var findPoorVilPath = app.basePath + 'poorVillage/findPoorVilById';
	var userId = 0;
	var userName = '';
	var poorVilId = 0;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
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
		userId = pageData.userId;
		userName = pageData.userName;
		poorVilId = pageData.vilId;
		loadRecord(false);
		console.log(poorVilId);
		if(poorVilId>0){
			findPoorVillage();
		}else{
			$$(".fsodHead").css('display','none');
		}
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {

	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {

	}
	
	/**
	 * 读取贫困村信息
	 */
	function findPoorVillage() {
		app.ajaxLoadPageContent(findPoorVilPath, {
			poorVilId: poorVilId
		}, function(result) {
			var data = result.data;
			console.log(data);
			$$('.fsodHead .content').html(data.memo);
			$$('.fsodHead .title').html(data.villageName + '简介');
			if(data.picUrl) {
				$$('.fsodHead img').attr('src', app.basePath + data.picUrl);
			}
		});
	}

	/**
	 *  读取工作日志 
	 * @param {Object} isLoadMore 是否加载更多
	 */
	function loadRecord(isLoadMore) {
		app.ajaxLoadPageContent(loadLogPath, {
			userId: userId,
			pageNo: pageNo,
			loadType: 0,
			logTitle: '',
			startDate: '',
			endDate: '',
		}, function(result) {
			var data = result;
			$$.each(data, function(index, item) {
				item.userName = userName;
				if(!item.logPic) {
					item.logPic = 'img/logo.png';
				} else {
					item.logPic = app.basePath + item.logPic;
				}
			});
			console.log(data);
			handleRecord(data, isLoadMore);
		});
	}

	/**
	 * 加载工作日志
	 * @param {Object} data
	 */
	function handleRecord(data, isLoadMore) {
		if(data.length) {
			if(isLoadMore) {
				$$('.fsodList').append(vilRecordCardTemplate(data));
			} else {
				$$('.fsodList').html(vilRecordCardTemplate(data));
			}
			$$('.fsodList .item-content').on('click', loadRecordDetail);

			if(data.length == 10) {
				loading = false;
			}
		} else {
			if(!isLoadMore) {
				$$('.recordList').html('');
			}
		}
	}

	/**
	 * 跳转详细页面 
	 */
	function loadRecordDetail() {
		var recordId = $$(this).data('id');
		var loadTypeId = $$(this).data('loadTypeId');
		var state = -1;
		var reviewName = userName;
		var workType = $$(this).data('workType');
		var b = reviewName.substring(reviewName.indexOf('('),reviewName.indexOf(')'));
		if(b == '(第一书记'){
			reviewName = reviewName.substring(0,reviewName.indexOf('('));
		}
//		console.log(recordId);
//		console.log(userId);
//		console.log(loadTypeId);
//		console.log(state);
//		console.log(a);
//		console.log(workType)
		app.myApp.getCurrentView().loadPage('recordDetail2.html?id=' + recordId + '&userId=' + userId + '&workType=' + workType + '&state=' + state + '&reviewName=' + reviewName);
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
				loadRecord(false);
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
			loadRecord(true);
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