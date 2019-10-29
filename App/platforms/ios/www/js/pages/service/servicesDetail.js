define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	var findServicePath = app.basePath + '/extVoluntaryService/findVoluntaryService';
	var checkPath = app.basePath + '/extVoluntaryService/isCheckRegiest';
	var sponsorPath = app.basePath + '/extVoluntaryService/isSponsor';
	var regiestPath = app.basePath + '/extVoluntaryService/regiest';
	
	var searchVolunteerPath = app.basePath + 'extVoluntaryService/searchVolunteer';
	var sid = 0;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		app.pageStorageClear('service/servicesDetail', [
			'service/servicesScore',
//			'service/servicesShowScore'
		]);
		var scoreCB = app.myApp.onPageBack('service/servicesScore', function(backPage) {
			loadServiceState();
		});
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
		sid = pageData.sid;
		loadServiceState();
		loadServicePeople();
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		handleServiceState(pageDataStorage['serviceState']);
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		//点击底端按钮
		$$('.s_bottom_btn').on('click', function(e) {
			var stype = $$('.s_bottom_btn').data('stype');
			switch(stype) {
				case 1:
					joinService();
					break;
				case 2:
					takeScore();
					break;
				case 3:
					showScore();
					break;
			}
		});
	}

	/**
	 * 获取活动详情 
	 */
	function loadServiceState() {
		app.ajaxLoadPageContent(findServicePath, {
			serviceId: sid
		}, function(data) {
			console.log(data);
			pageDataStorage['serviceState'] = data;
			handleServiceState(data);
		});
	}
	/**
	 * 报名人数
	 */
	function loadServicePeople() {
		app.ajaxLoadPageContent(searchVolunteerPath, {
			serviceId: sid
		}, function(data) {
			console.log(data);
			$$('.qs_serviceNumberOfApplicants').html('');
			$$.each(data.data, function(index, item) {
				console.log(index)
				if(index == 0){
					$$('.qs_serviceNumberOfApplicants').append(item.userName);	
				}else{
					$$('.qs_serviceNumberOfApplicants').append('，'+item.userName);	
				}
				
			});
			$$('.qs_serviceNumberOfApplicants').append('（'+data.total+'人）');
		});
	}

	/**
	 * 加载活动详情 
	 */
	function handleServiceState(data) {
		if(data) {
			$$('.qs_sTitle').html(data.serviceTitle);
			$$('.qs_address').html(data.servicePlace);
			$$('.qs_cTime').html(data.serviceTime);
			$$('.qs_creatorName').html(data.creatorName);
			$$('.qs_creatorPhone').html(data.creatorPhone);
			$$('.qs_totalUser').html(data.totalUser + '(人)');
			$$('.qs_content').html(data.serviceContent);
			$$('.qs_eTime').html(data.regiestEndtime);
			$$('.qs_serviceArticle').html(data.serviceArticle);
			
			//判断服务的状态
			switch(data.state) {
				case -3:
				case -2:
				case -1:
				case 1:
				case 4:
					$$('.s_bottom_btn').hide();
					break;
				case 2:
				case 3:
					{
						//查看自己是否已经报名
						app.ajaxLoadPageContent(checkPath, {
							serviceId: sid,
							userId: app.userId
						}, function(data) {
							if(data) {
								if(data.success) {
									$$('.s_bottom_btn').hide();
								} else {
									$$('.s_bottom_btn').data('stype', 1);
									$$('.s_bottom_btn').show();
								}
							}
						});
					}
					break;
				case 5:
					{
						//活动截至 判断当前用户是否是召集人
						//如果是召集人则可以参与打分
						//检查是否是召集人
						app.ajaxLoadPageContent(sponsorPath, {
							serviceId: sid,
							userId: app.userId
						}, function(data) {
							console.log(data);
							if(data.success) {
								$$('.s_bottom_btn').data('stype', 2);
								$$('.s_bottom_btn').html('活动打分');
								$$('.s_bottom_btn').show();
							}
						});
						break;
					}
					break;
				case 6:
					{
						$$('.s_bottom_btn').html('查看服务打分');
						$$('.s_bottom_btn').data('stype', 3);
						$$('.s_bottom_btn').show();
					}
					break;
			}

		} else {
			$$('.s_bottom_btn').hide();
		}
	}

	/**
	 * 报名参加活动
	 */
	function joinService() {
		app.ajaxLoadPageContent(regiestPath, {
			serviceId: sid,
			userId: app.userId
		}, function(data) {
			if(data.success) {
				app.myApp.alert('报名成功!');
				$$('.s_bottom_btn').hide();
				setTimeout(function(){
					loadServiceState();
					loadServicePeople();
				},200);
			} else {
				app.myApp.alert('报名失败!');
			}
		});
	}

	/**
	 * 活动打分
	 */
	function takeScore() {
		app.myApp.getCurrentView().loadPage('servicesScore.html?sid=' + sid);
	}

	function showScore() {
		app.myApp.getCurrentView().loadPage('servicesShowScore.html?sid=' + sid);
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