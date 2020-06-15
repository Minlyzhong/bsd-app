define(['app',
	'hbs!js/hbs/operatingList'
], function(app, vilDailyTemplate) {
	var $$ = Dom7;
	var pageNo = 1;
	var pageNo1 = 1;
	var loading = true;
	var loading1 = true;
	//获取办事事项列表
	var findLatestWorkLogPath = app.basePath + '/mobile/operating/event/list';
	//删除事件
	var deleteEvent = app.basePath + '/mobile/operating/event/';

	var pageDataStorage = {}; 
	
	var NewRecordKey = '';
	
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
		
		//$$('.checkUpdate').on('click', checkUpdate);
		//showPhotos(pageDataStorage['recordContent'].photos);
		//$$('.weui_uploader_input_wrp').on('click', showImgPicker);
		//$$('.saveRecord').on('click',publicR);
		
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
		// console.log(NewRecordKey);
		if(!NewRecordKey) {
			return;
		}
		loadRecord1(false,pageNo1);
	}
	
	/**
	 *	刷新 
	 */
	function refresh(){
		setTimeout(function() {
			pageNo = 1;
			loading = true;
			//这里写请求
			loadRecord(false,pageNo);
			app.myApp.pullToRefreshDone();
		}, 1000);
	}

	
	/**
	 * 异步请求页面数据 
	 */
	function loadRecord(isLoadMore,pageNo) {
		// console.log(pageNo);
		// console.log(NewRecordKey);
		app.ajaxLoadPageContent(findLatestWorkLogPath, {
			deptId: app.userDetail.deptId,
			current: pageNo,
			size: 10,
			// tenantId: app.user.tenantId,			
			// query: NewRecordKey,
		}, function(result) {
			var data = result.data.records;
			$$.each(data, function(index, item) {
				item.createTime = app.getnowdata(item.createTime);
			});
			// console.log(data);
			handleRecord(data, isLoadMore);			
		});
	}
	/**
	 * 异步请求搜索页面数据 
	 */
	function loadRecord1(isLoadMore,pageNo1) {
//		console.log(app.user.id);
//		console.log(app.userId);
		//清空photoDatas
		photoDatas = [];
		// console.log(pageNo);
		// console.log(NewRecordKey);
		app.ajaxLoadPageContent(findLatestWorkLogPath, {
			// userId: app.user.userId,
			size: 10,
			current: pageNo1,
			query: NewRecordKey,
			deptId: app.userDetail.deptId,
			
		}, function(result) {
			var data = result.data.records;
			$$.each(data, function(index, item) {
				
			});
			// console.log(data);
			if(data == ''){
				$$('.firstPeopleNotFound').css('display','none');
			}
			handleSearchRecord(data, isLoadMore);	
		});
	}


	/**
	 * 加载办事事项列表
	 * @param {Object} data
	 */
	function handleRecord(data, isLoadMore) {
		var _this = this;
		if(data.length) {

			$$.each(data, function(index, item){

				if(item.groupLeaderSign == null && item.personChargeSign == null && item.villagePersonCharge == null){
					item.isSign = 0;
				}else{
					item.isSign = 1;
				}
			})


			if(isLoadMore) {
				$$('.fsdList').append(vilDailyTemplate(data));
			} else {
				$$('.fsdList').html(vilDailyTemplate(data));
			}
			// 暂时注销
			$$('.fsdList .hL').on('click', loadRecordDetail);
			
			$$('.fsdList .swipeout-delete').on('click',function(){
				// var meetingId = $$(this).data('mid');
				// modifyMeetingActorState(meetingId);
				var eId = $$(this).data('id');
				var matterName = $$(this).data('mattername');

				console.log(matterName);
				// app.myApp.confirm('是否确认移除事项 : '+matterName+' ?', function() {
						
					// 提交到后台审核
					$$.ajax({
						url:deleteEvent+eId,
						method: 'DELETE',
						dataType: 'json',
						contentType: 'application/json;charset:utf-8', 
						data: '',
						cache: false,
						success:function (data) {
							if(data.data == true && data.code == 0){  
								app.myApp.toast('移除成功！', 'success').show(true);
								refresh();
							}else{
								app.myApp.toast('移除失败！请稍后再试', 'error').show(true);
								}
							
							},
						error:function () {
							app.myApp.alert("网络异常！");
							
						}
					});
				// });

			})

			if(data.length == 10) {
				loading = false;
			}
		} else {
			if(data.length == 0 && pageNo == 1){
				$$('.fsdList').html('<div style="font-size: 16px;padding-top: 200px; width:100%;text-align:center;">暂无办事事项</div>');
			}
			if(!isLoadMore) {
				$$('.recordList').html('');
			}
		}
	}
	
	/**
	 * 加载搜索办事事项
	 * @param {Object} data
	 */
	function handleSearchRecord(data, isLoadMore) {
		if(data.length) {
			$$.each(data, function(index, item){

				if(item.groupLeaderSign == null && item.personChargeSign == null && item.villagePersonCharge == null){
					item.isSign = 0;
				}else{
					item.isSign = 1;
				}
			})
			if(isLoadMore) {
				$$('.firstShowPeopleList ul').append(vilDailyTemplate(data));
			} else {
				$$('.firstShowPeopleList ul').html(vilDailyTemplate(data));
			}
			$$('.firstShowPeopleList ul .hL').on('click', loadRecordDetail);

			$$('.firstShowPeopleList .swipeout-delete').on('click',function(){
				// var meetingId = $$(this).data('mid');
				// modifyMeetingActorState(meetingId);
				var eId = $$(this).data('id');
				var matterName = $$(this).data('mattername');

				console.log(matterName);
				// app.myApp.confirm('是否确认移除事项 : '+matterName+' ?', function() {
						
					// 提交到后台审核
					$$.ajax({
						url:deleteEvent+eId,
						method: 'DELETE',
						dataType: 'json',
						contentType: 'application/json;charset:utf-8', 
						data: '',
						cache: false,
						success:function (data) {
							if(data.data == true && data.code == 0){  
								app.myApp.toast('移除成功！', 'success').show(true);
								//   初始化搜索页数
								  pageNo1 = 1;
								// 刷新搜索页
								  keyupContent();
								// 刷新进来时的页面
								  refresh();
							}else{
								app.myApp.toast('移除失败！请稍后再试', 'error').show(true);
								}
							
							},
						error:function () {
							app.myApp.alert("网络异常！");
							
						}
					});
				// });

			})
		
		 
			$$('.firstPeopleNotFound').css('display','none');
			if(data.length == 10) {
				loading1 = false;
			}
		}else{
			if(pageNo1 != 1){
				
			}else{
				$$('.firstPeopleNotFound').css('display', 'block');
			}
			
		}
	}

	//修改信息状态接口
	function modifyMeetingActorState(meetingId){
		app.ajaxLoadPageContent(modifyMeetingActorStatePath+meetingId, {
			// userId:app.userId,
			// meetingId:meetingId
		}, function(data) {
			console.log(data);
			findMeetingNotice();
		},{
			type:'DELETE'
		});
	}
	

	/**
	 * 跳转详细页面 
	 */
	function loadRecordDetail() {
		var signId = $$(this).data('id');
		var userId = $$(this).data('userId');
		var matter = $$(this).data('matterName');

		app.myApp.getCurrentView().loadPage('operatingQuest.html?id=' + signId + '&userId=' + userId+'&matterName='+matter);
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