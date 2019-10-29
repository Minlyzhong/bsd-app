define(['app',
	'hbs!js/hbs/signReportSpecial',
	'hbs!js/hbs/signReportSpecialPlayer'
], function(app, reportTemplate,reportPlayerTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//考勤统计
	var signReportPath = app.basePath + '/mobile/sign/statistics/';
	//根据分类代号查找分类
	var findTypeByCodePath = app.basePath + '/mobile/sign/codes';
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
	
	var deptNameSign = '';
	var deptSign = '';
	var deptId = '';
	var signDate;
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
		deptNameSign = '';
		deptSign = '';
		deptId = '';
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
		signDate = dateTime[pickChoose];
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
			signDate = dateTime[pickChoose];
			getSignReport(pickChoose, dateTime[pickChoose]);
		});
		//点击添加的时候触发
		$$('.addSignLeader').click(function(){
				app.myApp.getCurrentView().loadPage('signResultAddDept.html?deptType=1');
		});
		//点击移除的时候触发
		$$('.removeSignLeader').click(function(){
			$$('#signDept').val('');
			deptSign = '';
			deptNameSign = '';
		});
		//点击分类div触发事件
		$$('.assessmentSort').click(assessmentSortSearch);
		//点击查询按钮
		$$('.signSearchBtn').click(function(){
			$('.signOrganization').slideToggle(200);
			setTimeout(function(){
				signDate = dateTime[pickChoose];
				getSignReport(pickChoose, dateTime[pickChoose]);
			},100);
		});
		//点击取消按钮
		$$('.signCloseBtn').click(function(){
			$('.signOrganization').slideToggle(200);
			deptSign = '';
			deptNameSign = '';
			$$("#signDept").val('');
			signDate = dateTime[pickChoose];
			getSignReport(pickChoose, dateTime[pickChoose]);
		});
		
		//var result = [];
		//var resultId = [];
		//var result1 = [];
		//var result1Id = [];
		var result2 = [];
		var result2Id = [];
		var pickerDescribe;
		/*
		 * HKRYFL(人员分类)
		 *ZBTYPE(支部分类)
		 *DZZLX(党组织类型)
		 */
//		app.ajaxLoadPageContent1(findTypeByCodePath,{
//			code:"DZZLX",
//		},function(data){
//			$$.each(data, function(index, item) {
//				result[index] = item.subVal.toString();
//				resultId[index] = item.subKey.toString();
//			});
//		});
//		app.ajaxLoadPageContent1(findTypeByCodePath,{
//			code:"ZBTYPE",
//		},function(data){
//			$$.each(data, function(index, item) {
//				result1[index] = item.subVal.toString();
//				result1Id[index] = item.subKey.toString();
//			});
//		});
		app.ajaxLoadPageContent1(findTypeByCodePath,{
			code:"HKRYFL",
		},function(data){
			$$.each(data, function(index, item) {
				result2[index] = item.subVal.toString();
				result2Id[index] = item.subKey.toString();
			});
		});
//		var carVendors = {
//		     党组织类型 : result,
//		     支部分类 : result1,
//		     人员分类 : result2
//		};	
//		var carVendorsValues = {
//		     党组织类型 : resultId,
//		     支部分类 : result1Id,
//		     人员分类 : result2Id
//		};	
		var carVendors = {
		     人员分类 : result2
		};	
		var carVendorsValues = {
		     人员分类 : result2Id
		};	
		console.log(carVendors);
		console.log(carVendorsValues);
		pickerDescribe = app.myApp.picker({
    		input: '#picker-sort',
		    rotateEffect: true,
			formatValue: function (picker, values,displayValues) {
		        return displayValues[1];
		    },
			cols: [
		        {
		            textAlign: 'center',
		            displayValues: ['人员分类'],
		            values: ['4'],
		            onChange: function (picker,value,displayValues) {
		                if(picker.cols[1].replaceValues){
		                    picker.cols[1].replaceValues(carVendorsValues[displayValues],carVendors[displayValues]);
		                }
		            }
		        },
		        {
		        	displayValues:carVendors.人员分类,
		            values:carVendorsValues.人员分类,
		            width: 160,
		        },
		    ]
		});
		
		$$(".sortTypeChoose").on('click',function(){
			pickerDescribe.open();
			$$('.picker-3d .close-picker').text('完成');
			$$('.toolbar-inner .right').css('margin-right','20px');	
			$$('.picker-3d .close-picker').on('click',function(){
				console.log(pickerDescribe.value);
			});
		});
	}
	function assessmentSortSearch(){
		var sortImg = $$('.sortIcon').attr("src");
		var sortImgUrl = '';
		if(sortImg == 'img/assessmentResultImg/downIcon.png'){
			sortImgUrl = 'img/assessmentResultImg/upIcon.png';
			//弹出搜索框
			$('.signOrganization').slideToggle(200);
		}else{
			sortImgUrl = 'img/assessmentResultImg/downIcon.png';
			//隐藏搜索框
			$('.signOrganization').slideToggle(200);
		}
		$$('.sortIcon').prop("src",sortImgUrl);
	}
	
	/*
	 * 获取组织的名称和ID
	 */
	function getdeptName(deptNameSign1,deptSign1){
		deptNameSign = deptNameSign1;
		deptSign = deptSign1;
		$$('#signDept').val(deptNameSign);
		console.log(deptNameSign);
		console.log(deptSign);
	}
	
	/**
	 * 加载考勤统计
	 */
	function getSignReport(type, _date) {
//		if((type == 'day' && dayChoose == 1) ||
//			(type == 'week' && weekChoose == 1) ||
//			(type == 'month' && monthChoose == 1)) {
//			return;
//		}
//		console.log(deptSign == '');
//		console.log(deptSign);
		if(deptSign == ''){
			deptId = app.userDetail.deptId;
		}else{
			deptId = deptSign;
		}	
		console.log(app.roleId);
		console.log(app.userId);
		app.ajaxLoadPageContent(signReportPath+deptId+'/'+type, {
			// deptId: deptId,
			// type: type,
			date: _date,
			roleId:app.roleId,
			// userId:app.userId
		}, function(data) {
			console.log(data);
			//pageDataStorage[type] = data;
			handleSignReport(data.data, type);
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
		console.log('统计人数')
		console.log(data)
		console.log(type)
		var countObj = {};
		countObj.absentTotal = data['absent'];
		countObj.askForLeaveTotal = data['vocation'];
		countObj.businessTripTotal = data['trip'];
		countObj.normalTotal = data['normal'];
		countObj.type = type;
		countObj.total = data['base'];
		dataList[type] = countObj;
		if(app.roleId == 3 || app.roleId == 8){
			$$('.' + type + 'Report').html(reportPlayerTemplate(dataList[type]));
			if(type == 'day') {
				dayChoose = 1;
				loadChartPlayer("signDayChart", '日统计', dataList[type]);
			} else if(type == 'week') {
				weekChoose = 1;
				loadChartPlayer("signWeekChart", '周统计', dataList[type]);
			} else {
				monthChoose = 1;
				loadChartPlayer("signMonthChart", '月统计', dataList[type]);
			}
		}else{
			$$('.' + type + 'Report').html(reportPlayerTemplate(dataList[type]));
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
			//点击
			$$('.' + type + 'Report .row.signList .grid').on('click', function() {
				//peopleType 人员类型 1正常打卡人员;2请假人员;3出差人员;4缺勤人员
				var signtype = $$(this).data('type');
				var title = $$(this).html().split("：")[0];
				dateChoose = [$$('#dayCalId').val(), $$('#weekId').val(), monthContent];
				console.log(dateChoose);
				var peopleType;
				if(signtype == 'good'){
					peopleType=1;
					
				}else if(signtype == 'late'){
					peopleType=0;

				}else if(signtype == 'early'){
					peopleType=2;
				}else{
					peopleType=3;
				}
				console.log(title)
				app.myApp.getCurrentView().loadPage('signDetailSpecial.html?title=' + title + 
				'&signDate='+signDate+'&signType='+type+'&peopleType='+peopleType);
			});
		}
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

	//加载图表(领导)
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
				'#F15C80',
				'#818187',
			],
			title: {
				text: title,
				y: 25,
				x: 100
			},
			subtitle: {
				text: '应到次数：' + data['total'] + '次',
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
					['正常', data.normalTotal],
					['缺勤', data.absentTotal],
					['请假', data.askForLeaveTotal],
					['出差', data.businessTripTotal],
				]
			}]
		});
	}
	//加载图表(队员)
	function loadChartPlayer(chartId, title, data) {
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
				'#F15C80',
				'#818187',
			],
			title: {
				text: title,
				y: 25,
				x: 100
			},
			subtitle: {
				text: '应到次数：' + data['total'] + '次',
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
					['正常', data.normalTotal],
					['缺勤', data.absentTotal],
					['请假', data.askForLeaveTotal],
					['出差', data.businessTripTotal],
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
					dayChoose = 0;
					dateTime['day'] = year + '-' + month + '-' + day;
					signDate = dateTime['day'];
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
					weekChoose = 0;
					dateTime['week'] = year + '-' + app.utils.getTwoBitNumber(month) + '-' + app.utils.getTwoBitNumber(day);
					$$('#weekId').val(firstDay + '   -   ' + secondDay);
					signDate = dateTime['week'];
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
						signDate = dateTime['month'];
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
		getdeptName:getdeptName,
		resetFirstIn: resetFirstIn,
	}
});