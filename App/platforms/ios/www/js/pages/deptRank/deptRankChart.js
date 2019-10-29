define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//支部月数据  季度数据  年数据
	var loadDeptRankMonthChartPath = app.basePath + 'deptRank/loadMonthRank';
	var loadDeptRankQuarterChartPath = app.basePath + 'deptRank/loadQuarterRank';
	var loadDeptRankYearChartPath = app.basePath + 'deptRank/loadYearRank';
	var deptId = 0;

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
			'<li><a href="#" data-type="0">月</a></li>' +
			'<li><a href="#" data-type="1">季度</a></li>' +
			'<li><a href="#" data-type="2">年度</a></li>' +
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
		if(type == 0) {
			loadPath = loadDeptRankMonthChartPath;
		} else if(type == 1) {
			loadPath = loadDeptRankQuarterChartPath;
		} else {
			loadPath = loadDeptRankYearChartPath;
		}
		app.ajaxLoadPageContent(loadPath, {
			deptId: deptId,
		}, function(data) {
			console.log(data);
			if(data.length > 0) {
				var titleArr = [];
				var pointArr = [];
				var rankArr = [];
				$$.each(data, function(_, item) {
					//  "score": 分数,
					//  "rank": 排名,
					//  "date": "日期"
					titleArr.push(item.date);
					pointArr.push(item.score);
					rankArr.push(item.rank);
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