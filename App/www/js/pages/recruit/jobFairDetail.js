define(['app',
	'hbs!js/hbs/jobDescription',
	'hbs!js/hbs/jobCard'
], function(app, jobTemplate,cardTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var loading = true;
	//企业招聘信息详细内容
	var recruitDetail = app.basePath + '/mobile/recruit/recruitDetail/';
	// 检查用户是否已经创建简历
	var checkedCV = app.basePath + '/mobile/recruit/jobWanted/checked';

	// 投递简历
	var delivery = app.basePath + '/mobile/recruit/jobWanted/delivery';

	var contentId = 0;
	var jType = 0;
	var cId = 0;
	var hasCV = false;
	
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		console.log('newsDetail-page.query')
		console.log(page)
		initData(page.query);
		app.back2Home();
		clickEvent();
		// pushAndPull(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		hasCV = false;
		contentId = pageData.id;
		jType = pageData.type || 0;
		ajaxLoadContent();
		console.log('jType');
		console.log(jType);
		if(jType == 1){
			$$('#jobApplyBtn').css('display', 'none');
		}else{
			$$('#jobApplyBtn').css('display', 'block');
		}
		
		
		
	}	
	
	
	
	/**
	 * 点击事件
	 */
	function clickEvent() {
		
		//点击发送按钮
		$$('.applyJob').on('click', sendComment);
	
	}

	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent() {
		// 获取职位信息
		getRecruitDetail();
		// 检查是否已提交简历
		getCheckedCV();
	}


	
	/**
	 * 检查是否已提交简历
	 */
	function getCheckedCV() {
		$$.ajax({
            url:checkedCV,
            method: 'PUT',
			dataType: 'json',
			contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            data: {userId: app.userDetail.userId},
            cache: false,
            success:function (data) {
            	console.log(data);
				if(data.code == 0){
					hasCV = data.data || false;
				}	
				
					
            },
            error:function () {
				app.myApp.toast("获取数据失败，请稍后再试！", 'none').show(true);
            }
        });
	}
	
	/**
	 * 获取招聘信息
	 */
	function getRecruitDetail() {
		app.ajaxLoadPageContent(recruitDetail+contentId,{}, function(result) {
			console.log(result);
			if(result.code == 0 && result.data != null){
				var data = result.data;
				console.log('招聘信息');
				console.log(data);
				// $$.each(data,function(index, item){
				// 	console.log(item);
				data.releaseTime = data.releaseTime.split(' ')[0];
				// });
				var jobArr = data.label.split(',');
				console.log(jobArr);
				var str = '';
				$$.each(jobArr,function(index, item){
					str += '<span>'+item+'</span>'
				})
				$$('.jobMainTextSpan').html(str);
				$$('.jobCardHold').html(cardTemplate(data));
				$$('#jobDescription').html(data.jobDescription);
				$$('#positionQualification').html(data.positionQualification);
				$$('#departmentName').html(data.companyName);

			}else{
				
			}
		});
	}
	
	/**
	 * 发送申请
	 */
	function sendComment() {
		
		
		if(app.userId <= 0) {
			app.myApp.getCurrentView().loadPage('login.html');
			return;
		} else {
			// 如果还没有提交过简历, 先提交简历
			if(!hasCV){
				app.myApp.alert("该用户还没提交简历, 请先填写简历",function(){
					app.myApp.getCurrentView().loadPage('jobApply.html');
				})

			}else{
				app.myApp.confirm('确认申请该职位?', function() {
					var formData={
						userName: app.user.nickName,
						recruitId:contentId,
						userId: app.userId,
						deliveryDate: app.getnowdata()
					}
					console.log('formData')
					
					var formDatas= JSON.stringify(formData)
					console.log(formDatas)
					//提交到后台
					$$.ajax({
						url:delivery,
						method: 'PUT',
						dataType: 'json',
						contentType: 'application/json;charset:utf-8',
						data: formDatas,
						cache: false,
						success:function (data) {
							if(data.code == 0 && data.data == true){
								app.myApp.toast('申请成功！', 'success').show(true);
								app.myApp.getCurrentView().back();		
								setTimeout(function() {
									require(['js/pages/recruit/jobFair'], function(partyList) {
										partyList.refresh();
									
									});
									}, 1500);
							}else{
								app.myApp.toast('申请失败, 请稍后再试！', 'error').show(true);
							}
							
									
						},
						error:function () {
							app.myApp.alert('申请失败！');
							
						}
					});
				})
				
			}
		
			
			
		}
	}

		/**
	 * 上下拉操作 
	 */
// 	function pushAndPull(page) {
// 		//下拉刷新
// 		var ptrContent1 = $$(page.container).find('.pull-to-refresh-content');
// 		ptrContent1.on('refresh', function(e) {
// //				pageNo = 1;
// //				loading = true;
// 				//这里写请求
// 		// findMeetingNotice();
// 		app.myApp.pullToRefreshDone();
// 		});
// 	}
	function addCallback(){
		// 刷新检查是否已提交简历
		getCheckedCV();
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
		addCallback: addCallback,
	}
});