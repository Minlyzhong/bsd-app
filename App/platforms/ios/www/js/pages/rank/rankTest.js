define(['app',
	'hbs!js/hbs/assessmentLeaderTest',
], function(app, leaderTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	var pageNo1 = 1;
	var loading1 = true;
	
	//表头数据
	var searchDeptBranchTotalPathHead = app.basePath + 'knowledgeTopic/searchDeptBranchTotal';
	//获取年份
	var getYearsPath = app.basePath + 'knowledgeTopic/getYears';
	//各级党委部门下的支部完成情况
	var departmentCompletedStatusPath = app.basePath + 'knowledgeTopic/departmentCompletedStatus';
	var userPoint = 0;
	var queryByDeptName = '';
	var year="";
	var year1="";
	var month="";
	var month1="";
	var startDate = '';
	var endDate = '';
	var season = '';
	
	
	var seasonRankTestCount = 1;
	var yearRankTestCount = 1;
	//时间段
	//月份
	var rankTestMonthStartDate = '';
	var rankTestMonthEndDate = '';
	//季度
	var rankTestSeasonStartDate = '';
	var rankTestSeasonEndDate = '';
	var pageSeasonRankTest = 1;
	var loadingSeasonRankTest = true;
	//年份
	var rankTestYearStartDate = '';
	var rankTestYearEndDate = '';
	var pageYearRankTest = 1;
	var loadingYearRankTest = true;
	//查询
	var rankTestSearchStartDate = '';
	var rankTestSearchEndDate = '';
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		if(app.roleId != 1) {
			$$('.leaderInfo').remove();
			$$('.leaderDetailPage1').remove();
			$$('.rankPage').append(rankPageTemplate({
				role: app.roleId,
			}));
		}
		initData(page);
		clickEvent(page);
		app.back2Home();
	}

	/**
	 * 初始化模块变量
	 */
	function initData(page) {
		queryByDeptName = ''
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		pageNo1 = 1;
		loading1 = true;
		year="";
		year1="";
		month="";
		month1="";
		startDate = "";
		endDate="";
		//季度
		pageSeasonRankTest = 1;
		loadingSeasonRankTest = true;
		//年份
		pageYearRankTest = 1;
		loadingYearRankTest = true;
		//查询
		rankTestSearchStartDate = '';
		rankTestSearchEndDate = '';
		var user = {
			role: app.roleId
		}
		$$('.rankTestName').html(page.query.appName)
		seasonRankTestCount = 1;
		yearRankTestCount = 1;
//		if(user.role > -1 && user.role != 1) {
//			$$('.rankDetail').css('display', 'flex');
//			//加载数据
//			loadDept();
//			loadPartyMenu();
//		} else {
//			//利于党务负责人查看和评比的搜索框
			$$('.searchRank').css('display','block');
			$$('.rankDetail').css('display', 'none');
			//先执行loadTime();在去加载数据
			loadTime();	
			loadPartyDeptHead();
			loadCompletedStatus(false);
			pushAndPull(page);
//		}
		
	}
	
	
	
	function loadTime(){
		var pickerDescribe;
		var pickerDescribeSeason;
		var pickerDescribeYear;
		app.ajaxLoadPageContent1(getYearsPath,{
		},function(data){
			console.log(data);
			result = data;
			$$.each(data, function(index, item) {
					result[index] = item.text.toString()+'年';
			});
			console.log(result);
			pickerDescribe = app.myApp.picker({
	    		input: '#picker-describe',
			    rotateEffect: true,
			    cols: [
			        {
			            textAlign: 'left',
			            values:(result)
			        },
			        {
			            values: ('1月 2月 3月 4月 5月 6月 7月 8月 9月 10月 11月 12月').split(' ')
			        },
			    ]
			});
			pickerDescribeSeason = app.myApp.picker({
	    		input: '#picker-describeSeason',
			    rotateEffect: true,
			    cols: [
			        {
			            textAlign: 'left',
			            values:(result)
			        },
			        {
			            values: ('第一季度 第二季度 第三季度 第四季度').split(' ')
			        },
			    ]
			});
			pickerDescribeYear = app.myApp.picker({
	    		input: '#picker-describeYear',
			    rotateEffect: true,
			    cols: [
			        {
			            textAlign: 'left',
			            values:(result)
			        },
			    ]
			});
		});
		var date = new Date();
		year = date.getFullYear();
		month = date.getMonth()+1;
		rankTestMonthStartDate = year+'-'+month+'-1';
		rankTestMonthEndDate = year+'-'+month+'-31';
		$("#picker-describe").val(year+'年 '+ month+'月');
		//月份
		$$(".rankTestMonthTime").on('click',function(){
			pickerDescribe.open();
			$$('.picker-3d .close-picker').text('完成');
			$$('.picker-3d .close-picker').css('margin-right','10px');
			pickerDescribe.displayValue[0] = year+'年';
			pickerDescribe.displayValue[1] = month+'月';
			pickerDescribe.value[0] = year+'年';
			pickerDescribe.value[1] = month+'月';
			pickerDescribe.params.cols[0].setValue(year+'年');
			pickerDescribe.params.cols[1].setValue(month+'月');	
			$("#picker-describe").val(year+'年 '+ month+'月');
			year = pickerDescribe.value[0].substring(0,pickerDescribe.value[0].length-1);
			month = pickerDescribe.value[1].substring(0,pickerDescribe.value[1].length-1);
			rankTestMonthStartDate = year+'-'+month+'-1';
			rankTestMonthEndDate = year+'-'+month+'-31';
			$$('.picker-3d .close-picker').on('click',function(){
				year = pickerDescribe.value[0].substring(0,pickerDescribe.value[0].length-1);
				month = pickerDescribe.value[1].substring(0,pickerDescribe.value[1].length-1);
				$("#picker-describe").val(year+'年 '+ month+'月');
				rankTestMonthStartDate = year+'-'+month+'-1';
				rankTestMonthEndDate = year+'-'+month+'-31';
				var str = '';
				str += '<div class="infinite-scroll-preloader">';
				str += '<div class="preloader" style="left:35%;margin-left:0px;margin-top:0px;position:absolute;"></div>';
				str += '<div style="position: absolute;left: 45%;;font-size: 17px;">加载中...</div>';
				str += '</div>';
				$$('.leaderDetailPage1 .kpi-a-list ul').html(str);
				loadPartyDeptHead();
				loadCompletedStatus();
			});
		});
		//季度
		if(month<=3){
			$("#picker-describeSeason").val(year+'年 '+ '第一季度');
			rankTestSeasonStartDate = year+'-1-1';
			rankTestSeasonEndDate = year+'-3-31';
		}else if(month>3 && month<=6){
			$("#picker-describeSeason").val(year+'年 '+ '第二季度');
			rankTestSeasonStartDate = year+'-4-1';
			rankTestSeasonEndDate = year+'-6-31';
		}else if(month>6 && month<=9){
			$("#picker-describeSeason").val(year+'年 '+ '第三季度');
			rankTestSeasonStartDate = year+'-7-1';
			rankTestSeasonEndDate = year+'-9-31';
		}else if(month>9 && month<=12){
			$("#picker-describeSeason").val(year+'年 '+ '第四季度');
			rankTestSeasonStartDate = year+'-10-1';
			rankTestSeasonEndDate = year+'-12-31';
		}
		$$(".rankTestSeasonTime").on('click',function(){
			pickerDescribeSeason.open();
			$$('.picker-3d .close-picker').text('完成');
			$$('.picker-3d .close-picker').css('margin-right','10px');
			$$('.picker-3d .close-picker').on('click',function(){
				year = pickerDescribeSeason.value[0].substring(0,pickerDescribeSeason.value[0].length-1);
				season = pickerDescribeSeason.value[1].substring(0,pickerDescribeSeason.value[1].length);
				if(season == '第一季度'){
					rankTestSeasonStartDate = year+'-1-1';
					rankTestSeasonEndDate = year+'-3-31';
				}else if(season == '第二季度'){
					rankTestSeasonStartDate = year+'-4-1';
					rankTestSeasonEndDate = year+'-6-31';
				}else if(season == '第三季度'){
					rankTestSeasonStartDate = year+'-7-1';
					rankTestSeasonEndDate = year+'-9-31';
				}else if(season == '第四季度'){
					rankTestSeasonStartDate = year+'-10-1';
					rankTestSeasonEndDate = year+'-12-31';
				}
				$("#picker-describeSeason").val(year+'年 '+ season);
				var str = '';
				str += '<div class="infinite-scroll-preloader">';
				str += '<div class="preloader" style="left:35%;margin-left:0px;margin-top:0px;position:absolute;"></div>';
				str += '<div style="position: absolute;left: 45%;;font-size: 17px;">加载中...</div>';
				str += '</div>';
				$$('.leaderDetailPageSeason1 .kpi-a-list ul').html(str);
				loadPartyDeptHeadBySeason();
				loadCompletedStatusBySeason();
			});
		});
		
		//年份
		$("#picker-describeYear").val(year+'年 ');
		rankTestYearStartDate= year+'-1-1';
		rankTestYearEndDate= year+'-12-31';
		$$(".rankTestYearTime").on('click',function(){
			pickerDescribeYear.open();
			$$('.picker-3d .close-picker').text('完成');
			$$('.toolbar-inner .right').css('margin-right','20px');	
			$$('.picker-3d .close-picker').on('click',function(){
				$$('.shykNotFound').css('display','none');
				year = pickerDescribeYear.value[0].substring(0,pickerDescribeYear.value[0].length-1);
				rankTestYearStartDate= year+'-1-1';
				rankTestYearEndDate= year+'-12-31';
				$("#picker-describeYear").val(year+'年 ');
				var str = '';
				str += '<div class="infinite-scroll-preloader">';
				str += '<div class="preloader" style="left:35%;margin-left:0px;margin-top:0px;position:absolute;"></div>';
				str += '<div style="position: absolute;left: 45%;;font-size: 17px;">加载中...</div>';
				str += '</div>';
				$$('.leaderDetailPageYear1 .kpi-a-list ul').html(str);
				loadPartyDeptHeadByYear();
				loadCompletedStatusByYear();
			});
		});
	}
	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('#rankDeptSearch').on('focus', showSearchList);
		$$('.rankDeptSearchBar .searchCancelBtn').on('click', hideSearchList);
		$$('.rankTestSearchBox .searchBtn').on('click', keyupContent);
		$$('.rankTestSearchBox .resetBtn').on('click', clearSearchKey);
		$$('.rankTestSearchClose').on('click',function(){
			$$('.rankTestSearchBox').css('display','none');
		})
		
		$$('.addshykDept').click(function(){
			app.myApp.getCurrentView().loadPage('shykAddDept.html?deptName='+$$('#rankDeptName').val());
		})
		
		//点击tab标签
		//月份
		$$('.buttonShyk').on('click',function(){
			setTimeout(function(){
				$$('.leaderDetailPageSeason1').css('display','none');
				$$('.leaderDetailPage1').css('display','block');
				$$('.leaderDetailPageYear1').css('display','none');
			},100);
			if($$('.rankTestTab').css('display') == 'none'){
				setTimeout(function(){
					keyupContent();
				},100);
			}
		});
		//季度
		$$('.buttonShykSeason').on('click',function(){
			setTimeout(function(){
				$$('.leaderDetailPageSeason1').css('display','block');
				$$('.leaderDetailPage1').css('display','none');
				$$('.leaderDetailPageYear1').css('display','none');
			},100);
			
			if($$('.rankTestTab').css('display') == 'none'){
				setTimeout(function(){
					keyupContent();
				},100);
			}else{
				if(seasonRankTestCount == 1){
					setTimeout(function(){
						loadPartyDeptHeadBySeason();
						loadCompletedStatusBySeason(false);
					},500);
					seasonRankTestCount += 1;
				}
			}
			
		});
		//年份
		$$('.buttonShykYear').on('click',function(){
			setTimeout(function(){
				$$('.leaderDetailPageSeason1').css('display','none');
				$$('.leaderDetailPage1').css('display','none');
				$$('.leaderDetailPageYear1').css('display','block');
			},100);
			
			if($$('.rankTestTab').css('display') == 'none'){
				setTimeout(function(){
					keyupContent();
				},100);
			}else{
				if(yearRankTestCount == 1){
					setTimeout(function(){
						loadPartyDeptHeadByYear();
						loadCompletedStatusByYear(false);
					},500);
					yearRankTestCount += 1;
				}
			}
		});	
	}	
	/*
	 * 点击搜索框
	 */
	function showSearchList(){
		$$('.rankTestTab').css('display','none');
		$$('.kpi-a-listSearch ul').html('');
		pageNo1 = 1;
		loading1 = true;
		queryByDeptName = ''
		rankTestSearchEndDate = '';
		rankTestSearchStartDate = '';
		$$(this).css('text-align', 'left');
		$$('.rankTestSearchBox').css('display','block');
		$$('.rankDeptSearchBar .searchCancelBtn').css('display', 'block');
		$$('.leaderDetailSearchPage').css('display','block');
		$$('.leaderDetailPage1').css('display','none');
		$$('.leaderDetailSearchNotFound').css('display','none');
	}
	
	function clearSearchKey(){
		queryByDeptName = ''
		rankTestSearchEndDate = '';
		rankTestSearchStartDate = '';
		$$('#rankDeptName').val("");
		$$('#rankTestStartTime').val("");
		$$('#rankTestEndTime').val("");
	}
	/*
	 * 点击取消按钮
	 */
	function hideSearchList(){
		$$('.rankTestTab').css('display','block');
		$$('.kpi-a-listSearch ul').html('');
		pageNo1 = 1;
		loading1 = true;
		queryByDeptName = ''
		rankTestSearchEndDate = '';
		rankTestSearchStartDate = '';
		$$('#rankDeptName').val("");
		$$('#rankTestStartTime').val("");
		$$('#rankTestEndTime').val("");
		$$('.rankDeptSearchBar #rankDeptSearch').css('text-align', 'center');
		$$('.rankDeptSearchBar .searchCancelBtn').css('display', 'none');
		$$('.rankDeptSearchBar .searchbar-clear').css('opacity', '0');
		$$('.leaderDetailPage1').css('display','block');
		$$('.leaderDetailSearchPage').css('display','none');
	}
	/*
	 * keyup事件的触发
	 */
	function keyupContent(){
		//queryByDeptName = $$('#rankDeptSearch').val();
//		if($$("#rankTestStartTime").val() == '' && $$("#rankTestEndTime").val() != ''){
//			app.myApp.alert('请选择开始时间！');
//			return;
//		}
//		if($$("#rankTestEndTime").val() == '' && $$("#rankTestStartTime").val() != ''){
//			app.myApp.alert('请选择结束时间！');
//			return;
//		}
//		if(year > year1){
//			app.myApp.alert('开始年份必须小于结束年份！');
//			return;
//		}else if(year == year1 && month>month1){
//			app.myApp.alert('开始月份必须小于结束月份！');
//			return;
//		}else if(year != year1){
//			app.myApp.alert('月份跨度不能大于12个月！');
//			return;
//		}
		var monthClassName = $('#tab1').hasClass('active');
		var seasonClassName = $('#tab2').hasClass('active');
		var yearClassName = $('#tab3').hasClass('active');
		console.log(monthClassName);
		console.log(seasonClassName);
		console.log(yearClassName);
		if(monthClassName){
			rankTestSearchStartDate = rankTestMonthStartDate;
			rankTestSearchEndDate = rankTestMonthEndDate;
		}else if(seasonClassName){
			rankTestSearchStartDate = rankTestSeasonStartDate;
			rankTestSearchEndDate = rankTestSeasonEndDate;
		}else if(yearClassName){
			rankTestSearchStartDate = rankTestYearStartDate;
			rankTestSearchEndDate = rankTestYearEndDate;
		}
		queryByDeptName = $$('#rankDeptName').val();
		$$('.rankTestSearchBox').css('display','none');
		console.log(rankTestSearchStartDate);
		console.log(rankTestSearchEndDate);
		//loadPartyDeptHead();
		loadCompletedStatus1(false);
	}
	
	//获取领导考核统计表头(月份)
	function loadPartyDeptHead() {
		app.ajaxLoadPageContent1(searchDeptBranchTotalPathHead, {
			deptId:app.user.deptId,
			userId:app.user.id,
			startDate:rankTestMonthStartDate,
			endDate:rankTestMonthEndDate,
		}, function(result) {
			console.log(result);
			var data = result;
			pageDataStorage['partyDeptHead'] = data;
			handlePartyDeptHead(data);
		});
	}
	//获取领导考核统计表头(季度)
	function loadPartyDeptHeadBySeason() {
		app.ajaxLoadPageContent1(searchDeptBranchTotalPathHead, {
			deptId:app.user.deptId,
			userId:app.user.id,
			startDate:rankTestSeasonStartDate,
			endDate:rankTestSeasonEndDate,
		}, function(result) {
			console.log(result);
			var data = result;
			pageDataStorage['partyDeptHead'] = data;
			handlePartyDeptHeadBySeason(data);
		});
	}
	//获取领导考核统计表头(年度)
	function loadPartyDeptHeadByYear() {
		app.ajaxLoadPageContent1(searchDeptBranchTotalPathHead, {
			deptId:app.user.deptId,
			userId:app.user.id,
			startDate:rankTestYearStartDate,
			endDate:rankTestYearEndDate,
		}, function(result) {
			console.log(result);
			var data = result;
			pageDataStorage['partyDeptHead'] = data;
			handlePartyDeptHeadByYear(data);
		});
	}
	
	//各级党委部门下的支部完成情况(月份)
	function loadCompletedStatus(isLoadMore) {
		console.log(rankTestMonthStartDate);
		console.log(rankTestMonthEndDate);
		app.ajaxLoadPageContent(departmentCompletedStatusPath, {
			query:queryByDeptName,
			pageNo:pageNo,
			startDate:rankTestMonthStartDate,
			endDate:rankTestMonthEndDate,
		}, function(result) {
			console.log(result);
			var data = result.data;
			handleCompletedStatus(data,isLoadMore);
		});
	}
	//各级党委部门下的支部完成情况(季度)
	function loadCompletedStatusBySeason(isLoadMore) {
		console.log(rankTestSeasonStartDate);
		console.log(rankTestSeasonEndDate);
		app.ajaxLoadPageContent(departmentCompletedStatusPath, {
			query:queryByDeptName,
			pageNo:pageSeasonRankTest,
			startDate:rankTestSeasonStartDate,
			endDate:rankTestSeasonEndDate,
		}, function(result) {
			console.log(result);
			var data = result.data;
			handleCompletedStatusBySeason(data,isLoadMore);
		});
	}
	//各级党委部门下的支部完成情况(年份)
	function loadCompletedStatusByYear(isLoadMore) {
		console.log(rankTestYearStartDate);
		console.log(rankTestYearEndDate);
		app.ajaxLoadPageContent(departmentCompletedStatusPath, {
			query:queryByDeptName,
			pageNo:pageYearRankTest,
			startDate:rankTestYearStartDate,
			endDate:rankTestYearEndDate,
		}, function(result) {
			console.log(result);
			var data = result.data;
			handleCompletedStatusByYear(data,isLoadMore);
		});
	}
	
	//模糊查询各级党委部门下的支部完成情况
	function loadCompletedStatus1(isLoadMore) {
//		if(startDate == '' && endDate == ''){
//			var date = new Date();
//			startDate = date.getFullYear()+'-'+(date.getMonth()+1);
//			endDate = startDate;
//		}
		console.log(rankTestSearchStartDate);
		console.log(rankTestSearchEndDate);
		app.ajaxLoadPageContent(departmentCompletedStatusPath, {
			query:queryByDeptName,
			pageNo:pageNo1,
			startDate:rankTestSearchStartDate,
			endDate:rankTestSearchEndDate,
		}, function(result) {
			console.log(result);
			var data = result.data;
			handleCompletedStatus1(data,isLoadMore);
		});
	}
	/**
	 * 加载领导考核统计表头(月份)
	 */
	function handlePartyDeptHead(data) {
		$$('.assessCount').html(data.completedTotal);
		$$('.peopleTotal').html(data.unCompletedTotal);
		$$('.headRank .deptName').html(data.deptName);
	}
	/**
	 * 加载领导考核统计表头(季度)
	 */
	function handlePartyDeptHeadBySeason(data) {
		$$('.assessCountSeason').html(data.completedTotal);
		$$('.peopleTotalSeason').html(data.unCompletedTotal);
		$$('.headRankSeason .deptName').html(data.deptName);
	}
	/**
	 * 加载领导考核统计表头(年份)
	 */
	function handlePartyDeptHeadByYear(data) {
		$$('.assessCountYear').html(data.completedTotal);
		$$('.peopleTotalYear').html(data.unCompletedTotal);
		$$('.headRankYear .deptName').html(data.deptName);
	}
	
	/*
	 * 处理各级党委部门下的支部完成情况(月份)
	 */
	function handleCompletedStatus(data,isLoadMore){
		if(data.length) {
			if(isLoadMore) {
				$$('.leaderDetailPage1 .kpi-a-list ul').append(leaderTemplate(data));
			} else {
				$$('.leaderDetailPage1 .kpi-a-list ul').html(leaderTemplate(data));
			}
			$$('.kpi-a-list .assessLeaderContent').on('click',function(){
				app.myApp.getCurrentView().loadPage('shykDUD.html?deptId='+$$(this).data('id')+'&startDate='+rankTestMonthStartDate+'&endDate='+rankTestMonthEndDate+"&deptName="+$$(this).data('name'));
			});
			loading = false;
		} else {
			loading = true;
		}
	}
	/*
	 * 处理各级党委部门下的支部完成情况(季度)
	 */
	function handleCompletedStatusBySeason(data,isLoadMore){
		if(data.length) {
			if(isLoadMore) {
				$$('.leaderDetailPageSeason1 .kpi-a-list ul').append(leaderTemplate(data));
			} else {
				$$('.leaderDetailPageSeason1 .kpi-a-list ul').html(leaderTemplate(data));
			}
			$$('.kpi-a-list .assessLeaderContent').on('click',function(){
				app.myApp.getCurrentView().loadPage('shykDUD.html?deptId='+$$(this).data('id')+'&startDate='+rankTestSeasonStartDate+'&endDate='+rankTestSeasonEndDate+"&deptName="+$$(this).data('name'));
			});
			loadingSeasonRankTest = false;
		} else {
			loadingSeasonRankTest = true;
		}
	}
	/*
	 * 处理各级党委部门下的支部完成情况(年份)
	 */
	function handleCompletedStatusByYear(data,isLoadMore){
		if(data.length) {
			if(isLoadMore) {
				$$('.leaderDetailPageYear1 .kpi-a-list ul').append(leaderTemplate(data));
			} else {
				$$('.leaderDetailPageYear1 .kpi-a-list ul').html(leaderTemplate(data));
			}
			$$('.kpi-a-list .assessLeaderContent').on('click',function(){
				app.myApp.getCurrentView().loadPage('shykDUD.html?deptId='+$$(this).data('id')+'&startDate='+rankTestYearStartDate+'&endDate='+rankTestYearEndDate+"&deptName="+$$(this).data('name'));
			});
			loadingYearRankTest = false;
		} else {
			loadingYearRankTest = true;
		}
	}
	
	/*
	 * 处理各级党委部门下的支部完成情况
	 */
	function handleCompletedStatus1(data,isLoadMore){
		if(data.length) {
			if(isLoadMore) {
				$$('.leaderDetailSearchPage .kpi-a-listSearch ul').append(leaderTemplate(data));
			} else {
				$$('.leaderDetailSearchPage .kpi-a-listSearch ul').html(leaderTemplate(data));
			}
			$$('.kpi-a-listSearch .assessLeaderContent').on('click',function(){
				app.myApp.getCurrentView().loadPage('shykDUD.html?deptId='+$$(this).data('id')+'&startDate='+rankTestSearchStartDate+'&endDate='+rankTestSearchEndDate+"&deptName="+$$(this).data('name'));
				//app.myApp.getCurrentView().loadPage('shykDUD.html?deptId='+$$(this).data('id')+'&year='+year+'&year1='+year1+'&month='+month+'&month1='+month1);
			});
			loading1 = false;
		} else {
			loading1 = true;
		}
	}

	
	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll.leaderDetailPage1');
		var loadMoreContent1 = $$(page.container).find('.infinite-scroll.leaderDetailSearchPage1');
		var loadMoreContent2 = $$(page.container).find('.infinite-scroll.leaderDetailPageSeason1');
		var loadMoreContent3 = $$(page.container).find('.infinite-scroll.leaderDetailPageYear1');
		loadMoreContent.on('infinite',function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			//这里写请求
			loadCompletedStatus(true);
		});
		loadMoreContent1.on('infinite',function() {
			if(loading1) return;
			loading1 = true;
			pageNo1 += 1;
			//这里写请求
			loadCompletedStatus1(true);
		});
		loadMoreContent2.on('infinite',function() {
			if(loadingSeasonRankTest) return;
			loadingSeasonRankTest = true;
			pageSeasonRankTest += 1;
			//这里写请求
			loadCompletedStatusBySeason(true);
		
		});
		loadMoreContent3.on('infinite',function() {
			if(loadingYearRankTest) return;
			loadingYearRankTest = true;
			pageYearRankTest += 1;
			//这里写请求
			loadCompletedStatusByYear(true);
		});
		//下拉刷新	
		var ptrContent=$$(page.container).find('.pull-to-refresh-content.leaderDetailPage1');
		var ptrContent1=$$(page.container).find('.pull-to-refresh-content.leaderDetailSearchPage1');
		var ptrContent2=$$(page.container).find('.pull-to-refresh-content.leaderDetailPageSeason1');
		var ptrContent3=$$(page.container).find('.pull-to-refresh-content.leaderDetailPageYear1');
		ptrContent.on('refresh', function() {
			setTimeout(function() {
				pageNo = 1;
				loading = true;
				//这里写请求
				loadCompletedStatus(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});
		ptrContent1.on('refresh', function() {
			setTimeout(function() {
				pageNo1 = 1;
				loading1 = true;
				//这里写请求
				loadCompletedStatus1(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});
		ptrContent2.on('refresh', function() {
			setTimeout(function() {
				pageSeasonRankTest = 1;
				loadingSeasonRankTest = true;
				//这里写请求
				loadCompletedStatusBySeason(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});
		ptrContent3.on('refresh', function() {
			setTimeout(function() {
				pageYearRankTest = 1;
				loadingYearRankTest = true;
				//这里写请求
				loadCompletedStatusByYear(false);
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