define(['app',
	
], function(app, userInfoTemplate, deptInfoTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var registTitle = '';
	var registId = 0;
	var registType = '';
	
	//加入志愿服务
	var saveZYFW = app.basePath + '/mobile/volunteer/regiest/';
	//加入会议
	var saveMeeting = app.basePath + '/mobile/meeting/join/';
	//根据id查询相对的志愿服务
	var searchZYFW = app.basePath + '/mobile/volunteer/detail/';
	//根据id查询相对的会议
	var searchMeeting = app.basePath + '/mobile/meeting/';
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

	function initData(pageData){
		registTitle = '';
		registId = 0;
		registType = '';
		console.log(pageData);
		if(pageData.id){
			registTitle = pageData.title;
			registId = pageData.id;
			registType = pageData.type;
			searchTitle(registType, registId);
		}
		
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
		$$('.registerCircle').on('click', savePerson);
		
	}
	
	
	function searchTitle(type, id){
		// alert(type)
		// alert(id)
		// 志愿服务是ZYFW
		if(type == 'ZYFW'){
			app.ajaxLoadPageContent(searchZYFW+id, {
			
			}, function(data) {
				if(data.code == 0 && data.data != null){
					console.log(data);
					if(data.data.serviceArticle == null){
						data.data.serviceArticle = '无';
					}
					var serviceTime = app.getnowdata(data.data.serviceTime);
					$$('.registerCircle').html('加入服务');
					$$('.registTitle').html(data.data.serviceTitle);
					$$('.registTitleContent').html(registTitle);
					$$('.serviceTime').html('志愿服务时间 : '+serviceTime);
					$$('.serviceAdress').html('志愿服务地点 : '+data.data.servicePlace);
					$$('.serviceContent').html('志愿服务内容 : '+data.data.serviceContent);
					$$('.serviceArticle').html('携带服务物品 : '+data.data.serviceArticle);

				}else{
					app.myApp.toast('没有找到该志愿服务','error').show(true);
					app.myApp.getCurrentView().back();
				}
			});
			
		}else{
			app.ajaxLoadPageContent(searchMeeting+id, {
			
			}, function(data) {
				if(data.code == 0 && data.data != null){
					console.log(data);
					$$('.registerCircle').html('加入会议');
					$$('.registTitle').html(data.data.meetingTitle);
					$$('.registTitleContent').html(data.data.meetingContent);
					$$('.registTime').html('会议时间 : '+data.data.meetingTime);
				}else{
					app.myApp.toast('没有找到该会议','error').show(true);
					app.myApp.getCurrentView().back();
				}
			});
			
		}
	}


	

	

	function savePerson(){
		if(registType == 'ZYFW'){
			console.log('1')
			$$.ajax({
				url:saveZYFW + registId ,
				method: 'POST',
				dataType: 'json',
				contentType: 'application/json;charset:utf-8',
				// data: formDatas,
				cache: false,
				success:function (result) {
					if(result.data == true && result.code == 0){
						app.myApp.toast("报名成功！", 'success').show(true);
						app.myApp.getCurrentView().back();
					}else{
						app.myApp.toast("报名失败！", 'error').show(true);
					}
					
				},
				error:function () {
					app.myApp.alert('报名失败');
				}
				})
		}else{
			console.log('2')
			$$.ajax({
				url:saveMeeting + registId ,
				method: 'POST',
				dataType: 'json',
				contentType: 'application/json;charset:utf-8',
				// data: formDatas,
				cache: false,
				success:function (result) {
					if(result.data !== null && result.code == 0){
						app.myApp.toast("报名成功！", 'success').show(true);
						app.myApp.getCurrentView().back();
					}else{
						app.myApp.toast("报名失败！", 'error').show(true);
					}
				},
				error:function () {
					app.myApp.alert('报名失败');
				}
				})
		}
		
	}

	
	/**
	 * 重置firstIn变量 
	 */
	function resetFirstIn() {
		firstIn = 1;
	}

	return {
		init: init,
		// resetFirstIn: resetFirstIn,
		// clickEvent: clickEvent,
	}
});