define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//部门考核项
	var loadDepartmentAssessPath = app.basePath + '/mobile/partyAm/loadDepartmentAssess';
	var deptId = -1;
	var deptName = '';
	var idNameMap = {};
	var startDate = '';
	var endDate = '';
	var type=0;
	var khpl=0;
	var yearly='';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('assessment/assessList', [
//			'assessment/assessPeopleList',
//			'assessment/assessTopicList',
//			'assessment/assessPaperList'
//		]);
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
		clickEvent(page);
		attrDefine(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		deptId = pageData.assessid;
		deptName = pageData.name;
		type=pageData.type;
		khpl=pageData.khpl;
		if(pageData.startDate != undefined){
			startDate = pageData.startDate;
			yearly = startDate.split('-')[0];
		}
		if(pageData.endDate != undefined){
			endDate = pageData.endDate;
		}
		loadDepartmentEmployee();
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		handleDepartmentEmployee(pageDataStorage['departmentEmployee']);
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.peopleInfo').on('click', function() {
			var id = deptId;
			var name = page.query.name + $$('.peopleInfo').html();
			app.myApp.getCurrentView().loadPage('assessPeopleList.html?topicId=' + id + '&name=' + name+"&startDate="+startDate+'&endDate='+endDate);
		})
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.navTitle').html(page.query.name);
		$$('.assessListScore').html(page.query.point);
		$$('.assessListTime').html(page.query.count);
	}

	/**
	 * 读取部门考核项 
	 */
	function loadDepartmentEmployee() {
		if(startDate == '' && endDate == ''){
			var myDate = new Date();
			year = myDate.getFullYear();
			month = myDate.getMonth()+1;
			
			startDate = year+'-'+month+'-01';
			endDate = year+'-'+month+'-31';
		}

		console.log(startDate)
		console.log(endDate)
		app.ajaxLoadPageContent(loadDepartmentAssessPath, {
			deptId: deptId,
			startDate:startDate,
			endDate:endDate,
			// yearly:yearly,
			// type:type,
			khpl:khpl,
		}, function(data) {
			var data = data.data;
			console.log(data);
			pageDataStorage['departmentEmployee'] = data;
			handleDepartmentEmployee(data);
		});
	}

	/**
	 *  加载部门考核项 
	 * @param {Object} data
	 */
	function handleDepartmentEmployee(data) {
		if(data && data.length > 0) {
			$$('.assessListChart').css('height', (data.length * 40 + 130) + 'px');
			var nameArr = [];
			var countArr = [];
			var pointArr = [];
			$$.each(data, function(index, item) {
				idNameMap[item.name] = item.id;
				nameArr.push(item.name);
				countArr.push(item.count);
				pointArr.push(item.point);
			});
			loadChart(nameArr, countArr, pointArr);
			$$('.assessListCheck').on('click', function() {
				app.myApp.getCurrentView().loadPage('assessTopicList.html?item=' + JSON.stringify(data) + '&name=' + deptName + '&deptId=' + deptId+'&startDate='+startDate+'&endDate='+endDate);
			});
		} else {
			app.myApp.alert(app.utils.callbackAjaxError());
		}
	}

	/**
	 * 加载图表
	 */
	function loadChart(nameArr, countArr, pointArr) {
		$('#assessListChart').highcharts({
			chart: {
				type: 'bar'
			},
			//			title: {
			//				text: ''
			//			},
			title: {
				text: '单位考核进度',
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
					point: {
						events: {
							click: function() {
								app.myApp.getCurrentView().loadPage('assessPaperList.html?topicId=' + idNameMap[this.category] + '&name=' + this.category + '&deptId=' + deptId+'&startDate='+startDate+'&endDate='+endDate);
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