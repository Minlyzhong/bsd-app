define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//获取考核完成进度
	var findCompletionPath = app.basePath + 'statHelper/findCompletion';
	var name = '';
	var topicId = 0;
	var deptId = 0;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('assessment/assessTopicDetail', [
//			'assessment/assessTDJoin',
//			'assessment/assessTDLost'
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
		name = pageData.name;
		topicId = pageData.topicId;
		deptId = pageData.deptId;
		console.log(deptId);
		console.log(topicId);
		ajaxLoadContent();
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		handleCompletion(pageDataStorage['completion']);
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.atdHead .tName').html(page.query.name);
		$$('.atdHead .dName').html(page.query.deptName);
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		
	}

	/**
	 *  点击完成度标签
	 */
	function gridClick() {
		var type = $$(this).html().split('：')[0].trim();
		var count = $$($$(this).find('span')).html();
		if(count != 0) {
			loadPage(type);
		}
	}

	/**
	 * 页面跳转 
	 * @param {Object} type
	 */
	function loadPage(type) {
		var regn = new RegExp("\n", "g"); //g,表示全部替换。
		var regt = new RegExp("\t", "g"); //g,表示全部替换。
		var rege = new RegExp("=", "g"); //g,表示全部替换。
		var head = $('.atdHead').prop('outerHTML');
		head = head.replace(regn, '').replace(regt, '').replace(rege, 'equal');
		if(type == '已参与') {
			app.myApp.getCurrentView().loadPage('assessTDJoin.html?head=' + head + '&deptId=' + deptId + '&topicId=' + topicId);
		} else {
			app.myApp.getCurrentView().loadPage('assessTDLost.html?head=' + head + '&deptId=' + deptId + '&topicId=' + topicId);
		}
	}

	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent() {
		app.ajaxLoadPageContent(findCompletionPath, {
			deptId: deptId,
			knowledgePaperId: topicId,
		}, function(data) {
			console.log(data.data);
			var result = data.data;
			pageDataStorage['completion'] = result;
			handleCompletion(result);
		});
	}

	/**
	 * 加载数据 
	 */
	function handleCompletion(result) {
		$$('.atdBody .good span').html(result['completedNum']);
		$$('.atdBody .notYet span').html(result['unCompletedNum']);
		$$('.atdBody .no-gutter .grid').on('click', gridClick);
		loadChart('atdChart', '考核项-支部完成度', result);
	}

	/**
	 * 加载图表 
	 * @param {Object} chartId
	 * @param {Object} title
	 * @param {Object} data
	 */
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
				'#818187',
			],
			title: {
				text: title,
				y: 25
			},
			subtitle: {
				text: '支部数量：' + data['totalParty'] + '个',
				//				text: '支部数量：20个',
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
								loadPage(this.name);
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
								return this.point.name + ': ' + this.y + '个<br />' + percen + '%';
							}
						}
					}
				}
			},
			series: [{
				type: 'pie',
				name: '比例',
				data: [
					['已参与', data['completedNum']],
					['未参与', data['unCompletedNum']],
				]
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