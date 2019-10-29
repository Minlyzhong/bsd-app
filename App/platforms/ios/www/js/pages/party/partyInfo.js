define(['app',
	''
], function(app, vilDailyTemplate) {
	var $$ = Dom7;
	var pageNo = 1;
	var loading = true;
	//查询最新党组织统计信息
	var findPartyStatInfoPath = app.basePath + 'partyStat/findPartyStatInfo';
	//查询党建考核进度信息
	var findCompRateOfPartyPath = app.basePath + 'statHelper/findCompRateOfParty';
	//	根据组织机构ID，查询最新党员队伍统计信
	var findPartyMemberInfoPath = app.basePath + 'partyMemberStat/findPartyMemberInfo';
	var deptId = '';
	var deptName = '';
	var deptType = '';
	var parentDeptName = '';
	var parentDeptId = '';
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
		deptId = pageData.deptId;
		deptName = pageData.deptName;
		deptType = pageData.deptType;
		parentDeptName = pageData.parentDeptName;
		parentDeptId = pageData.parentDeptId;
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		//loadRecord(false);
		$$('.partyTitle').html(deptName);
		window.setTimeout(function() {
			showInfo(deptId, deptName, deptType);
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
		
	}
	
	/**
	 * 显示基本情况 
	 */
	function showInfo(deptId, deptName, deptType) {
		var memberData = {};
		var partyData = {};
		var unitData = {};
		var partyMemberHtml = '';
		var partyCompRateHtml= '';
		var partyHtml = '';
		console.log(deptId);
		app.ajaxLoadPageContent(findPartyMemberInfoPath, {
			deptId: deptId,
		}, function(result) {
			console.log(result);
			memberData = result.data;
			partyMemberHtml = '<div class="partyInfo">' +
				'<div style="font-weight: bold;text-align: center;">' + deptName + '</div>' +
				'<div style="margin-bottom: 30px;">党员总数<span>' + memberData.totalMember + '</span>名。</div>' +
				'<div style="margin-bottom: 10px;"><span style="font-weight: bold; color:black;">党员性别、民族和学历：</span><br />女党员<span>' + memberData.female + '</span>名，占党员总数的<span>' + memberData.femaleRate + '</span>%；<br />少数民族党员总数的<span>' + memberData.minorityRate + '</span>%；<br />大专及以上学历党员<span>' + memberData.dzys + '</span>名，占党员总数的<span>' + memberData.dzysRate + '</span>%。</div>' +
				'<div style="margin-bottom: 10px;"><span style="font-weight: bold; color:black;">党员的年龄：</span><br />35岁及以下的党员<span>' + memberData.group1 + '</span>名，占党员总数的<span>' + memberData.group1Rate + '</span>%；<br />36岁至45岁的党员<span>' + memberData.group2 + '</span>名，占党员总数的<span>' + memberData.group2Rate + '</span>%；<br />46岁至60岁的党员<span>' + memberData.group3 + '</span>名，占党员总数的<span>' + memberData.group3Rate + '</span>%；<br />61岁及以上的党员<span>' + memberData.group4 + '</span>名，占党员总数的<span>' + memberData.group4Rate + '</span>%。</div>' +
				'<div style="margin-bottom: 10px;"><span style="font-weight: bold; color:black;">党员的职业：</span><br />工人<span>' + memberData.worker + '</span>名，<br />农牧渔民<span>' + memberData.farmer + '</span>名，<br />企事业单位、民办非企业单位专业技术人员<span>' + memberData.artisan + '</span>名，<br />企事业单位、民办非企业单位管理人员<span>' + memberData.manager + '</span>名，<br />党政机关工作人员<span>' + memberData.leader + '</span>名，<br />学生及其他职业人员<span>' + memberData.student + '</span>名，<br />离退休人员<span>' + memberData.retiree + '</span>名。</div>';
		}, {
			async: false
		});
		app.ajaxLoadPageContent(findCompRateOfPartyPath, {
			deptId: deptId,
		}, function(result) {
			console.log(result);
			partyCompRateHtml = '<div class="signChart" id="atdChart"></div>' +	
				'<div class="row no-gutter signList">' +
					'<div class="col-50 grid good grid1" data-type="yes">' +
						'已参与：<span style="display: inline;"></span>个' +
					'</div>' +
					'<div class="col-50 grid notYet grid1" data-type="no">' +
						'未参与：<span style="display: inline;"></span>个' +
					'</div>' +
				'</div>';
			pageDataStorage['CompRate'] = result;
			pageDataStorage['deptName'] = deptName;
			console.log(deptId)
			pageDataStorage['deptId1'] = deptId;
		}, {
			async: false
		});
		app.ajaxLoadPageContent(findPartyStatInfoPath, {
			deptId: deptId,
		}, function(result) {
			console.log(result);
			partyData = result.data;
			partyHtml = '<div class="partyInfo">' +
				'<div style="font-weight: bold;text-align: center;">' + deptName + '</div>' +
				'<div style="margin-bottom: 30px;">已建立党的基层组织<span>' + partyData.jczz + '</span>个，其中，党委<span>' + partyData.dw + '</span>个，党总支<span>' + partyData.dzz + '</span>个，党支部<span>' + partyData.dzb + '</span>个。</div>' +
				'<div style="font-weight: bold;">已建立的党组织中：</div>' +
				'<div><span style="font-weight: bold;">城市街道</span>（含城市社区居委会）建立党组织<span>' + partyData.cszz + '</span>个，占基层党组织总数的<span>' + partyData.cszzRate + '</span>%；</div>' +
				'<div><span style="font-weight: bold;">乡镇</span>（含乡镇社区居委会）建立党组织<span>' + partyData.xzzz + '</span>个，占基层党组织总数的<span>' + partyData.xzzzRate + '</span>%；</div>' +
				'<div><span style="font-weight: bold;">机关单位</span>建立党组织<span>' + partyData.jgzz + '</span>个，占基层党组织总数的<span>' + partyData.jgzzRate + '</span>%；</div>' +
				'<div><span style="font-weight: bold;">事业单位</span>建立党组织<span>' + partyData.syzz + '</span>个，占基层党组织总数的<span>' + partyData.syzzRate + '</span>%；</div>' +
				'<div><span style="font-weight: bold;">公有企业单位</span>建立党组织<span>' + partyData.gyzz + '</span>个，占基层党组织总数的<span>' + partyData.gyzzRate + '</span>%；</div>' +
				'<div><span style="font-weight: bold;">非公有企业单位</span>建立党组织<span>' + partyData.fgyzz + '</span>个，占基层党组织总数的<span>' + partyData.fgyzzRate + '</span>%；</div>' +
				'<div><span style="font-weight: bold;">社会组织</span>建立党组织<span>' + partyData.sfzz + '</span>个，占基层党组织总数的<span>' + partyData.sfzzRate + '</span>%；</div>' +
				'</div>';
		}, {
			async: false
		});
		var str = '';
		if(pageDataStorage['deptName'].substring(pageDataStorage['deptName'].length,pageDataStorage['deptName'].length-3)!='党支部'){
			str = '<div data-index="2">考核进度信息</div>';
		}
		
		$$('.conInfoPage').html(
			'<div class="conInfoTab">' +
			'<div data-index="0">党组织信息' +
			'</div>' +
			'<div data-index="1">党员队伍信息' +
			'</div>' +
			  str	 +
			'</div>' +
			'<div class="conInfoContent"style="margin-top: 38px; min-height: 100%;"></div>'
		);
		//var tabPosition = 0;
		$$('.conInfoTab div').on('click', function() {
			$$('.conInfoTab div').removeClass('active');
			$$(this).addClass('active');
			var index = $$(this).data('index');
			//tabPosition = index;
			if(index == '0') {
				if(!partyHtml) {
					app.myApp.alert('该单位暂无党组织信息');
				} else {
					$$('.conInfoContent').html(partyHtml);
				}
			} else if(index == '1'){
				if(!partyMemberHtml) {
					app.myApp.alert('该单位暂无党员队伍信息');
				} else {
					$$('.conInfoContent').html(partyMemberHtml);
				}
			} else{			
				if(!partyCompRateHtml) {
					app.myApp.alert('该单位暂无考核进度信息');
				} else {
					$$('.conInfoContent').html(partyCompRateHtml);
					handleCompletion(pageDataStorage['CompRate'],pageDataStorage['deptName'],pageDataStorage['deptId1']);
				}
			}
		});
		$$($$('.conInfoTab div')[0]).click();
		//var tabPosition = 0;
		//滑动切换选项卡
//		$('.conInfoContent').swipe({
//			swipeLeft: function(event, direction, distance, duration, fingerCount) {
//				if(tabPosition == 0) {
//					if(distance > 60) {
//						console.log(tabPosition);
//						tabPosition = 1;
//						$$($$('.conInfoTab div')[1]).click();
//						return;
//					}
//				}
//				if(tabPosition == 1) {
//					if(distance > 60) {
//						console.log(tabPosition);
//						tabPosition = 2;
//						$$($$('.conInfoTab div')[2]).click();
//						return;
//					}
//				}
//			},
//			swipeRight: function(event, direction, distance, duration, fingerCount) {
//				if(tabPosition == 2) {
//					if(distance > 60) {
//						tabPosition = 1;
//						$$($$('.conInfoTab div')[1]).click();
//						return;
//					}
//				}
//				if(tabPosition == 1) {
//					if(distance > 60) {
//						tabPosition = 0;
//						$$($$('.conInfoTab div')[0]).click();
//						return;
//					}
//				}
//			}
//		});
		app.myApp.hidePreloader();
	}
	function handleCompletion(result,deptName,deptId){
		console.log(result);
		console.log(deptId);
		$$('.good span').html(result['partyInNum']);
		$$('.notYet span').html(result['partyOffNum']);
		$$('.no-gutter .grid1').on('click', gridClick);
		loadChart('atdChart', '党建考核进度信息', result,deptName,deptId);
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
				text: deptName+'支部总数：' + data['partyTotalNum'] + '个',
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
					['已参与', data['partyInNum']],
					['未参与', data['partyOffNum']],
				]
			}]
		});
		$$('.highcharts-title').css('fill','blue');
		$$('.highcharts-title').on('click',function(){
			console.log(deptName);
			console.log(deptId);
			if(deptId == 1){
				
				app.myApp.getCurrentView().loadPage('partyDynamic.html');
			}else{
				app.myApp.getCurrentView().loadPage('partyDynamic.html?deptId='+deptId+'&deptName='+deptName+'&parentDeptName='+parentDeptName+'&parentDeptId='+parentDeptId);
			}
			
//			require(['js/pages/partyDynamic/partyDynamic'], function(partyDynamic) {
//				partyDynamic.itemClick1(deptName,deptId);
//			});
		})
	}
	/**
	 *  点击完成度标签
	 */
	function gridClick() {
		console.log(pageDataStorage['deptId1']);
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
		console.log(type);
		console.log(deptId);
		if(type == '已参与') {
			app.myApp.getCurrentView().loadPage('assessInformationJoin.html?deptId='+deptId);
		} else {
			app.myApp.getCurrentView().loadPage('assessInformationLost.html?deptId='+deptId);
		}
	}
	

	function resetFirstIn() {
		firstIn = 1;
	}

	return {
		init: init,
		resetFirstIn: resetFirstIn,
	}
});