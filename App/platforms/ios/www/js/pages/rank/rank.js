define(['app',
	'hbs!js/hbs/rankPage',
	'hbs!js/hbs/assessmentLeader',
	'hbs!js/hbs/rankDetail1',
], function(app, rankPageTemplate, leaderTemplate,rankDetail1Template) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	var pageNo1 = 1;
	var loading1 = true;
	//个人考核完成情况接口
	var loadPartyMenuPath = app.basePath + 'knowledgeTestpaper/loadPartyMenu';
	//部门考核情况接口
	var loadDeptPath = app.basePath + '/mobile/partyAm/loadDeptByUserId';
	//领导接口
	var loadPartyDeptPath = app.basePath + '/mobile/partyAm/loadRankingDepartment';
	//领导表头接口
	var loadPartyDeptPathHead = app.basePath + '/mobile/partyAm/loadPeopleAndWorkTotal';
	//获取年份
	var getYearsPath = app.basePath + '/mobile/partyAm/getYears';
	var userPoint = 0;
	var userPointBySeason = 0;
	var userPointByYear = 0;
	var queryByDeptName = '';
	
	//时间段
	var year = '';
	var month = '';
	var season = '';
	//月份
	var rankMonthStartTime = '';
	var rankMonthEndTime = '';
	//季度
	var rankSeasonStartTime = '';
	var rankSeasonEndTime = '';
	var rankSeasonCount = 1;
	var pageRankSeason = 1;
	var loadingRankSeason = true;
	//年份
	var rankYearStartTime = '';
	var rankYearEndTime = '';
	var rankYearCount = 1;
	var pageRankYear = 1;
	var loadingRankYear = true;
	//查询
	var rankSearchStartTime = '';
	var rankSearchEndTime = '';
	var type1=0;
	var khpl1=0;
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('rank/rank', [
//			'assessment/assessList',
//			'rank/rankDetail',
//		]);
		app.roleId = parseInt(localStorage.getItem('roleId'));
		// 测试用
		app.roleId = 1;
		if(app.roleId != 1) {
			$$('.leaderInfo').remove();
			$$('.leaderDetailPage').remove();
			$$('.rankPage').append(rankPageTemplate({
				role: app.roleId,
			}));
			$$('.rankSelect').css('display','none');
			$$('.rankTab').css('display','none');
		}else{
			//$$('.rankSelect').css('display','block');
		}
//		if(firstIn) {
		
		initData(page);
//		} else {
//			loadStorage(page);
//		}
		//触发绑定事件
//		app.myApp.initPullToRefresh($('.leaderDetailPage'));
//		app.myApp.initFastClicks($('.leaderDetailPageSeason'));

//		app.myApp.initPullToRefresh($('.page1'));
//		app.myApp.initFastClicks($('.page1'));
		app.myApp.initPageInfiniteScroll($('.rankTab'));
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
		type1=0;
		khpl1=0;
		year = '';
		month = '';
		season = '';
		//月份
		rankMonthStartTime = '';
		rankMonthEndTime = '';
		//季度
		rankSeasonStartTime = '';
		rankSeasonEndTime = '';
		rankSeasonCount = 1;
		pageRankSeason = 1;
		loadingRankSeason = true;
		//年份
		rankYearStartTime = '';
		rankYearEndTime = '';
		rankYearCount = 1;
		pageRankYear = 1;
		loadingRankYear = true;
		
		clickEvent(page);
		console.log(app.roleId);
		
		var user = {
			role: app.roleId
		}
	
		if(user.role > -1 && user.role != 1) {

			$$('.rankDetail').css('display', 'flex');
			$$('.rankSelect1').css('margin-top', '47px');
			TownshipTime();
			//加载数据
			loadDept();
			//loadPartyMenu();
			app.roleId = parseInt(localStorage.getItem('roleId'));
		} else {
			//利于党务负责人查看和评比的搜索框
			$$('.searchRank').css('display','block');
			$$('.rankDetail').css('display', 'none');
			var str = '';
			str += '<div class="infinite-scroll-preloader">';
			str += '<div class="preloader" style="left:35%;margin-left:0px;margin-top:0px;position:absolute;"></div>';
			str += '<div style="position: absolute;left: 45%;;font-size: 17px;">加载中...</div>';
			str += '</div>';
			$$('.leaderDetailPage .kpi-a-list ul').html(str);
			CountyTime();
			loadPartyDeptHead();
			loadPartyDept(false);
			pushAndPull(page);
		}
	}
	
	/**
	 *  读取缓存数据 
	 */
//	function loadStorage(page) {
//		console.log('1');
//		var user = {
//			role: app.roleId
//		}
//		if(user.role > -1 && user.role != 1) {
//			console.log('2');
//			$$('.rankDetail').css('display', 'flex');
//			//加载数据
//			handlePartyMenu(pageDataStorage['partyMenu']);
//			handleDept(pageDataStorage['dept']);
//			console.log(pageDataStorage['dept']);
//		} else {
//			$$('.rankDetail').css('display', 'none');
//			handlePartyDept(pageDataStorage['partyDept'], false);
//			handlePartyDeptHead(pageDataStorage['partyDeptHead']);
//			pushAndPull(page);
//		}
//	}
	//乡镇时间
	function TownshipTime(){
		//选择时间
		var result = [];
		var pickerDescribe;
		var pickerDescribeSeason;
		var pickerDescribeYear;
		//获取年份
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
	    		input: '#picker-describeOther',
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
			pickerDescribeSeason = app.myApp.picker({
	    		input: '#picker-describeSeasonOther',
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
	    		input: '#picker-describeYearOther',
			    rotateEffect: true,
			    cols: [
			        {
			            textAlign: 'left',
			            values:(result)
			        },
			    ]
			});
		});

		var myDate = new Date();
		year = myDate.getFullYear();
		month = myDate.getMonth()+1<10? "0"+(myDate.getMonth()+1):myDate.getMonth()+1;

		//月份时间判断
		$("#picker-describeOther").val(year+'年 '+ month+'月');
		
		rankMonthStartTime = year+'-'+month+'-01';
		rankMonthEndTime = year+'-'+month+'-31';
		$$(".rankTimeMonthOther").on('click',function(){
			pickerDescribe.open();
			$("#picker-describeOther").val(year+'年 '+ month+'月');
			$$('.picker-3d .close-picker').text('完成');
			//设置一开始被选中的年月份
			pickerDescribe.displayValue[0] = year+'年';
			pickerDescribe.displayValue[1] = month+'月';
			pickerDescribe.value[0] = year+'年';
			pickerDescribe.value[1] = month+'月';
			pickerDescribe.params.cols[0].setValue(year+'年');
			pickerDescribe.params.cols[1].setValue(month+'月');		
			$$('.toolbar-inner .right').css('margin-right','20px');	
			$$('.picker-3d .close-picker').on('click',function(){
				year = pickerDescribe.value[0].substring(0,pickerDescribe.value[0].length-1);
				month = pickerDescribe.value[1].substring(0,pickerDescribe.value[1].length-1);
				$("#picker-describeOther").val(year+'年 '+ month+'月');
				
				rankMonthStartTime = year+'-'+month+'-01';
				rankMonthEndTime = year+'-'+month+'-31';
				setTimeout(function(){
					loadDept();
				},100);
				
				//loadPartyMenu();
			});
		});
		
		//季度时间判断
		if(month<=3){
			$("#picker-describeSeasonOther").val(year+'年 '+ '第一季度');
			rankSeasonStartTime = year+'-01-01';
			rankSeasonEndTime = year+'-03-31';
		}else if(month>3 && month<=6){
			$("#picker-describeSeasonOther").val(year+'年 '+ '第二季度');
			rankSeasonStartTime = year+'-04-01';
			rankSeasonEndTime = year+'-06-31';
		}else if(month>6 && month<=9){
			$("#picker-describeSeasonOther").val(year+'年 '+ '第三季度');
			rankSeasonStartTime = year+'-07-01';
			rankSeasonEndTime = year+'-09-31';
		}else if(month>9 && month<=12){
			$("#picker-describeSeasonOther").val(year+'年 '+ '第四季度');
			rankSeasonStartTime = year+'-10-01';
			rankSeasonEndTime = year+'-12-31';
		}
		$$(".rankTimeSeasonOther").on('click',function(){
			pickerDescribeSeason.open();
			$$('.picker-3d .close-picker').text('完成');
			$$('.toolbar-inner .right').css('margin-right','20px');	
			$$('.picker-3d .close-picker').on('click',function(){
				year = pickerDescribeSeason.value[0].substring(0,pickerDescribeSeason.value[0].length-1);
				season = pickerDescribeSeason.value[1].substring(0,pickerDescribeSeason.value[1].length);
				if(season == '第一季度'){
					rankSeasonStartTime = year+'-01-01';
					rankSeasonEndTime = year+'-03-31';
				}else if(season == '第二季度'){
					rankSeasonStartTime = year+'-04-01';
					rankSeasonEndTime = year+'-06-31';
				}else if(season == '第三季度'){
					rankSeasonStartTime = year+'-07-01';
					rankSeasonEndTime = year+'-09-31';
				}else if(season == '第四季度'){
					rankSeasonStartTime = year+'-10-01';
					rankSeasonEndTime = year+'-12-31';
				}
				$("#picker-describeSeasonOther").val(year+'年 '+ season);
				setTimeout(function(){
					loadDeptBySeason();
				},100);
				//loadPartyMenuBySeason();
			});
		});
		
		//年份时间判断
		$("#picker-describeYearOther").val(year+'年 ');
		rankYearStartTime= year+'-01-01';
		rankYearEndTime= year+'-12-31';
		$$(".rankTimeYearOther").on('click',function(){
			pickerDescribeYear.open();
			$$('.picker-3d .close-picker').text('完成');
			$$('.toolbar-inner .right').css('margin-right','20px');	
			$$('.picker-3d .close-picker').on('click',function(){
				year = pickerDescribeYear.value[0].substring(0,pickerDescribeYear.value[0].length-1);
				rankYearStartTime= year+'-01-01';
				rankYearEndTime= year+'-12-31';
				$("#picker-describeYearOther").val(year+'年 ');
				setTimeout(function(){
					loadDeptByYear();
				},100);
				//loadPartyMenuByYear();
			});
		});
		
		
		//点击tab标签
		//月份
		$$('.rankSelect1 .buttonShyk1').on('click',function(){
			
		});
		//季度
		$$('.rankSelect1 .buttonShykSeason1').on('click',function(){
//			setTimeout(function(){
//				$$('.leaderInfo').css('display','block');
//				$$('.leaderInfoSeason').css('display','none');
//				$$('.leaderInfoYear').css('display','none');
//				$$('.leaderDetailPage').css('display','block');
//				$$('.leaderDetailPageSeason').css('display','none');
//				$$('.leaderDetailPageYear').css('display','none');
//			},100)
			setTimeout(function(){
				if(rankSeasonCount == 1){
					loadDeptBySeason();
					//loadPartyMenuBySeason();
					rankSeasonCount += 1;
				}
			},100);
		});
		//年份
		$$('.rankSelect1 .buttonShykYear1').on('click',function(){
			setTimeout(function(){
				if(rankYearCount == 1){
					loadDeptByYear();
					//loadPartyMenuByYear();
					rankYearCount += 1;
				}
			},100);
		});
	}
	
	//县委时间
	function CountyTime(){
		//选择时间
		var result = [];
		var pickerDescribe;
		var pickerDescribeSeason;
		var pickerDescribeYear;
		//获取年份
		app.ajaxLoadPageContent1(getYearsPath,{
		},function(data){
			console.log(data);
			result = data.data;
			$$.each(data.data, function(index, item) {
				result[index] = item.toString()+'年';
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
			            values: ('01月 02月 03月 04月 05月 06月 07月 08月 09月 10月 11月 12月').split(' ')
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

		var myDate = new Date();
		year = myDate.getFullYear();
		month = myDate.getMonth()+1<10? "0"+(myDate.getMonth()+1):myDate.getMonth()+1;
		//月份时间判断
		$("#picker-describe").val(year+'年 '+ month+'月');
		
		rankMonthStartTime = year+'-'+month+'-01';
		rankMonthEndTime = year+'-'+month+'-31';
		$$(".rankTimeMonth").on('click',function(){
			pickerDescribe.open();
			$("#picker-describe").val(year+'年 '+ month+'月');
			$$('.picker-3d .close-picker').text('完成');
			//设置一开始被选中的年月份
			pickerDescribe.displayValue[0] = year+'年';
			pickerDescribe.displayValue[1] = month+'月';
			pickerDescribe.value[0] = year+'年';
			pickerDescribe.value[1] = month+'月';
			pickerDescribe.params.cols[0].setValue(year+'年');
			pickerDescribe.params.cols[1].setValue(month+'月');		
			$$('.toolbar-inner .right').css('margin-right','20px');	
			$$('.picker-3d .close-picker').on('click',function(){
				year = pickerDescribe.value[0].substring(0,pickerDescribe.value[0].length-1);
				month = pickerDescribe.value[1].substring(0,pickerDescribe.value[1].length-1);
				$("#picker-describe").val(year+'年 '+ month+'月');
				pageNo = 1;
				loading = true;
				var str = '';
				str += '<div class="infinite-scroll-preloader">';
				str += '<div class="preloader" style="left:35%;margin-left:0px;margin-top:0px;position:absolute;"></div>';
				str += '<div style="position: absolute;left: 45%;;font-size: 17px;">加载中...</div>';
				str += '</div>';
				$$('.leaderDetailPage .kpi-a-list ul').html(str);
				rankMonthStartTime = year+'-'+month+'-01';
				rankMonthEndTime = year+'-'+month+'-31';
				loadPartyDeptHead();
				loadPartyDept(false);
			});
		});
		
		//季度时间判断
		if(month<=3){
			$("#picker-describeSeason").val(year+'年 '+ '第一季度');
			rankSeasonStartTime = year+'-01-01';
			rankSeasonEndTime = year+'-03-31';
		}else if(month>3 && month<=6){
			$("#picker-describeSeason").val(year+'年 '+ '第二季度');
			rankSeasonStartTime = year+'-04-01';
			rankSeasonEndTime = year+'-06-31';
		}else if(month>6 && month<=9){
			$("#picker-describeSeason").val(year+'年 '+ '第三季度');
			rankSeasonStartTime = year+'-07-01';
			rankSeasonEndTime = year+'-09-31';
		}else if(month>9 && month<=12){
			$("#picker-describeSeason").val(year+'年 '+ '第四季度');
			rankSeasonStartTime = year+'-10-01';
			rankSeasonEndTime = year+'-12-31';
		}
		$$(".rankTimeSeason").on('click',function(){
			pickerDescribeSeason.open();
			$$('.picker-3d .close-picker').text('完成');
			$$('.toolbar-inner .right').css('margin-right','20px');	
			$$('.picker-3d .close-picker').on('click',function(){
				year = pickerDescribeSeason.value[0].substring(0,pickerDescribeSeason.value[0].length-1);
				season = pickerDescribeSeason.value[1].substring(0,pickerDescribeSeason.value[1].length);
				if(season == '第一季度'){
					rankSeasonStartTime = year+'-01-01';
					rankSeasonEndTime = year+'-03-31';
				}else if(season == '第二季度'){
					rankSeasonStartTime = year+'-04-01';
					rankSeasonEndTime = year+'-06-31';
				}else if(season == '第三季度'){
					rankSeasonStartTime = year+'-07-01';
					rankSeasonEndTime = year+'-09-31';
				}else if(season == '第四季度'){
					rankSeasonStartTime = year+'-10-01';
					rankSeasonEndTime = year+'-12-31';
				}
				$("#picker-describeSeason").val(year+'年 '+ season);
				pageRankSeason = 1;
				loadingRankSeason = true;
				var str = '';
				str += '<div class="infinite-scroll-preloader">';
				str += '<div class="preloader" style="left:35%;margin-left:0px;margin-top:0px;position:absolute;"></div>';
				str += '<div style="position: absolute;left: 45%;;font-size: 17px;">加载中...</div>';
				str += '</div>';
				$$('.leaderDetailPageSeason .kpi-a-list ul').html(str);
				loadPartyDeptHeadBySeason();
				loadPartyDeptBySeason(false);
			});
		});
		
		//年份时间判断
		$("#picker-describeYear").val(year+'年 ');
		rankYearStartTime= year+'-01-01';
		rankYearEndTime= year+'-12-31';
		$$(".rankTimeYear").on('click',function(){
			pickerDescribeYear.open();
			$$('.picker-3d .close-picker').text('完成');
			$$('.toolbar-inner .right').css('margin-right','20px');	
			$$('.picker-3d .close-picker').on('click',function(){
				year = pickerDescribeYear.value[0].substring(0,pickerDescribeYear.value[0].length-1);
				rankYearStartTime= year+'-01-01';
				rankYearEndTime= year+'-12-31';
				$("#picker-describeYear").val(year+'年 ');
				pageRankYear = 1;
				loadingRankYear = true;
				var str = '';
				str += '<div class="infinite-scroll-preloader">';
				str += '<div class="preloader" style="left:35%;margin-left:0px;margin-top:0px;position:absolute;"></div>';
				str += '<div style="position: absolute;left: 45%;;font-size: 17px;">加载中...</div>';
				str += '</div>';
				$$('.leaderDetailPageYear .kpi-a-list ul').html(str);
				loadPartyDeptHeadByYear();
				loadPartyDeptByYear(false);
			});
		});
		
		
		//点击tab标签
		//月份
		$$('.rankSelect .buttonShyk').on('click',function(){
			if($$('.rankTab').css('display') == 'none'){
				setTimeout(function(){
					searchRank();
				},100);
			}
		});
		//季度
		$$('.rankSelect .buttonShykSeason').on('click',function(){
			
			
			if($$('.rankTab').css('display') == 'none'){
				setTimeout(function(){
					searchRank();
				},100);
			}else{
				setTimeout(function(){
					if(rankSeasonCount == 1){
						var str = '';
						str += '<div class="infinite-scroll-preloader">';
						str += '<div class="preloader" style="left:35%;margin-left:0px;margin-top:0px;position:absolute;"></div>';
						str += '<div style="position: absolute;left: 45%;;font-size: 17px;">加载中...</div>';
						str += '</div>';
						$$('.leaderDetailPageSeason .kpi-a-list ul').html(str);
						loadPartyDeptHeadBySeason();
						loadPartyDeptBySeason(false);
						rankSeasonCount += 1;
					}
				},100);
			}
		});
		//年份
		$$('.rankSelect .buttonShykYear').on('click',function(){
			if($$('.rankTab').css('display') == 'none'){
				setTimeout(function(){
					searchRank();
				},100);
			}else{
				setTimeout(function(){
				if(rankYearCount == 1){
						var str = '';
						str += '<div class="infinite-scroll-preloader">';
						str += '<div class="preloader" style="left:35%;margin-left:0px;margin-top:0px;position:absolute;"></div>';
						str += '<div style="position: absolute;left: 45%;;font-size: 17px;">加载中...</div>';
						str += '</div>';
						$$('.leaderDetailPageYear .kpi-a-list ul').html(str);
						loadPartyDeptHeadByYear();
						loadPartyDeptByYear(false);
						rankYearCount += 1;
					}
				},100);
			}
		});
	}
	
	
	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('#rankDeptSearch').on('focus', showSearchList);
		$$('.rankDeptSearchBar .searchCancelBtn').on('click', hideSearchList);
		//$$('#rankDeptSearch').on('keyup', keyupContent);
		$$('#rankDeptSearch').on('keyup', searchRank);
		
		
	}
	
	//搜索条件
	function searchRank(){
		var monthClassName = $('#tab1').hasClass('active');
		var seasonClassName = $('#tab2').hasClass('active');
		var yearClassName = $('#tab3').hasClass('active');
		console.log(monthClassName);
		console.log(seasonClassName);
		console.log(yearClassName);
		if(monthClassName){
			rankSearchStartTime = rankMonthStartTime;
			rankSearchEndTime = rankMonthEndTime;
			type1=1;
			khpl1=2;
		}else if(seasonClassName){
			rankSearchStartTime = rankSeasonStartTime;
			rankSearchEndTime = rankSeasonEndTime;
			type1=1;
			khpl1=1;
		}else if(yearClassName){
			rankSearchStartTime = rankYearStartTime;
			rankSearchEndTime = rankYearEndTime;
			//rankSearchStartTime = year;
			type1=0;
			khpl1=0;
		}
		keyupContent();
	}
	/*
	 * 点击搜索框
	 */
	function showSearchList(){
		$$('.rankTab').css('display','none');
		$$('.kpi-a-listSearch ul').html('');
		pageNo1 = 1;
		loading1 = true;
		queryByDeptName = ''
		$$(this).css('text-align', 'left');
		$$('.rankDeptSearchBar .searchCancelBtn').css('display', 'block');
		$$('.leaderDetailSearchPage').css('display','block');
		$$('.leaderDetailPage').css('display','none');
		$$('.leaderDetailSearchNotFound').css('display','none');
	}
	/*
	 * 点击取消按钮
	 */
	function hideSearchList(){
		$$('.rankTab').css('display','block');
		$$('.kpi-a-listSearch ul').html('');
		pageNo1 = 1;
		loading1 = true;
		queryByDeptName = ''
		$$('#rankDeptSearch').val("");
		$$('.rankDeptSearchBar #rankDeptSearch').css('text-align', 'center');
		$$('.rankDeptSearchBar .searchCancelBtn').css('display', 'none');
		$$('.rankDeptSearchBar .searchbar-clear').css('opacity', '0');
		$$('.leaderDetailPage').css('display','block');
		$$('.leaderDetailSearchPage').css('display','none');
	}
	/*
	 * keyup事件的触发
	 */
	function keyupContent(){
		queryByDeptName = $$('#rankDeptSearch').val();
		if(!queryByDeptName){
			return;
		}
		loadPartyDept1(false);
	}
	
	/*
	 * 获取个人考核完成情况(月份)
	 */
	function loadPartyMenu() {
		console.log(rankMonthStartTime);
		console.log(rankMonthEndTime);
		app.ajaxLoadPageContent(loadPartyMenuPath, {
			userId: app.userId,
			deptId: app.user.deptId,
			startDate:rankMonthStartTime,
			endDate:rankMonthEndTime,
		}, function(data) {
			console.log(data);
			pageDataStorage['partyMenu'] = data;
			handlePartyMenu(data);
		});
	}
	/*
	 * 获取个人考核完成情况(季度)
	 */
	function loadPartyMenuBySeason() {
		console.log(rankSeasonStartTime);
		console.log(rankSeasonEndTime);
		app.ajaxLoadPageContent(loadPartyMenuPath, {
			userId: app.userId,
			deptId: app.user.deptId,
			startDate:rankSeasonStartTime,
			endDate:rankSeasonEndTime,
		}, function(data) {
			console.log(data);
			pageDataStorage['partyMenuSeason'] = data;
			setTimeout(function(){
				handlePartyMenuBySeason(data);
			},100)
			
		});
	}
	/*
	 * 获取个人考核完成情况(年度)
	 */
	function loadPartyMenuByYear() {
		console.log(rankYearStartTime);
		console.log(rankYearEndTime);
		app.ajaxLoadPageContent(loadPartyMenuPath, {
			userId: app.userId,
			deptId: app.user.deptId,
			startDate:rankYearStartTime,
			endDate:rankYearEndTime,
		}, function(data) {
			console.log(data);
			pageDataStorage['partyMenuYear'] = data;
			setTimeout(function(){
				handlePartyMenuByYear(data);
			},100)
			
		});
	}

	/**
	 * 加载个人考核信息 (月份)
	 */
	function handlePartyMenu(data) {
		var curData = data.data;
		var titleArr = [];
		var proportionArr = [];
		var scoreArr = [];
		var chartHeight = 0;
		for(var key in curData) {
			chartHeight += 40;
			var assObj = {};
			titleArr.push(key);
			var count = 0;
			var score = 0;
			$$.each(curData[key], function(index, item) {
				if(item.totalScore) {
					score += item.totalScore;
				}
			});
			var proportion = app.utils.getDecimal(score / userPoint * 100, 1);
			proportionArr.push(proportion);
			scoreArr.push(score);
		}
		$$('#userKpiChart').css('height', (chartHeight + 130) + 'px');
		var chartObj = {};
		chartObj.title = titleArr;
		chartObj.proportion = proportionArr;
		chartObj.score = scoreArr;
		loadChart(chartObj);
	}
	/**
	 * 加载个人考核信息 (季度)
	 */
	function handlePartyMenuBySeason(data) {
		var curDataSeason = data.data;
		var titleArrSeason = [];
		var proportionArrSeason = [];
		var scoreArrSeason = [];
		var chartHeightSeason = 0;
		for(var key in curDataSeason) {
			chartHeightSeason += 40;
			var assObjSeason = {};
			titleArrSeason.push(key);
			var countSeason = 0;
			var scoreSeason = 0;
			$$.each(curDataSeason[key], function(index, item) {
				if(item.totalScore) {
					scoreSeason += item.totalScore;
				}
			});
			var proportionSeason = app.utils.getDecimal(scoreSeason / userPointBySeason * 100, 1);
			proportionArrSeason.push(proportionSeason);
			scoreArrSeason.push(scoreSeason);
		}
		$$('#userKpiChartSeason').css('height', (chartHeightSeason + 130) + 'px');
		var chartObjSeason = {};
		chartObjSeason.title = titleArrSeason;
		chartObjSeason.proportion = proportionArrSeason;
		chartObjSeason.score = scoreArrSeason;
		setTimeout(function(){
			loadChartBySeason(chartObjSeason);
		},100);
		
	}
	/**
	 * 加载个人考核信息 (年度)
	 */
	function handlePartyMenuByYear(data) {
		var curDataYear = data.data;
		var titleArrYear = [];
		var proportionArrYear = [];
		var scoreArrYear = [];
		var chartHeightYear = 0;
		for(var key in curDataYear) {
			chartHeightYear += 40;
			var assObjYearn = {};
			titleArrYear.push(key);
			var countYear = 0;
			var scoreYear = 0;
			$$.each(curDataYear[key], function(index, item) {
				if(item.totalScore) {
					scoreYear += item.totalScore;
				}
			});
			var proportionYear = app.utils.getDecimal(scoreYear / userPointByYear * 100, 1);
			proportionArrYear.push(proportionYear);
			scoreArrYear.push(scoreYear);
		}
		$$('#userKpiChartYear').css('height', (chartHeightYear + 130) + 'px');
		var chartObjYear = {};
		chartObjYear.title = titleArrYear;
		chartObjYear.proportion = proportionArrYear;
		chartObjYear.score = scoreArrYear;
		setTimeout(function(){
			loadChartByYear(chartObjYear);
		},100);
		
	}

	/**
	 * 加载图表(月份)
	 */
	function loadChart(chartObj) {
		$('#userKpiChart').highcharts({
			chart: {
				type: 'bar'
			},
			title: {
				text: '个人考核进度',
				style: {
					color: '#369',
				}
			},
			xAxis: {
				categories: chartObj.title,
				title: {
					text: null
				},
				labels: {
					formatter: function() {
						if(this.value.length > 8) {
							return this.value.substr(0, 4) + '<br />' + this.value.substr(4, 3) + '...';
						} else {
							return this.value.substr(0, 4) + '<br />' + this.value.substr(4, 4);
						}
					},
					style: {
						textAlign: 'left',
					},
				}
			},
			yAxis: {
				min: 0,
				minRange: 1,
				title: {
					text: null,
				},
				labels: {
					overflow: 'justify',
				}
			},
			tooltip: {
				// valueSuffix: ''
				shared: true,
				// pointFormat: '<span>{series.name}: <b>{point.y}</b><br/>'
				formatter: function() {
					var s = '<b>' + this.x + '</b>';
					//					console.log(this.points[0].point.index);
					$.each(this.points, function(index, _) {
						s += '<br/>' + this.series.name + ': ' +
							this.y;
						if(index === 1) {
							s += '%';
						} else {
							s += '分';
						}
					});
					return s;
				},
			},
			plotOptions: {
				bar: {
					dataLabels: {
						enabled: true,
						formatter: function() {
							if(this.series.name == '得分比例') {
								return this.y + '%';
							}
							return this.y;
						}
					},
					point: {
						events: {
							click: function() {
								app.myApp.getCurrentView().loadPage('rankDetail.html');
								//		                        console.log('Category: ' + this.category + ', value: ' + this.y);
							}
						}
					}
					
					//线条之间的空隙
					//					pointPadding: 0.4,
					//组之间的空隙
					//					groupPadding: 0
				}
			},
			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'top',
				x: -10,
				y: 0,
				floating: true,
				borderWidth: 1,
				backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
				shadow: true
			},
			credits: {
				enabled: false
			},
			series: [{
				name: '考核分数',
				data: chartObj.score,
			}, {
				name: '得分比例',
				data: chartObj.proportion
			}]
		});
	}
	
	/**
	 * 加载图表(季度)
	 */
	function loadChartBySeason(chartObj) {
		console.log('1212121');
		$('#userKpiChartSeason').highcharts({
			chart: {
				type: 'bar'
			},
			title: {
				text: '个人考核进度',
				style: {
					color: '#369',
				}
			},
			xAxis: {
				categories: chartObj.title,
				title: {
					text: null
				},
				labels: {
					formatter: function() {
						if(this.value.length > 8) {
							return this.value.substr(0, 4) + '<br />' + this.value.substr(4, 3) + '...';
						} else {
							return this.value.substr(0, 4) + '<br />' + this.value.substr(4, 4);
						}
					},
					style: {
						textAlign: 'left',
					},
				}
			},
			yAxis: {
				min: 0,
				minRange: 1,
				title: {
					text: null,
				},
				labels: {
					overflow: 'justify',
				}
			},
			tooltip: {
				// valueSuffix: ''
				shared: true,
				// pointFormat: '<span>{series.name}: <b>{point.y}</b><br/>'
				formatter: function() {
					var s = '<b>' + this.x + '</b>';
					//					console.log(this.points[0].point.index);
					$.each(this.points, function(index, _) {
						s += '<br/>' + this.series.name + ': ' +
							this.y;
						if(index === 1) {
							s += '%';
						} else {
							s += '分';
						}
					});
					return s;
				},
			},
			plotOptions: {
				bar: {
					dataLabels: {
						enabled: true,
						formatter: function() {
							if(this.series.name == '得分比例') {
								return this.y + '%';
							}
							return this.y;
						}
					},
					point: {
						events: {
							click: function() {
								app.myApp.getCurrentView().loadPage('rankDetail.html');
								//		                        console.log('Category: ' + this.category + ', value: ' + this.y);
							}
						}
					}
					
					//线条之间的空隙
					//					pointPadding: 0.4,
					//组之间的空隙
					//					groupPadding: 0
				}
			},
			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'top',
				x: -10,
				y: 0,
				floating: true,
				borderWidth: 1,
				backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
				shadow: true
			},
			credits: {
				enabled: false
			},
			series: [{
				name: '考核分数',
				data: chartObj.score,
			}, {
				name: '得分比例',
				data: chartObj.proportion
			}]
		});
	}
	/**
	 * 加载图表(年度)
	 */
	function loadChartByYear(chartObj) {
		$('#userKpiChartYear').highcharts({
			chart: {
				type: 'bar'
			},
			title: {
				text: '个人考核进度',
				style: {
					color: '#369',
				}
			},
			xAxis: {
				categories: chartObj.title,
				title: {
					text: null
				},
				labels: {
					formatter: function() {
						if(this.value.length > 8) {
							return this.value.substr(0, 4) + '<br />' + this.value.substr(4, 3) + '...';
						} else {
							return this.value.substr(0, 4) + '<br />' + this.value.substr(4, 4);
						}
					},
					style: {
						textAlign: 'left',
					},
				}
			},
			yAxis: {
				min: 0,
				minRange: 1,
				title: {
					text: null,
				},
				labels: {
					overflow: 'justify',
				}
			},
			tooltip: {
				// valueSuffix: ''
				shared: true,
				// pointFormat: '<span>{series.name}: <b>{point.y}</b><br/>'
				formatter: function() {
					var s = '<b>' + this.x + '</b>';
					//					console.log(this.points[0].point.index);
					$.each(this.points, function(index, _) {
						s += '<br/>' + this.series.name + ': ' +
							this.y;
						if(index === 1) {
							s += '%';
						} else {
							s += '分';
						}
					});
					return s;
				},
			},
			plotOptions: {
				bar: {
					dataLabels: {
						enabled: true,
						formatter: function() {
							if(this.series.name == '得分比例') {
								return this.y + '%';
							}
							return this.y;
						}
					},
					point: {
						events: {
							click: function() {
								app.myApp.getCurrentView().loadPage('rankDetail.html');
								//		                        console.log('Category: ' + this.category + ', value: ' + this.y);
							}
						}
					}
					
					//线条之间的空隙
					//					pointPadding: 0.4,
					//组之间的空隙
					//					groupPadding: 0
				}
			},
			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'top',
				x: -10,
				y: 0,
				floating: true,
				borderWidth: 1,
				backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
				shadow: true
			},
			credits: {
				enabled: false
			},
			series: [{
				name: '考核分数',
				data: chartObj.score,
			}, {
				name: '得分比例',
				data: chartObj.proportion
			}]
		});
	}
	/**
	 *  获取部门考核情况(月份)
	 */
	function loadDept() {
		console.log(rankMonthStartTime);
		console.log(rankMonthEndTime);
		app.ajaxLoadPageContent(loadDeptPath, {
			deptId: app.user.deptId,
			// userId: app.userId,
			startDate:rankMonthStartTime,
			endDate:rankMonthEndTime,
//			type:1,
			khpl:2,
		}, function(data) {
			console.log(data.data);
			pageDataStorage['dept'] = data.data;
			//userPoint = data.data.userPoint;
			console.log(data.data.point);
			userPoint = data.data.point;
			setTimeout(function(){
				handleDept(data);
			},100);
		},{
			async: false
		});
	}
	/**
	 *  获取部门考核情况(季度)
	 */
	function loadDeptBySeason() {
		console.log(rankSeasonStartTime);
		console.log(rankSeasonEndTime);
		app.ajaxLoadPageContent(loadDeptPath, {
			deptId: app.user.deptId,
			// userId: app.userId,
			startDate:rankSeasonStartTime,
			endDate:rankSeasonEndTime,
//			type:1,
			khpl:1,
		}, function(data) {
			console.log(data.data);
			pageDataStorage['deptSeason'] = data.data;
			//userPointBySeason = data.data.userPoint;
			userPointBySeason = data.data.point;
			setTimeout(function(){
				handleDeptBySeason(data);
			},100);
		},{
			async: false
		});
	}
	/**
	 *  获取部门考核情况(年度)
	 */
	function loadDeptByYear() {
		console.log(rankYearStartTime);
		console.log(rankYearEndTime);
//		console.log(year);
		app.ajaxLoadPageContent(loadDeptPath, {
			deptId: app.user.deptId,
			// userId: app.userId,
			startDate:rankYearStartTime,
			endDate:rankYearEndTime,
//			yearly:year,
//			type:0,
			khpl:0,
		}, function(data) {
			console.log(data.data);
			pageDataStorage['deptYear'] = data.data;
			//userPointByYear = data.data.userPoint;
			userPointByYear = data.data.point;
			setTimeout(function(){
				handleDeptByYear(data);
			},100);
			
		},{
			async: false
		});
	}

	/**
	 * 加载部门考核情况(月份)
	 * @param {Object} data
	 */
	function handleDept(data) {
		console.log(data);
		$$('.rank-list ul').html(rankDetail1Template(data.data));
//		$$('.kpi-a-list-item-title').html(data.data.deptName);
//		$$('.rankPeople').html(data.data.people);
//		$$('.rankCount').html(data.data.count);
//		$$('.rankPoint').html(data.data.point);


		//$$('.rankScore').html(data.data.userPoint);
//		$$('.rankScore').html(data.data.point);
		if(data.data.lastTime) {
			$$('.headTime').html(data.data.lastTime);
			$$('.rankDetail').on('click', function() {
				app.myApp.getCurrentView().loadPage('rankDetail.html');
			});
		} else {
			$$('.headTime').html('无记录');
			$$('.rankDetail').on('click', function() {
				app.myApp.alert('您还没考核记录');
			});
		}
		$$('.rank-list .assessDeptContent').on('click', function() {
			console.log(data.data.count)
			var count = data.data.count;
			var assessid = app.user.deptId;
			var name = data.data.deptName;
			var point = data.data.point;
			console.log(name);
			console.log(count);
			console.log(point);
			console.log('11');
			if(count == 0) {
				app.myApp.alert('该部门还没有考核记录');
				return;
			}
			app.myApp.getCurrentView().loadPage('assessList.html?assessid=' + assessid + '&name=' + name + '&point=' + point + '&count=' + count+'&startDate='+rankMonthStartTime+'&endDate='+rankMonthEndTime+'&type=1&khpl=2');
		});	
	}
	
	/**
	 * 加载部门考核情况(季度)
	 * @param {Object} data
	 */
	function handleDeptBySeason(data) {
		$$('.rank-listSeason ul').html(rankDetail1Template(data.data));
//		$$('.kpi-a-list-item-titleSeason').html(data.data.deptName);
//		$$('.rankPeopleSeason').html(data.data.people);
//		$$('.rankCountSeason').html(data.data.count);
//		$$('.rankPointSeason').html(data.data.point);
//		//$$('.rankScoreSeason').html(data.data.userPoint);
//		$$('.rankScoreSeason').html(data.data.point);
		if(data.data.lastTime) {
			$$('.headTimeSeason').html(data.data.lastTime);
			$$('.rankDetail').on('click', function() {
				app.myApp.getCurrentView().loadPage('rankDetail.html');
			});
		} else {
			$$('.headTimeSeason').html('无记录');
			$$('.rankDetail').on('click', function() {
				app.myApp.alert('您还没考核记录');
			});
		}
		$$('.rank-listSeason .assessDeptContent').on('click', function() {
			var countSeason = data.data.count;
			if(countSeason == 0) {
				app.myApp.alert('该部门还没有考核记录');
				return;
			}
			var assessidSeason = app.user.deptId;
			var nameSeason = data.data.deptName;
			var pointSeason = data.data.point;
			console.log(nameSeason);
			console.log(countSeason);
			console.log(pointSeason);
			app.myApp.getCurrentView().loadPage('assessList.html?assessid=' + assessidSeason + '&name=' + nameSeason + '&point=' + pointSeason + '&count=' + countSeason+'&startDate='+rankSeasonStartTime+'&endDate='+rankSeasonEndTime+'&type=1&khpl=1');
		});
	}
	/**
	 * 加载部门考核情况(季度)
	 * @param {Object} data
	 */
	function handleDeptByYear(data) {
		$$('.rank-listYear ul').html(rankDetail1Template(data.data));
		$$('.kpi-a-list-item-titleYear').html(data.data.deptName);
		$$('.rankPeopleYear').html(data.data.people);
		$$('.rankCountYear').html(data.data.count);
		$$('.rankPointYear').html(data.data.point);
		//$$('.rankScoreYear').html(data.data.userPoint);
		$$('.rankScoreYear').html(data.data.point);
		if(data.data.lastTime) {
			$$('.headTimeYear').html(data.data.lastTime);
			$$('.rankDetail').on('click', function() {
				app.myApp.getCurrentView().loadPage('rankDetail.html');
			});
		} else {
			$$('.headTimeYear').html('无记录');
			$$('.rankDetail').on('click', function() {
				app.myApp.alert('您还没考核记录');
			});
		}
		$$('.rank-listYear .assessDeptContent').on('click', function() {
			var countYear = data.data.count;
			if(countYear == 0) {
				app.myApp.alert('该部门还没有考核记录');
				return;
			}
			var assessidYear = app.user.deptId;
			var nameYear= data.data.deptName;
			var pointYear = data.data.point;
			console.log(nameYear);
			console.log(countYear);
			console.log(pointYear);
			//app.myApp.getCurrentView().loadPage('assessList.html?assessid=' + assessidYear + '&name=' + nameYear + '&point=' + pointYear + '&count=' + countYear+'&startDate='+rankYearStartTime+'&endDate='+rankYearEndTime+'&type=1&khpl=2');
			app.myApp.getCurrentView().loadPage('assessList.html?assessid=' + assessidYear + '&name=' + nameYear + '&point=' + pointYear + '&count=' + countYear+'&startDate='+year+'&endDate='+rankYearEndTime+'&type=0&khpl=0');
		});
	}
	
	//获取领导考核统计表头(月份)
	function loadPartyDeptHead() {
		app.ajaxLoadPageContent1(loadPartyDeptPathHead, {
			startDate:rankMonthStartTime,
			endDate:rankMonthEndTime,
			khpl:2,
		}, function(result) {
			console.log(result);

			var data = result.data;
			
				//pageDataStorage['partyDeptHead'] = data;
			handlePartyDeptHead(data);
			
			
		});
	}
	//获取领导考核统计表头(季度)
	function loadPartyDeptHeadBySeason() {
		app.ajaxLoadPageContent1(loadPartyDeptPathHead, {
			startDate:rankSeasonStartTime,
			endDate:rankSeasonEndTime,
			khpl:1,
		}, function(result) {
			console.log(result);
			var data = result.data;
			handlePartyDeptHeadBySeason(data);
		});
	}
	//获取领导考核统计表头(年度)
	function loadPartyDeptHeadByYear() {
		app.ajaxLoadPageContent1(loadPartyDeptPathHead, {
			startDate:rankYearStartTime,
			endDate:rankYearEndTime,
			khpl:0,
		}, function(result) {
			console.log(result);
			var data = result.data;
			handlePartyDeptHeadByYear(data);
		});
	}
	
	/**
	 * 加载领导考核统计表头(月份)
	 */
	function handlePartyDeptHead(data) {
		$$('.assessCount').html(data.count);
		$$('.peopleTotal').html(data.people);
	}
	/**
	 * 加载领导考核统计表头(季度)
	 */
	function handlePartyDeptHeadBySeason(data) {
		$$('.assessCountSeason').html(data.count);
		$$('.peopleTotalSeason').html(data.people);
	}
	/**
	 * 加载领导考核统计表头(年份)
	 */
	function handlePartyDeptHeadByYear(data) {
		$$('.assessCountYear').html(data.count);
		$$('.peopleTotalYear').html(data.people);
	}



	//获取领导考核统计(月份)
	function loadPartyDept(isLoadMore) {
		console.log(rankMonthStartTime);
		console.log(rankMonthEndTime);
		app.ajaxLoadPageContent1(loadPartyDeptPath, {
			current: pageNo,
			startDate:rankMonthStartTime,
			endDate:rankMonthEndTime,
//			type:1,
			khpl:2,
		}, function(result) {
			console.log(result);
			var data = result.data;
			if((data == null && pageNo == 1)|| (data.length == 0 && pageNo == 1)){
				var str = '';
				
				str += '<div style="position: absolute;left: 45%;;font-size: 17px;">没有数据</div>';
				
				$$('.leaderDetailPage .kpi-a-list ul').html(str);
					
				}else{
				$$.each(data, function(index, item) {
					item.rank = (pageNo - 1) * 10 + index + 1;	
				});
				if(isLoadMore) {
					pageDataStorage['partyDept'] = pageDataStorage['partyDept'].concat(data);
				} else {
					pageDataStorage['partyDept'] = data;
				}
				handlePartyDept(data, isLoadMore);
			}
			
		});
	}
	//获取领导考核统计(季度)
	function loadPartyDeptBySeason(isLoadMore) {
		console.log(rankSeasonStartTime);
		console.log(rankSeasonEndTime);
		app.ajaxLoadPageContent1(loadPartyDeptPath, {
			current: pageRankSeason,
			startDate:rankSeasonStartTime,
			endDate:rankSeasonEndTime,
//			type:1,
			khpl:1,
		}, function(result) {
			
			var data = result.data;
			console.log(data);
			console.log(pageRankSeason);
			if((data == null && pageRankSeason == 1)|| (data.length == 0 && pageRankSeason == 1)){
				var str = '';
				
				str += '<div style="position: absolute;left: 45%;;font-size: 17px;">没有数据</div>';
				
				$$('.leaderDetailPageSeason .kpi-a-list ul').html(str);
					
				}else{
					$$.each(data, function(index, item) {
						item.rank = (pageNo - 1) * 10 + index + 1;	
					});
					if(isLoadMore) {
						pageDataStorage['partyDeptSeason'] = pageDataStorage['partyDeptSeason'].concat(data);
					} else {
						pageDataStorage['partyDeptSeason'] = data;
					}
					handlePartyDeptBySeason(data, isLoadMore);
				}
			
		});
	}
	//获取领导考核统计(年度)
	function loadPartyDeptByYear(isLoadMore) {
		console.log(rankYearStartTime);
		console.log(rankYearEndTime);
//		console.log(year);
		app.ajaxLoadPageContent1(loadPartyDeptPath, {
			current: pageRankYear,
			startDate:rankYearStartTime,
			endDate:rankYearEndTime,
//			yearly:year,
//			type:0,
			khpl:0,
		}, function(result) {
			console.log(result);
			var data = result.data;
			console.log(data);
			
			if((data == null && pageRankYear == 1) || (data.length == 0 && pageRankYear == 1)){
				var str = '';
				
				str += '<div style="position: absolute;left: 45%;;font-size: 17px;">没有数据</div>';
				
				$$('.leaderDetailPageYear .kpi-a-list ul').html(str);
					
				}else{
					$$.each(data, function(index, item) {
						item.rank = (pageNo - 1) * 10 + index + 1;	
					});
					if(isLoadMore) {
						pageDataStorage['partyDeptYear'] = pageDataStorage['partyDeptYear'].concat(data);
					} else {
						pageDataStorage['partyDeptYear'] = data;
					}
					handlePartyDeptByYear(data, isLoadMore);

				}
			
		});
	}
	//查询领导考核统计
	function loadPartyDept1(isLoadMore) {
		console.log(rankSearchStartTime);
		console.log(rankSearchEndTime);
		app.ajaxLoadPageContent(loadPartyDeptPath, {
			current: pageNo1,
			query:queryByDeptName,
			startDate:rankSearchStartTime,
			endDate:rankSearchEndTime,
	//		yearly:rankSearchStartTime,
	//		type:type1,
			khpl:khpl1,
		}, function(result) {
			console.log(result);
			var data = result.data;
			$$.each(data, function(index, item) {
				item.rank = (pageNo1 - 1) * 10 + index + 1;
			});
			if(isLoadMore) {
				pageDataStorage['partyDept1'] = pageDataStorage['partyDept1'].concat(data);
			} else {
				pageDataStorage['partyDept1'] = data;
			}
			$$('.leaderDetailSearchNotFound').css('display','none');
			if(data == undefined){
				$$('.leaderDetailSearchNotFound').css('display','block');
			}
			handlePartySearchDept(data, isLoadMore);
			
		});
	}
	
	
	/**
	 *  加载领导考核统计(月份)
	 * @param {Object} data
	 */
	function handlePartyDept(data, isLoadMore) {
		if(data && data.length > 0) {
			if(isLoadMore) {
				$$('.leaderDetailPage .kpi-a-list ul').append(leaderTemplate(data));
			} else {
				$$('.leaderDetailPage .kpi-a-list ul').html(leaderTemplate(data));
			}
			//点击事件
			$$('.leaderDetailPage .assessLeaderContent').on('click', function() {
				var assessid = $$(this).data('id');
				var name = $$(this).data('name');
				var point = $$(this).data('point');
				var count = $$(this).data('count');
				if(count == 0) {
					app.myApp.alert('该部门还没有考核记录');
					return;
				}
				app.myApp.getCurrentView().loadPage('assessList.html?assessid=' + assessid + '&name=' + name + '&point=' + point + '&count=' + count+'&startDate='+rankMonthStartTime+'&endDate='+rankMonthEndTime+'&type=1&khpl=2');
			});
			if(data.length == 10) {
				loading = false;
			}
		}
	}
	/**
	 *  加载领导考核统计(季度)
	 * @param {Object} data
	 */
	function handlePartyDeptBySeason(data, isLoadMore) {
		if(data && data.length > 0) {
			if(isLoadMore) {
				$$('.leaderDetailPageSeason .kpi-a-list ul').append(leaderTemplate(data));
			} else {
				$$('.leaderDetailPageSeason .kpi-a-list ul').html(leaderTemplate(data));
			}
			//点击事件
			$$('.leaderDetailPageSeason .assessLeaderContent').on('click', function() {
				var assessid = $$(this).data('id');
				var name = $$(this).data('name');
				var point = $$(this).data('point');
				var count = $$(this).data('count');
				if(count == 0) {
					app.myApp.alert('该部门还没有考核记录');
					return;
				}
				app.myApp.getCurrentView().loadPage('assessList.html?assessid=' + assessid + '&name=' + name + '&point=' + point + '&count=' + count+'&startDate='+rankSeasonStartTime+'&endDate='+rankSeasonEndTime+'&type=1&khpl=1');
			});
			if(data.length == 10) {
				loadingRankSeason = false;
			}
		}
	}
	/**
	 *  加载领导考核统计(年份)
	 * @param {Object} data
	 */
	function handlePartyDeptByYear(data, isLoadMore) {
		if(data && data.length > 0) {
			if(isLoadMore) {
				$$('.leaderDetailPageYear .kpi-a-list ul').append(leaderTemplate(data));
			} else {
				$$('.leaderDetailPageYear .kpi-a-list ul').html(leaderTemplate(data));
			}
			//点击事件
			$$('.leaderDetailPageYear .assessLeaderContent').on('click', function() {
				var assessid = $$(this).data('id');
				var name = $$(this).data('name');
				var point = $$(this).data('point');
				var count = $$(this).data('count');
				if(count == 0) {
					app.myApp.alert('该部门还没有考核记录');
					return;
				}
				app.myApp.getCurrentView().loadPage('assessList.html?assessid=' + assessid + '&name=' + name + '&point=' + point + '&count=' + count+'&startDate='+rankYearStartTime+'&endDate='+rankYearEndTime+'&type=0&khpl=0');
			});
			if(data.length == 10) {
				loadingRankYear = false;
			}
		}
	}
	
	/**
	 *  加载领导考核统计
	 * @param {Object} data
	 */
	function handlePartySearchDept(data, isLoadMore) {
		if(data && data.length > 0) {
			if(isLoadMore) {
				$$('.kpi-a-listSearch ul').append(leaderTemplate(data));
			} else {
				$$('.kpi-a-listSearch ul').html(leaderTemplate(data));
			}
			//点击事件
			$$('.kpi-a-listSearch .assessLeaderContent').on('click', function() {
				var assessid = $$(this).data('id');
				var name = $$(this).data('name');
				var point = $$(this).data('point');
				var count = $$(this).data('count');
				if(count == 0) {
					app.myApp.alert('该部门还没有考核记录');
					return;
				}
				app.myApp.getCurrentView().loadPage('assessList.html?assessid=' + assessid + '&name=' + name + '&point=' + point + '&count=' + count+'&type='+type1+'&khpl='+khpl1+'&startDate='+rankSearchStartTime+'&endDate='+rankSearchEndTime);
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
		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll.leaderDetailPage');
		console.log(loadMoreContent);
		loadMoreContent.on('infinite',function() {
			if(queryByDeptName == ''){
				if(loading) return;
				loading = true;
				pageNo += 1;
				//这里写请求
				loadPartyDept(true);
			}
		});
		var loadMoreContent1 = $$(page.container).find('.infinite-scroll.leaderDetailSearchPage');
		console.log(loadMoreContent1);
		loadMoreContent1.on('infinite',function() {
				if(loading1) return;
				loading1 = true;
				pageNo1 += 1;
				//这里写请求
				loadPartyDept1(true);
		});
		var loadMoreContent2 = $$(page.container).find('.infinite-scroll.leaderDetailPageSeason');
		console.log(loadMoreContent2);
		loadMoreContent2.on('infinite',function() {
				if(loadingRankSeason) return;
				loadingRankSeason = true;
				pageRankSeason += 1;
				//这里写请求
				loadPartyDeptBySeason(true);
		});
		var loadMoreContent3 = $$(page.container).find('.infinite-scroll.leaderDetailPageYear');
		console.log(loadMoreContent3);
		loadMoreContent3.on('infinite',function() {
				if(loadingRankYear) return;
				loadingRankYear = true;
				pageRankYear += 1;
				//这里写请求
				loadPartyDeptByYear(true);
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