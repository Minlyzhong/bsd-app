define(['app',
], function(app) {
	var $$ = Dom7;
	//查询党支部三会一课考核进度信息
	var getTopicPieChartPath = app.basePath + 'statHelper/getTopicPieChart';
	//获取年份
	var getYearsPath = app.basePath + 'knowledgeTopic/getYears';
	var deptId = '';
	var deptName = '';
	var year = '';
	var month = '';
	var season = '';
	
	//时间段
	//月份
	var threeplusMonthStartDate = '';
	var threeplusMonthEndDate = '';
	//季度
	var seasonPluxCount = 1;
	var threeplusSeasonStartDate = '';
	var threeplusSeasonEndDate = '';
	//年份
	var yearPluxCount = 1;
	var threeplusYearStartDate = '';
	var threeplusYearEndDate = '';
	//点击时间
	var clickStartDate = '';
	var clickEndDate = '';
	var CompRateOfThreePlusXAppName;

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
		deptId = app.user.deptId;
		deptName = app.user.deptName;
		console.log(app.user);
		CompRateOfThreePlusXAppName = pageData.appName
		firstIn = 0;
		pageDataStorage = {};	
		year = '';
		month = '';
		season='';
			//月份
		threeplusMonthStartDate = '';
		threeplusMonthEndDate = '';
		//季度
		seasonPluxCount = 1;
		threeplusSeasonStartDate = '';
		threeplusSeasonEndDate = '';
		//年份
		yearPluxCount = 1;
		threeplusYearStartDate = '';
		threeplusYearEndDate = '';
		//点击时间
		clickStartDate = '';
		clickEndDate = '';
		$$('.threePlusXStatisticsTitle').html(pageData.appName);
		window.setTimeout(function() {
			showInfo(deptId, deptName);
		}, 500);
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
		$$('#threePlusXStatisticsSearch').on('focus', function() {
			$$(this).css('text-align', 'left');
			$$('#threePlusXStatisticsStartTime').val();
			$$('#threePlusXStatisticsEndTime').val();
			$$('.threePlusXStatisticsCancelBtn').css('display', 'block');
			$$('.threePlusXStatisticsSearchBox').css('display', 'block');
		});
		
		$$('.threePlusXStatisticsCancelBtn').click(CancelthreePlusXStatisticsSearch);
		$$('.threePlusXStatisticsSearchClose').click(CancelthreePlusXStatisticsSearch);
		
		$$('.threePlusXStatisticsSearchBox .resetBtn').click(clearthreePlusXStatisticsSearch);
		
		$$('.threePlusXStatisticsSearchBox .searchBtn').click(function(){
			$$('.threePlusXStatisticsSearchBox').css('display', 'none');
//			if($$("#threePlusXStatisticsStartTime").val() == '' && $$("#threePlusXStatisticsEndTime").val() != ''){
//				app.myApp.alert('请选择开始时间！');
//			return;
//			}
//			if($$("#threePlusXStatisticsEndTime").val() == '' && $$("#threePlusXStatisticsStartTime").val() != ''){
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
//			startTime = year+'-'+month;
//			endTime = year1+'-'+month1;
//			console.log(startTime);
//			console.log(endTime);
			setTimeout(function() {
				showInfo(deptId, deptName);
			}, 500);
		});		
		var pickerDescribe;
		var pickerDescribePlusSeason;
		var pickerDescribePlusYear;
				
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
		threeplusMonthStartDate = year+'-'+month+'-1';
		threeplusMonthEndDate = year+'-'+month+'-31';
		$$(".threePlusMonthTime").on('click',function(){
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
				threeplusMonthStartDate = year+'-'+month+'-1';
				threeplusMonthEndDate = year+'-'+month+'-31';
				setTimeout(function(){
					showInfo(deptId, deptName);
				},100);
			});
		});
		
		
		//季度时间判断
		if(month<=3){
			$("#picker-describeSeason").val(year+'年 '+ '第一季度');
			threeplusSeasonStartDate = year+'-1-1';
			threeplusSeasonEndDate = year+'-3-31';
		}else if(month>3 && month<=6){
			$("#picker-describeSeason").val(year+'年 '+ '第二季度');
			threeplusSeasonStartDate = year+'-4-1';
			threeplusSeasonEndDate = year+'-6-31';
		}else if(month>6 && month<=9){
			$("#picker-describeSeason").val(year+'年 '+ '第三季度');
			threeplusSeasonStartDate = year+'-7-1';
			threeplusSeasonEndDate = year+'-9-31';
		}else if(month>9 && month<=12){
			$("#picker-describeSeason").val(year+'年 '+ '第四季度');
			threeplusSeasonStartDate = year+'-10-1';
			threeplusSeasonEndDate = year+'-12-31';
		}
		$$(".threePlusSeasonTime").on('click',function(){
			pickerDescribeSeason.open();
			$$('.picker-3d .close-picker').text('完成');
			$$('.toolbar-inner .right').css('margin-right','20px');	
			$$('.picker-3d .close-picker').on('click',function(){
				$$('.shykNotFound').css('display','none');
				year = pickerDescribeSeason.value[0].substring(0,pickerDescribeSeason.value[0].length-1);
				season = pickerDescribeSeason.value[1].substring(0,pickerDescribeSeason.value[1].length);
				if(season == '第一季度'){
					threeplusSeasonStartDate = year+'-1-1';
					threeplusSeasonEndDate = year+'-3-31';
				}else if(season == '第二季度'){
					threeplusSeasonStartDate = year+'-4-1';
					threeplusSeasonEndDate = year+'-6-31';
				}else if(season == '第三季度'){
					threeplusSeasonStartDate = year+'-7-1';
					threeplusSeasonEndDate = year+'-9-31';
				}else if(season == '第四季度'){
					threeplusSeasonStartDate = year+'-10-1';
					threeplusSeasonEndDate = year+'-12-31';
				}
				$("#picker-describeSeason").val(year+'年 '+ season);
				setTimeout(function(){
					showInfoBySeason(deptId, deptName);
				},100);
			});
		});
		
		
		//年份时间判断
		$("#picker-describeYear").val(year+'年 ');
		threeplusYearStartDate= year+'-1-1';
		threeplusYearEndDate= year+'-12-31';
		$$(".threePlusYearTime").on('click',function(){
			pickerDescribeYear.open();
			$$('.picker-3d .close-picker').text('完成');
			$$('.toolbar-inner .right').css('margin-right','20px');	
			$$('.picker-3d .close-picker').on('click',function(){
				$$('.shykNotFound').css('display','none');
				year = pickerDescribeYear.value[0].substring(0,pickerDescribeYear.value[0].length-1);
				threeplusYearStartDate= year+'-1-1';
				threeplusYearEndDate= year+'-12-31';
				$("#picker-describeYear").val(year+'年 ');
				setTimeout(function(){
					showInfoByYear(deptId, deptName);
				},100);
			});
		});
		
		
		//点击tab标签
		//月份
		$$('.buttonShyk').on('click',function(){
//			setTimeout(function(){
//				showInfo(deptId, deptName);
//			},100);
		});
		//季度
		$$('.buttonShykSeason').on('click',function(){
			console.log(seasonPluxCount);
			if(seasonPluxCount == 1){
				setTimeout(function(){
					showInfoBySeason(deptId, deptName);
				},500);
				seasonPluxCount += 1;
			}
			
		});
		//年份
		$$('.buttonShykYear').on('click',function(){
			console.log(yearPluxCount);
			if(yearPluxCount == 1){
				setTimeout(function(){
					showInfoByYear(deptId, deptName);
				},500);
				yearPluxCount += 1;
			}
		});	
	}
	
	function refreshPlusX(){
		setTimeout(function() {
				showInfo(deptId, deptName);
		}, 500);
	}
	
	/*
	 * 点击取消
	 */
	function CancelthreePlusXStatisticsSearch(){
		$$('#threePlusXStatisticsSearch').css('text-align', 'center');
		$$('.threePlusXStatisticsCancelBtn').css('display', 'none');
		$$('.threePlusXStatisticsSearchBox').css('display', 'none');
		startTime = "";
		endTime = "";
		$$('#threePlusXStatisticsStartTime').val('');
		$$('#threePlusXStatisticsEndTime').val('');
		setTimeout(function() {
				showInfo(deptId, deptName);
		}, 500);
	}
	
	function clearthreePlusXStatisticsSearch(){
		$$('#threePlusXStatisticsStartTime').val('');
		$$('#threePlusXStatisticsEndTime').val('');
		startTime = "";
		endTime = "";
	}
	
	/**
	 * 显示基本情况 
	 */
	function showInfo(deptId, deptName) {
		console.log(threeplusMonthStartDate);
		console.log(threeplusMonthEndDate);
		var partyCompRateHtml= '';
		console.log(deptId);
		app.ajaxLoadPageContent(getTopicPieChartPath, {
			deptId: deptId,
			startDate:threeplusMonthStartDate,
			endDate:threeplusMonthEndDate,
			userId:app.userId,
		}, function(result) {
			console.log(result);
			partyCompRateHtml = '<div class="signChart" id="atdChart"></div>' +	
				'<div class="row no-gutter signList">' +
					'<div class="col-50 grid good grid1" data-type="yes">' +
						'已参与：<span style="display: inline;"></span>' +
					'</div>' +
					'<div class="col-50 grid notYet grid1" data-type="no">' +
						'未参与：<span style="display: inline;"></span>' +
					'</div>' +
				'</div>';
			pageDataStorage['CompRate'] = result;
			pageDataStorage['deptName'] = deptName;
			console.log(deptId)
			pageDataStorage['deptId1'] = deptId;
		}, {
			async: false
		});
		$$('.threePlusXStatisticsPage').html(partyCompRateHtml);
		handleCompletion(pageDataStorage['CompRate'],pageDataStorage['deptName'],pageDataStorage['deptId1']);
		app.myApp.hidePreloader();
	}
	function handleCompletion(result,deptName,deptId){
		console.log(result);
		console.log(deptId);
		$$('.good span').html(result['topicCompleted']);
		$$('.notYet span').html(result['unCompletedTotal']);
		$$('.no-gutter .grid1').on('click', gridClick);
		loadChart('atdChart', '3+x统计进度信息', result,deptName,deptId);
	}
	
	//季度
	function showInfoBySeason(deptId, deptName) {
		console.log(threeplusSeasonStartDate);
		console.log(threeplusSeasonEndDate);
		var partyCompRateHtmlSeason= '';
		console.log(deptId);
		app.ajaxLoadPageContent(getTopicPieChartPath, {
			deptId: deptId,
			startDate:threeplusSeasonStartDate,
			endDate:threeplusSeasonEndDate,
			userId:app.userId,
		}, function(result) {
			console.log(result);
			partyCompRateHtmlSeason = '<div class="signChart" id="atdChartSeason"></div>' +	
				'<div class="row no-gutter signList">' +
					'<div class="col-50 grid goodSeason grid1Season" data-type="yes">' +
						'已参与：<span style="display: inline;"></span>' +
					'</div>' +
					'<div class="col-50 grid notYetSeason grid1Season" data-type="no">' +
						'未参与：<span style="display: inline;"></span>' +
					'</div>' +
				'</div>';
			pageDataStorage['CompRateSeason'] = result;
			pageDataStorage['deptNameSeason'] = deptName;
			console.log(deptId)
			pageDataStorage['deptId1'] = deptId;
		}, {
			async: false
		});
		$$('.threePlusXStatisticsPageSeason').html(partyCompRateHtmlSeason);
		handleCompletionBySeason(pageDataStorage['CompRateSeason'],pageDataStorage['deptNameSeason'],pageDataStorage['deptId1']);
		app.myApp.hidePreloader();
	}
	function handleCompletionBySeason(result,deptName,deptId){
		console.log(result);
		console.log(deptId);
		$$('.goodSeason span').html(result['topicCompleted']);
		$$('.notYetSeason span').html(result['unCompletedTotal']);
		$$('.no-gutter .grid1Season').on('click', gridClick);
		loadChart('atdChartSeason', '3+x统计进度信息', result,deptName,deptId);
	}
	
	//年度
	function showInfoByYear(deptId, deptName) {
		console.log(threeplusYearStartDate);
		console.log(threeplusYearEndDate);
		var partyCompRateHtmlYear= '';
		console.log(deptId);
		app.ajaxLoadPageContent(getTopicPieChartPath, {
			deptId: deptId,
			startDate:threeplusYearStartDate,
			endDate:threeplusYearEndDate,
			userId:app.userId,
		}, function(result) {
			console.log(result);
			partyCompRateHtmlYear = '<div class="signChart" id="atdChartYear"></div>' +	
				'<div class="row no-gutter signList">' +
					'<div class="col-50 grid goodYear grid1Year" data-type="yes">' +
						'已参与：<span style="display: inline;"></span>' +
					'</div>' +
					'<div class="col-50 grid notYetYear grid1Year" data-type="no">' +
						'未参与：<span style="display: inline;"></span>' +
					'</div>' +
				'</div>';
			pageDataStorage['CompRateYear'] = result;
			pageDataStorage['deptNameYear'] = deptName;
			console.log(deptId)
			pageDataStorage['deptId1'] = deptId;
		}, {
			async: false
		});
		$$('.threePlusXStatisticsPageYear').html(partyCompRateHtmlYear);
		handleCompletionByYear(pageDataStorage['CompRateYear'],pageDataStorage['deptNameYear'],pageDataStorage['deptId1']);
		app.myApp.hidePreloader();
	}
	function handleCompletionByYear(result,deptName,deptId){
		console.log(result);
		console.log(deptId);
		$$('.goodYear span').html(result['topicCompleted']);
		$$('.notYetYear span').html(result['unCompletedTotal']);
		$$('.no-gutter .grid1Year').on('click', gridClick);
		loadChart('atdChartYear', '3+x统计进度信息', result,deptName,deptId);
	}
	
	/**
	 * 加载图表 
	 * @param {Object} chartId
	 * @param {Object} title
	 * @param {Object} data
	 */
	function loadChart(chartId, title, data,deptName,deptId) {
		Highcharts.chart(chartId, {
			chart: {
				type: 'pie',
				options3d: {
					enabled: true,
					alpha: 45,
					beta: 0
				}
			},
			colors: [
				'#7CB5EC',
				'#818187',
			],
			title: {
				text:title,
				y: 25,
			},
			subtitle: {
				text: deptName+'计划参与次数：' + data['topicTotal'] + '次',
				y: 45
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			},
			plotOptions: {
				pie: {
					size: 180,
					center: ['52%', '45%'],
					allowPointSelect: false,
					depth: 30,
					point: {
						events: {
							click: function() {
								loadPage(this.name,deptId);
							}
						}
					},
					dataLabels: {
						distance: 5,
						connectorPadding: 0,
						connectorColor: 'gray',
						enabled: true,
						formatter: function() {
							if(this.percentage > 0) {
								var percen = app.utils.getDecimal(this.percentage, 1);
								return this.point.name + ': ' + this.y + '<br />' + percen + '%';
							}
						}
					}
				}
			},
			series: [{
				type: 'pie',
				name: '比例',
				data: [
					['已参与', data['topicCompleted']],
					['未参与', data['unCompletedTotal']],
				]
			}]
		});
	}
	/**
	 *  点击完成度标签
	 */
	function gridClick() {
		var type = $$(this).html().split('：')[0].trim();
		var count = $$($$(this).find('span')).html();
		if(count != 0) {
			
			loadPage(type,pageDataStorage['deptId1']);
		}
	}

	/**
	 * 页面跳转 
	 * @param {Object} type
	 */
	function loadPage(type,deptId) {
		var monthClassName = $('#tab1').hasClass('active');
		var seasonClassName = $('#tab2').hasClass('active');
		var yearClassName = $('#tab3').hasClass('active');
		console.log(monthClassName);
		console.log(seasonClassName);
		console.log(yearClassName);
		if(monthClassName){
			clickStartDate = threeplusMonthStartDate;
			clickEndDate = threeplusMonthEndDate;
		}else if(seasonClassName){
			clickStartDate = threeplusSeasonStartDate;
			clickEndDate = threeplusSeasonEndDate;
		}else if(yearClassName){
			clickStartDate = threeplusYearStartDate;
			clickEndDate = threeplusYearEndDate;
		}
		console.log(type);
		console.log(deptId);
		console.log(deptName);
		console.log(clickStartDate);
		console.log(clickEndDate);
		console.log('123');
		if(type == '已参与') {
			app.myApp.getCurrentView().loadPage('threeMeetingsAndOneClassD.html?type=1&startTime='+clickStartDate+'&endTime='+clickEndDate+'&topicId=0'+'&branchName='+deptName+'&deptId='+deptId);
		} else {
			app.myApp.getCurrentView().loadPage('ThreeMeetingsAndOneClassUD.html?type=0&startTime='+clickStartDate+'&endTime='+clickEndDate+'&topicId=0'+'&branchName='+deptName+'&deptId='+deptId);
		}
	}
	

	function resetFirstIn() {
		firstIn = 1;
	}

	return {
		init: init,
		refreshPlusX:refreshPlusX,
		resetFirstIn: resetFirstIn,
	}
});