define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//支部月数据  季度数据  年数据
	var loadDeptRankMonthChartPath = app.basePath + '/mobile/partyAm/loadRank';
	var loadDeptRankQuarterChartPath = app.basePath + '/mobile/partyAm/loadRank';
	var loadDeptRankYearChartPath = app.basePath + '/mobile/partyAm/loadRank';
	var deptId = 0;
	var timeType =1;
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('deptRank/deptRankChart', [
//			
//		]);
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
		attrDefine(page);
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
		deptId = pageData.deptId;
		ajaxLoadContent();
		timeType = 1;
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {

	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.deptRC .pageTitle').html(page.query.title);
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.deptRankCal').on('click', timePicker);
	}

	/**
	 * 时间选择器 
	 */
	function timePicker() {
		var clickedLink = this;
		var popoverHTML = '<div class="popover" style="width: 30%;">' +
			'<div class="popover-inner">' +
			'<div class="list-block dynamicPopover rankPopover">' +
			'<ul>' +
			'<li><a href="#" data-type="1">近一月</a></li>' +
			'<li><a href="#" data-type="3">近三月</a></li>' +
			'<li><a href="#" data-type="6">近半年</a></li>' +
			'<li><a href="#" data-type="12">近一年</a></li>' +
			'</ul>' +
			'</div>' +
			'</div>' +
			'</div>'
		var popover = app.myApp.popover(popoverHTML, clickedLink);
		$$('.rankPopover li a').on('click', function() {
			app.myApp.closeModal(popover);
		});
		$$('.rankPopover li').on('click', function() {
			if($$(this).find('a').html() != $$('.deptRankCal').html()) {
				time = $$(this).find('a').html()
				$$('.deptRankCal').html(time);
				timeType = $$(this).find('a').data('type');
				$$('.deptRankCal').data('type', timeType);
				console.log(timeType)
				ajaxLoadContent();
			}
		});
	}

	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent() {
		var loadPath = '';
		var type = parseInt($$('.deptRankCal').data('type'));
		loadPath = loadDeptRankMonthChartPath;
		var date=new Date();
		var year=date.getFullYear();
		// var month=date.getMonth()+1>10?date.getMonth()+1:'0'+date.getMonth()+1;
		// var day=date.getDate()>10?date.getDate():'0'+date.getDate();
		var month = date.getMonth() + 1<10? "0"+(date.getMonth() + 1):date.getMonth() + 1;
		var day = date.getDate()<10? "0" + date.getDate():date.getDate();
		var nowdatestr=year+"-"+month+"-"+day;
		
		// 近一个月
		
		console.log(spetime);
		if(timeType){
			var spetime = getPreMonthDay(nowdatestr,timeType)
		} else{
			var spetime = getPreMonthDay(nowdatestr,1)
		}
		// // 近3个月
		// var spetime = getPreMonthDay(nowdatestr,3)
		// console.log(spetime);
		// // 近6个月
		// var spetime = getPreMonthDay(nowdatestr,6)
		// console.log(spetime);
		// // 近12个月
		// var spetime = getPreMonthDay(nowdatestr,12)
		// console.log(spetime);
		// if(type == 0) {
			
		// } else if(type == 1) {
			
		// } else if(type == 2){
			
		// }else{

		// }

		app.ajaxLoadPageContent(loadPath, {
			deptId: deptId,
			startDate: spetime,
			endDate: nowdatestr
		}, function(data) {
			console.log(data);
			var data = data.data;
			if(data.length > 0) {
				var titleArr = [];
				var pointArr = [];
				var rankArr = [];
				$$.each(data, function(_, item) {
					//  "score": 分数,
					//  "rank": 排名,
					//  "date": "日期"
					titleArr.push(item.statisticsTime.split(' ')[0]);
					pointArr.push(item.totalScore);
					rankArr.push(item.totalRank);
				});
				loadChart(titleArr, pointArr, rankArr);
			} else {
				$$('#rankChart').html('');
			}
		});
	}

	/**
	 * 绘制图表 
	 */
	function loadChart(titleArr, pointArr, rankArr) {
		$('#rankChart').highcharts({
			chart: {
				//				type: 'spline',
				marginTop: 80,
				spacingTop: 20
			},
			title: {
				text: '支部统计图',
			},
			xAxis: {
				categories: titleArr,
				type: 'datetime',
				minTickInterval: 4,
			},
			yAxis: [{
				//				min: 1,
				title: {
					align: 'high',
					offset: 0,
					rotation: 0,
					y: -10,
					x: -10,
					text: '得分'
				},
				plotLines: [{
					value: 0,
					width: 1,
					color: '#808080'
				}]
			}, {
				reversed: true,
				opposite: true,
//				startOnTick: true,
				tickInterval: 1,
//				min: 1,
//				minRange: 1,
				title: {
					align: 'high',
					offset: 0,
					rotation: 0,
					y: -10,
					x: 10,
					text: '排名'
				},
				plotLines: [{
					value: 0,
					width: 1,
					color: '#808080'
				}],
			}],
			credits: {
				enabled: false
			},
			plotOptions: {
				series: [{
					color: '#FF0000'
				},{
					color: '#dddddd'
				}],
				line: {
					lineWidth: 3,
				}
				//				spline: {
				//					lineWidth: 4,
				//					states: {
				//						hover: {
				//							lineWidth: 5
				//						}
				//					},
				//					marker: {
				//						enabled: false
				//					},
				//				}
			},
			legend: {
				layout: 'vertical',
				align: 'left',
				verticalAlign: 'top',
				x: 0,
				y: -10,
				floating: true,
				borderWidth: 1,
				backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
				shadow: true
			},
			series: [{
				name: '得分',
				data: pointArr,
				color: '#7cb5ec',
			}, {
				name: '排名',
				data: rankArr,
				color: '#ea8f47',
				yAxis: 1
			}]
		});
	}


	//获取当前日期前N个月的日期
    function getPreMonthDay(date,monthNum)
    {
		
        var dateArr = date.split('-');
        var year = dateArr[0]; //获取当前日期的年份
        var month = dateArr[1]; //获取当前日期的月份
        var day = dateArr[2]; //获取当前日期的日
        var days = new Date(year, month, 0);
		days = days.getDate(); //获取当前日期中月的天数
		if(monthNum>=12){
			var year2 = year-1;
			var month2 = parseInt(month);
		}else{
			var year2 = year;
			var month2 = parseInt(month) - monthNum;
		}
        
		console.log(month2)
        if (month2 <=0) {
			year2 = parseInt(year2) - parseInt(month2 / 12 == 0 ? 1 : parseInt(month2) / 12);
			console.log(month2 / 12)
			console.log(parseInt(month2) / 12)
            month2 = 12 - (Math.abs(month2) % 12);
		}
		// if (month2 <=0 ) {
        //     year2 = parseInt(year2) - parseInt(month2 / 12 == 0 ? 1 : parseInt(month2) / 12)-1;
        //     month2 = 12 - (Math.abs(month2) % 12);
        // }
        var day2 = day;
        var days2 = new Date(year2, month2, 0);
        days2 = days2.getDate();
        if (day2 > days2) {
            day2 = days2;
        }
        if (month2 < 10) {
            month2 = '0' + month2;
        }
        var t2 = year2 + '-' + month2 + '-' + day2;
        return t2;
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