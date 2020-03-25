define(['app',
	'hbs!js/hbs/shykUD',
	'hbs!js/hbs/shykD',
], function(app, shykUDTemplate,shykDTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	var pageNo1 = 1;
	var loading1 = true;
	var pageNo3 = 1;
	var loading3 = true;
	var pageNo4 = 1;
	var loading4 = true;
	//获取年份
	var getYearsPath = 	app.basePath + '/mobile/partyAm/getYears';
	//获取党委下面已完成未完成的支部
	var getOneDepartmentCompletionStatusPath = 	app.basePath + '/mobile/partyAm/getOneDepartmentCompletionStatus';
	//获取三会一课分类
	// var getAllThreeAndOnePath = app.basePath + 'knowledgeTopic/findThreePlusXTopic';
	var userPoint = 0;
	var queryByDeptName1 = '';
	var year="";
	var year1="";
	var month="";
	var month1="";
	var udCount = 0;
	var dCount = 0;
	var startDate = '';
	var endDate = '';
	var dudStartDate = '';
	var dudEndDate = '';
	var deptId = 0;
	//0是未参与1是已参与
	var type=1;
	var deptN = ''
	var topicId = 0;
	
	var doneCount = '';
	var uDoneCount = '';
	var khpl;
	
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page);
		clickEvent(page);
		$$($$('.atdjdTab div')[0]).addClass('active');
		app.back2Home();
	}

	/**
	 * 初始化模块变量
	 */
	function initData(page) {
		queryByDeptName1 = ''
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		pageNo1 = 1;
		loading1 = true;
		pageNo3 = 1;
		loading3 = true;
		pageNo4 = 1;
		loading4 = true;
		year="";
		year1="";
		month="";
		month1="";
		startDate = "";
		endDate="";
		dudStartDate = '';
		dudEndDate = '';
		udCount = 0;
		dCount = 0;
		type=1;
		topicId = 0;
		deptId = app.user.deptId;
		deptN = page.query.deptName;
		
		doneCount = '';
		uDoneCount = '';
		console.log('page')
		console.log(page)
		$$(".shykdN").html('('+deptN+')三会一课考核统计');
		if(page.query.deptId != undefined){
			deptId = page.query.deptId;
		}
		if(page.query.startDate != undefined){
			startDate = page.query.startDate;
		}
		if(page.query.endDate != undefined){
			endDate = page.query.endDate;
		}
		if(page.query.khpl != undefined){
			khpl = page.query.khpl;
			console.log('khpl')
			console.log(khpl)
		}
		pushAndPull(page);
		loadshykD(false);
		loadTime();		
		// loadSort();
	}
	
	
	function loadSort(){
		// app.ajaxLoadPageContent(getAllThreeAndOnePath, {
		// }, function(data) {
		// 	console.log(data);
		// var data = [{id:0,title:'未参与'},{id:1,title:'已参与'}]
		// 	handleSort(data);
		// });
	}
	
	function handleSort(data){
//		$$("#shykSearchType").append("<option value='全部' selected>sddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd</option>");
		$.each(data,function(index,item){
				$$("#shykSearchType").append("<option value="+item.id+">"+item.title+"</option>");
		});
		$$('#shykSearchType').change(function() {
			topicId  = $$('#shykSearchType').val();
			 
		});
	}
	/*
	 * 显示日期
	 */
	function loadTime(){
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
	    		input: '#shykStartTime',
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
	    		input: '#shykEndTime',
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
//		var date = new Date();
//		year = date.getFullYear();
//		month = date.getMonth()+1;
//		dudStartDate = year+'-'+month+'-1';
//		dudEndDate = year+'-'+month+'-31';
		$$(".shykStartTime").on('click',function(){
			pickerDescribe.open();
			year = pickerDescribe.value[0].substring(0,pickerDescribe.value[0].length-1);
			month = pickerDescribe.value[1].substring(0,pickerDescribe.value[1].length-1);
			startDate = year+'-'+month;
			$$('.picker-3d .close-picker').text('完成');
			$$('.picker-3d .close-picker').css('margin-right','10px');
			$$('.picker-3d .close-picker').on('click',function(){
				year = pickerDescribe.value[0].substring(0,pickerDescribe.value[0].length-1);
				month = pickerDescribe.value[1].substring(0,pickerDescribe.value[1].length-1);
				$("#shykStartTime").val(year+'年 '+ month+'月');
				dudStartDate = year+'-'+month+'-01';
			});
		});
		$$(".shykEndTime").on('click',function(){
			pickerDescribe1.open();
			year1 = pickerDescribe1.value[0].substring(0,pickerDescribe.value[0].length-1);
			month1 = pickerDescribe1.value[1].substring(0,pickerDescribe.value[1].length-1);
			endDate = year1+'-'+month1;
			$$('.picker-3d .close-picker').text('完成');
			$$('.picker-3d .close-picker').css('margin-right','10px');
			$$('.picker-3d .close-picker').on('click',function(){
				year1 = pickerDescribe1.value[0].substring(0,pickerDescribe1.value[0].length-1);
				month1 = pickerDescribe1.value[1].substring(0,pickerDescribe1.value[1].length-1);
				$("#shykEndTime").val(year1+'年 '+ month1+'月');
				dudEndDate = year1+'-'+month1+'-31';
			});
		});
	}
	/**
	 * 点击事件
	 */
	function clickEvent(page) {	
		$$('.atdjdTab div').on('click', tabClick);
		
		$$('.shykuduSearchBar #shykuduSearch').on('focus',startSearch);
		
		$$('.shykdudSearchBox .searchBtn').on('click',keyupContent);
		
		$$('.shykdudSearchBox .resetBtn').on('click',clearSearchList);
		
		$$('.shykdudSearchClose').on('click',function(){
			$$('.shykdudSearchBox').css('display','none');
		});
		$$('.shykuduSearchBar .searchCancelBtn').on('click',hideSearchList1);
	}
	
	
	//查询
	function startSearch(){
		$$(this).css('text-align', 'left');
		$$('.shykuduSearchBar .searchCancelBtn').css('display','block');
		$$('.shykdudSearchBox').css('display','block');
		$$('.shykD').css('display','none');
		$$('.shykUD').css('display','none');
		console.log(type);
		if(type == 1){
			$$('.shykUDSearch').css('display','none');
			$$('.shykDSearch').css('display','block');
		}else{
			$$('.shykUDSearch').css('display','block');
			$$('.shykDSearch').css('display','none');
		}
		
		
	}
	
	//tab切换
	function tabClick() {
		$$('.atdjdTab div').removeClass('active');
		$$(this).addClass('active');
		var index = $$(this).data('index');
		$$('.shykUDSearch').css('display','none');
		$$('.shykDSearch').css('display','none');
		hideSearchList1();
		if(index == '0') {
			$$('.shykD').css('display', 'block');
			$$('.shykUD').css('display', 'none');
			type = 1;
			$$('.shykUDSearch').css('display','none');
			$$('.shykDSearch').css('display','block');
			if(dCount == 0){
				loadshykD(false);
				dCount += 1;
			}	
		} else {
			$$('.shykD').css('display', 'none');
			$$('.shykUD').css('display', 'block');
			type = 0;
			$$('.shykUDSearch').css('display','block');
			$$('.shykDSearch').css('display','none');
			if(udCount == 0){
				loadshykUD(false);
				udCount += 1;
			}		
		}
	}
	/*
	 * 点击取消按钮
	 */
	function hideSearchList1(){
		$$('.alrdone').html('('+doneCount+')');
		$$('.uDone').html('('+uDoneCount+')');
		$$('.shykuduSearchBar #shykuduSearch').css('text-align', 'center');
		$$('.shykuduSearchBar .searchCancelBtn').css('display','none');
		$$('.shykUDSearch').css('display','none');
		$$('.shykDSearch').css('display','none');
		$$('.shykUDNotFound').css('display','none');
		$$('.shykDNotFound').css('display','none');
		if(type==1){
			console.log('未完成');
			$$('.shykD').css('display','block');
			$$('.shykUD').css('display','none');
		}else{
			console.log('完成');
			$$('.shykD').css('display','none');
			$$('.shykUD').css('display','block');
		}
		
		
	}
	/*
	 * 点击q清空按钮
	 */
	function clearSearchList(){
		queryByDeptName1 = '';
		startDate='';
		endDate='';
		dudStartDate='';
		dudEndDate='';
		$$('#shykDeptName').val('');
		$$('#shykStartTime').val('');
		$$('#shykEndTime').val('');
	}
	/*
	 * keyup事件的触发
	 */
	function keyupContent(){
		if($$("#shykStartTime").val() == '' && $$("#shykEndTime").val() != ''){
			app.myApp.alert('请选择开始时间！');
			return;
		}
		if($$("#shykEndTime").val() == '' && $$("#shykStartTime").val() != ''){
			app.myApp.alert('请选择结束时间！');
			return;
		}
		console.log(year);
		console.log(year1);
		if(year > year1){
			app.myApp.alert('开始年份必须小于结束年份！');
			return;
		}else if(year == year1 && month>month1){
			app.myApp.alert('开始月份必须小于结束月份！');
			return;
		}else if(year != year1){
			app.myApp.alert('月份跨度不能大于12个月！');
			return;
		}
		topicId = $$('#shykSearchType').val()
		queryByDeptName1 = $$('#shykDeptName').val();
		$$('.shykdudSearchBox').css('display','none');
		console.log(queryByDeptName1);
		console.log(dudStartDate);
		console.log(dudEndDate);
		if(type==1){
			searchshykD(false);
		}else{
			searchshykUD(false);
		}
		
		
	}
	
	//已完成支部
	function loadshykD(isLoadMore) {
		if(startDate == '' && endDate == ''){
			var date = new Date();
			year = date.getFullYear();
			month = date.getMonth()+1<10? "0"+(date.getMonth()+1):date.getMonth()+1;
			startDate = year+'-'+month+'-01';
			endDate = year+'-'+month+'-31';
		}
		console.log(startDate);
		console.log(endDate);
		console.log(type);
		console.log(topicId);
		app.ajaxLoadPageContent1(getOneDepartmentCompletionStatusPath, {
			type:type,
			deptId:deptId,
			current:pageNo,
			startDate:startDate,
			endDate:endDate,
			size:20,
			// topicId:topicId,
			khpl:khpl
		}, function(result) {
			console.log(result);
			var data = result.data;
			console.log(result == '');
			if(data.records == '' && pageNo == 1){
				$$('.alrdone').html('(0)');
				doneCount = '0';
				$$('.infinite-scroll-preloader').remove();
			}else if(data.records.length >0 && pageNo == 1){
				doneCount = data.total;
				$$('.alrdone').html('('+data.total+')');
			}
			handleCompletedStatus(data.records,isLoadMore);
		});
	}
	
	//已完成支部
	function searchshykD(isLoadMore) {
		if(dudStartDate == '' && dudEndDate == ''){
//			var date = new Date();
//			startDate = date.getFullYear()+'-'+(date.getMonth()+1);
//			endDate = startDate;
//			console.log(endDate);
			var date = new Date();
			year = date.getFullYear();
			month = date.getMonth()+1<10? "0"+(date.getMonth()+1):date.getMonth()+1;
			dudStartDate = year+'-'+month+'-01';
			dudEndDate = year+'-'+month+'-31';
		}
		console.log(dudStartDate);
		console.log(dudEndDate);
		console.log(type);
		console.log(topicId);
		app.ajaxLoadPageContent1(getOneDepartmentCompletionStatusPath, {
			type:type,
			deptId:deptId,
			query:queryByDeptName1,
			current:pageNo3,
			startDate:dudStartDate,
			endDate:dudEndDate,
			size:20,
			// topicId:topicId,
			khpl:khpl
		}, function(result) {
			console.log(result);
			var data = result.data;
			if(data.records == '' && pageNo1 == 1){
				$$('.alrdone').html('(0)');
				$$('.infinite-scroll-preloader').remove();
			}else if(data.records.length >0 && pageNo1 == 3){
				$$('.alrdone').html('('+data.total+')');
			}
			SearchCompletedStatus(data.records,isLoadMore);
		});
	}
	
	//未完成支部
	function loadshykUD(isLoadMore) {
		if(startDate == '' && endDate == ''){
			var date = new Date();
			startDate = date.getFullYear()+'-'+(date.getMonth()+1);
			endDate = startDate;
			console.log(endDate);
		}
		console.log(type);
		app.ajaxLoadPageContent1(getOneDepartmentCompletionStatusPath, {
			type:type,
			deptId:deptId,
			current:pageNo1,
			startDate:startDate,
			endDate:endDate,
			size:20,
			// topicId:topicId,
			khpl:khpl
		}, function(result) {
			console.log(result);
			var data = result.data;
			
			if((data.records == '' || data.records == null )&& pageNo1 == 1){
				$$('.uDone').html('(0)');
				uDoneCount = '0';
				$$('.infinite-scroll-preloader').remove();
			}else if(data.records.length >0 && pageNo1 == 1){
				uDoneCount = data.total;
				$$('.uDone').html('('+data.total+')');
			}
			handleUCompletedStatus(data.records,isLoadMore);
		});
	}
	//未完成支部
	function searchshykUD(isLoadMore) {
		if(dudStartDate == '' && dudEndDate == ''){
//			var date = new Date();
//			startDate = date.getFullYear()+'-'+(date.getMonth()+1);
//			endDate = startDate;
//			console.log(endDate);
			var date = new Date();
			year = date.getFullYear();
			month = date.getMonth()+1<10? "0"+(date.getMonth()+1):date.getMonth()+1;
			dudStartDate = year+'-'+month+'-01';
			dudEndDate = year+'-'+month+'-31';
		}
		console.log(type);
		app.ajaxLoadPageContent1(getOneDepartmentCompletionStatusPath, {
			type:type,
			deptId:deptId,
			query:queryByDeptName1,
			current:pageNo4,
			startDate:dudStartDate,
			endDate:dudEndDate,
			size:20,
			// topicId:topicId,
			khpl:khpl
		}, function(result) {
			console.log(result);
			var data = result.data;
			if(data.records == ''&& pageNo4 == 1){
				$$('.uDone').html('(0)');
				$$('.infinite-scroll-preloader').remove();
			}else if(data.records.length > 0 && pageNo4 == 1){
				$$('.uDone').html('('+data.total+')');
			}
			SearchUCompletedStatus(data.records,isLoadMore);
		});
	}
	
	/*
	 * 处理各级党委部门下的支部完成情况
	 */
	function handleCompletedStatus(data,isLoadMore){
		if(data == "" && pageNo == 1){
			$$('.shykD .kpi-a-list ul').html("");
		}
		if(data == ""){
			$$('.infinite-scroll-preloader').remove();
		}
		if(data.length) {
			if(isLoadMore) {
				$$('.infinite-scroll-preloader').remove();
				$$('.shykD .kpi-a-list ul').append(shykDTemplate(data));
			} else {
				$$('.shykD .kpi-a-list ul').html(shykDTemplate(data));
			}
			if(data.length<10 && pageNo == 1){
				$$('.infinite-scroll-preloader').remove();
			}
			$$('.shykD .item-content').on('click',function(){
				console.log('已参与');
				app.myApp.getCurrentView().loadPage('threeMeetingsAndOneClassD.html?type=1&deptId='+$$(this).data('id')+'&topicId='+topicId+'&branchName='+$$(this).data('name')+'&startTime='+startDate+'&endTime='+endDate+'&khpl='+khpl);
			});
			loading = false;
		} else {
			loading = true;
		}
	}
	
	/*
	 * 处理各级党委部门下的支部完成情况
	 */
	function SearchCompletedStatus(data,isLoadMore){
		if(data == "" && pageNo3 == 1){
			$$('.shykDSearch .kpi-a-list ul').html("");
			$$('.shykDNotFound').css('display','block');
		}
		if(data == ""){
			$$('.infinite-scroll-preloader').remove();
		}
		if(data.length) {
			if(isLoadMore) {
				$$('.infinite-scroll-preloader').remove();
				$$('.shykDSearch .kpi-a-list ul').append(shykDTemplate(data));
			} else {
				$$('.shykDSearch .kpi-a-list ul').html(shykDTemplate(data));
				$$('.shykDSearch .kpi-a-list ul').css('margin-top', '11px');
			}
			if(data.length<10 && pageNo3 == 1){
				$$('.infinite-scroll-preloader').remove();
			}
			$$('.shykDSearch .item-content').on('click',function(){
				console.log('已参与查询');
				app.myApp.getCurrentView().loadPage('threeMeetingsAndOneClassD.html?type=1&deptId='+$$(this).data('id')+'&startTime='+dudStartDate+'&endTime='+dudEndDate+'&topicId='+topicId+'&branchName='+$$(this).data('name')+'&khpl='+khpl);
			});
			loading3 = false;
		} else {
			loading3 = true;
		}
	}
	
	function handleUCompletedStatus(data,isLoadMore){
		if(data == "" && pageNo1 == 1){
			$$('.shykUD .kpi-a-list ul').html("");
		}
		if(data == ""){
			$$('.infinite-scroll-preloader').remove();
		}
		if(data.length) {
			if(isLoadMore) {
				$$('.infinite-scroll-preloader').remove();

				$$('.shykUD .kpi-a-list ul').append(shykUDTemplate(data));
			} else {
				console.log(data);
				$$('.shykUD .kpi-a-list ul').html(shykUDTemplate(data));
				// $$('.shykUD .kpi-a-list ul').css('margin-top', '11px');
			}
			if(data.length<10 && pageNo1 == 1){
				$$('.infinite-scroll-preloader').remove();
			}
			$$('.shykUD .item-content').on('click',function(){
				console.log('未参与');
			});
			loading1 = false;
		} else {
			loading1 = true;
		}
	}
	
	function SearchUCompletedStatus(data,isLoadMore){
		if(data == "" && pageNo4 == 1){
			$$('.shykUDSearch .kpi-a-list ul').html("");
			$$('.shykUDNotFound').css('display','block');
		}
		if(data == ""){
			$$('.infinite-scroll-preloader').remove();
		}
		if(data.length) {
			if(isLoadMore) {
				$$('.infinite-scroll-preloader').remove();
				$$('.shykUDSearch .kpi-a-list ul').append(shykUDTemplate(data));
			} else {
				$$('.shykUDSearch .kpi-a-list ul').html(shykUDTemplate(data));
				$$('.shykUDSearch .kpi-a-list ul').css('margin-top', '11px');

			}
			if(data.length<10 && pageNo4 == 1){
				$$('.infinite-scroll-preloader').remove();
			}
			$$('.shykUDSearch .item-content').on('click',function(){
				console.log('未参与查询');
			});
			loading4 = false;
		} else {
			loading4 = true;
		}
	}

	
	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll.shykD');
		var loadMoreContent1 = $$(page.container).find('.infinite-scroll.shykUD');
		var loadMoreContent2 = $$(page.container).find('.infinite-scroll.shykDSearch');
		var loadMoreContent3 = $$(page.container).find('.infinite-scroll.shykUDSearch');
		loadMoreContent.on('infinite',function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			//这里写请求
			loadshykD(true);
		});
		loadMoreContent1.on('infinite',function() {
			if(loading1) return;
			loading1 = true;
			pageNo1 += 1;
			//这里写请求
			loadshykUD(true);
		});
		loadMoreContent2.on('infinite',function() {
			if(loading3) return;
			loading3 = true;
			pageNo3 += 1;
			//这里写请求
			searchshykD(true);
		});
		loadMoreContent3.on('infinite',function() {
			if(loading4) return;
			loading4 = true;
			pageNo4 += 1;
			//这里写请求
			searchshykUD(true);
		});
		//下拉刷新	
		var ptrContent=$$(page.container).find('.pull-to-refresh-content.shykD');
		var ptrContent1=$$(page.container).find('.pull-to-refresh-content.shykUD');
		var ptrContent2=$$(page.container).find('.pull-to-refresh-content.shykDSearch');
		var ptrContent3=$$(page.container).find('.pull-to-refresh-content.shykUDSearch');
		ptrContent.on('refresh', function() {
			setTimeout(function() {
				pageNo = 1;
				loading = true;
				//这里写请求
				loadshykD(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});	
		ptrContent1.on('refresh', function() {
			setTimeout(function() {
				pageNo1 = 1;
				loading1 = true;
				//这里写请求
				loadshykUD(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});
		ptrContent2.on('refresh', function() {
			setTimeout(function() {
				pageNo3 = 1;
				loading3 = true;
				//这里写请求
				searchshykD(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});
		ptrContent3.on('refresh', function() {
			setTimeout(function() {
				pageNo4 = 1;
				loading4 = true;
				//这里写请求
				searchshykUD(false);
				app.myApp.pullToRefreshDone();
			}, 500);
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