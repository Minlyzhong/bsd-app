define(['app',
	'hbs!js/hbs/signReport'
], function(app, reportTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//考勤统计
	var signReportPath = app.basePath + 'extApplicationPage/getSignReport';
	//统计导航栏的点击次数
	var weekChoose = 0;
	var monthChoose = 0;
	var dayChoose = 0;
	//日周月的时间选择器
	var dayCal = '';
	var weekCal = '';
	var monthPick = '';
	//日周月当前选择的时间
	var dateTime = {};
	//月的时间选择器显示的内容
	var monthContent = '';
	//日周月的个人信息汇总
	var peopleList = {};
	//日周月的考勤人数汇总
	var dataList = {};
	//当前选择器选择的类别
	var pickChoose = 'day';
	var dateChoose = '';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('signReport/signReport', [
//			'signReport/signDetail',
//		]);
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
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
		weekChoose = 0;
		monthChoose = 0;
		dayChoose = 0;
		dayCal = '';
		weekCal = '';
		monthPick = '';
		dateTime = {};
		monthContent = '';
		peopleList = {};
		dataList = {};
		pickChoose = 'day';
		var today = app.utils.getCurTime().split(" ")[0];
		dateTime['day'] = today;
		dateTime['week'] = today;
		dateTime['month'] = today;
		monthContent = [new Date().getFullYear() + '', ("0" + (new Date().getMonth() + 1)).slice(-2)];
		dateChoose = [app.utils.getCurTimeWithDay(), getWeekId(), monthContent];
		$$('.' + pickChoose + 'Pick').addClass('active');
		$$('.' + pickChoose + 'Page').addClass('active');
		//添加点击事件
		getSignReport(pickChoose, dateTime[pickChoose]);
		//初始化时间选择器
		datePicker([dateChoose[0], dateChoose[1], dateChoose[2]]);
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		$$('.' + pickChoose + 'Pick').addClass('active');
		$$('.' + pickChoose + 'Page').addClass('active');
		datePicker([dateChoose[0], dateChoose[1], dateChoose[2]]);
		if(dayChoose == 1) {
			handleSignReport(pageDataStorage['day'], 'day');
		}
		if(weekChoose == 1) {
			handleSignReport(pageDataStorage['week'], 'week');
		}
		if(monthChoose == 1) {
			handleSignReport(pageDataStorage['month'], 'month');
		}
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.signBtnRow').find('a').on('click', function() {
			pickChoose = $$(this).data('type');
			getSignReport(pickChoose, dateTime[pickChoose]);
		});
	}

	/**
	 * 加载考勤统计
	 */
	function getSignReport(type, _date) {
		if((type == 'day' && dayChoose == 1) ||
			(type == 'week' && weekChoose == 1) ||
			(type == 'month' && monthChoose == 1)) {
			return;
		}
		app.ajaxLoadPageContent(signReportPath, {
			deptId: app.user.deptId,
			type: type,
			date: _date
		}, function(data) {
			data = data.data;
			console.log(data);
			pageDataStorage[type] = data;
			handleSignReport(data, type);
		});
	}

	/**
	 * 整理数据
	 * 
	 * @param {Object} data 服务器返回的字段
	 * @param {Object} type 查看类别
	 */
	function handleSignReport(data, type) {
		//统计人数
		var countObj = {};
		var infoObj = {};
		//data  总数组
		for(var key in data) {
			if(key == 'total') {
				continue;
			}
			countObj[key] = 0;
			var userIdArr = [];
			//data[key]   正常人数的数组
			infoObj[key] = {};
			var infoKeyObj = infoObj[key];
			$$.each(data[key], function(index, item) {
				if($.inArray(item.userId, userIdArr) == -1) {
					countObj[key]++;
					userIdArr.push(item.userId);
					infoKeyObj[item.userId] = [];
				}
				infoKeyObj[item.userId].push(item);
			});
		}
		//保存总人数
		countObj.type = type;
		countObj.total = data['total'];
		console.log(countObj);
		dataList[type] = countObj;

		//保存用户记录
		peopleList[type] = infoObj;
		console.log(peopleList);

		$$('.' + type + 'Report').html(reportTemplate(dataList[type]));
		if(type == 'day') {
			dayChoose = 1;
			loadChart("signDayChart", '日统计', dataList[type]);
		} else if(type == 'week') {
			weekChoose = 1;
			loadChart("signWeekChart", '周统计', dataList[type]);
		} else {
			monthChoose = 1;
			loadChart("signMonthChart", '月统计', dataList[type]);
		}
		$$('.' + type + 'Report .row.signList .grid').on('click', function() {
			var signtype = $$(this).data('type');
			var title = $$(this).html().split("：")[0];
			dateChoose = [$$('#dayCalId').val(), $$('#weekId').val(), monthContent];
			app.myApp.getCurrentView().loadPage('signDetail.html?title=' + title +
				'&item=' + JSON.stringify(peopleList[type][signtype]));
		});
	}

	function getWeekId() {
		var weekDay = new Date().getDay() - 1;
		var firstDay = app.utils.getSpecialDate(new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate(), weekDay * -1).split(" ")[0];
		var secondDay = app.utils.getSpecialDate(new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate(), 4 - weekDay).split(" ")[0];
		if(new Date(secondDay) > new Date()) {
			secondDay = app.utils.getCurTime().split(" ")[0];
		}
		return firstDay + '   -   ' + secondDay;
	}

	//加载图表
	function loadChart(chartId, title, data) {
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
				'#F7A35C',
				//             '#8085E9',
				//  早退
				//				'#F15C80',
				'#818187',
			],
			title: {
				text: title,
				y: 25,
				x: 100
			},
			subtitle: {
				text: '应到人数：' + data['total'] + '人',
				y: 45,
				x: 100
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
					dataLabels: {
						distance: 10,
						connectorPadding: 0,
						connectorColor: 'gray',
						enabled: true,
						formatter: function() {
							if(this.percentage > 0) {
								var percen = app.utils.getDecimal(this.percentage, 1);
								return this.point.name + ': ' + percen + '%';
							}
						}
					}
				}
			},
			series: [{
				type: 'pie',
				name: '比例',
				data: [
					['正常', data.good],
					['迟到', data.late],
					//					['早退', data.early],
					['缺勤', data.notYet],
				]
			}]
		});
	}

	/**
	 * 时间选择器 
	 * @param {Object} type  时间选择器的类别
	 */
	function datePicker(dateChoose) {
		$$('#dayCalId').val(dateChoose[0]);
		dayCalendar();
		$$('#weekId').val(dateChoose[1]);
		weekCalendar();
		monthPicker(dateChoose[2]);
	}

	/**
	 * 日统计日历初始化
	 */
	function dayCalendar() {
		if(dayCal) {
			dayCal.destroy();
		}
		dayCal = app.myApp.calendar({
			input: '#dayCalId',
			toolbarCloseText: '完成',
			headerPlaceholder: '选择的日期',
			monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
			dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
			dateFormat: 'yyyy-mm-dd DD',
			closeOnSelect: true,
			disabled: {
				from: new Date(),
			},
			onDayClick: function(_, _, year, month, day) {
				month = app.utils.getTwoBitNumber(parseInt(month) + 1);
				day = app.utils.getTwoBitNumber(day);
				if(year + '-' + month + '-' + day != $$('#dayCalId').val().split(" ")[0]) {
					//					console.log(year + '-' + month + '-' + day);
					dayChoose = 0;
					dateTime['day'] = year + '-' + month + '-' + day;
					getSignReport('day', dateTime['day']);
				}
			}
		});
	}

	/**
	 * 周统计日历初始化
	 */
	function weekCalendar() {
		if(weekCal) {
			weekCal.destroy();
		}
		weekCal = app.myApp.calendar({
			input: '#weekCalId',
			toolbarCloseText: '完成',
			headerPlaceholder: '选择的日期',
			monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
			dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
			dateFormat: '',
			closeOnSelect: true,
			disabled: {
				from: new Date(),
			},
			onDayClick: function(_, _, year, month, day) {
				month = parseInt(month) + 1;
				var weekDay = new Date(year + '/' + month + '/' + day).getDay() - 1;
				var firstDay = app.utils.getSpecialDate(year + '/' + month + '/' + day, weekDay * -1).split(" ")[0];
				var secondDay = app.utils.getSpecialDate(year + '/' + month + '/' + day, 4 - weekDay).split(" ")[0];
				if(new Date(secondDay) > new Date()) {
					secondDay = app.utils.getCurTime().split(" ")[0];
				}
				if(firstDay + '   -   ' + secondDay != $$('#weekId').val()) {
					//请求数据
					//					console.log(year + '-' + month + '-' + day);
					weekChoose = 0;
					dateTime['week'] = year + '-' + app.utils.getTwoBitNumber(month) + '-' + app.utils.getTwoBitNumber(day);
					$$('#weekId').val(firstDay + '   -   ' + secondDay);
					getSignReport('week', dateTime['week']);
				}
			}
		});
	}

	/**
	 *  月统计日历初始化
	 */
	function monthPicker(monthDate) {
		if(monthPick) {
			monthPick.destroy();
		}
		var yearArr = [];
		var currentYear = new Date().getFullYear();
		for(var i = 0; i < 5; i++) {
			yearArr.push(currentYear - i);
		}
		monthPick = app.myApp.picker({
			input: '#monthId',
			rotateEffect: true,
			toolbarTemplate: '<div class="toolbar">' +
				'<div class="toolbar-inner">' +
				'<div class="left">' +
				'<a href="#" class="link"></a>' +
				'</div>' +
				'<div class="right">' +
				'<a href="#" class="link close-picker">完成</a>' +
				'</div>' +
				'</div>' +
				'</div>',
			formatValue: function(p, values, displayValues) {
				//				console.log(values[0]);
				return values[0] + '年 - ' + values[1] + '月';
			},
			value: [monthDate[0], monthDate[1]],
			cols: [{
				values: yearArr
			}, {
				divider: true,
				content: '年',
				width: 50,
			}, {
				values: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
				width: 100,
				textAlign: 'right'
			}, {
				divider: true,
				content: '月',
				width: 50,
			}, ],
			onOpen: function(picker) {
				picker.container.find('.close-picker').on('click', function() {
					if(JSON.stringify(monthContent) != JSON.stringify([picker.value[0], picker.value[1]])) {
						monthChoose = 0;
						//					console.log(picker.value[0] + '-' + picker.value[1] + '-01');
						monthContent = [picker.value[0], picker.value[1]];
						dateTime['month'] = picker.value[0] + '-' + picker.value[1] + '-01';
						getSignReport('month', dateTime['month']);
					}
				});
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