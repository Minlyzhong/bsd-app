define(['app',
	'hbs!js/hbs/firstSecretaryDaily'
], function(app, vilDailyTemplate) {
	var $$ = Dom7;
	var pageNo = 1;
	var pageNo1 = 1;
	var loading = true;
	var loading1 = true;
	//最新日志分页列表
	var findLatestWorkLogPath = app.basePath + '/mobile/worklog/page/list/';
	//添加微动态
	var addRecord = app.basePath + '/mobile/worklog/';
	//上传图片
	var uploadRecordPhotoPath = app.basePath + '/file/upload';
	//日志内容输入最小字数 url:
	var findLogMinLenPath = app.basePath + '/mobile/worklog/';
	var photoBrowserPhotos = [];
	var photoBrowserPopup = '';
	var photoBrowserPhotoslist = {};
	// var photoBrowserPopup = '';
	var readonlyPicCount = 0;
	var photoDatas = [];
	var signStatus = 0;
	var count = 0;
	var pageDataStorage = {}; 
	
	var NewRecordKey = '';

	var imageList = [];
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		NewRecordKey = '';
		count = 0;
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
		pageNo1 = 1;
		loading1 = true;
		imageList = [];
		photoBrowserPhotos = [];
		photoBrowserPopup = '';
		photoBrowserPhotoslist = {};
		readonlyPicCount = 0;
		photoDatas = [];
		if(pageData.reloadOk != 1){
			loadRecord(false,pageNo);
		}
		//字数
		app.ajaxLoadPageContent(findLogMinLenPath+'2'+'/content/min/len', {
			
		}, function(result) {
			console.log(result)
			pageDataStorage['minLen'] = result.data
			$$('#publicContent').attr('placeholder','这一刻你想说什么（不少于'+pageDataStorage['minLen']+'字!）');
		});
		
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.pageTitle').html(page.query.appName);	
	}

	
	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		//$$('.checkUpdate').on('click', checkUpdate);
		//showPhotos(pageDataStorage['recordContent'].photos);
		$$('.publicRecord').on('click',publibMove);
		//$$('.weui_uploader_input_wrp').on('click', showImgPicker);
		//$$('.saveRecord').on('click',publicR);
		//$$('.gps').on('click', getPosition);
		
		$$('#ShowNewRecordSearch').on('focus',searchRecord);
		$$('.ShowNewRecordSearchBar .searchCancelBtn').on('click', hideSearchList);
		$$('#ShowNewRecordSearch').on('keyup', keyupContent);
	}
	
	function searchRecord(){
		pageNo1 = 1;
		loading1 = true;
		NewRecordKey='';
		$$(this).css('text-align', 'left');
		$$('.firstShowPeopleList ul').html('');
		$$('.firstPeopleNotFound').css('display', 'none');
		$$('.ShowNewRecordSearchBar .searchCancelBtn').css('display', 'block');
		$$('.infinite-scroll.searchRecord').css('display', 'block');
		$$('.infinite-scroll.contentRecord').css('display', 'none');
	}
	function hideSearchList(){
		pageNo1 = 1;
		loading1 = true;
		NewRecordKey='';
		$$('#ShowNewRecordSearch').val('');
		$$('.firstPeopleNotFound').css('display', 'none');
		$$('.firstShowPeopleList ul').html('');
		$$('#ShowNewRecordSearch').css('text-align', 'center');
		$$('.ShowNewRecordSearchBar .searchCancelBtn').css('display', 'none');
		$$('.infinite-scroll.searchRecord').css('display', 'none');
		$$('.infinite-scroll.contentRecord').css('display', 'block');
	}
	function keyupContent(){
		$$('.firstShowPeopleList ul').html('');
		NewRecordKey = $$('#ShowNewRecordSearch').val();
		console.log(NewRecordKey);
		if(!NewRecordKey) {
			return;
		}
		loadRecord1(false,pageNo1);
	}
	/**
	 *页面跳转 
	 */
	function publibMove(){
		app.myApp.getCurrentView().loadPage('publicRecord.html?reloadOk=1');
	}
	

	
	/**
	 *	刷新 
	 */
	function refresh(){
		setTimeout(function() {
			pageNo = 1;
			loading = true;
			photoBrowserPhotos = [];
			photoBrowserPopup = '';
			photoBrowserPhotoslist = {};
			readonlyPicCount = 0;
			//这里写请求
			loadRecord(false,pageNo);
			app.myApp.pullToRefreshDone();
		}, 1000);
	}


	
	/**
	 * 异步请求页面数据 
	 */
	function loadRecord(isLoadMore,pageNo) {
//		console.log(app.user.id);
//		console.log(app.userId);
		//清空photoDatas
		photoDatas = [];
		console.log(pageNo);
		console.log(NewRecordKey);
		app.myApp.showPreloader('加载中...');
		app.ajaxLoadPageContent(findLatestWorkLogPath+3, {
			// userId: app.user.userId,
			pageNo: pageNo,
			tenantId: app.user.tenantId,
			
//			query: NewRecordKey,
		}, function(result) {
			app.myApp.hidePreloader();
			var data = result.data.records;
			$$.each(data, function(index, item) {
				item.isSearch = 'false';
				// $$('.recordLike>i').removeClass('icon-collect').addClass('icon-noCollect');
				// $$('.likeStatus').html('赞');
			});
			console.log(data);
			handleRecord(data, isLoadMore);			
		});
	}
	function loadRecord1(isLoadMore,pageNo1) {
//		console.log(app.user.id);
//		console.log(app.userId);
		//清空photoDatas
		photoDatas = [];
		console.log(pageNo);
		console.log(NewRecordKey);
		app.ajaxLoadPageContent(findLatestWorkLogPath+3, {
			// userId: app.user.userId,
			pageNo: pageNo1,
			query: NewRecordKey,
		}, function(result) {
			
			var data = result.data.records;
			$$.each(data, function(index, item) {
				item.isSearch = 'true';
			});
			console.log(data);
			if(data == ''){
				$$('.firstPeopleNotFound').css('display','none');
			}
			handleSearchRecord(data, isLoadMore);	
		});
	}


	/**
	 * 加载工作日志
	 * @param {Object} data
	 */
	function handleRecord(data, isLoadMore) {
		
		if(data.length) {

			


			if(isLoadMore) {
				$$('.fsdList').append(vilDailyTemplate(data));
				
			} else {
				$$('.fsdList').html(vilDailyTemplate(data));
				
			}
			$$.each(data, function(index, item){
				if(item.images){
					var imageList = item.images;
					var imageId = item.id;
					
					showReadonlyPhotos(imageList, imageId,false);
					

				}else{
					// item.logPic = item.logPic;
				}
			})

			$$('.fsdList .align-top').on('click', loadRecordDetail);

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
	 * 显示已读相片
	 * @param {Object} picUrlList 需要显示的图片数组
	 */
	function showReadonlyPhotos(picUrlList,imageId, isSearch) {
		console.log(picUrlList,imageId)
			photoBrowserPhotos=[];
		$$.each(picUrlList, function(index, item) {
			var item = item.attPath;
			
			photoBrowserPhotos.push(app.filePath + item);
			photoBrowserPhotoslist[imageId] = photoBrowserPhotos;
			console.log(photoBrowserPhotos)
			var random = app.utils.generateGUID();
			
			$$('#picList_'+imageId+'_'+isSearch).append(
				'<div class="weui_uploader_bd kpiPicture">' +
				'<div class="picContainer" id="img_' + random + '">' +
				'<img src="' + app.filePath + item + '" class="picSize" />' +
				'</div>' +
				'</div>');
				
			$$('#img_' + random).on('click', function(e) {
				e.stopPropagation();
				var picIndex = $$(this).parent().index();
				console.log(picIndex);
				console.log(photoBrowserPhotoslist);
				console.log(photoBrowserPhotoslist[imageId]);
				photoBrowserPopup = app.myApp.photoBrowser({
					photos: photoBrowserPhotoslist[imageId],
					theme: 'dark',
					backLinkText: '关闭',
					ofText: '/',
					type: 'popup',
				});
				photoBrowserPopup.open(picIndex);
			});
		});
	}
	
	/**
	 * 加载搜索工作日志
	 * @param {Object} data
	 */
	function handleSearchRecord(data, isLoadMore) {
		if(data.length) {
			if(isLoadMore) {
				$$('.firstShowPeopleList ul').append(vilDailyTemplate(data));
			} else {
				$$('.firstShowPeopleList ul').html(vilDailyTemplate(data));
			}
			$$.each(data, function(index, item){
				if(item.images){
					var imageList = item.images;
					var imageId = item.id;
					
					showReadonlyPhotos(imageList, imageId, true);
					

				}else{
					// item.logPic = item.logPic;
				}
			})
			$$('.firstShowPeopleList ul .align-top').on('click', loadRecordDetail);

			if(data.length == 10) {
				loading1 = false;
			}
		} else {
			$$('.firstPeopleNotFound').css('display', 'block');
		}
	}

	/**
	 * 跳转详细页面 
	 */
	function loadRecordDetail() {
		var recordId = $$(this).data('id');
		var userId = $$(this).data('userId');
		var loadTypeId = 1;
		var state = -1;
		var reviewName = $$(this).data('userName');
		var workType = '微动态';
//		console.log(recordId);
//		console.log(userId);
//		console.log(loadTypeId);
//		console.log(state);
//		console.log(reviewName);
//		console.log(workType);
		app.myApp.getCurrentView().loadPage('recordDetail3.html?id=' + recordId + '&userId=' + userId + '&workType=' + workType + '&state=' + state + '&reviewName=' + reviewName + '&logTypeId=3');
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
				loadRecord(false,pageNo);
				app.myApp.pullToRefreshDone();
			}, 500);
		});

		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		loadMoreContent.on('infinite', function() {
			if(NewRecordKey==''){
				if(loading) return;
				loading = true;
				pageNo += 1;
				//这里写请求
				loadRecord(true,pageNo);
			}else{
				if(loading1) return;
				loading1 = true;
				pageNo1 += 1;
				//这里写请求
				loadRecord1(true,pageNo1);
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
		refresh: refresh,
		resetFirstIn: resetFirstIn,
	}
});