define(['app',
	'hbs!js/hbs/workPlace',
	'hbs!js/hbs/workPlace1'
], function(app, vilDailyTemplate,vilDailyTemplate1) {
	var $$ = Dom7;
	var pageNo = 1;
	var pageNo1 = 1;
	var loading = true;
	var loading1 = true;
	//获取建设任务
	var findBuildingPath = app.basePath + '/mobile/position/building/list';

	//获取建设任务详情
	var findBuildingDetailPath = app.basePath + '/mobile/position/building/detail/';
	
	var NewRecordKey = '';
	var tpArr = [];
	var tpArr1 = [];

	var photoBrowserPhotoslist = {};
	var photoBrowserPhotos = [];
	var photoBrowserPopup = '';
	var readonlyPicCount = 0;
	var photoDatas = [];
	var reWork = 0;
	var deptName = '';

	
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
		photoBrowserPhotos = [];
		reWork = 0;
		photoBrowserPopup = '';
		readonlyPicCount = 0;
		pageDataStorage = {};
		photoBrowserPhotoslist={};
		pageNo = 1;
		loading = true;
		pageNo1 = 1;
		loading1 = true;
		tpArr = [];
		tpArr1 = [];
		$$('.workTitle').html('您所属的支部: '+app.userDetail.deptName)
		if(pageData.reloadOk != 1){
			loadRecord(false,pageNo);
		}
		
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
		tpArr1 = [];
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
		tpArr = [];
		tpArr1 = [];
		photoBrowserPhotos = [];
		reWork = 0;
		photoBrowserPopup = '';
		readonlyPicCount = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		pageNo1 = 1;
		loading1 = true;
		photoBrowserPhotoslist={};
		setTimeout(function() {
			
			//这里写请求
			loadRecord(false,pageNo);
			app.myApp.pullToRefreshDone();
		}, 500);
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
		app.ajaxLoadPageContent(findBuildingPath, {
			// userId: app.user.userId,
			pageNo: pageNo,
			// tenantId: app.user.tenantId,
			
//			query: NewRecordKey,
		}, function(result) {
			var data = result.data.records;
			$$.each(data, function(index, item){
				item.index = index;
			})
			console.log(data);
			
			handleRecord(data, isLoadMore);			
		});
	}

	/**
	 * 搜索数据 
	 */
	function loadRecord1(isLoadMore,pageNo1) {

		//清空photoDatas
		photoDatas = [];
		tpArr1 = [];
		console.log(pageNo);
		console.log(NewRecordKey);
		app.ajaxLoadPageContent(findBuildingPath , {
			// userId: app.user.userId,
			pageNo: pageNo1,
			query: NewRecordKey,
		}, function(result) {
			var data = result.data.records;
			$$.each(data, function(index, item){
				item.index = index;
			})
			console.log(data);
			// if(data == ''){
			$$('.firstPeopleNotFound').css('display','none');
			// }
			handleSearchRecord(data, isLoadMore);	
		});
	}


	/**
	 * 
	 * @param {Object} data
	 */
	function handleRecord(data, isLoadMore) {
		if(data.length) {




			if(isLoadMore) {
				$$('.fsdList ul').append(vilDailyTemplate(data));
			} else {
				$$('.fsdList ul').html(vilDailyTemplate(data));
			}
			// $$('.fsdList ul .card-content').on('click', loadRecordDetail);

			if(data.length == 10) {
				loading = false;
			}

			$$('.fsdList ul .addBuildingImg').on('click', loadAddDetail);

			$$('.fsdList ul .accordion-item').on('open', loadRecordDetail);

			// $$('.accordion-item').on('open', function () {
			// 	console.log('打开');
			//   }); 
			   
		} else {
			if(!isLoadMore) {
				$$('.recordList').html('');
			}
		}
	}
	
	/**
	 * 加载搜索
	 * @param {Object} data
	 */
	function handleSearchRecord(data, isLoadMore) {
		if(data.length) {
			if(isLoadMore) {
				$$('.firstShowPeopleList ul').append(vilDailyTemplate1(data));
			} else {
				$$('.firstShowPeopleList ul').html(vilDailyTemplate1(data));
			}
			$$('.firstShowPeopleList ul .addBuildingImg').on('click', loadAddDetail);
			$$('.firstShowPeopleList ul .accordion-item').on('open', loadRecordDetail1);

			if(data.length == 10) {
				loading1 = false;
			}
		} else {
			$$('.firstPeopleNotFound').css('display', 'block');
		}
	}

/**
	 * 查看详情图片
	 */
	function loadRecordDetail() {
		
		var id = $$(this).data('id');
		// console.log(id);
		// console.log(tpArr[id]);
		// console.log(tpArr);
		if(id && !tpArr[id]) {
			app.myApp.showPreloader('加载中...');
			app.ajaxLoadPageContent(findBuildingDetailPath + id, {
	
			}, function(result) {
				app.myApp.hidePreloader();
				
				if(result.code == 0 && result.data != null){
					
					var data = result.data.images;
					if(data !=null){
						tpArr[id] = data;
						console.log(tpArr[id]);
						console.log(id);
						$$('.noPic_'+id).css('display','none');
						handleDetailPic(id,false);	
					}else{
						tpArr[id] = [{id: id,url:null}];
						$$('.noPic_'+id).css('display','block');
					}
					
				}else{
					app.myApp.toast('获取图片失败','error').show(true);
				}
						
			});
		}else{
			// handleDetailPic(id);

		}

	}
	
		
		
	
	/**
	 * 搜索查看详情图片
	 */
	function loadRecordDetail1() {
		
		var id = $$(this).data('id');
		console.log(id);
		console.log(tpArr1[id]);
		console.log(tpArr1);
		if(id && !tpArr1[id]) {
			app.myApp.showPreloader('加载中...');
			app.ajaxLoadPageContent(findBuildingDetailPath + id, {
	
			}, function(result) {
				app.myApp.hidePreloader();
				
				if(result.code == 0 && result.data != null){
					
					var data = result.data.images;
					if(data !=null){
						tpArr1[id] = data;
						console.log(tpArr1[id]);
						console.log(id);
						$$('.noPic_'+id).css('display','none');
						handleDetailPic(id,true);	
					}else{
						tpArr1[id] = [{id: id,url:null}];
						$$('.noPic_'+id).css('display','block');
					}
					
				}else{
					app.myApp.toast('获取图片失败','error').show(true);
				}
			});
		}else{
			// handleDetailPic(id);

		}
		

	}

	/**
	 * 处理图片
	 */
	function handleDetailPic(id,isSearch){
		if(isSearch){
			var topicContent = tpArr1[id];
		}else{
			var topicContent = tpArr[id];
		}
		showReadonlyPhotos(topicContent, id,isSearch);

		
	}
	
/**
	 * 显示相片
	 * @param {Object} picUrlList 需要显示的图片数组
	 */
	function showReadonlyPhotos(picUrlList ,id,isSearch) {
		photoBrowserPhotos=[];
		$$.each(picUrlList, function(index, item) {
			photoBrowserPhotos.push(app.filePath + item.url);
			photoBrowserPhotoslist[id] = photoBrowserPhotos;
			var random = app.utils.generateGUID();
			if(isSearch){
				var pic = $$('.buildingPic1_'+id);
			}else{
				var pic = $$('.buildingPic_'+id);
			}
			pic.append(
				'<div class="weui_uploader_bd kpiPicture">' +
				'<div class="picContainer" id="img_' + random + '">' +
				'<img src="' + app.filePath + item.url + '" class="picSize" />' +
				'</div>' +
				'</div>');
			
		
			$$('#img_' + random).on('click', function(e) {
				var picIndex = $$(this).parent().index();
				console.log(picIndex)
				photoBrowserPopup = app.myApp.photoBrowser({
					photos: photoBrowserPhotoslist[id],
					theme: 'dark',
					backLinkText: '关闭',
					ofText: '/',
					type: 'popup',
				});
				photoBrowserPopup.open(picIndex - 1 - reWork);
			});
		});
	}


	/**
	 * 跳转详细页面 
	 */
	function loadAddDetail(e) {
		e.stopPropagation();
		console.log('1111')
		
		var id = $$(this).data('id');
		var placeName = $$(this).data('placeName');
		// var loadTypeId = 1;
		// var state = -1;
		// var reviewName = $$(this).data('userName');
		console.log(placeName)

		app.myApp.getCurrentView().loadPage('workPlaceDetail.html?id='+id+'&placeName='+placeName);
		return false;
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