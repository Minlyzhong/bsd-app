define(['app',
	'hbs!js/hbs/threeMeetingsAndOneClassPaperD'
], function(app,tMAOCDetailTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	var pageNo1 = 1;
	var loading1 = true;
	//获取党支部未完成的三会一课
	var getTopicCompletedOrNotPath = app.basePath + '/mobile/partyAm/getTopicCompletedOrNot';
	
	//获取年份
	var getYearsPath = app.basePath + '/mobile/partyAm/getYears';
	var title = '';
	
	
	var year = '';
	var month = '';
	var year1 = '';
	var month1 = '';
	
	var query;
	var startDate ='';
	var endDate = '';
	var searchStartDate = '';
	var searchEndDate = '';
	var type=0;
	var deptId = 0;
	var topicId = 0;
	var branchName = '';
	var khpl;
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		app.back2Home();
		pushAndPull(page);
		//点击事件
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
		pageNo1 = 1;
		loading1 = true;
		query="";
		type = pageData.type;
		deptId = app.user.deptId;
		topicId = pageData.topicId;
		startDate='';
		endDate='';
		year = '';
		month = '';
		year1 = '';
		month1 = '';
		branchName = pageData.branchName;
		if(type == 0){
			// 查未完成的三会一课
			 getTopicCompletedOrNotPath = app.basePath + '/mobile/partyAm/getTopicCompletedOrNot';
		}else{
			// 已完成的三会一课
			getTopicCompletedOrNotPath = app.basePath + '/mobile/partyAm/getTopicCompleted';
		}
		if(pageData.deptId != undefined){
			deptId = pageData.deptId;
		}
		if(pageData.startTime != undefined){
			startDate = pageData.startTime;
		}
		if(pageData.startTime != undefined){
			endDate = pageData.endTime;
		}
		if(pageData.khpl != undefined){
			khpl = pageData.khpl;
		}
		console.log(startDate);
		console.log(endDate);
		console.log(khpl);
		ajaxLoadContent(false);
	}	
	/**
	 * 点击事件
	 */
	function clickEvent(){
		
		//点击查询框
		$$('#threeMeetingsAndOneClassPaperDetailSearch').on('focus', function() {
			$$(this).css('text-align', 'left');
			$$('#threeMeetingsAndOneClassPaperDetailName').val("");
			$$('#threeMeetingsAndOneClassPaperDetailSearch').val("");
			$$('#threeMeetingsAndOneClassPaperDetailStartTime').val('');
			$$('#threeMeetingsAndOneClassPaperDetailEndTime').val('');
			$$('.threeMeetingsAndOneClassPaperDetailSearchBar .threeMeetingsAndOneClassPaperDetailCancelBtn').css('display', 'block');
			$$('.threeMeetingsAndOneClassPaperDetailPage').css('display', 'none');
			$$('.threeMeetingsAndOneClassPaperDetailSearch').css('display', 'block');
			$$('.threeMeetingsAndOneClassPaperDetailSearchList').css('display', 'block');
			$$('.threeMeetingsAndOneClassPaperDetailDSearchBox').css('display', 'block');
			$$('.threeMeetingsAndOneClassPaperDetailSearchList ul').html("");
		});
		
		$$('.threeMeetingsAndOneClassPaperDetailCancelBtn').click(function(){
			searchStartDate = '';
			searchEndDate = '';
			$$('#threeMeetingsAndOneClassPaperDetailName').val("");
			$$('#threeMeetingsAndOneClassPaperDetailSearch').val("");
			$$('#threeMeetingsAndOneClassPaperDetailSearch').css('text-align', 'center');
			$$('.threeMeetingsAndOneClassPaperDetailSearchBar .threeMeetingsAndOneClassPaperDetailCancelBtn').css('display', 'none');
			$$('.threeMeetingsAndOneClassPaperDetailPage').css('display', 'block');
			$$('.threeMeetingsAndOneClassPaperDetailSearch').css('display', 'none');
		});
		
		$$('.threeMeetingsAndOneClassPaperDetailSearchClose').click(function(){
			query="";
			searchStartDate = '';
			searchEndDate = '';
			$$('#threeMeetingsAndOneClassPaperDetailName').val("");
			$$('#threeMeetingsAndOneClassPaperDetailSearch').val("");
			$$('#threeMeetingsAndOneClassPaperDetailSearch').css('text-align', 'center');
			$$('.threeMeetingsAndOneClassPaperDetailSearchBar .threeMeetingsAndOneClassPaperDetailCancelBtn').css('display', 'none');
			$$('.threeMeetingsAndOneClassPaperDetailPage').css('display', 'block');
			$$('.threeMeetingsAndOneClassPaperDetailSearch').css('display', 'none');
			$$('.threeMeetingsAndOneClassPaperDetailDSearchBox').css('display', 'none');
			
		});
		
		$$('.threeMeetingsAndOneClassPaperDetailDSearchBox .resetBtn').on('click',function(){
			searchStartDate = '';
			searchEndDate = '';
			pageNo1=1;
			$$('#threeMeetingsAndOneClassPaperDetailStartTime').val('');
			$$('#threeMeetingsAndOneClassPaperDetailEndTime').val('');
			$$('#threeMeetingsAndOneClassPaperDetailName').val('');
			loading1=true;
			
		});
		$$('.threeMeetingsAndOneClassPaperDetailDSearchBox .searchBtn').on('click',function(){
//			if($$("#threeMeetingsAndOneClassPaperDetailStartTime").val() == '' && $$("#threeMeetingsAndOneClassPaperDetailEndTime").val() != ''){
//				app.myApp.alert('请选择开始时间！');
//				return;
//			}
//			if($$("#threeMeetingsAndOneClassPaperDetailEndTime").val() == '' && $$("#threeMeetingsAndOneClassPaperDetailStartTime").val() != ''){
//				app.myApp.alert('请选择结束时间！');
//				return;
//			}
//			if(year > year1){
//				app.myApp.alert('开始年份必须小于结束年份！');
//				return;
//			}else if(year == year1 && month>month1){
//				app.myApp.alert('开始月份必须小于结束月份！');
//				return;
//			}else if(year != year1){
//				app.myApp.alert('月份跨度不能大于12个月！');
//				return;
//			}
			$$('.threeMeetingsAndOneClassPaperDetailSearch ul').html('');
			pageNo1=1;
			loading1=true;
			$$('.threeMeetingsAndOneClassPaperDetailDSearchBox').css('display','none');
			query = $$('#threeMeetingsAndOneClassPaperDetailName').val();
			console.log(query);
			console.log(searchStartDate);
			console.log(searchEndDate);
			ajaxLoadContent1(false);
		});
		
		var pickerDescribe;
		var pickerDescribe1;
		app.ajaxLoadPageContent1(getYearsPath,{
		},function(data){
			console.log(data);
			result = data.data;
			if(result == null){
				var nowDate = new Date();
				var nowYear = nowDate.getFullYear();
				result =[nowYear+'年']
				
			}
			$$.each(data.data, function(index, item) {
				result[index] = item.toString()+'年';
		});
			console.log(result);
			pickerDescribe = app.myApp.picker({
	    		input: '#threeMeetingsAndOneClassPaperDetailStartTime',
			    rotateEffect: true,
			    cols: [
			        {
			            textAlign: 'left',
			            values:(result)
			        },
			        {
			            values: ('01月 02月 03月 04月 05月 06月 07月 08月 09月 10月 11月 12月').split(' ')
			        },
			    ]
			});
			pickerDescribe1 = app.myApp.picker({
	    		input: '#threeMeetingsAndOneClassPaperDetailEndTime',
			    rotateEffect: true,
			    cols: [
			        {
			            textAlign: 'left',
			            values:(result)
			        },
			        {
			            values: ('01月 02月 03月 04月 05月 06月 07月 08月 09月 10月 11月 12月').split(' ')
			        },
			    ]
			});
		});
		$$(".threeMeetingsAndOneClassPaperDetailStartTime").on('click',function(){
			pickerDescribe.open();
			$$('.picker-3d .close-picker').text('完成');
			$$('.picker-3d .close-picker').css('margin-right','20px');
			year = pickerDescribe.value[0].substring(0,pickerDescribe.value[0].length-1);
			month = pickerDescribe.value[1].substring(0,pickerDescribe.value[1].length-1);
			searchStartDate = year+'-'+month+'-1';
			$$('.picker-3d .close-picker').on('click',function(){
				year = pickerDescribe.value[0].substring(0,pickerDescribe.value[0].length-1);
				month = pickerDescribe.value[1].substring(0,pickerDescribe.value[1].length-1);
				$("#threeMeetingsAndOneClassPaperDetailStartTime").val(year+'年 '+ month+'月');
				searchStartDate = year+'-'+month+'-1';
			});
		});
		$$(".threeMeetingsAndOneClassPaperDetailEndTime").on('click',function(){
			pickerDescribe1.open();
			$$('.picker-3d .close-picker').text('完成');
			$$('.picker-3d .close-picker').css('margin-right','20px');
			year1 = pickerDescribe1.value[0].substring(0,pickerDescribe1.value[0].length-1);
			month1 = pickerDescribe1.value[1].substring(0,pickerDescribe1.value[1].length-1);
			searchEndDate = year1+'-'+month1+'-31';
			$$('.picker-3d .close-picker').on('click',function(){
				year1 = pickerDescribe1.value[0].substring(0,pickerDescribe1.value[0].length-1);
				month1 = pickerDescribe1.value[1].substring(0,pickerDescribe1.value[1].length-1);
				$("#threeMeetingsAndOneClassPaperDetailEndTime").val(year1+'年 '+ month1+'月');
				searchEndDate = year1+'-'+month1+'-31';
			});
		});
	}

	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent(isLoadMore) {
		if(startDate == '' && endDate == ''){
			var date = new Date();
			startDate = date.getFullYear()+'-'+(date.getMonth()+1);
			endDate = startDate;
			console.log(endDate);
		}
		console.log(startDate);
		console.log(endDate);
		var result = startDate.split("-");
		year = result[0];
		month = result[1];
		var result1 = endDate.split("-");
		year1 = result1[0];
		month1 = result1[1];
		app.ajaxLoadPageContent(getTopicCompletedOrNotPath, {
			// userId:app.userId,
			// topicId:topicId,
			deptId:deptId,
			current:pageNo,
			// type:type,
			startDate:startDate,
			endDate:endDate,
			khpl:khpl
		}, function(result) {

			
			var data = result.data.records;
				console.log(data);

				$$.each(data, function(index, item) {
					console.log(item);
					item.month = item.createdDate.split('-')[1];
				});
				
			handleData(data, isLoadMore,result.data.total);
		});
	}
	
	/**
	 * 查询三会一课
	 */
	function ajaxLoadContent1(isLoadMore) {
//		if(searchStartDate == "" &&  searchEndDate == ''){
//			var myDate = new Date();
//			year = myDate.getFullYear();
//			month = myDate.getMonth()+1;
//			searchStartDate = year+'-'+month+'-1';
//			searchEndDate = year+'-'+month+'-31';
			searchStartDate = startDate;
			searchEndDate = endDate;
//		}
		console.log(query);
		console.log(searchStartDate);
		console.log(searchEndDate);
		var result = searchStartDate.split("-");
		year = result[0];
		month = result[1];
		var result1 = searchEndDate.split("-");
		year1 = result1[0];
		month1 = result1[1];
		console.log(year);
		console.log(month);
		console.log(year1);
		console.log(month1);
		app.ajaxLoadPageContent(getTopicCompletedOrNotPath, {
			// userId:app.userId,
			// topicId:topicId,
			deptId:deptId,
			current:pageNo1,
			// type:type,
			startDate:searchStartDate,
			endDate:searchEndDate,
			query:query,
			khpl:khpl
		}, function(result) {
			var data = result.data.records;
				console.log(data);

				$$.each(data, function(index, item) {
					console.log(item);
					item.month = item.createdDate.split('-')[1];
				});
				
			handleData1(data, isLoadMore,result.data.total);
		});
	}

	/**
	 * 加载数据 
	 */
	function handleData(data, isLoadMore,total) {
		$$('.shykDBranchName').html(branchName);
		if(data == ''){
			$$('.infinite-scroll-preloader').remove();
		}
		if(data == '' && pageNo == 1){
			$$('.infinite-scroll-preloader').remove();
			if(year == year1 && month == month1){
				$$('.shykDBranchNum').html(year+'年'+month+'月已参与0项');
			}else{
				if(month == 1 && month1 == 3){
					$$('.shykDBranchNum').html(year+'年第一季度已参与0项');
				}else if(month == 4 && month1 == 6){
					$$('.shykDBranchNum').html(year+'年第二季度已参与0项');
				}else if(month == 7 && month1 == 9){
					$$('.shykDBranchNum').html(year+'年第三季度已参与0项');
				}else if(month == 10 && month1 == 12){
					$$('.shykDBranchNum').html(year+'年第四季度已参与0项');
				}else if(month == 1 && month1 == 12){
					$$('.shykDBranchNum').html(year+'年已参与0项');
				}
				//$$('.shykDBranchNum').html(year+'年'+month+'月至'+year+'年'+month+'月完成数0个');
			}
			
		}
		
		if(data) {
			if(year == year1 && month == month1){
				$$('.shykDBranchNum').html(year+'年'+month+'月已参与'+total+'项');
			}else{
				if(month == 1 && month1 == 3){
					$$('.shykDBranchNum').html(year+'年第一季度已参与'+total+'项');
				}else if(month == 4 && month1 == 6){
					$$('.shykDBranchNum').html(year+'年第二季度已参与'+total+'项');
				}else if(month == 7 && month1 == 9){
					$$('.shykDBranchNum').html(year+'年第三季度已参与'+total+'项');
				}else if(month == 10 && month1 == 12){
					$$('.shykDBranchNum').html(year+'年第四季度已参与'+total+'项');
				}else if(month == 1 && month1 == 12){
					$$('.shykDBranchNum').html(year+'年已参与'+total+'项');
				}
				//$$('.shykDBranchNum').html(year+'年'+month+'月至'+year1+'年'+month1+'月完成数'+total+'个');
			}
			if(isLoadMore) {
				$$('.threeMeetingsAndOneClassPaperDetailList ul').append(tMAOCDetailTemplate(data));
				$$('.infinite-scroll-preloader').remove();
			} else if(pageNo==1 && data.length<10){
				$$('.threeMeetingsAndOneClassPaperDetailList ul').html(tMAOCDetailTemplate(data));
				$$('.infinite-scroll-preloader').remove();
			}
			$$('.threeMeetingsAndOneClassPaperDetailList .item-content').on('click', function() {
				var id = $$(this).data('id');
				var title = $$(this).find('.kpi-title').html() || '无标题';
				var score = $$(this).data("score") || 0;
				var target = $$(this).data('target') || '无';
				var minus = $$(this).data('minus') || 0;
				var memo = $$(this).data('memo') || '无';
				app.myApp.getCurrentView().loadPage('shykDDetail.html?topicId='+ id+'&startDate='+startDate+'&endDate='+endDate+'&deptId='+deptId);
			});
			$$('.threeMeetingsAndOneClassPaperDetailList .getDetail').on('click', function() {
				var id = $$(this).data('id');
				var title = $$(this).find('.kpi-title').html() || '无标题';
				var score = $$(this).data("score") || 0;
				var target = $$(this).data('target') || '无';
				var minus = $$(this).data('minus') || 0;
				var memo = $$(this).data('memo') || '无';
				app.myApp.getCurrentView().loadPage('shykDDetail.html?topicId='+ id+'&startDate='+startDate+'&endDate='+endDate+'&deptId='+deptId);
			});
			if(data.length == 10) {
				loading = false;
			}
		}
	}

	/**
	 * 加载数据 
	 */
	function handleData1(data, isLoadMore,total) {
		$$('.shykDBranchName1').html(branchName);
		if(data == ""){
			console.log(data == "");
			$$('.infinite-scroll-preloader').remove();
			$$('.threeMeetingsAndOneClassPaperDetailNotFound').css('display','block');
		}
		if(data == '' && pageNo1 == 1){
			console.log('111');
			$$('.infinite-scroll-preloader').remove();
			if(month == 1 && month1 == 3){
					$$('.shykDBranchNum1').html(year+'年第一季度已参与0项');
				}else if(month == 4 && month1 == 6){
					$$('.shykDBranchNum1').html(year+'年第二季度已参与0项');
				}else if(month == 7 && month1 == 9){
					$$('.shykDBranchNum1').html(year+'年第三季度已参与0项');
				}else if(month == 10 && month1 == 12){
					$$('.shykDBranchNum1').html(year+'年第四季度已参与0项');
				}else if(month == 1 && month1 == 12){
					$$('.shykDBranchNum1').html(year+'年已参与0项');
				}
			//$$('.shykDBranchNum1').html(year+'年'+month+'月至'+year1+'年'+month1+'月完成数0个');
		}
		
		if(data) {
			if(year == year1 && month == month1){
				$$('.shykDBranchNum1').html(year+'年'+month+'月已参与'+total+'项');
			}else{
				if(month == 1 && month1 == 3){
					$$('.shykDBranchNum1').html(year+'年第一季度已参与'+total+'项');
				}else if(month == 4 && month1 == 6){
					$$('.shykDBranchNum1').html(year+'年第二季度已参与'+total+'项');
				}else if(month == 7 && month1 == 9){
					$$('.shykDBranchNum1').html(year+'年第三季度已参与'+total+'项');
				}else if(month == 10 && month1 == 12){
					$$('.shykDBranchNum1').html(year+'年第四季度已参与'+total+'项');
				}else if(month == 1 && month1 == 12){
					$$('.shykDBranchNum1').html(year+'年已参与'+total+'项');
				}
				//$$('.shykDBranchNum1').html(year+'年'+month+'月至'+year1+'年'+month1+'月完成数'+total+'个');
			}
			$$('.threeMeetingsAndOneClassPaperDetailNotFound').css('display','none');
			if(isLoadMore) {
				$$('.threeMeetingsAndOneClassPaperDetailSearchList ul').append(tMAOCDetailTemplate(data));
				$$('.infinite-scroll-preloader').remove();
			} else if(pageNo1==1 && data.length<10){
				$$('.threeMeetingsAndOneClassPaperDetailSearchList ul').html(tMAOCDetailTemplate(data));
				$$('.infinite-scroll-preloader').remove();
			}
			$$('.threeMeetingsAndOneClassPaperDetailSearchList .item-content').on('click', function() {
				var id = $$(this).data('id');
				var title = $$(this).find('.kpi-title').html() || '无标题';
				var score = $$(this).data("score") || 0;
				var target = $$(this).data('target') || '无';
				var minus = $$(this).data('minus') || 0;
				var memo = $$(this).data('memo') || '无';
				app.myApp.getCurrentView().loadPage('shykDDetail.html?topicId='+ id+'&startDate='+searchStartDate+'&endDate='+searchEndDate+'&deptId='+deptId);
			});
			$$('.threeMeetingsAndOneClassPaperDetailSearchList .getDetail').on('click', function() {
				var id = $$(this).data('id');
				var title = $$(this).find('.kpi-title').html() || '无标题';
				var score = $$(this).data("score") || 0;
				var target = $$(this).data('target') || '无';
				var minus = $$(this).data('minus') || 0;
				var memo = $$(this).data('memo') || '无';
				app.myApp.getCurrentView().loadPage('shykDDetail.html?topicId='+ id+'&startDate='+startDate+'&endDate='+endDate+'&deptId='+deptId);
			});
			if(data.length == 10) {
				loading1 = false;
			}
		}
	}
	
	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//下拉刷新
		var ptrContent = $$(page.container).find('.threeMeetingsAndOneClassPaperDetailPage');
		ptrContent.on('refresh', function(e) {
			setTimeout(function() {
				pageNo = 1;
				loading = true;
				//这里写请求
				ajaxLoadContent(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});
		
		//下拉刷新
		var ptrContent1 = $$(page.container).find('.threeMeetingsAndOneClassPaperDetailSearch');
		ptrContent1.on('refresh', function(e) {
			setTimeout(function() {
				pageNo1 = 1;
				loading1 = true;
				//这里写请求
				ajaxLoadContent1(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});

		//加载更多
		var loadMoreContent = $$(page.container).find('.threeMeetingsAndOneClassPaperDetailPage');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			//这里写请求
			ajaxLoadContent(true);
		});
		//加载更多
		var loadMoreContent1 = $$(page.container).find('.threeMeetingsAndOneClassPaperDetailSearch');
		loadMoreContent1.on('infinite', function() {
			if(loading1) return;
			loading1 = true;
			pageNo1 += 1;
			//这里写请求
			ajaxLoadContent1(true);
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