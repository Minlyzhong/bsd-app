define(['app',
	'hbs!js/hbs/assessmentEmployee'
], function(app, assessEmployeeTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//部门考核人员
	var loadDepartmentEmployeePath = app.basePath + '/mobile/partyAm/loadDepartmentEmployee';
	var deptId = 0;
	var startDate = '';
	var endDate = '';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('assessment/assessPeopleList', [
//			'assessment/assessPeopleDetail',
//		]);
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
		attrDefine(page);
		clickEvent(page);
		pushAndPull(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		deptId = pageData.topicId;
		startDate = pageData.startDate;
		endDate = pageData.endDate;
		loadEmployee(false);
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		handleEmployee(pageDataStorage['employee'], false);
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.peopleTitle').html(page.query.name);
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.peopleChart').on('click', function() {
			loadAllEmployee(page.query.name);
		});
	}

	/**
	 * 加载图表数据
	 */
	function loadAllEmployee(title) {
		var chartPopup = app.myApp.popup(
			'<div class="popup">' +
			'<div class="navbar">' +
			'<div class="navbar-inner">' +
			'<div class="left close-popup"><a href="#" class="link icon-only"><i class="icon icon-eback"></i></a></div>' +
			'<div class="center">' + title + '</div>' +
			'<div class="right"></div>' +
			'</div>' +
			'</div>' +
			'<div class="page-content" style="    margin-bottom: -44px;padding-bottom: 44px;">' +
			'<div id="assessPeopleListChart" class="assessPeopleListChart"></div>' +
			'</div>' +
			'</div>'
		);
		var data = pageDataStorage['chart'];
		if(data) {
			loadChart(data);
		} else {
			loadEmployee(false, 0);
		}
	}

	/**
	 * 分页获取部门人员
	 */
	function loadEmployee(isLoadMore) {
		var _pageNo = arguments[1] >= 0 ? arguments[1] : pageNo;
		app.ajaxLoadPageContent(loadDepartmentEmployeePath, {
			deptId: deptId,
			current: _pageNo,
			startDate:startDate,
			endDate:endDate
		}, function(result) {
			var data = result.data.records;
			console.log(data);
			if(!_pageNo) {
				pageDataStorage['chart'] = data;
				loadChart(data);
			} else {
				if(isLoadMore) {
					pageDataStorage['employee'] = pageDataStorage['employee'].concat(data);
				} else {
					pageDataStorage['employee'] = data;
				}
				handleEmployee(data, isLoadMore);
			}
		});
	}

	/**
	 * 加载部门人员
	 * @param {Object} data
	 */
	function handleEmployee(data, isLoadMore) {
		if(data && data.length > 0) {
			$$.each(data, function(index, item) {
				item.date = item.date.split(" ")[0];
			});
			if(isLoadMore) {
				$$('.assessPeopleList ul').append(assessEmployeeTemplate(data));
			} else {
				$$('.assessPeopleList ul').html(assessEmployeeTemplate(data));
			}
			$$('.assessPeopleListContent').on('click', function() {
				var count = $$(this).data('count');
				if(count == 0) {
					app.myApp.alert('该人员没有考核记录');
					return;
				}
				var empId = $$(this).data('id');
				var empName = $$(this).data('name');
				app.myApp.getCurrentView().loadPage('assessPeopleDetail.html?empId=' + empId + '&name=' + empName+'&startDate='+startDate+'&endDate='+endDate);
			});
			if(data.length == 10) {
				loading = false;
			}
		}
	}

	/**
	 * 加载图表
	 */
	function loadChart(data) {
		app.myApp.showPreloader('加载图表中...');
		$$('.assessPeopleListChart').css('height', (data.length * 40 + 130) + 'px');
		var nameArr = [];
		var countArr = [];
		var pointArr = [];
		$$.each(data, function(index, item) {
			nameArr.push(item.name);
			countArr.push(item.count);
			pointArr.push(item.point);
		});
		$('#assessPeopleListChart').highcharts({
			chart: {
				type: 'bar'
			},
			//			title: {
			//				text: ''
			//			},
			title: {
				text: '个人明细条形图',
				style: {
					color: '#369',
				}
			},
			xAxis: {
				categories: nameArr,
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
						s += '<br/>' + this.series.name + ': ' +
							this.y;
						if(index === 1) {
							s += '次';
						} else {
							s += '分';
						}
					});
					return s;
				},
			},
			plotOptions: {
				bar: {
					dataLabels: {
						enabled: true
					},
					//组之间的空隙
					//					groupPadding: 0
				}
			},
			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'top',
				x: -10,
				y: 0,
				floating: true,
				borderWidth: 1,
				backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
				shadow: true
			},
			credits: {
				enabled: false
			},
			series: [{
				name: '考核分数',
				data: pointArr
			}, {
				name: '考核次数',
				data: countArr
			}]
		});
		app.myApp.hidePreloader();
	}

	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			//这里写请求
			loadEmployee(true);
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