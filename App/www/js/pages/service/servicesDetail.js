define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	// 获取志愿者服务内容
	var findServicePath = app.basePath + '/mobile/volunteer/detail/';
	// 查询是否报名
	var checkPath = app.basePath + '/mobile/volunteer/check/';
	// 检查是否是召集人
	var sponsorPath = app.basePath + '/mobile/volunteer/check/duty/';
	// 报名志愿者服务
	var regiestPath = app.basePath + '/mobile/volunteer/regiest/';
	// 查看报名人
	var searchVolunteerPath = app.basePath + '/mobile/volunteer/members/';
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
		app.ajaxLoadPageContent(findServicePath+sid, {
			// serviceId: sid
		}, function(data) {
			console.log(data);
			pageDataStorage['serviceState'] = data.data;
			handleServiceState(data.data);
		});
	}
	/**
	 * 报名人数
	 */
	function loadServicePeople() {
		app.ajaxLoadPageContent(searchVolunteerPath+sid, {
			// serviceId: sid
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
			$$('.qs_serviceNumberOfApplicants').append('（'+data.data.length+'人）');
		});
	}

	/**
	 * 加载活动详情 
	 */
	function handleServiceState(data) {
		if(data) {
			var serviTime = app.getnowdata(data.serviceTime)
			var endTime = app.getnowdata(data.registEndtime)
			$$('.qs_sTitle').html(data.serviceTitle);
			$$('.qs_address').html(data.servicePlace);
			$$('.qs_cTime').html(serviTime);
			$$('.qs_creatorName').html(data.creatorName);
			$$('.qs_creatorPhone').html(data.creatorPhone);
			$$('.qs_totalUser').html(data.totalUser + '(人)');
			$$('.qs_content').html(data.serviceContent);
			$$('.qs_eTime').html(endTime);
			$$('.qs_serviceArticle').html(data.serviceArticle);
			console.log(data.auditStatus)
			//判断服务的状态
			switch(data.auditStatus) {
				case -3:
				case -2:
				case -1:
						case 0:	
						$$('.s_bottom_btn').hide();
							break;
				case 1:
						{
							//查看自己是否已经报名
							app.ajaxLoadPageContent(checkPath+sid, {
								// serviceId: sid,
								// userId: app.userId
							}, function(data) {
								if(data) {
									if(data.data == true) {
										$$('.s_bottom_btn').hide();
									} else {
										$$('.s_bottom_btn').data('stype', 1);
										$$('.s_bottom_btn').show();
									}
								}
							});
						}
		
						break;
				case 2:
						$$('.s_bottom_btn').hide();
					break;
				case 3:
						$$('.s_bottom_btn').hide();
					break;	
				case 4:
					{
						//活动截至 判断当前用户是否是召集人
						//如果是召集人则可以参与打分
						//检查是否是召集人
						app.ajaxLoadPageContent(sponsorPath+sid, {
							// serviceId: sid,
							userId: app.userId
						}, function(data) {
							console.log(data);
							if(data.msg == 'success') {
								$$('.s_bottom_btn').data('stype', 2);
								$$('.s_bottom_btn').html('活动打分');
								$$('.s_bottom_btn').show();
							}
						});
						break;
					}
					break;	
				case 5:
						{
							$$('.s_bottom_btn').html('查看服务打分');
							$$('.s_bottom_btn').data('stype', 3);
							$$('.s_bottom_btn').show();
						}
						break;
				case 5:
					
				case 6:
					
			}

		} else {
			$$('.s_bottom_btn').hide();
		}
	}

	/**
	 * 报名参加活动
	 */
	function joinService() {
		app.ajaxLoadPageContent(regiestPath+sid, {
			// serviceId: sid,
			// userId: app.userId
		}, function(data) {
			if(data.data == true) {
				app.myApp.alert('报名成功!');
				$$('.s_bottom_btn').hide();
				setTimeout(function(){
					loadServiceState();
					loadServicePeople();
				},200);
			} else if(data.msg == "the service join members is full."){
				app.myApp.toast('报名名额已满!','error').show(true);
			}else{
				app.myApp.toast('报名失败!','error').show(true);
				// app.myApp.alert('报名失败!');
			}
		},{
			type:'POST'
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