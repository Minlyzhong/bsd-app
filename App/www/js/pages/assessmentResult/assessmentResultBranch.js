define(['app',
	'hbs!js/hbs/assessmentResultBranch',
], function(app,leaderTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	var pageNo1 = 1;
	var loading1 = true;
	/*
	 * 接口
	 */
	//获取年份
	var getYearsPath = app.basePath + '/admin/mobile/partyAm/getYears';
	//根据分类代号查找分类
	var findTypeByCodePath = app.basePath + '/mobile/sign/codes';
	//党委统计表头
	var searchCommitteeTotalPath = app.basePath + 'result/searchCommitteeTotal';
	//领导接口
	var completedStatusPath = app.basePath + 'result/completedStatus';
	/*
	 * 参数
	 */
	var userPoint = 0;
	var userPointBySeason = 0;
	var userPointByYear = 0;
	var queryByDeptName = '';
	//分类代号
	var sortCode = '';
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
	var branchSeasonCount = 1;
	var pageRankSeason = 1;
	var loadingRankSeason = true;
	//年份
	var rankYearStartTime = '';
	var rankYearEndTime = '';
	var branchYearCount = 1;
	var pageRankYear = 1;
	var loadingRankYear = true;
	//查询
	var rankSearchStartTime = '';
	var rankSearchEndTime = '';
	
	var assortmentbranch = '';
	var typeSearch=0;
	var	khplSearch=0;
	
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page);
		app.myApp.initPageInfiniteScroll($('.rankBranchTab'));
		//加载分类
		//开始默认为DZZLX(党组织类型)
		sortCode = 'ZBTYPE';
		findTypeByCode();
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
		typeSearch=0;
		khplSearch=0;
		year = '';
		month = '';
		season = '';
		assortmentbranch = '-1';
		//月份
		rankMonthStartTime = '';
		rankMonthEndTime = '';
		//季度
		rankSeasonStartTime = '';
		rankSeasonEndTime = '';
		pageRankSeason = 1;
		loadingRankSeason = true;
		//年份
		rankYearStartTime = '';
		rankYearEndTime = '';
		pageRankYear = 1;
		loadingRankYear = true;
		//点击事件
		clickEvent(page);
		var user = {
			role: app.roleId
		}
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
	
	/*
	 * 根据分类代号查找分类
	 * param{
		 * 	HKRYFL(人员分类)
		 *	ZBTYPE(支部分类)
		 *	DZZLX(党组织类型)
	 * }
	 */
	function findTypeByCode(){
		console.log(sortCode);
		var result=[];
		var resultId=[];
		var pickerSort;
		app.ajaxLoadPageContent1(findTypeByCodePath,{
			code:sortCode,
		},function(data){
			result = data;
			$$.each(data, function(index, item) {
					result[index] = item.subVal.toString();
					resultId[index] = item.subKey.toString();
			});
			pickerSort = app.myApp.picker({
	    		input: '#picker-sort',
			    rotateEffect: true,
			    formatValue: function (p, values, displayValues) {
			        return displayValues[0];
			    },
			    cols: [
			        {
			            textAlign: 'center',
			            displayValues:(result),
			            values:(resultId)
			        }
			    ]
			});
		});
		$$(".sortTypeChoose").on('click',function(){
			pickerSort.open();
			$$('.picker-3d .close-picker').text('完成');
			$$('.toolbar-inner .right').css('margin-right','20px');	
			$$('.picker-3d .close-picker').on('click',function(){
				//把值赋到参数上
				assortmentbranch = pickerSort.value[0];
			});
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
			if($$('.rankBranchTab').css('display') == 'none'){
				setTimeout(function(){
					searchRank();
				},100);
			}
		});
		//季度
		$$('.rankSelect .buttonShykSeason').on('click',function(){
			if($$('.rankBranchTab').css('display') == 'none'){
				setTimeout(function(){
					searchRank();
				},100);
			}else{
				setTimeout(function(){
					if(branchSeasonCount == 1){
						var str = '';
						str += '<div class="infinite-scroll-preloader">';
						str += '<div class="preloader" style="left:35%;margin-left:0px;margin-top:0px;position:absolute;"></div>';
						str += '<div style="position: absolute;left: 45%;;font-size: 17px;">加载中...</div>';
						str += '</div>';
						$$('.leaderDetailPageSeason .kpi-a-list ul').html(str);
						loadPartyDeptHeadBySeason();
						loadPartyDeptBySeason(false);
						branchSeasonCount += 1;
					}
				},100);
			}
		});
		//年份
		$$('.rankSelect .buttonShykYear').on('click',function(){
			if($$('.rankBranchTab').css('display') == 'none'){
				setTimeout(function(){
					searchRank();
				},100);
			}else{
				setTimeout(function(){
				if(branchYearCount == 1){
						var str = '';
						str += '<div class="infinite-scroll-preloader">';
						str += '<div class="preloader" style="left:35%;margin-left:0px;margin-top:0px;position:absolute;"></div>';
						str += '<div style="position: absolute;left: 45%;;font-size: 17px;">加载中...</div>';
						str += '</div>';
						$$('.leaderDetailPageYear .kpi-a-list ul').html(str);
						loadPartyDeptHeadByYear();
						loadPartyDeptByYear(false);
						branchYearCount += 1;
					}
				},100);
			}
		});
	}
	
	
	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		//点击分类div触发事件
		$$('.assessmentSort').click(assessmentSortSearch);
		//点击取消按钮
		$$('.arbCloseBtn').click(function(){
			$('.assessmentBranchSortBox').slideToggle(200);
			hideSearchList();
		});
		//点击确定按钮
		$$('.arbSearchBtn').click(function(){
			//搜索框隐藏
			$('.assessmentBranchSortBox').slideToggle(200);
			searchRank();
		});
	}
	
	/**
	 * 按党委查询条件
	 **/
	function assessmentSortSearch(){
		showSearchList();
		var sortImg = $$('.sortIcon').attr("src");
		var sortImgUrl = '';
		if(sortImg == 'img/assessmentResultImg/downIcon.png'){
			sortImgUrl = 'img/assessmentResultImg/upIcon.png';
			//弹出搜索框
			$('.assessmentBranchSortBox').slideToggle(200);
		}else{
			sortImgUrl = 'img/assessmentResultImg/downIcon.png';
			//隐藏搜索框
			$('.assessmentBranchSortBox').slideToggle(200);
		}
		$$('.sortIcon').prop("src",sortImgUrl);
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
			typeSearch=2;
			khplSearch=2;
		}else if(seasonClassName){
			rankSearchStartTime = rankSeasonStartTime;
			rankSearchEndTime = rankSeasonEndTime;
			typeSearch=2;
			khplSearch=1;
		}else if(yearClassName){
			rankSearchStartTime = rankYearStartTime;
			rankSearchEndTime = rankYearEndTime;
			typeSearch=2;
			khplSearch=0;
		}
		keyupContent();
	}
	/*
	 * 点击搜索框
	 */
	function showSearchList(){
		$$('.rankBranchTab').css('display','none');
		$$('.kpi-a-listSearchBranch ul').html('');
		pageNo1 = 1;
		loading1 = true;
		queryByDeptName = ''
		$$('.BranchSearchBox').css('display','block');
		$$('.leaderDetailSearchNotFound').css('display','none');
	}
	/*
	 * 点击取消按钮
	 */
	function hideSearchList(){
		$$('.rankBranchTab').css('display','block');
		$$('.kpi-a-listSearchBranch ul').html('');
		pageNo1 = 1;
		loading1 = true;
		queryByDeptName = ''
		$$('#rankDeptSearch').val("");
		$$('.leaderDetailSearchNotFound').css('display','none');
		$$('.BranchSearchBox').css('display','none');
	}
	/*
	 * keyup事件的触发
	 */
	function keyupContent(){
		queryByDeptName = $$('#rankDeptSearch').val();
		console.log(queryByDeptName);
		console.log(khplSearch);
		console.log(typeSearch);
		console.log(rankSearchStartTime);
		console.log(rankSearchEndTime);
//		if(!queryByDeptName){
//			return;
//		}
		loadPartyDeptHeadBySearch();
		loadPartyDept1(false);
	}
	
	//获取领导考核统计表头(月份)
	/* @param type //类型 党委4   支部（2,3）    个人1
	 * @param assortment  // 类型分类
	 * @param khpl  //考核频率1(年份) ，2(季度), 3(月份)
	 * @param startDate  //开始时间
	 * @param endDate  //结束时间
	 */
	function loadPartyDeptHead() {
		app.ajaxLoadPageContent1(searchCommitteeTotalPath, {
			startDate:rankMonthStartTime,
			endDate:rankMonthEndTime,
			type:2,
			assortment:assortmentbranch,
			khpl:2,
			roleId:app.roleId,
			deptId:app.user.deptId,
		}, function(result) {
			console.log(result);
			var data = result;
			handlePartyDeptHead(data);
		});
	}
	//获取领导考核统计表头(季度)
	function loadPartyDeptHeadBySeason() {
		app.ajaxLoadPageContent1(searchCommitteeTotalPath, {
			startDate:rankSeasonStartTime,
			endDate:rankSeasonEndTime,
			type:2,
			assortment:assortmentbranch,
			khpl:1,
			roleId:app.roleId,
			deptId:app.user.deptId,
		}, function(result) {
			console.log(result);
			var data = result;
			handlePartyDeptHeadBySeason(data);
		});
	}
	//获取领导考核统计表头(年度)
	function loadPartyDeptHeadByYear() {
		app.ajaxLoadPageContent1(searchCommitteeTotalPath, {
			startDate:rankYearStartTime,
			endDate:rankYearEndTime,
			type:2,
			assortment:assortmentbranch,
			khpl:0,
			roleId:app.roleId,
			deptId:app.user.deptId,
		}, function(result) {
			console.log(result);
			var data = result;
			handlePartyDeptHeadByYear(data);
		});
	}
	//获取领导考核统计表头(查询)
	function loadPartyDeptHeadBySearch() {
		app.ajaxLoadPageContent1(searchCommitteeTotalPath, {
			startDate:rankYearStartTime,
			endDate:rankYearEndTime,
			type:khplSearch,
			assortment:assortmentbranch,
			khpl:typeSearch,
			roleId:app.roleId,
			deptId:app.user.deptId,
		}, function(result) {
			console.log(result);
			var data = result;
			handlePartyDeptHeadBySearch(data);
		});
	}
	/**
	 * 加载领导考核统计表头(月份)
	 */
	function handlePartyDeptHead(data) {
		$$('.doneBranchNFA').html(data.completedTotal);
		$$('.UDoneBranchNFA').html(data.unCompletedTotal);
	}
	/**
	 * 加载领导考核统计表头(季度)
	 */
	function handlePartyDeptHeadBySeason(data) {
		$$('.doneBranchNFASeason').html(data.completedTotal);
		$$('.UDoneBranchNFASeason').html(data.unCompletedTotal);
	}
	/**
	 * 加载领导考核统计表头(年份)
	 */
	function handlePartyDeptHeadByYear(data) {
		$$('.doneBranchNFAYear').html(data.completedTotal);
		$$('.UDoneBranchNFAYear').html(data.unCompletedTotal);
	}
	/**
	 * 加载领导考核统计表头(查询)
	 */
	function handlePartyDeptHeadBySearch(data) {
		$$('.doneNFABranchSearch').html(data.completedTotal);
		$$('.uDoneNFABranchSearch').html(data.unCompletedTotal);
	}



	//获取领导考核统计(月份)
	/* @param type //类型 党委4   支部（2）    个人1
	 * @param assortment  // 类型分类
	 * @param khpl  //考核频率1(年份) ，2(季度), 3(月份)
	 * @param startDate  //开始时间
	 * @param endDate  //结束时间
	 */
	function loadPartyDept(isLoadMore) {
		console.log(rankMonthStartTime);
		console.log(rankMonthEndTime);
		app.ajaxLoadPageContent1(completedStatusPath, {
			pageNo: pageNo,
			startDate:rankMonthStartTime,
			endDate:rankMonthEndTime,
			khpl:2,
			type:2,
			assortment:assortmentbranch,
			roleId:app.roleId,
			deptId:app.user.deptId,
		}, function(result) {
			console.log(result);
			var data = result.data;
			$$.each(data, function(index, item) {
				item.rank = (pageNo - 1) * 10 + index + 1;	
			});
			if(isLoadMore) {
				pageDataStorage['partyDept'] = pageDataStorage['partyDept'].concat(data);
			} else {
				pageDataStorage['partyDept'] = data;
			}
			handlePartyDept(data, isLoadMore);
		});
	}
	//获取领导考核统计(季度)
	function loadPartyDeptBySeason(isLoadMore) {
		console.log(rankSeasonStartTime);
		console.log(rankSeasonEndTime);
		app.ajaxLoadPageContent1(completedStatusPath, {
			pageNo: pageRankSeason,
			startDate:rankSeasonStartTime,
			endDate:rankSeasonEndTime,
			khpl:1,
			type:2,
			assortment:assortmentbranch,
			roleId:app.roleId,
			deptId:app.user.deptId,
		}, function(result) {
			console.log(result);
			var data = result.data;
			$$.each(data, function(index, item) {
				item.rank = (pageNo - 1) * 10 + index + 1;	
			});
			if(isLoadMore) {
				pageDataStorage['partyDeptSeason'] = pageDataStorage['partyDeptSeason'].concat(data);
			} else {
				pageDataStorage['partyDeptSeason'] = data;
			}
			handlePartyDeptBySeason(data, isLoadMore);
		});
	}
	//获取领导考核统计(年度)
	function loadPartyDeptByYear(isLoadMore) {
		console.log(rankYearStartTime);
		console.log(rankYearEndTime);
		app.ajaxLoadPageContent1(completedStatusPath, {
			pageNo: pageRankYear,
			startDate:rankYearStartTime,
			endDate:rankYearEndTime,
			khpl:0,
			type:2,
			assortment:assortmentbranch,
			roleId:app.roleId,
			deptId:app.user.deptId,
		}, function(result) {
			console.log(result);
			var data = result.data;
			$$.each(data, function(index, item) {
				item.rank = (pageNo - 1) * 10 + index + 1;	
			});
			if(isLoadMore) {
				pageDataStorage['partyDeptYear'] = pageDataStorage['partyDeptYear'].concat(data);
			} else {
				pageDataStorage['partyDeptYear'] = data;
			}
			handlePartyDeptByYear(data, isLoadMore);
		});
	}
	//查询领导考核统计
	function loadPartyDept1(isLoadMore) {
		console.log(rankSearchStartTime);
		console.log(rankSearchEndTime);
		app.ajaxLoadPageContent(completedStatusPath, {
			pageNo: pageNo1,
			query:queryByDeptName,
			startDate:rankSearchStartTime,
			endDate:rankSearchEndTime,
			khpl:khplSearch,
			type:typeSearch,
			assortment:assortmentbranch,
			roleId:app.roleId,
			deptId:app.user.deptId,
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
				var assessResultid = $$(this).data('id');
				//app.myApp.getCurrentView().loadPage('assessList.html?assessid=' + assessid + '&name=' + name + '&point=' + point + '&count=' + count+'&startDate='+rankMonthStartTime+'&endDate='+rankMonthEndTime);
				app.myApp.getCurrentView().loadPage('assessmentResultPCDetail.html?assessResultid='+assessResultid+'&khpl=2&type=2&startDate='+rankMonthStartTime+'&endDate='+rankMonthEndTime);
			});
			if(data.length == 10) {
				loading = false;
			}
		}else{
			if(pageNo==1){
				$$('.leaderDetailPage .kpi-a-list ul').html('');
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
				var assessResultid = $$(this).data('id');
				//app.myApp.getCurrentView().loadPage('assessList.html?assessid=' + assessid + '&name=' + name + '&point=' + point + '&count=' + count+'&startDate='+rankSeasonStartTime+'&endDate='+rankSeasonEndTime);
				app.myApp.getCurrentView().loadPage('assessmentResultPCDetail.html?assessResultid='+assessResultid+'&khpl=1&type=2&startDate='+rankSeasonStartTime+'&endDate='+rankSeasonEndTime);
			});
			if(data.length == 10) {
				loadingRankSeason = false;
			}
		}else{
			if(pageRankSeason==1){
				$$('.leaderDetailPageSeason .kpi-a-list ul').html('');
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
				var assessResultid = $$(this).data('id');
				//app.myApp.getCurrentView().loadPage('assessList.html?assessid=' + assessid + '&name=' + name + '&point=' + point + '&count=' + count+'&startDate='+rankYearStartTime+'&endDate='+rankYearEndTime);
				app.myApp.getCurrentView().loadPage('assessmentResultPCDetail.html?assessResultid='+assessResultid+'&khpl=0&type=2&startDate='+rankYearStartTime+'&endDate='+rankYearEndTime);
			});
			if(data.length == 10) {
				loadingRankYear = false;
			}
		}else{
			if(pageRankYear==1){
				$$('.leaderDetailPageYear .kpi-a-list ul').html('');
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
				$$('.kpi-a-listSearchBranch ul').append(leaderTemplate(data));
			} else {
				$$('.kpi-a-listSearchBranch ul').html(leaderTemplate(data));
			}
			//点击事件
			$$('.kpi-a-listSearchBranch .assessLeaderContent').on('click', function() {
				var assessResultid = $$(this).data('id');
				console.log(khplSearch);
				console.log(typeSearch);
				console.log(rankSearchStartTime);
				console.log(rankSearchEndTime);
				app.myApp.getCurrentView().loadPage('assessmentResultPCDetail.html?assessResultid='+assessResultid+'&khpl='+khplSearch+'&type='+typeSearch+'&startDate='+rankSearchStartTime+'&endDate='+rankSearchEndTime);
			});
			if(data.length == 10) {
				loading1 = false;
			}
		}else{
			if(pageNo1==1){
				$$('.kpi-a-listSearchBranch ul').html('');
			}
		}
	}
	
	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll.leaderDetailPage');
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
		loadMoreContent1.on('infinite',function() {
				if(loading1) return;
				loading1 = true;
				pageNo1 += 1;
				//这里写请求
				loadPartyDept1(true);
		});
		var loadMoreContent2 = $$(page.container).find('.infinite-scroll.leaderDetailPageSeason');
		loadMoreContent2.on('infinite',function() {
			if(queryByDeptName == ''){
				if(loadingRankSeason) return;
				loadingRankSeason = true;
				pageRankSeason += 1;
				//这里写请求
				loadPartyDeptBySeason(true);
			}
		});
		var loadMoreContent3 = $$(page.container).find('.infinite-scroll.leaderDetailPageYear');
		loadMoreContent3.on('infinite',function() {
			if(queryByDeptName == ''){
				if(loadingRankYear) return;
				loadingRankYear = true;
				pageRankYear += 1;
				//这里写请求
				loadPartyDeptByYear(true);
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
		resetFirstIn: resetFirstIn,
	}
});