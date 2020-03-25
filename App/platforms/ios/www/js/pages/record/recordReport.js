define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	var newArr = [];
	//统计日志数量，个人 年周月日
	var findLogReportPath = app.basePath + '/mobile/worklog/statistics/';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('record/recordReport', [
//			'record/recordReportList',
//		]);
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		loadLogWorkReport();
		newArr=[];
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		handleLogWorkReport(pageDataStorage['logWorkReport']);
	}

	/**
	 *  统计日志数量
	 */
	function loadLogWorkReport() {
		app.ajaxLoadPageContent(findLogReportPath+app.userId, {
			// userId: app.userId,
		}, function(result) {
			var data = result.data;
			console.log(data);
			pageDataStorage['logWorkReport'] = data;
			handleLogWorkReport(data);
		});
	}

	/**
	 *  加载统计日志数量
	 */
	function handleLogWorkReport(data) {
		var nameArr = [];
		var countArr = [];
		for(var key in data) {
			nameArr.push(key);
			countArr.push(data[key]);
		}
		$$('#recordReportChart').css('height', (data.length * 30) + 'px');
		loadChart(nameArr, countArr);
	}

	/**
	 * 加载图表
	 */
	function loadChart(nameArr, countArr) {
		$$.each(nameArr, function(index, item){
			if(item == 'day'){		
				newArr[index]='天';
			}else if(item == 'week'){
				newArr[index] = '周';
			}else if(item == 'month'){
				newArr[index] = '月';
			}else if(item == 'year'){
				newArr[index] = '年';
			}
		})
		console.log(newArr)
		console.log(countArr)
		$('#recordReportChart').highcharts({
			chart: {
				type: 'bar'
			},
			//			title: {
			//				text: ''
			//			},
			title: {
				text: '工作日志统计表',
				style: {
					color: '#369',
				}
			},
			xAxis: {
				categories: newArr,
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
				tickInterval: 1,
				min: 0,
				minRange: 1,
				title: {
					text: null
				},
				labels: {
					overflow: 'justify'
				}
			},
			tooltip: {
				// valueSuffix: ''
				shared: true,
				// pointFormat: '<span>{series.name}: <b>{point.y}</b><br/>'
				formatter: function() {
					var s = '<b>' + this.x + '</b>';
					$.each(this.points, function(index, _) {
						s += '<br/>' + this.series.name + ': ' + this.y;
						s += '次';
					});
					return s;
				},
			},
			plotOptions: {
				bar: {
					dataLabels: {
						enabled: true
					},
					point: {
						events: {
							click: function() {
								recordReportList(this.category);
								//		                        console.log('Category: ' + this.category + ', value: ' + this.y);
							}
						}
					}
					//组之间的空隙
					//					groupPadding: 0
				}
			},
			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'top',
				x: -10,
				y: 14,
				floating: true,
				borderWidth: 1,
				backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
				shadow: true
			},
			credits: {
				enabled: false
			},
			series: [
				//			{
				//				name: '考核分数',
				//				data: pointArr
				//			},
				{
					name: '日志条数',
					data: countArr
				}
			]
		});
	}

	/**
	 *  查询某个统计类型的详细信息
	 * @param {Object} type 统计类型
	 */
	function recordReportList(type) {
		app.myApp.getCurrentView().loadPage('recordReportList.html?type=' + type);
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