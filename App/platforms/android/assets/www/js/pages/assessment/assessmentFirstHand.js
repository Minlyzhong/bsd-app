define(['app',
	'hbs!js/hbs/assessmentContent',
	'hbs!js/hbs/assessmentItem',
	'hbs!js/hbs/assessmentPaperFirstHand',
	],
	function(app, contentTemplate, itemTemplate, paperTemplate) {
		var $$ = Dom7;
		var firstIn = 1;
		var pageDataStorage = {};
		var pageNo = 1;
		var loading = true;
		//模糊查找考核清单
		var searchPaperPath = app.basePath + '/mobile/partyAm/aLeaderLoadKnowledgeTopicByYearAndMonth';
		//根据年月查询一把手考核清单
		var loadTopicPath = app.basePath + '/mobile/partyAm/aLeaderLoadKnowledgeTopicByYearAndMonth';
		//考核责任项
		var loadPartyMenuPath = app.basePath + '/mobile/partyAm/leaderLoadTestPaperList';
		//查询一把手考核未完成数量
		var findShykUnReadPath = app.basePath + '/mobile/partyAm/getLeaderTotal';
		//获取三会一课年份
		var getYearsPath = app.basePath + '/mobile/partyAm/getYears';
		
		
		var oldContent = '';
		//月份
		var tpArr = {};
		var notAssess = ['没上报', '已上报'];
		var assessTpId = 0;
		var assessWorkCB = '';
		//季度
		var tpArrSeason = {};
		var notAssessSeason = ['没上报', '已上报'];
		var assessTpIdSeason = 0;
		var assessWorkCBSeason = '';
		//年度
		var tpArrYear = {};
		var notAssessYear = ['没上报', '已上报'];
		var assessTpIdYear = 0;
		var assessWorkCBYear = '';
		
		
		
		var year = '';
		var month = '';
		
		//月份
		var asessmentMonthStartDate = '';
		var asessmentMonthEndDate = '';
		var pageNo = 1;
		var loading = true;
		var asessmentMonthCount = 1;
		//季度
		var asessmentSeasonStartDate = '';
		var asessmentSeasonEndDate = '';
		var pageASeason = 1;
		var loadingASeason = true;
		var asessmentSeasonCount = 1;
		var season='';
		//年度
		var asessmentYearStartDate = '';
		var asessmentYearEndDate = '';
		var asessmentYearStartDate1 = '';
		var asessmentYearEndDate1 = '';
		var pageAYear = 1;
		var loadingAYear = true;
		var asessmentYearCount = 1;
		//查询
		var asessmentSearchStartDate = '';
		var asessmentSearchEndDate = '';
		var pageASearch = 1;
		var loadingASSearch = true;
		var asessmentSearchCount = 1;
		
		var bottomStr = '';

		/**
		 * 页面初始化 
		 * @param {Object} page 页面内容
		 */
		function init(page) {
//			app.pageStorageClear('assessment/assessment', [
//				'assessment/assessWork',
//			]);
//			if(firstIn) {
				console.log(page)
				initData(page.query);
//			} else {
//				loadStorage();
//			}
			app.back2Home();
			//handleAssessmentType();
			//loadKnowledgeTopic(false);
			//pushAndPull(page);
			clickEvent();
			
			ajaxLoadContent();
			//ajaxLoadContentByYear();
		}

		/**
		 * 初始化模块变量
		 */
		function initData(pageData) {
			$$('.assessmenTitle').html(pageData.appName);
			firstIn = 0;
			pageDataStorage = {};
			//月份
			asessmentMonthStartDate = '';
			asessmentMonthStartDate = '';
			pageNo = 1;
			loading = true;
			asessmentMonthCount = 1;
			//季度
			asessmentSeasonStartDate = '';
			asessmentSeasonEndDate = '';
			pageASeason = 1;
			loadingASeason = true;
			asessmentSeasonCount = 1;
			season = '';
			//年度
			asessmentYearStartDate = '';
			asessmentYearEndDate = '';
			asessmentYearStartDate1 = '';
			asessmentYearEndDate1 = '';
			pageAYear = 1;
			loadingAYear = true;
			asessmentYearCount = 1;
			//查询
			asessmentSearchStartDate = '';
			asessmentSearchEndDate = '';
			pageASearch = 1;
			loadingASSearch = true;
			asessmentSearchCount = 1;
			//全局参数
			year = '';
			month = '';
			oldContent = '';		
			//月份
			tpArr = {};
			assessTpId = 0;
			assessWorkCB = '';
			// notAssess = JSON.parse(pageData.notAssess);
			// console.log('123---'+notAssess);
			//季度
			tpArrSeason = {};
			assessTpIdSeason = 0;
			assessWorkCBSeason = '';
			// notAssessSeason = JSON.parse(pageData.notAssess);
			//年度
			tpArrYear = {};
			assessTpIdYear = 0;
			assessWorkCBYear = '';
			// notAssessYear = JSON.parse(pageData.notAssess);
			
			bottomStr += '<div style="color:#9E9E9E;font-size:20px;text-align:center;">--&nbsp;已经到底啦！--</div>'
		
		}

		/**
		 * 读取缓存数据 
		 */
		function loadStorage() {
			//arguments[0]获取其传回来的第一个参数
			if(arguments[0] >= 0) {
				console.log(pageDataStorage)
				loadTopic(pageDataStorage['tpId']);
				$$($$('.assesserLeftList .item-inner')[arguments[0]]).click();
				loadTopicBySeason(pageDataStorage['tpIdSeason']);
				$$($$('.assesserLeftListSeason .item-inner')[arguments[0]]).click();
				loadTopicByYear(pageDataStorage['tpIdYear']);
				$$($$('.assesserLeftListYear .item-inner')[arguments[0]]).click();
			} else {
				$$('.assesserLeftList ul').html(itemTemplate(pageDataStorage['left']));
				loadEvent(pageDataStorage['left']);
				$$('.assesserLeftListSeason ul').html(itemTemplate(pageDataStorage['leftSeason']));
				loadEventBySeason(pageDataStorage['leftSeason']);
				$$('.assesserLeftListYear ul').html(itemTemplate(pageDataStorage['leftYear']));
				loadEventByYear(pageDataStorage['leftYear ']);
			}
		}

				/**
	 * 查询3+x未读的日志数量
	 */
	function findShykReadRows(data) {
		var myDate = new Date();
		
		var month = myDate.getMonth()+1<10? "0"+(myDate.getMonth()+1):myDate.getMonth()+1;
		startDate = myDate.getFullYear()+'-'+ month +'-01';
		endDate =myDate.getFullYear()+'-'+ month+'-31';

		app.ajaxLoadPageContent(findShykUnReadPath, {
			khpl:data,
			startDate:startDate,
			endDate:endDate,
			
		}, function(result) {
			if(result.data == null){
				
			}
			shykReadRows = result.data;
		},{
			async: false
		});
	}

		/**
		 * 点击事件
		 */
		function clickEvent() {

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
				$$.each(result, function(index, item) {
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
			asessmentMonthStartDate = year+'-'+month+'-01';
			asessmentMonthEndDate = year+'-'+month+'-31';
			$$(".assessmentTime").on('click',function(){
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
					$$('.shykNotFound').css('display','none');
					year = pickerDescribe.value[0].substring(0,pickerDescribe.value[0].length-1);
					month = pickerDescribe.value[1].substring(0,pickerDescribe.value[1].length-1);
					$("#picker-describe").val(year+'年 '+ month+'月');
					pageNo = 1;
					loading = true;
					asessmentMonthStartDate = year+'-'+month+'-01';
					asessmentMonthEndDate = year+'-'+month+'-31';
					$$('.assesserRightList ul').html('');
					ajaxLoadContent();
				});
			});
			
			
			//季度时间判断
			if(month<=3){
				$("#picker-describeSeason").val(year+'年 '+ '第一季度');
				asessmentSeasonStartDate = year+'-01-01';
				asessmentSeasonEndDate = year+'-03-31';
			}else if(month>3 && month<=6){
				$("#picker-describeSeason").val(year+'年 '+ '第二季度');
				asessmentSeasonStartDate = year+'-04-01';
				asessmentSeasonEndDate = year+'-06-31';
			}else if(month>6 && month<=9){
				$("#picker-describeSeason").val(year+'年 '+ '第三季度');
				asessmentSeasonStartDate = year+'-07-01';
				asessmentSeasonEndDate = year+'-09-31';
			}else if(month>9 && month<=12){
				$("#picker-describeSeason").val(year+'年 '+ '第四季度');
				asessmentSeasonStartDate = year+'-10-01';
				asessmentSeasonEndDate = year+'-12-31';
			}
			$$(".assessmentTimeSeason").on('click',function(){
				pickerDescribeSeason.open();
				$$('.picker-3d .close-picker').text('完成');
				$$('.toolbar-inner .right').css('margin-right','20px');	
				$$('.picker-3d .close-picker').on('click',function(){
					year = pickerDescribeSeason.value[0].substring(0,pickerDescribeSeason.value[0].length-1);
					season = pickerDescribeSeason.value[1].substring(0,pickerDescribeSeason.value[1].length);
					if(season == '第一季度'){
						asessmentSeasonStartDate = year+'-01-01';
						asessmentSeasonEndDate = year+'-03-31';
					}else if(season == '第二季度'){
						asessmentSeasonStartDate = year+'-04-01';
						asessmentSeasonEndDate = year+'-06-31';
					}else if(season == '第三季度'){
						asessmentSeasonStartDate = year+'-07-01';
						asessmentSeasonEndDate = year+'-09-31';
					}else if(season == '第四季度'){
						asessmentSeasonStartDate = year+'-10-01';
						asessmentSeasonEndDate = year+'-12-31';
					}
					$("#picker-describeSeason").val(year+'年 '+ season);
					pageASeason = 1;
					loadingASeason = true;
					$$('.assesserRightListSeason ul').html('');
					ajaxLoadContentBySeason();
				});
			});
			
			
			//年份时间判断
			$("#picker-describeYear").val(year+'年 ');
			asessmentYearStartDate1= year+'-01-01';
			asessmentYearEndDate1= year+'-12-31';
			asessmentYearStartDate = year +'-01-01';
			asessmentYearEndDate = year +'-12-31';
			$$(".assessmentTimeYear").on('click',function(){
				pickerDescribeYear.open();
				$$('.picker-3d .close-picker').text('完成');
				$$('.toolbar-inner .right').css('margin-right','20px');	
				$$('.picker-3d .close-picker').on('click',function(){
					year = pickerDescribeYear.value[0].substring(0,pickerDescribeYear.value[0].length-1);
					asessmentYearStartDate1= year+'-01-01';
					asessmentYearEndDate1= year+'-12-31';
					asessmentYearStartDate = year+'-01-01';
					asessmentYearEndDate = year+'-12-31';
					$("#picker-describeYear").val(year+'年 ');
					pageAYear = 1;
					loadingAYear = true;
					$$('.assesserRightListYear ul').html('');
					ajaxLoadContentByYear();
				});
			});
			
			
			
			//点击查询框
			$$('#assessSearch').on('focus', function() {
				//$$('.assessmentSearch').css('display','block');
				$$('.assessmentTab').css('display','none');
				$$(this).css('text-align', 'left');
				$$('.assessSearchBar .searchCancelBtn').css('display', 'block');
				$$('.assesserSearchList').css('display', 'block');
			});
			//取消按钮
			$$('.searchCancelBtn').on('click',cancelAssessmentSearch);
			//$$('.assessmentSearch .assessmentSearchClose').on('click',cancelAssessmentSearch);
			//搜索按钮
			$$('#assessSearch').on('keyup', searchAssessment1);
			//$$('.assessmentSearch .searchBtn').on('click',keyupAssessment);
			//清空按钮
//			$$('.assessmentSearch .resetBtn').on('click',function(){
//				oldContent = '';
//				$$('#assessmentContext').val('');
//			});

			// $$('.assessFirstSearchClear').on('click', function() {
			// 	console.log('search')
			// 	oldContent = '';
			// 	$$(this).css('opacity', '0');
			// 	$$('.assesserSearchList ul').html("");
			// 	$$('#assessSearch').val("");
			// });
			//点击tab标签
			//月份
			$$('.buttonShyk').on('click',function(){
				if($$('.assessmentTab').css('display') == 'none'){
					setTimeout(function(){
						searchAssessment1();
					},100);
				}
			});
			//季度
			$$('.buttonShykSeason').on('click',function(){
				if($$('.assessmentTab').css('display') == 'none'){
					setTimeout(function(){
						searchAssessment1();
					},100);
				}else{
					if(asessmentSeasonCount == 1){
						ajaxLoadContentBySeason();
						asessmentSeasonCount += 1;
					}
				}
			});
			//年份
			$$('.buttonShykYear').on('click',function(){
				if($$('.assessmentTab').css('display') == 'none'){
					setTimeout(function(){
						searchAssessment1();
					},100);
				}else{
					if(asessmentYearCount == 1){
						ajaxLoadContentByYear();
						asessmentYearCount += 1;
					}
				}
			});
			//点击时间图标
			$$('.icon-history').on('click',function(){
				app.myApp.getCurrentView().loadPage('assessmentFirstHandResultPaperDetail .html');
			});
		}
		
		//搜索条件
		function searchAssessment1(){
			var monthClassName = $('#tab1').hasClass('active');
			var seasonClassName = $('#tab2').hasClass('active');
			var yearClassName = $('#tab3').hasClass('active');
			console.log(monthClassName);
			console.log(seasonClassName);
			console.log(yearClassName);
			if(monthClassName){
				asessmentSearchStartDate = asessmentMonthStartDate;
				asessmentSearchEndDate = asessmentMonthEndDate;
				keyupAssessment();
			}else if(seasonClassName){
				asessmentSearchStartDate = asessmentSeasonStartDate;
				asessmentSearchEndDate = asessmentSeasonEndDate;
				keyupAssessment();
			}else if(yearClassName){
				asessmentSearchStartDate = year;
				keyupAssessmentByYear();
			}
			
		}
		

		function keyupAssessment(){
			var searchContent = $$('#assessSearch').val();
			
			//var searchContent = $$('#assessmentContext').val();
			if(!searchContent) {
				oldContent = '';
				$$('.assessFirstSearchClear').css('opacity', '0');
				$$('.assesserSearchList ul').html("");
			} else {
				$$('.assessFirstSearchClear').css('opacity', '1');
			}
			
			searchPaper(searchContent);
		}
		function keyupAssessmentByYear(){
			var searchContent = $$('#assessSearch').val();
			
			//var searchContent = $$('#assessmentContext').val();
			if(!searchContent) {
				oldContent = '';
				$$('.assessFirstSearchClear').css('opacity', '0');
				$$('.assesserSearchList ul').html("");
			} else {
				$$('.assessFirstSearchClear').css('opacity', '1');
			}
			
			searchPaperByYear(searchContent);
		}
	
		function cancelAssessmentSearch(){
			$$('.assessmentTab').css('display','block');
			oldContent = '';
			$$('#assessSearch').val("");
			$$('.assessmentSearch').css('display','none');
			
			$$('#assessmentContext').val("");
			$$('.assessSearchBar #assessSearch').css('text-align', 'center');
			//$$(this).css('display', 'none');
			$$('.assessSearchBar .searchCancelBtn').css('display','none');
			$$('.assesserSearchList ul').html("");
			$$('.assesserSearchList').css('display', 'none');
			$$('.assessFirstSearchClear').css('opacity', '0');
			$$('.assessNotFound').css('display', 'none');
		}

		/**
		 * 异步请求页面数据 (月份)
		 * khpl考核频率类型 年 0 ， 季 1，月 2
		 */
		function ajaxLoadContent() {
			app.ajaxLoadPageContent(loadPartyMenuPath, {
				deptId: app.user.deptId,
				// type:1,
				startDate:asessmentMonthStartDate,
				endDate:asessmentMonthEndDate,
				// userId:app.userId,
				khpl:2,
			}, function(result) {
				if(result.data == null){
					$$('.assesserRightList ul').html('<div class="noresult">没有需要考核的内容</div>');
				}else{
					var data = result.data;
					console.log('loadPartyMenuPath');
					console.log(data);
					pageDataStorage['left'] = data;
					$$('.assesserLeftList ul').html(itemTemplate(data));
					if(notAssess.length) {
						$$.each($$('.assesserLeftList .item-inner'), function(index, item1) {
							$$.each(notAssess, function(index, item2) {
								if($$(item1).data('tpid') == item2.knowledgePaperId) {
									if(item2.totalNum) {
										$$(item1).prepend('<span class="appBadge bg-red assessBadge" style="font-size: 13px;right: 0;top: 0;text-align: center;">' + item2.totalNum + '</span>');
									}
								}
							});
						});
					}
					setTimeout(function(){
						console.log('loadEvent')
						loadEvent(data);
					},100)
				}
				
				
			});
		}
		/**
		 * 异步请求页面数据(季度)
		 */
		function ajaxLoadContentBySeason() {
			app.ajaxLoadPageContent(loadPartyMenuPath, {
				// deptId: app.user.deptId,
				// type:1,
				startDate:asessmentSeasonStartDate,
				endDate:asessmentSeasonEndDate,
				// userId:app.userId,
				khpl:1,
			}, function(result) {
				if(result.data == null){
					$$('.assesserRightListSeason ul').html('<div class="noresult">没有需要考核的内容</div>');
				}else{
					var data = result.data;
					console.log(data);
					pageDataStorage['leftSeason'] = data;
					$$('.assesserLeftListSeason ul').html(itemTemplate(data));
					if(notAssessSeason.length) {
						$$.each($$('.assesserLeftListSeason .item-inner'), function(index, item1) {
							$$.each(notAssessSeason, function(index, item2) {
								if($$(item1).data('tpid') == item2.knowledgePaperId) {
									if(item2.totalNum) {
										$$(item1).prepend('<span class="appBadge bg-red assessBadgeSeason" style="font-size: 13px;right: 0;top: 0;text-align: center;">' + item2.totalNum + '</span>');
									}
								}
							});
						});
					}
					setTimeout(function(){
						loadEventBySeason(data);
					},100);
				}
				
			});
			
		}
		/**
		 * 异步请求页面数据('年份')
		 */
		function ajaxLoadContentByYear() {
			app.ajaxLoadPageContent(loadPartyMenuPath, {
				// deptId: app.user.deptId,
				// type:0,
				startDate:asessmentYearStartDate,
				endDate:asessmentYearEndDate,
				// year:asessmentYearStartDate,
				// userId:app.userId,
				khpl:0,
			}, function(result) {
				if(result.data == null){
					$$('.assesserRightListYear ul').html('<div class="noresult">没有需要考核的内容</div>');
				}else{
					$$('.assesserRightListYear ul').html('');
					var data = result.data;
					console.log(data);
					pageDataStorage['leftYear'] = data;
					$$('.assesserLeftListYear ul').html(itemTemplate(data));
					if(notAssessYear.length) {
						$$.each($$('.assesserLeftListYear .item-inner'), function(index, item1) {
							$$.each(notAssessYear, function(index, item2) {
								if($$(item1).data('tpid') == item2.knowledgePaperId) {
									if(item2.totalNum) {
										$$(item1).prepend('<span class="appBadge bg-red assessBadgeYear" style="font-size: 13px;right: 0;top: 0;text-align: center;">' + item2.totalNum + '</span>');
									}
								}
							});
						});
					}

					setTimeout(function(){
						console.log('1----')
						loadEventByYear(data);
					},100);
				}
				
				
			});
			
		}

		/**
		 * 动态加载事件(月份)
		 * @param {Object} data 请求的数据
		 */
		function loadEvent(data) {
			$$('.assesserLeftList .item-inner').on('click', function() {
				assessTpId = $$(this).data('tpid');
				pageDataStorage['index'] = $$(this).parent().index();
				$$('.assesserLeftList .item-inner').css('background', 'whitesmoke');
				$$('.assesserLeftList .item-inner').children().css('color', 'gray');
				$$(this).css('background', 'white');
				$$(this).children().css('color', '#ed4c3c');

				var tpId = $$(this).data('tpId');
				pageDataStorage['tpId'] = tpId;
				if(tpId && !tpArr[tpId]) {

					loadTopic(tpId);
				} else {
					handleTopic(tpId);
				}
			});
			$$($$('.assesserLeftList .item-inner')[0]).click();
		}
		/**
		 * 动态加载事件(季度)
		 * @param {Object} data 请求的数据
		 */
		function loadEventBySeason(data) {
			$$('.assesserLeftListSeason .item-inner').on('click', function() {
				assessTpIdSeason = $$(this).data('tpid');
				pageDataStorage['indexSeason'] = $$(this).parent().index();
				$$('.assesserLeftListSeason .item-inner').css('background', 'whitesmoke');
				$$('.assesserLeftListSeason .item-inner').children().css('color', 'gray');
				$$(this).css('background', 'white');
				$$(this).children().css('color', '#ed4c3c');

				var tpIdSeason = $$(this).data('tpId');
				pageDataStorage['tpIdSeason'] = tpIdSeason;
				if(tpIdSeason && !tpArrSeason[tpIdSeason]) {
					loadTopicBySeason(tpIdSeason);
				} else {
					handleTopicBySeason(tpIdSeason);
				}
			});
			$$($$('.assesserLeftListSeason .item-inner')[0]).click();
		}
		/**
		 * 动态加载事件(年度)
		 * @param {Object} data 请求的数据
		 */
		function loadEventByYear(data) {
			$$('.assesserLeftListYear .item-inner').on('click', function() {
				assessTpIdYear = $$(this).data('tpid');
				pageDataStorage['indexYear'] = $$(this).parent().index();
				$$('.assesserLeftListYear .item-inner').css('background', 'whitesmoke');
				$$('.assesserLeftListYear .item-inner').children().css('color', 'gray');
				$$(this).css('background', 'white');
				$$(this).children().css('color', '#ed4c3c');

				var tpIdYear = $$(this).data('tpId');
				pageDataStorage['tpIdYear'] = tpIdYear;
				
				console.log(tpIdYear)
				// 清单内容tpArrYear[tpIdYear]
				console.log(tpArrYear[tpIdYear])
				console.log(tpIdYear && !tpArrYear[tpIdYear])
				if(tpIdYear && !tpArrYear[tpIdYear]) {
					console.log('1')
					loadTopicByYear(tpIdYear);
				} else {
					console.log('2')
					handleTopicByYear(tpIdYear);
				}
			});
			$$($$('.assesserLeftListYear .item-inner')[0]).click();
		}

		/**
		 * 加载考核清单(月份)
		 * @param {Object} tpId 考核项ID
		 */
		function loadTopic(tpId) {
			console.log(asessmentMonthStartDate);
			console.log(asessmentMonthEndDate);
			app.ajaxLoadPageContent(loadTopicPath, {
				// deptId:app.user.deptId,
				tpId: tpId,
				// userId: app.userId,
				
				startDate:asessmentMonthStartDate,
				endDate:asessmentMonthEndDate,
				khpl:2,
			}, function(result) {
				var data = result.data;
				console.log(data);
				tpArr[tpId] = data;
				handleTopic(tpId);
				findShykReadRows(2)
			});
		}
		/**
		 * 加载考核清单(季度)
		 * @param {Object} tpId 考核项ID
		 */
		function loadTopicBySeason(tpIdSeason) {
			console.log(asessmentSeasonStartDate);
			console.log(asessmentSeasonEndDate);
			app.ajaxLoadPageContent(loadTopicPath, {
				// deptId:app.user.deptId,
				tpId: tpIdSeason,
				// userId: app.userId,
				
				startDate:asessmentSeasonStartDate,
				endDate:asessmentSeasonEndDate,
				khpl:1,
			}, function(result) {
				var data = result.data;
				console.log(data);
				tpArrSeason[tpIdSeason] = data;
				handleTopicBySeason(tpIdSeason);
				findShykReadRows(1)
			});
		}
		/**
		 * 加载考核清单(年度)
		 * @param {Object} tpId 考核项ID
		 */
		function loadTopicByYear(tpIdYear) {
			console.log(asessmentYearStartDate);
			app.ajaxLoadPageContent(loadTopicPath, {
				// deptId:app.user.deptId,
				tpId: tpIdYear,
				// userId: app.userId,
				startDate:asessmentYearStartDate,
				endDate:asessmentYearEndDate,
				khpl:0,
			}, function(result) {
				var data = result.data;
				console.log(data);
				tpArrYear[tpIdYear] = data;
				console.log(tpArrYear[tpIdYear]);
				console.log(tpArrYear);
				handleTopicByYear(tpIdYear);
				findShykReadRows(0)
			});
		}

		function addCallback() {
			loadStorage(pageDataStorage['index']);
			if(notAssess.length) {
				$$.each(notAssess, function(index, item2) {
					if(item2.knowledgePaperId == parseInt(assessTpId)) {
						item2.totalNum = item2.totalNum - 1;
					}
				});
				// $$('.assessBadge').remove();
				// $$.each($$('.assesserLeftList .item-inner'), function(index, item1) {
				// 	$$.each(notAssess, function(index, item2) {
				// 		if($$(item1).data('tpid') == item2.knowledgePaperId) {
				// 			if(item2.totalNum) {
				// 				$$(item1).prepend('<span class="appBadge bg-red assessBadge" style="font-size: 13px;right: 0;top: 0;text-align: center;">' + item2.totalNum + '</span>');
				// 			}
				// 		}
				// 	});
				// });
				require(['js/pages/appList/appList'], function(appList) {
					appList.minusAssessFirstNum(parseInt(assessTpId));
				});
			}
			tpArr = {};
			tpArrSeason = {};
			tpArrYear = {};
			ajaxLoadContent();
			ajaxLoadContentBySeason();
			ajaxLoadContentByYear();
			

		}

		/**
		 * 把考核清单写入页面 (月份)
		 * @param {Object} tpId 考核项ID
		 */
		function handleTopic(tpId) {
			var topicContent = tpArr[tpId];
			$$('.assesserRightList ul').html(paperTemplate(topicContent));
			
			//点击事件
			$$('.assesserRightList .item-content').on('click', function() {
				var id = $$(this).data('id');
				var title = $$(this).find('.kpi-title').html() || '无标题';
				var score = $$(this).data("score") || 0;
				var target = $$(this).data('target') || '无';
				var minus = $$(this).data('minus') || 0;
				var memo = $$(this).data('memo') || '无';
				console.log('assessWorkFirstHand.html');
				app.myApp.getCurrentView().loadPage('assessWorkFirstHand.html?assessId=' + id + '&title=' + title + '&score=' + score + '&target=' + target + '&minus=' + minus +'&memo='+ memo+'&StartDate='+asessmentMonthStartDate);
			});
			
			//点击分数的时候
			$$('.assessmentScore').on('click',function(){
				//跳转到详细页面
				var id = $$(this).data('id');
				app.myApp.getCurrentView().loadPage('assessmentResultPaperDetail.html?deptId='+app.user.deptId+'&topicId='+id+'&startDate='+asessmentMonthStartDate+'endDate='+asessmentMonthEndDate);
			});
		}
		/**
		 * 把考核清单写入页面 (季度)
		 * @param {Object} tpId 考核项ID
		 */
		function handleTopicBySeason(tpIdSeason) {
			var topicContentSeason = tpArrSeason[tpIdSeason];
			$$('.assesserRightListSeason ul').html(paperTemplate(topicContentSeason));
			
			//点击事件
			$$('.assesserRightListSeason .item-content').on('click', function() {
				var id = $$(this).data('id');
				var title = $$(this).find('.kpi-title').html() || '无标题';
				var score = $$(this).data("score") || 0;
				var target = $$(this).data('target') || '无';
				var minus = $$(this).data('minus') || 0;
				var memo = $$(this).data('memo') || '无';
				app.myApp.getCurrentView().loadPage('assessWorkFirstHand.html?assessId=' + id + '&title=' + title + '&score=' + score + '&target=' + target + '&minus=' + minus +'&memo='+ memo+'&StartDate='+asessmentMonthStartDate);
			});
			
			//点击分数的时候
			$$('.assessmentScore').on('click',function(){
				//跳转到详细页面
				var id = $$(this).data('id');
				app.myApp.getCurrentView().loadPage('assessmentResultPaperDetail.html?deptId='+app.user.deptId+'&topicId='+id+'&startDate='+asessmentSeasonStartDate+'endDate='+asessmentSeasonEndDate);
			});
		}
		/**
		 * 把考核清单写入页面 (年度)
		 * @param {Object} tpId 考核项ID
		 */
		function handleTopicByYear(tpIdYear) {
			console.log('1111');
			console.log(tpIdYear);
			console.log(tpArrYear);
			var topicContentYear = tpArrYear[tpIdYear];
			console.log(topicContentYear);
			console.log($$('.assesserRightListYear ul'));
			$$('.assesserRightListYear ul').html(paperTemplate(topicContentYear));
			
			//点击事件
			$$('.assesserRightListYear .item-content').on('click', function() {
				var id = $$(this).data('id');
				var title = $$(this).find('.kpi-title').html() || '无标题';
				var score = $$(this).data("score") || 0;
				var target = $$(this).data('target') || '无';
				var minus = $$(this).data('minus') || 0;
				var memo = $$(this).data('memo') || '无';
				app.myApp.getCurrentView().loadPage('assessWorkFirstHand.html?assessId=' + id + '&title=' + title + '&score=' + score + '&target=' + target + '&minus=' + minus +'&memo='+ memo+'&StartDate='+asessmentMonthStartDate);
			});
			
			//点击分数的时候
			$$('.assessmentScore').on('click',function(){
				//跳转到详细页面
				var id = $$(this).data('id');
				app.myApp.getCurrentView().loadPage('assessmentResultPaperDetail.html?deptId='+app.user.deptId+'&topicId='+id+'&startDate='+asessmentYearStartDate1+'endDate='+asessmentYearEndDate1);
			});
		}

		//查找考核清单
		function searchPaper(content) {
			content = content.trim();
			if(content != oldContent) {
				oldContent = content;
			} else {
				return;
			}
			$$('.assessNotFound').css('display', 'none');
			if(!content) {
				return;
			}
			console.log(asessmentSearchStartDate);
			console.log(asessmentSearchEndDate);
			//type考核对象类型0、党委 1、支部 2、个人
			app.ajaxLoadPageContent(searchPaperPath, {
				// deptId: app.user.deptId,
				query: content,
				// type:1,
				khpl:2,
				startDate:asessmentSearchStartDate,
				endDate:asessmentSearchEndDate,
			}, function(data) {
				console.log(data);
				if(data.data && data.data.length > 0) {
					$$('.assesserSearchList ul').html(contentTemplate(data.data));
					$$('.assesserSearchList .item-content').on('click', function() {
						var id = $$(this).data('id');
						var title = $$(this).find('.kpi-title').html();
						var score = $$(this).data("score");
						var target = $$(this).data('target');
						var minus = $$(this).data('minus');
						var memo = $$(this).data('memo');
						app.myApp.getCurrentView().loadPage('assessWorkFirstHand.html?assessId=' + id + '&title=' + title + '&score=' + score + '&target=' + target + '&minus=' + minus +'&memo=' + memo+'&StartDate='+asessmentSearchStartDate);
					});
					
					//点击分数的时候
					$$('.assessmentScoreSearch').on('click',function(){
						//跳转到详细页面
						var id = $$(this).data('id');
						app.myApp.getCurrentView().loadPage('assessmentResultPaperDetail.html?deptId='+app.user.deptId+'&topicId='+id+'&startDate='+asessmentSearchStartDate+'endDate='+asessmentSearchEndDate);
					});
				} else {
					$$('.assesserSearchList ul').html("");
					$$('.assessNotFound').css('display', 'block');
				}
			});
		}
		//查找考核清单
		function searchPaperByYear(content) {
			content = content.trim();
			console.log(content);
			if(content != oldContent) {
				oldContent = content;
			} else {
				return;
			}
			$$('.assessNotFound').css('display', 'none');
			if(!content) {
				return;
			}
			console.log(asessmentYearStartDate);
			app.ajaxLoadPageContent(searchPaperPath, {
				deptId: app.user.deptId,
				query: content,
				// type:0,
				startDate:asessmentYearStartDate,
				endDate:asessmentYearEndDate
			}, function(data) {
				console.log(data);
				if(data.data && data.data.length > 0) {
					$$('.assesserSearchList ul').html(contentTemplate(data.data));
					$$('.assesserSearchList .item-content').on('click', function() {
						var id = $$(this).data('id');
						var title = $$(this).find('.kpi-title').html();
						var score = $$(this).data("score");
						var target = $$(this).data('target');
						var minus = $$(this).data('minus');
						var memo = $$(this).data('memo');
						app.myApp.getCurrentView().loadPage('assessWorkFirstHand.html?assessId=' + id + '&title=' + title + '&score=' + score + '&target=' + target + '&minus=' + minus +'&memo=' + memo);
					});
					
					//点击分数的时候
					$$('.assessmentScoreSearch').on('click',function(){
						//跳转到详细页面
						var id = $$(this).data('id');
						app.myApp.getCurrentView().loadPage('assessmentResultPaperDetail.html?deptId='+app.user.deptId+'&topicId='+id+'&startDate='+asessmentYearStartDate1+'endDate='+asessmentYearEndDate1);
					});
				} else {
					$$('.assesserSearchList ul').html("");
					$$('.assessNotFound').css('display', 'block');
				}
			});
		}
		
	/**
	 * 上下拉操作 
	 */
//	function pushAndPull(page) {
//		//下拉刷新	
//		var ptrContent = $$(page.container).find('.pull-to-refresh-content');
//		ptrContent.on('refresh', function(e) {
//			setTimeout(function() {
//				pageNo = 1;
//				loading = true;
//				//这里写请求
//				loadKnowledgeTopic(false);
//				app.myApp.pullToRefreshDone();
//			}, 500);
//		});	
//
//		//滚动加载
//		var loadMoreContent = $$(page.container).find('.infinite-scroll');
//		loadMoreContent.on('infinite', function() {
//			if(loading) return;
//			loading = true;
//			pageNo += 1;
//			loadKnowledgeTopic(true);
//		});
//	}
//		
/*
		 * 刷新
		 */
		function refreshThreeMeetingsAndOneClassPaper(){
			pageNo = 1;
			loading = true;
			loadKnowledgeTopic(false);
			pageSeason = 1
			loadingSeason = true;
			loadShykBySeason(false);
			pageYear = 1;
			loadingYear = true;
			loadShykByYear(false);
			pageNo1 = 1;
			loading1 = true;
			searchPaper(searchContent,false);
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
			addCallback: addCallback,
		}
	});