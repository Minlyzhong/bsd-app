define(['app',
		'hbs!js/hbs/evaItem',
		'hbs!js/hbs/evaPaper',
		'hbs!js/hbs/evaPaperSeason',
		'hbs!js/hbs/evaPaperYear',
		'hbs!js/hbs/evaPaperSearch',
], function(app,evaItemTemplate,evaPaperTemplate,evaPaperSeasonTemplate,evaPaperYearTemplate,evaPaperSearchTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	
	//接口
	//获取年份
	var getYearsPath = app.basePath + '/mobile/partyAm/getYears';
	//加载党员考评考核项
	var loadPartyMemberTestPaperPath = app.basePath + 'knowledgeTestpaper/loadPartyMemberTestPaper';
	//加载党员考评清单
	var loadPartyMemberTopicPaperPath = app.basePath + 'knowledgeTestpaper/loadPartyMemberTopic';
	//保存
	var savePartyMemberReportDetialPath = app.basePath + 'knowledgeTestpaper/savePartyMemberReportDetial';
	
	//公用
	var year = '';
	var month = '';
	//月份
	var evaArr = {};
	var evaArrSearch = {};
	var notEva = [];
	var evaTpId = 0;
	var evaWorkCB = '';
	//季度
	var evaArrSeason = {};
	var evaArrSeasonSearch = {};
	var notEvaSeason = [];
	var evaTpIdSeason = 0;
	var evaWorkCBSeason = '';
	//年度
	var evaArrYear = {};
	var evaArrYearSearch = {};
	var notEvaYear = [];
	var evaTpIdYear = 0;
	var evaWorkCBYear = '';
	//月份
	var evaMonthStartDate = '';
	var evaMonthEndDate = '';
	var pageNo = 1;
	var loading = true;
	var evaMonthCount = 1;
	//季度
	var evaSeasonStartDate = '';
	var evaSeasonEndDate = '';
	var pageASeason = 1;
	var loadingASeason = true;
	var evaSeasonCount = 1;
	var season='';
	//年度
	var evaYearStartDate = '';
	var evaYearEndDate = '';
	var pageAYear = 1;
	var loadingAYear = true;
	var evaYearCount = 1;
	//查询
	var evaSearchStartDate = '';
	var evaSearchEndDate = '';
	var pageASearch = 1;
	var loadingASSearch = true;
	var evaSearchCount = 1;
	
	
	var scores = [];
	var scoresBySeason = [];
	var scoresByYear = [];
	var scoresBySearch = [];
	var oldContent = '';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		app.back2Home();
		attrDefine(page);
		clickEvent(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		//设置标题名称
		$$('.partyEvaTitle').html(pageData.appName);
		//公用
		year = '';
		month = '';
		//月份
		evaArr = {};
		evaArrSearch = {}
		notEva = [];
		evaTpId = 0;
		evaWorkCB = '';
		//季度
		evaArrSeason = {};
		evaArrSeasonSearch = {}
		notEvaSeason = [];
		evaTpIdSeason = 0;
		evaWorkCBSeason = '';
		//年度
		evaArrYear = {};
		evaArrYearSearch = {}
		notEvaYear = [];
		evaTpIdYear = 0;
		evaWorkCBYear = '';
		//月份
		evaMonthStartDate = '';
		evaMonthEndDate = '';
		pageNo = 1;
		loading = true;
		evaMonthCount = 1;
		//季度
		evaSeasonStartDate = '';
		evaSeasonEndDate = '';
		pageASeason = 1;
		loadingASeason = true;
		evaSeasonCount = 1;
		season='';
		//年度
		evaYearStartDate = '';
		evaYearEndDate = '';
		pageAYear = 1;
		loadingAYear = true;
		evaYearCount = 1;
		//查询
		evaSearchStartDate = '';
		evaSearchEndDate = '';
		pageASearch = 1;
		loadingASSearch = true;
		evaSearchCount = 1;
		
		oldContent = '';
		scores = [];
		scoresBySeason = [];
		scoresByYear = [];
		scoresBySearch = [];
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
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
		evaMonthStartDate = year+'-'+month+'-01';
		evaMonthEndDate = year+'-'+month+'-31';
		$$(".evaTime").on('click',function(){
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
				evaMonthStartDate = year+'-'+month+'-01';
				evaMonthEndDate = year+'-'+month+'-31';
				$$('.evaRightList ul').html('');
				ajaxLoadContent();
			});
		});
		//季度时间判断
		if(month<=3){
			$("#picker-describeSeason").val(year+'年 '+ '第一季度');
			evaSeasonStartDate = year+'-01-01';
			evaSeasonEndDate = year+'-03-31';
		}else if(month>3 && month<=6){
			$("#picker-describeSeason").val(year+'年 '+ '第二季度');
			evaSeasonStartDate = year+'-04-01';
			evaSeasonEndDate = year+'-06-31';
		}else if(month>6 && month<=9){
			$("#picker-describeSeason").val(year+'年 '+ '第三季度');
			evaSeasonStartDate = year+'-07-01';
			evaSeasonEndDate = year+'-09-31';
		}else if(month>9 && month<=12){
			$("#picker-describeSeason").val(year+'年 '+ '第四季度');
			evaSeasonStartDate = year+'-10-01';
			evaSeasonEndDate = year+'-12-31';
		}
		$$(".evaTimeSeason").on('click',function(){
			pickerDescribeSeason.open();
			$$('.picker-3d .close-picker').text('完成');
			$$('.toolbar-inner .right').css('margin-right','20px');	
			$$('.picker-3d .close-picker').on('click',function(){
				year = pickerDescribeSeason.value[0].substring(0,pickerDescribeSeason.value[0].length-1);
				season = pickerDescribeSeason.value[1].substring(0,pickerDescribeSeason.value[1].length);
				if(season == '第一季度'){
					evaSeasonStartDate = year+'-01-01';
					evaSeasonEndDate = year+'-03-31';
				}else if(season == '第二季度'){
					evaSeasonStartDate = year+'-04-01';
					evaSeasonEndDate = year+'-06-31';
				}else if(season == '第三季度'){
					evaSeasonStartDate = year+'-07-01';
					evaSeasonEndDate = year+'-09-31';
				}else if(season == '第四季度'){
					evaSeasonStartDate = year+'-10-01';
					evaSeasonEndDate = year+'-12-31';
				}
				$("#picker-describeSeason").val(year+'年 '+ season);
				pageASeason = 1;
				loadingASeason = true;
				$$('.evaRightListSeason ul').html('');
				ajaxLoadContentBySeason();
			});
		});
		//年份时间判断
		$("#picker-describeYear").val(year+'年 ');
		evaYearStartDate = year;
		$$(".evaTimeYear").on('click',function(){
			pickerDescribeYear.open();
			$$('.picker-3d .close-picker').text('完成');
			$$('.toolbar-inner .right').css('margin-right','20px');	
			$$('.picker-3d .close-picker').on('click',function(){
				year = pickerDescribeYear.value[0].substring(0,pickerDescribeYear.value[0].length-1);
				asessmentYearStartDate = year;
				$("#picker-describeYear").val(year+'年 ');
				pageAYear = 1;
				loadingAYear = true;
				$$('.evaRightListYear ul').html('');
				ajaxLoadContentByYear();
			});
		});
		//点击查询框
		$$('#evaSearch').on('focus', function() {
			$$('.evaTab').css('display','none');
			$$(this).css('text-align', 'left');
			$$('.evaSearchBar .evaSearchCancelBtn').css('display', 'block');
			$$('.evaSearchList').css('display', 'block');
		});
		//取消按钮
		$$('.evaSearchCancelBtn').on('click',cancelAssessmentSearch);
		//搜索按钮
		$$('#evaSearch').on('keyup', searchAssessment1);
		//点击tab标签
		//月份
		$$('.buttonShyk').on('click',function(){
			if($$('.evaTab').css('display') == 'none'){
				setTimeout(function(){
					searchAssessment1();
				},100);
			}
		});
		//季度
		$$('.buttonShykSeason').on('click',function(){
			if($$('.evaTab').css('display') == 'none'){
				setTimeout(function(){
					searchAssessment1();
				},100);
			}else{
				if(evaSeasonCount == 1){
					ajaxLoadContentBySeason();
					evaSeasonCount += 1;
				}
			}
		});
		//年份
		$$('.buttonShykYear').on('click',function(){
			if($$('.evaTab').css('display') == 'none'){
				setTimeout(function(){
					searchAssessment1();
				},100);
			}else{
				if(evaYearCount == 1){
					ajaxLoadContentByYear();
					evaYearCount += 1;
				}
			}
		});
		//加载月份数据
		ajaxLoadContent();
		
	}
	
	/**
	 * 异步请求页面数据 (月份)
	 */
	function ajaxLoadContent() {
		console.log(evaMonthStartDate);
		console.log(evaMonthEndDate);
		app.ajaxLoadPageContent(loadPartyMemberTestPaperPath, {
			deptId: app.user.deptId,
			type:1,
			startDate:evaMonthStartDate,
			endDate:evaMonthEndDate,
			userId:app.userId,
			khpl:2,
		}, function(result) {
			var data = result;
			console.log(data);
			pageDataStorage['evaleft'] = data;
			$$('.evaLeftList ul').html(evaItemTemplate(data));		
//			if(notAssess.length) {
//				$$.each($$('.assesserLeftList .item-inner'), function(index, item1) {
//					$$.each(notAssess, function(index, item2) {
//						if($$(item1).data('tpid') == item2.knowledgePaperId) {
//							if(item2.totalNum) {
//								$$(item1).prepend('<span class="appBadge bg-red assessBadge" style="font-size: 13px;right: 0;top: 0;text-align: center;">' + item2.totalNum + '</span>');
//							}
//						}
//					});
//				});
//			}
			setTimeout(function(){
				loadEvent(data);
			},100)
		});
	}
	/**
	 * 异步请求页面数据(季度)
	 */
	function ajaxLoadContentBySeason() {
		console.log(evaSeasonStartDate);
		console.log(evaSeasonEndDate);
		app.ajaxLoadPageContent(loadPartyMemberTestPaperPath, {
			deptId: app.user.deptId,
			type:1,
			startDate:evaSeasonStartDate,
			endDate:evaSeasonEndDate,
			userId:app.userId,
			khpl:1,
		}, function(result) {
			var data = result;
			console.log(data);
			pageDataStorage['evaleftSeason'] = data;
			$$('.evaLeftListSeason ul').html(evaItemTemplate(data));
//			if(notAssessSeason.length) {
//				$$.each($$('.assesserLeftListSeason .item-inner'), function(index, item1) {
//					$$.each(notAssessSeason, function(index, item2) {
//						if($$(item1).data('tpid') == item2.knowledgePaperId) {
//							if(item2.totalNum) {
//								$$(item1).prepend('<span class="appBadge bg-red assessBadgeSeason" style="font-size: 13px;right: 0;top: 0;text-align: center;">' + item2.totalNum + '</span>');
//							}
//						}
//					});
//				});
//			}
			setTimeout(function(){
				loadEventBySeason(data);
			},100);
		});
	}
	/**
	 * 异步请求页面数据('年份')
	 */
	function ajaxLoadContentByYear() {
		console.log(evaYearStartDate)
		app.ajaxLoadPageContent(loadPartyMemberTestPaperPath, {
			deptId: app.user.deptId,
			type:0,
			year:evaYearStartDate,
			userId:app.userId,
			khpl:0,
		}, function(result) {
			var data = result;
			console.log(data);
			pageDataStorage['evaleftYear'] = data;
			$$('.evaLeftListYear ul').html(evaItemTemplate(data));
//			if(notAssessYear.length) {
//				$$.each($$('.assesserLeftListYear .item-inner'), function(index, item1) {
//					$$.each(notAssessYear, function(index, item2) {
//						if($$(item1).data('tpid') == item2.knowledgePaperId) {
//							if(item2.totalNum) {
//								$$(item1).prepend('<span class="appBadge bg-red assessBadgeYear" style="font-size: 13px;right: 0;top: 0;text-align: center;">' + item2.totalNum + '</span>');
//							}
//						}
//					});
//				});
//			}
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
		$$('.evaLeftList .item-inner').on('click', function() {
			evaTpId = $$(this).data('tpid');
			pageDataStorage['index'] = $$(this).parent().index();
			$$('.evaLeftList .item-inner').css('background', 'whitesmoke');
			$$('.evaLeftList .item-inner').children().css('color', 'gray');
			$$(this).css('background', 'white');
			$$(this).children().css('color', '#ed4c3c');

			var tpId = $$(this).data('tpId');
			pageDataStorage['tpId'] = tpId;
//			if(tpId && !evaArr[tpId]) {
				loadTopic(tpId);
//			}
//			else {
//				handleTopic(tpId);
//			}
		});
		$$($$('.evaLeftList .item-inner')[0]).click();
	}
	/**
	 * 动态加载事件(季度)
	 * @param {Object} data 请求的数据
	 */
	function loadEventBySeason(data) {
		$$('.evaLeftListSeason .item-inner').on('click', function() {
			evaTpIdSeason = $$(this).data('tpid');
			pageDataStorage['indexSeason'] = $$(this).parent().index();
			$$('.assesserLeftListSeason .item-inner').css('background', 'whitesmoke');
			$$('.assesserLeftListSeason .item-inner').children().css('color', 'gray');
			$$(this).css('background', 'white');
			$$(this).children().css('color', '#ed4c3c');

			var tpIdSeason = $$(this).data('tpId');
			pageDataStorage['tpIdSeason'] = tpIdSeason;
//			if(tpIdSeason && !evaArrSeason[tpIdSeason]) {
				loadTopicBySeason(tpIdSeason);
//			}
//			else {
//				handleTopicBySeason(tpIdSeason);
//			}
		});
		$$($$('.evaLeftListSeason .item-inner')[0]).click();
	}
	/**
	 * 动态加载事件(年度)
	 * @param {Object} data 请求的数据
	 */
	function loadEventByYear(data) {
		$$('.evaLeftListYear .item-inner').on('click', function() {
			evaTpIdYear = $$(this).data('tpid');
			pageDataStorage['indexYear'] = $$(this).parent().index();
			$$('.assesserLeftListYear .item-inner').css('background', 'whitesmoke');
			$$('.assesserLeftListYear .item-inner').children().css('color', 'gray');
			$$(this).css('background', 'white');
			$$(this).children().css('color', '#ed4c3c');

			var tpIdYear = $$(this).data('tpId');
			pageDataStorage['tpIdYear'] = tpIdYear;
//			if(tpIdYear && !evaArrYear[tpIdYear]) {
				loadTopicByYear(tpIdYear);
//			} 
//			else {
//				handleTopicByYear(tpIdYear);
//			}
		});
		$$($$('.evaLeftListYear .item-inner')[0]).click();
	}

	/**
	 * 加载考核清单(月份)
	 * @param {Object} tpId 考核项ID
	 */
	function loadTopic(evaId) {
		console.log(evaMonthStartDate);
		console.log(evaMonthEndDate);
		app.ajaxLoadPageContent(loadPartyMemberTopicPaperPath, {
			deptId:app.user.deptId,
			tpId: evaId,
			userId: app.userId,
			type:1,
			startDate:evaMonthStartDate,
			endDate:evaMonthEndDate,
			khpl:2,
		}, function(result) {
			var data = result;
			console.log(result);
			evaArr[evaId] = result;
			handleTopic(evaId);
		});
	}
	/**
	 * 加载考核清单(季度)
	 * @param {Object} tpId 考核项ID
	 */
	function loadTopicBySeason(evaIdSeason) {
		console.log(evaSeasonStartDate);
		console.log(evaSeasonEndDate);
		app.ajaxLoadPageContent(loadPartyMemberTopicPaperPath, {
			deptId:app.user.deptId,
			tpId: evaIdSeason,
			userId: app.userId,
			type:1,
			startDate:evaSeasonStartDate,
			endDate:evaSeasonEndDate,
			khpl:1,
		}, function(result) {
			var data = result;
			console.log(result);
			evaArrSeason[evaIdSeason] = result;
			handleTopicBySeason(evaIdSeason);
		});
	}
	/**
	 * 加载考核清单(年度)
	 * @param {Object} tpId 考核项ID
	 */
	function loadTopicByYear(evaIdYear) {
		console.log(evaYearStartDate);
		app.ajaxLoadPageContent(loadPartyMemberTopicPaperPath, {
			deptId:app.user.deptId,
			tpId: evaIdYear,
			userId: app.userId,
			type:0,
			year:evaYearStartDate,
			khpl:0,
		}, function(result) {
			var data = result;
			console.log(result);
			evaArrYear[evaIdYear] = result;
			handleTopicByYear(evaIdYear);
		});
	}

	/**
	 * 把考核清单写入页面 (月份)
	 * @param {Object} tpId 考核项ID
	 */
	function handleTopic(tpId) {
		var topicContent = evaArr[tpId];
		$$('.evaRightList ul').html(evaPaperTemplate(topicContent));
		//点击分数输入框
		if(topicContent[0].state == 0){
			$$('.scoreSubmit').css('display','block');
		}else{
			$$('.scoreSubmit').css('display','none');
		}
		
		
		$$("input[class='abc']").blur(function(){
		  var dfHighScore = $$(this).next()[0].defaultValue;
		  var evatopicId = $$(this).next().next()[0].defaultValue;
		  var enterScore = $$(this).val();
		  //判断时候为空
		  if(enterScore == ''){
		  	return;
		  }
		  if(enterScore >  dfHighScore){
		  	app.myApp.alert('不能大于最高分')
		  	$$(this).val('');
		  	$$(this).attr('placeholder','请填写分数');
		  	return;
		  }
		  if(enterScore < 0){
		  	app.myApp.alert('不能等于负数')
		  	$$(this).val('');
		  	$$(this).attr('placeholder','请填写分数');
		  	return;
		  }  
		});
		//点击提交
		$$('.scoreSubmit').on('click',function(){
			var userScores = $$('.evaRightList').find('input[class="abc"]');
			var evatopicIds = $$('.evaRightList').find('input[class="hiddenID"]');
			var indexMonth = 0;
			$.each(userScores, function(index,item) {
				var inputScore = {
				  	topicId:0,
					reportUserId:app.userId,
					userScore:0,
					totalScore:0
				}
				if($$(item).val() == ''){
					app.myApp.alert('第'+(index+1)+'项请填写！');
					indexMonth = index + 1;
					scores = [];
					return false;
				}
				inputScore.topicId = parseInt($$($$(evatopicIds)[index]).val());
				inputScore.userScore = parseFloat($$(item).val());
				scores.push(inputScore);
			});
			console.log(scores);
			if(scores != ''){
				app.ajaxLoadPageContent(savePartyMemberReportDetialPath, {
				jsonArr:JSON.stringify(scores),
				}, function(result) {
					console.log(result);
					ajaxLoadContent();
				});
			}else{
//				if(indexMonth == 0){
//					app.myApp.alert('第1项请填写！');
//				}else{
//					app.myApp.alert('第'+indexMonth+'项请填写！');
//				}
			}
			
		});
	}
	/**
	 * 把考核清单写入页面 (季度)
	 * @param {Object} tpId 考核项ID
	 */
	function handleTopicBySeason(tpIdSeason) {
		var topicContentSeason = evaArrSeason[tpIdSeason];
		$$('.evaRightListSeason ul').html(evaPaperSeasonTemplate(topicContentSeason));
		if(topicContentSeason[0].state == 0){
			$$('.scoreSubmitSeason').css('display','block');
		}else{
			$$('.scoreSubmitSeason').css('display','none');
		}
		//点击提交
		$$("input[class='abcSeason']").blur(function(){
		  var dfHighScore = $$(this).next()[0].defaultValue;
		  var evatopicId = $$(this).next().next()[0].defaultValue;
		  var enterScore = $$(this).val();
		  console.log(dfHighScore);
		  //判断时候为空
		  if(enterScore == ''){
		  	return;
		  }
		  if(enterScore >  dfHighScore){
		  	app.myApp.alert('不能大于最高分')
		  	$$(this).val('');
		  	$$(this).attr('placeholder','请填写分数');
		  	return;
		  }
		  if(enterScore < 0){
		  	app.myApp.alert('不能等于负数')
		  	$$(this).val('');
		  	$$(this).attr('placeholder','请填写分数');
		  	return;
		  }  
		});
		$$('.scoreSubmitSeason').on('click',function(){
			var userScores = $$('.evaRightListSeason').find('input[class="abcSeason"]');
			var evatopicIds = $$('.evaRightListSeason').find('input[class="hiddenID"]');
			var indexSeason = 0;
			$.each(userScores, function(index,item) {
				var inputScore = {
				  	topicId:0,
					reportUserId:app.userId,
					userScore:0,
					totalScore:0,
				}
				if($$(item).val() == ''){
					app.myApp.alert('第'+(index+1)+'项请填写！');
					indexSeason = index+1;
					scoresBySeason = [];
					return false;
				}
				inputScore.topicId = parseInt($$($$(evatopicIds)[index]).val());
				inputScore.userScore = parseFloat($$(item).val());
				scoresBySeason.push(inputScore);
			});
			console.log(scoresBySeason);
			if(scoresBySeason != ''){
				app.ajaxLoadPageContent(savePartyMemberReportDetialPath, {
				jsonArr:JSON.stringify(scoresBySeason),	
				}, function(result) {
					console.log(result);
					ajaxLoadContentBySeason();
				});
			}
//			else{
//				if(indexSeason == 0){
//					app.myApp.alert('第1项请填写！');
//				}else{
//					app.myApp.alert('第'+indexSeason+'项请填写！');
//				}
//			}
		});
	}
	/**
	 * 把考核清单写入页面 (年度)
	 * @param {Object} tpId 考核项ID
	 */
	function handleTopicByYear(tpIdYear) {
		var topicContentYear = evaArrYear[tpIdYear];
		$$('.evaRightListYear ul').html(evaPaperYearTemplate(topicContentYear));
		if(topicContentYear[0].state == 0){
			$$('.scoreSubmitYear').css('display','block');
		}else{
			$$('.scoreSubmitYear').css('display','none');
		}
		$$('input[class="abcYear"]').blur(function(){
		  var dfHighScore = $$(this).next()[0].defaultValue;
		  var evatopicId = $$(this).next().next()[0].defaultValue;
		  var enterScore = $$(this).val();
		  //判断时候为空
		  if(enterScore == ''){
		  	return;
		  }
		  if(enterScore >  dfHighScore){
		  	app.myApp.alert('不能大于最高分')
		  	$$(this).val('');
		  	$$(this).attr('placeholder','请填写分数');
		  	return;
		  }
		  if(enterScore < 0){
		  	app.myApp.alert('不能等于负数')
		  	$$(this).val('');
		  	$$(this).attr('placeholder','请填写分数');
		  	return;
		  }  
		});
		//点击提交
		$$('.scoreSubmitYear').on('click',function(){
			var userScores = $$('.evaRightListYear').find('input[class="abcYear"]');
			var evatopicIds = $$('.evaRightListYear').find('input[class="hiddenID"]');
			var indexYear = 0;
			$.each(userScores, function(index,item) {
				var inputScore = {
				  	topicId:0,
					reportUserId:app.userId,
					userScore:0,
					totalScore:0,
				}
				if($$(item).val() == ''){
					app.myApp.alert('第'+(index+1)+'项请填写！');
					indexYear = index + 1;
					scoresByYear = [];
					return false;
				}
				inputScore.topicId = parseInt($$($$(evatopicIds)[index]).val());
				inputScore.userScore = parseFloat($$(item).val());
				scoresByYear.push(inputScore);
			});
			console.log(scoresByYear);
			if(scoresByYear != ''){
				app.ajaxLoadPageContent(savePartyMemberReportDetialPath, {
				jsonArr:JSON.stringify(scoresByYear),	
				}, function(result) {
					console.log(result);
					ajaxLoadContentByYear();
				});
			}else{
//				if(indexYear == 0){
//					app.myApp.alert('第1项请填写！');
//				}else{
//					app.myApp.alert('第'+indexYear+'项请填写！');
//				}
			}
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
			evaSearchStartDate = evaMonthStartDate;
			evaSearchEndDate = evaMonthEndDate;
			keyupAssessment();
		}else if(seasonClassName){
			evaSearchStartDate = evaSeasonStartDate;
			evaSearchEndDate = evaSeasonEndDate;
			keyupAssessmentBySeason();
		}else if(yearClassName){
			evaSearchStartDate = year;
			keyupAssessmentByYear();
		}
	}
	
	function keyupAssessment(){
		var searchContent = $$('#evaSearch').val();
		if(!searchContent) {
			oldContent = '';
			$$('.searchbar-clear').css('opacity', '0');
			$$('.assesserSearchList ul').html("");
		} else {
			$$('.searchbar-clear').css('opacity', '1');
		}
		ajaxLoadContentBySearch(searchContent);
	}
	function keyupAssessmentBySeason(){
		var searchContent = $$('#evaSearch').val();
		if(!searchContent) {
			oldContent = '';
			$$('.searchbar-clear').css('opacity', '0');
			$$('.assesserSearchList ul').html("");
		} else {
			$$('.searchbar-clear').css('opacity', '1');
		}
		ajaxLoadContentBySeasonBySearch(searchContent);
	}
	function keyupAssessmentByYear(){
		var searchContent = $$('#evaSearch').val();
		if(!searchContent) {
			oldContent = '';
			$$('.searchbar-clear').css('opacity', '0');
			$$('.assesserSearchList ul').html("");
		} else {
			$$('.searchbar-clear').css('opacity', '1');
		}
		ajaxLoadContentByYearBySearch(searchContent);
	}
	
	function cancelAssessmentSearch(){
		$$('.evaTab').css('display','block');
		oldContent = '';
		$$('#evaSearch').val("");
		$$('.evaSearchBar #evaSearch').css('text-align', 'center');
		$$('.evaSearchBar .evaSearchCancelBtn').css('display','none');
		$$('.evaLeftListSearch ul').html("");
		$$('.evaRightListSearch ul').html("");
		$$('.evaSearchList').css('display', 'none');
	}

	/**
	 * 异步请求页面数据 (月份)
	 */
	function ajaxLoadContentBySearch(evaContent) {
		console.log(evaSearchStartDate);
		console.log(evaSearchEndDate);
		console.log(evaContent);
		app.ajaxLoadPageContent(loadPartyMemberTestPaperPath, {
			deptId: app.user.deptId,
			type:1,
			startDate:evaSearchStartDate,
			endDate:evaSearchEndDate,
			userId:app.userId,
			khpl:2,
			query:evaContent
		}, function(result) {
			var data = result;
			console.log(data);
			pageDataStorage['evaleftSearchSearch'] = data;
			$$('.evaLeftListSearch ul').html(evaItemTemplate(data));	
			if(data != ''){
				setTimeout(function(){
					loadEventBySearch(data);
				},100);
			}else{
				$$('.evaRightListSearch ul').html('');	
			}
		});
	}
	/**
	 * 异步请求页面数据(季度)
	 */
	function ajaxLoadContentBySeasonBySearch(evaContentSeason) {
		console.log(evaSearchStartDate);
		console.log(evaSearchEndDate);
		console.log(evaContentSeason);
		app.ajaxLoadPageContent(loadPartyMemberTestPaperPath, {
			deptId: app.user.deptId,
			type:1,
			startDate:evaSearchStartDate,
			endDate:evaSearchEndDate,
			userId:app.userId,
			khpl:1,
			query:evaContentSeason
		}, function(result) {
			var data = result;
			console.log(data);
			pageDataStorage['evaleftSeasonSearch'] = data;
			$$('.evaLeftListSearch ul').html(evaItemTemplate(data));
			if(data != ''){
				setTimeout(function(){
					loadEventBySeasonBySearch(data);
				},100);
			}else{
				$$('.evaRightListSearch ul').html('');	
			}
		});
	}
	/**
	 * 异步请求页面数据('年份')
	 */
	function ajaxLoadContentByYearBySearch(evaContentYear) {
		console.log(evaSearchStartDate);
		console.log(evaContentYear);
		app.ajaxLoadPageContent(loadPartyMemberTestPaperPath, {
			deptId: app.user.deptId,
			type:0,
			year:evaSearchStartDate,
			userId:app.userId,
			khpl:0,
			query:evaContentYear
		}, function(result) {
			var data = result;
			console.log(data);
			pageDataStorage['evaleftYearSearch'] = data;
			$$('.evaLeftListSearch ul').html(evaItemTemplate(data));
			if(data != ''){
				setTimeout(function(){
					loadEventByYearBySearch(data);
				},100);
			}else{
				$$('.evaRightListSearch ul').html('');	
			}
		});
	}

	/**
	 * 动态加载事件(月份)
	 * @param {Object} data 请求的数据
	 */
	function loadEventBySearch(data) {
		$$('.evaLeftListSearch .item-inner').on('click', function() {
			evaTpId = $$(this).data('tpid');
			pageDataStorage['index'] = $$(this).parent().index();
			$$('.evaLeftListSearch .item-inner').css('background', 'whitesmoke');
			$$('.evaLeftListSearch .item-inner').children().css('color', 'gray');
			$$(this).css('background', 'white');
			$$(this).parent().css('background', 'white');
			$$(this).children().css('color', '#ed4c3c');
			var tpIdSearch = $$(this).data('tpId');
			pageDataStorage['tpIdSearch'] = tpIdSearch;
			loadTopicBySearch(tpIdSearch);
		});
		$$($$('.evaLeftListSearch .item-inner')[0]).click();
	}
	/**
	 * 动态加载事件(季度)
	 * @param {Object} data 请求的数据
	 */
	function loadEventBySeasonBySearch(data) {
		$$('.evaLeftListSearch .item-inner').on('click', function() {
			evaTpIdSeason = $$(this).data('tpid');
			pageDataStorage['indexSeason'] = $$(this).parent().index();
			$$('.evaLeftListSearch .item-inner').css('background', 'whitesmoke');
			$$('.evaLeftListSearch .item-inner').children().css('color', 'gray');
			$$(this).css('background', 'white');
			$$(this).children().css('color', '#ed4c3c');
			$$(this).parent().css('background', 'white');
			var tpIdSeasonSearch = $$(this).data('tpId');
			pageDataStorage['tpIdSeasonSearch'] = tpIdSeasonSearch;
			loadTopicBySeasonBySearch(tpIdSeasonSearch);
		});
		$$($$('.evaLeftListSearch .item-inner')[0]).click();
	}
	/**
	 * 动态加载事件(年度)
	 * @param {Object} data 请求的数据
	 */
	function loadEventByYearBySearch(data) {
		$$('.evaLeftListSearch .item-inner').on('click', function() {
			evaTpIdYear = $$(this).data('tpid');
			pageDataStorage['indexYear'] = $$(this).parent().index();
			$$('.evaLeftListSearch .item-inner').css('background', 'whitesmoke');
			$$('.evaLeftListSearch .item-inner').children().css('color', 'gray');
			$$(this).css('background', 'white');
			$$(this).children().css('color', '#ed4c3c');
			$$(this).parent().css('background', 'white');
			var tpIdYearSearch = $$(this).data('tpId');
			pageDataStorage['tpIdYearSearch'] = tpIdYearSearch;
			loadTopicByYearBySearch(tpIdYearSearch);
		});
		$$($$('.evaLeftListSearch .item-inner')[0]).click();
	}

	/**
	 * 加载考核清单(月份)
	 * @param {Object} tpId 考核项ID
	 */
	function loadTopicBySearch(evaIdSearch) {
		console.log(evaSearchStartDate);
		console.log(evaSearchEndDate);
		app.ajaxLoadPageContent(loadPartyMemberTopicPaperPath, {
			deptId:app.user.deptId,
			tpId: evaIdSearch,
			userId: app.userId,
			type:1,
			startDate:evaSearchStartDate,
			endDate:evaSearchEndDate,
			khpl:2,
		}, function(result) {
			var data = result;
			console.log(result);
			evaArrSearch[evaIdSearch] = result;
			handleTopicBySearch(evaIdSearch);
		});
	}
	/**
	 * 加载考核清单(季度)
	 * @param {Object} tpId 考核项ID
	 */
	function loadTopicBySeasonBySearch(evaIdSeasonSearch) {
		console.log(evaSearchStartDate);
		console.log(evaSeasonEndDate);
		app.ajaxLoadPageContent(loadPartyMemberTopicPaperPath, {
			deptId:app.user.deptId,
			tpId: evaIdSeasonSearch,
			userId: app.userId,
			type:1,
			startDate:evaSearchStartDate,
			endDate:evaSearchEndDate,
			khpl:1,
		}, function(result) {
			var data = result;
			console.log(result);
			evaArrSeasonSearch[evaIdSeasonSearch] = result;
			handleTopicBySearchBySeason(evaIdSeasonSearch);
		});
	}
	/**
	 * 加载考核清单(年度)
	 * @param {Object} tpId 考核项ID
	 */
	function loadTopicByYearBySearch(evaIdYearSearch) {
		console.log(evaSearchStartDate);
		app.ajaxLoadPageContent(loadPartyMemberTopicPaperPath, {
			deptId:app.user.deptId,
			tpId: evaIdYearSearch,
			userId: app.userId,
			type:0,
			year:evaSearchStartDate,
			khpl:0,
		}, function(result) {
			var data = result;
			console.log(result);
			evaArrYearSearch[evaIdYearSearch] = result;
			handleTopicBySearchByYear(evaIdYearSearch);
		});
	}

	/**
	 * 把考核清单写入页面 (月份)
	 * @param {Object} tpId 考核项ID
	 */
	function handleTopicBySearch(tpIdSearch) {
		var topicContentSearch = evaArrSearch[tpIdSearch];
		$$('.evaRightListSearch ul').html(evaPaperSearchTemplate(topicContentSearch));
		//点击分数输入框
		if(topicContentSearch[0].state == 0){
			$$('.scoreSubmitSearch').css('display','block');
		}else{
			$$('.scoreSubmitSearch').css('display','none');
		}
		$$("input[class='abcSearch']").blur(function(){
		  var dfHighScore = $$(this).next()[0].defaultValue;
		  var evatopicId = $$(this).next().next()[0].defaultValue;
		  var enterScore = $$(this).val();
		  //判断时候为空
		  if(enterScore == ''){
		  	return;
		  }
		  if(enterScore >  dfHighScore){
		  	app.myApp.alert('不能大于最高分')
		  	$$(this).val('');
		  	$$(this).attr('placeholder','请填写分数');
		  	return;
		  }
		  if(enterScore < 0){
		  	app.myApp.alert('不能等于负数')
		  	$$(this).val('');
		  	$$(this).attr('placeholder','请填写分数');
		  	return;
		  }  
		});
		//点击提交
		$$('.scoreSubmitSearch').on('click',function(){
			var userScores = $$('.evaRightListSearch').find('input[class="abcSearch"]');
			var evatopicIds = $$('.evaRightListSearch').find('input[class="hiddenID"]');
			var indexSearch = 0;
			$.each(userScores, function(index,item) {
				var inputScore = {
				  	topicId:0,
					reportUserId:app.userId,
					userScore:0,
					totalScore:0
				}
				if($$(item).val() == ''){
					app.myApp.alert('第'+(index+1)+'项请填写！');
					indexSearch = index+1;
					scoresBySearch = [];
					return false;
				}
				inputScore.topicId = parseInt($$($$(evatopicIds)[index]).val());
				inputScore.userScore = parseFloat($$(item).val());
				scoresBySearch.push(inputScore);
			});
			console.log(scoresBySearch);
			if(scoresBySearch != ''){
				app.ajaxLoadPageContent(savePartyMemberReportDetialPath, {
					jsonArr:JSON.stringify(scoresBySearch),
				}, function(result) {
					ajaxLoadContent();
					ajaxLoadContentBySearch();	
				});
			}else{
				app.myApp.alert('第'+indexSearch+'项请填写！');
			}
		});
	}
	
	function handleTopicBySearchBySeason(tpIdSearch) {
		var topicContentSearch = evaArrSeasonSearch[tpIdSearch];
		$$('.evaRightListSearch ul').html(evaPaperSearchTemplate(topicContentSearch));
		//点击分数输入框
		if(topicContentSearch[0].state == 0){
			$$('.scoreSubmitSearch').css('display','block');
		}else{
			$$('.scoreSubmitSearch').css('display','none');
		}
		$$("input[class='abcSearch']").blur(function(){
		  var dfHighScore = $$(this).next()[0].defaultValue;
		  var evatopicId = $$(this).next().next()[0].defaultValue;
		  var enterScore = $$(this).val();
		  //判断时候为空
		  if(enterScore == ''){
		  	return;
		  }
		  if(enterScore >  dfHighScore){
		  	app.myApp.alert('不能大于最高分')
		  	$$(this).val('');
		  	$$(this).attr('placeholder','请填写分数');
		  	return;
		  }
		  if(enterScore < 0){
		  	app.myApp.alert('不能等于负数')
		  	$$(this).val('');
		  	$$(this).attr('placeholder','请填写分数');
		  	return;
		  }  
		});
		//点击提交
		$$('.scoreSubmitSearch').on('click',function(){
			var userScores = $$('.evaRightListSearch').find('input[class="abcSearch"]');
			var evatopicIds = $$('.evaRightListSearch').find('input[class="hiddenID"]');
			var indexSearch = 0;
			$.each(userScores, function(index,item) {
				var inputScore = {
				  	topicId:0,
					reportUserId:app.userId,
					userScore:0,
					totalScore:0
				}
				if($$(item).val() == ''){
					app.myApp.alert('第'+(index+1)+'项请填写！');
					indexSearch = index+1;
					scoresBySearch = [];
					return false;
				}
				inputScore.topicId = parseInt($$($$(evatopicIds)[index]).val());
				inputScore.userScore = parseFloat($$(item).val());
				scoresBySearch.push(inputScore);
			});
			console.log(scoresBySearch);
			if(scoresBySearch != ''){
				app.ajaxLoadPageContent(savePartyMemberReportDetialPath, {
					jsonArr:JSON.stringify(scoresBySearch),
				}, function(result) {	
					ajaxLoadContentBySeason();
					ajaxLoadContentBySeasonBySearch();
				});
			}else{
				app.myApp.alert('第'+indexSearch+'项请填写！');
			}
		});
	}
	
	function handleTopicBySearchByYear(tpIdSearch) {
		var topicContentSearch = evaArrYearSearch[tpIdSearch];
		$$('.evaRightListSearch ul').html(evaPaperSearchTemplate(topicContentSearch));
		//点击分数输入框
		if(topicContentSearch[0].state == 0){
			$$('.scoreSubmitSearch').css('display','block');
		}else{
			$$('.scoreSubmitSearch').css('display','none');
		}
		$$("input[class='abcSearch']").blur(function(){
		  var dfHighScore = $$(this).next()[0].defaultValue;
		  var evatopicId = $$(this).next().next()[0].defaultValue;
		  var enterScore = $$(this).val();
		  //判断时候为空
		  if(enterScore == ''){
		  	return;
		  }
		  if(enterScore >  dfHighScore){
		  	app.myApp.alert('不能大于最高分')
		  	$$(this).val('');
		  	$$(this).attr('placeholder','请填写分数');
		  	return;
		  }
		  if(enterScore < 0){
		  	app.myApp.alert('不能等于负数')
		  	$$(this).val('');
		  	$$(this).attr('placeholder','请填写分数');
		  	return;
		  }  
		});
		//点击提交
		$$('.scoreSubmitSearch').on('click',function(){
			var userScores = $$('.evaRightListSearch').find('input[class="abcSearch"]');
			var evatopicIds = $$('.evaRightListSearch').find('input[class="hiddenID"]');
			var indexSearch = 0;
			$.each(userScores, function(index,item) {
				var inputScore = {
				  	topicId:0,
					reportUserId:app.userId,
					userScore:0,
					totalScore:0
				}
				if($$(item).val() == ''){
					app.myApp.alert('第'+(index+1)+'项请填写！');
					indexSearch = index+1;
					scoresBySearch = [];
					return false;
				}
				inputScore.topicId = parseInt($$($$(evatopicIds)[index]).val());
				inputScore.userScore = parseFloat($$(item).val());
				scoresBySearch.push(inputScore);
			});
			console.log(scoresBySearch);
			if(scoresBySearch != ''){
				app.ajaxLoadPageContent(savePartyMemberReportDetialPath, {
					jsonArr:JSON.stringify(scoresBySearch),
				}, function(result) {
					ajaxLoadContentByYear();
					ajaxLoadContentByYearBySearch();
				});
			}else{
//				if(indexSearch == 0){
//					app.myApp.alert('第1项请填写！');
//				}else{
//					app.myApp.alert('第'+indexSearch+'项请填写！');
//				}
				
			}
		});
	}
	function resetFirstIn() {
		firstIn = 1;
	}

	return {
		init: init,
		resetFirstIn: resetFirstIn,
	}
});