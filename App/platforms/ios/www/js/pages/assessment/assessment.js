define(['app',
		'hbs!js/hbs/assessmentContent',
		'hbs!js/hbs/assessmentItem',
		'hbs!js/hbs/assessmentPaper',
	],
	function(app, contentTemplate, itemTemplate, paperTemplate) {
		var $$ = Dom7;
		var firstIn = 1;
		var pageDataStorage = {};
		var pageNo = 1;
		var loading = true;
		//考核责任项
		var loadPartyMenuPath = app.basePath + 'knowledgeTestpaper/loadTestPaper';
		//查找考核清单
		var searchPaperPath = app.basePath + 'knowledgeTestpaper/searchAssessmentPaper';
		//加载考核清单
		var loadTopicPath = app.basePath + 'knowledgeTestpaper/loadTopic';
		//获取三会一课年份
		var getYearsPath = app.basePath + 'knowledgeTopic/getYears';
		//根据年月查询考核清单
		//var loadKnowledgeTopicByYearAndMonthPath = app.basePath + 'knowledgeTopic/loadKnowledgeTopicByYearAndMonth';
		
		
		var oldContent = '';
		//月份
		var tpArr = {};
		var notAssess = [];
		var assessTpId = 0;
		var assessWorkCB = '';
		//季度
		var tpArrSeason = {};
		var notAssessSeason = [];
		var assessTpIdSeason = 0;
		var assessWorkCBSeason = '';
		//年度
		var tpArrYear = {};
		var notAssessYear = [];
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
		var pageAYear = 1;
		var loadingAYear = true;
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
				initData(page.query);
//			} else {
//				loadStorage();
//			}
			app.back2Home();
			//handleAssessmentType();
			//loadKnowledgeTopic(false);
			//pushAndPull(page);
			clickEvent();
			
			//ajaxLoadContent();
			ajaxLoadContentByYear();
		}

		/**
		 * 初始化模块变量
		 */
		function initData(pageData) {
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
			pageAYear = 1;
			loadingAYear = true;
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
			notAssess = JSON.parse(pageData.notAssess);
			//季度
			tpArrSeason = {};
			assessTpIdSeason = 0;
			assessWorkCBSeason = '';
			notAssessSeason = JSON.parse(pageData.notAssess);
			//年度
			tpArrYear = {};
			assessTpIdYear = 0;
			assessWorkCBYear = '';
			notAssessYear = JSON.parse(pageData.notAssess);
			
			bottomStr += '<div style="color:#9E9E9E;font-size:20px;text-align:center;">--&nbsp;已经到底啦！--</div>'
		
		}

		/**
		 * 读取缓存数据 
		 */
		function loadStorage() {
			//arguments[0]获取其传回来的第一个参数
			if(arguments[0] >= 0) {
				loadTopic(pageDataStorage['tpId']);
				$$($$('.assesserLeftList .item-inner')[arguments[0]]).click();
			} else {
				$$('.assesserLeftList ul').html(itemTemplate(pageDataStorage['left']));
				loadEvent(pageDataStorage['left']);
			}
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
			var myDate = new Date();
			year = myDate.getFullYear();
			month = myDate.getMonth()+1;
			//月份时间判断
			$("#picker-describe").val(year+'年 '+ month+'月');
			asessmentMonthStartDate = year+'-'+month+'-1';
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
					asessmentMonthStartDate = year+'-'+month+'-1';
					asessmentMonthEndDate = year+'-'+month+'-31';
					$$('.assesserRightList ul').html('');
					ajaxLoadContent();
				});
			});
			
			
			//季度时间判断
			if(month<=3){
				$("#picker-describeSeason").val(year+'年 '+ '第一季度');
				asessmentSeasonStartDate = year+'-1-1';
				asessmentSeasonEndDate = year+'-3-31';
			}else if(month>3 && month<=6){
				$("#picker-describeSeason").val(year+'年 '+ '第二季度');
				asessmentSeasonStartDate = year+'-4-1';
				asessmentSeasonEndDate = year+'-6-31';
			}else if(month>6 && month<=9){
				$("#picker-describeSeason").val(year+'年 '+ '第三季度');
				asessmentSeasonStartDate = year+'-7-1';
				asessmentSeasonEndDate = year+'-9-31';
			}else if(month>9 && month<=12){
				$("#picker-describeSeason").val(year+'年 '+ '第四季度');
				asessmentSeasonStartDate = year+'-10-1';
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
						asessmentSeasonStartDate = year+'-1-1';
						asessmentSeasonEndDate = year+'-3-31';
					}else if(season == '第二季度'){
						asessmentSeasonStartDate = year+'-4-1';
						asessmentSeasonEndDate = year+'-6-31';
					}else if(season == '第三季度'){
						asessmentSeasonStartDate = year+'-7-1';
						asessmentSeasonEndDate = year+'-9-31';
					}else if(season == '第四季度'){
						asessmentSeasonStartDate = year+'-10-1';
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
//			asessmentYearStartDate= year+'-1-1';
//			asessmentYearEndDate= year+'-12-31';
			asessmentYearStartDate = year;
			$$(".assessmentTimeYear").on('click',function(){
				pickerDescribeYear.open();
				$$('.picker-3d .close-picker').text('完成');
				$$('.toolbar-inner .right').css('margin-right','20px');	
				$$('.picker-3d .close-picker').on('click',function(){
					year = pickerDescribeYear.value[0].substring(0,pickerDescribeYear.value[0].length-1);
					//asessmentYearStartDate= year+'-1-1';
					asessmentYearStartDate = year;
					//asessmentYearEndDate= year+'-12-31';
					$("#picker-describeYear").val(year+'年 ');
					pageAYear = 1;
					loadingAYear = true;
					$$('.assesserRightListYear ul').html('');
					ajaxLoadContentByYear(false);
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

//			$$('.searchbar-clear').on('click', function() {
//				oldContent = '';
//				$$(this).css('opacity', '0');
//				$$('.assesserSearchList ul').html("");
//				$$('#assessSearch').val("");
//			});
			//点击tab标签
			//月份
			$$('.buttonShyk').on('click',function(){
				if($$('.assessmentTab').css('display') == 'none'){
					setTimeout(function(){
						searchAssessment1();
					},100);
				}else{
					if(asessmentMonthCount == 1){
						ajaxLoadContent();
						asessmentMonthCount += 1;
					}
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
				}
			});
		}
		
		//搜索条件
		function searchAssessment1(){
			var monthClassName = $('#tab3').hasClass('active');
			var seasonClassName = $('#tab2').hasClass('active');
			var yearClassName = $('#tab1').hasClass('active');
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
		
//		function loadKnowledgeTopic(isLoadMore){
//			console.log(pageNo);
//			console.log(isLoadMore);
//			app.ajaxLoadPageContent1(loadKnowledgeTopicByYearAndMonthPath,{
//				year:year,
//				month:month,
//				pageNo:pageNo,
//				userId:app.userId
//			},function(data){
//				if(data.length>0){
//					console.log(data);
//					if(isLoadMore == true) {
//						$$('.infinite-scroll-preloader').remove();
//						$$('.assesserRightList ul').append(paperTemplate(data));
//					} else{
//						$$('.assesserRightList ul').html(paperTemplate(data));
//					}
//					if(pageNo == 1 && data.length<10){
//						$$('.infinite-scroll-preloader').remove();
//						//$$('.assesserRightList ul').append(bottomStr);
//					}
//					$$('.assesserRightList .item-content').on('click', function() {
//						var id = $$(this).data('id');
//						var title = $$(this).find('.kpi-title').html() || '无标题';
//						var score = $$(this).data("score") || 0;
//						var target = $$(this).data('target') || '无';
//						var minus = $$(this).data('minus') || 0;
//						var memo = $$(this).data('memo') || '无';
//						app.myApp.getCurrentView().loadPage('assessWork.html?assessId=' + id + '&title=' + title + '&score=' + score + '&target=' + target + '&minus=' + minus +'&memo='+ memo);
//					});
//					loading = false;
//				}else{
//					loading = true;
//					$$('.infinite-scroll-preloader').remove();
//					//$$('.assesserRightList ul').append(bottomStr);
//				}
//			});
//		}
		
		/**
		 *  加载查询类型
		 */
//		function handleAssessmentType() {
//			//年份类型
//			$$("#assessmentYear").append("<option value='2017' selected>2017 </option>");
//			$$("#assessmentYear").append("<option value='2018' >2018</option>");
//			$$('#assessmentYear').change(function() {});
//			
//			//季度类型
//			$$("#assessmentSeason").append("<option value='0' selected>第一季度 </option>");
//			$$("#assessmentSeason").append("<option value='1' >第二季度 </option>");
//			$$("#assessmentSeason").append("<option value='3' >第三季度  </option>");
//			$$("#assessmentSeason").append("<option value='4' >第四季度  </option>");
//			$$('#assessmentSeason').change(function() {});
//		}
		
		function keyupAssessment(){
			var searchContent = $$('#assessSearch').val();
			
			//var searchContent = $$('#assessmentContext').val();
			if(!searchContent) {
				oldContent = '';
				$$('.searchbar-clear').css('opacity', '0');
				$$('.assesserSearchList ul').html("");
			} else {
				$$('.searchbar-clear').css('opacity', '1');
			}
			
			searchPaper(searchContent);
		}
		function keyupAssessmentByYear(){
			var searchContent = $$('#assessSearch').val();
			
			//var searchContent = $$('#assessmentContext').val();
			if(!searchContent) {
				oldContent = '';
				$$('.searchbar-clear').css('opacity', '0');
				$$('.assesserSearchList ul').html("");
			} else {
				$$('.searchbar-clear').css('opacity', '1');
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
			//$$('.searchbar-clear').css('opacity', '0');
			$$('.assessNotFound').css('display', 'none');
		}

		/**
		 * 异步请求页面数据 (月份)
		 */
		function ajaxLoadContent() {
			console.log(asessmentMonthStartDate);
			console.log(asessmentMonthEndDate);
			app.ajaxLoadPageContent(loadPartyMenuPath, {
				deptId: app.user.deptId,
				type:1,
				startDate:asessmentMonthStartDate,
				endDate:asessmentMonthEndDate,
			}, function(result) {
				var data = result;
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
					loadEvent(data);
				},100)
				
			});
		}
		/**
		 * 异步请求页面数据(季度)
		 */
		function ajaxLoadContentBySeason() {
			console.log(asessmentSeasonStartDate);
			console.log(asessmentSeasonEndDate);
			app.ajaxLoadPageContent(loadPartyMenuPath, {
				deptId: app.user.deptId,
				type:1,
				startDate:asessmentSeasonStartDate,
				endDate:asessmentSeasonEndDate,
			}, function(result) {
				var data = result;
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
			});
		}
		/**
		 * 异步请求页面数据('年份')
		 */
		function ajaxLoadContentByYear() {
			console.log(asessmentYearStartDate)
			app.ajaxLoadPageContent(loadPartyMenuPath, {
				deptId: app.user.deptId,
				type:0,
				year:asessmentYearStartDate,
			}, function(result) {
				var data = result;
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
					loadEventByYear(data);
				},100);
				
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
				if(tpIdYear && !tpArrYear[tpIdYear]) {
					loadTopicByYear(tpIdYear);
				} else {
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
				tpId: tpId,
				userId: app.userId,
				type:1,
				startDate:asessmentMonthStartDate,
				endDate:asessmentMonthEndDate,
			}, function(result) {
				var data = result;
				console.log(result);
				tpArr[tpId] = result;
				handleTopic(tpId);
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
				tpId: tpIdSeason,
				userId: app.userId,
				type:1,
				startDate:asessmentSeasonStartDate,
				endDate:asessmentSeasonEndDate,
			}, function(result) {
				var data = result;
				console.log(result);
				tpArrSeason[tpIdSeason] = result;
				handleTopicBySeason(tpIdSeason);
			});
		}
		/**
		 * 加载考核清单(年度)
		 * @param {Object} tpId 考核项ID
		 */
		function loadTopicByYear(tpIdYear) {
			console.log(asessmentYearStartDate);
			app.ajaxLoadPageContent(loadTopicPath, {
				tpId: tpIdYear,
				userId: app.userId,
				type:0,
				year:asessmentYearStartDate,
			}, function(result) {
				var data = result;
				console.log(result);
				tpArrYear[tpIdYear] = result;
				handleTopicByYear(tpIdYear);
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
				$$('.assessBadge').remove();
				$$.each($$('.assesserLeftList .item-inner'), function(index, item1) {
					$$.each(notAssess, function(index, item2) {
						if($$(item1).data('tpid') == item2.knowledgePaperId) {
							if(item2.totalNum) {
								$$(item1).prepend('<span class="appBadge bg-red assessBadge" style="font-size: 13px;right: 0;top: 0;text-align: center;">' + item2.totalNum + '</span>');
							}
						}
					});
				});
				require(['js/pages/appList/appList'], function(appList) {
					appList.minusAssessNum(parseInt(assessTpId));
				});
			}
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
				app.myApp.getCurrentView().loadPage('assessWork.html?assessId=' + id + '&title=' + title + '&score=' + score + '&target=' + target + '&minus=' + minus +'&memo='+ memo);
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
				app.myApp.getCurrentView().loadPage('assessWork.html?assessId=' + id + '&title=' + title + '&score=' + score + '&target=' + target + '&minus=' + minus +'&memo='+ memo);
			});
		}
		/**
		 * 把考核清单写入页面 (年度)
		 * @param {Object} tpId 考核项ID
		 */
		function handleTopicByYear(tpIdYear) {
			var topicContentYear = tpArrYear[tpIdYear];
			console.log('1111');
			$$('.assesserRightListYear ul').html(paperTemplate(topicContentYear));
			
			//点击事件
			$$('.assesserRightListYear .item-content').on('click', function() {
				var id = $$(this).data('id');
				var title = $$(this).find('.kpi-title').html() || '无标题';
				var score = $$(this).data("score") || 0;
				var target = $$(this).data('target') || '无';
				var minus = $$(this).data('minus') || 0;
				var memo = $$(this).data('memo') || '无';
				app.myApp.getCurrentView().loadPage('assessWork.html?assessId=' + id + '&title=' + title + '&score=' + score + '&target=' + target + '&minus=' + minus +'&memo='+ memo);
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
			app.ajaxLoadPageContent(searchPaperPath, {
				deptId: app.user.deptId,
				searchContent: content,
				type:1,
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
						app.myApp.getCurrentView().loadPage('assessWork.html?assessId=' + id + '&title=' + title + '&score=' + score + '&target=' + target + '&minus=' + minus +'&memo=' + memo);
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
				searchContent: content,
				type:0,
				year:asessmentYearStartDate
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
						app.myApp.getCurrentView().loadPage('assessWork.html?assessId=' + id + '&title=' + title + '&score=' + score + '&target=' + target + '&minus=' + minus +'&memo=' + memo);
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