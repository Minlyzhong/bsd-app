define(['app',
	
], function(app, userInfoTemplate, deptInfoTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var registTitle = '';
	var registId = 0;
	var registType = '';
	var chooseLogType = 0;
	var chooseLogType2 = 0;
	var home = [];
	
	//加入抗疫
	var saveApply = app.basePath + '/mobile/volunteer/coronavirus';
	//读取村镇类型
	var loadTownPath = app.basePath + '/mobile/village/list';
	//读取村社区类型
	var loadDictPath = app.basePath + '/mobile/worklog/types';
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
		chooseLogType = 0;
		chooseLogType2 = 0;
		home = [];
		console.log(pageData);
		if(pageData.id){
			registId = pageData.id;
			if(pageData.type){
				registTitle = pageData.title;
				
				registType = pageData.type;
				searchTitle(registType, registId);
			}
			
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
		$$('.applyHold').on('click', savePerson);
		
	}

	/**
	 *  查看乡镇类型
	 */
	function loadDict() {
		app.ajaxLoadPageContent(loadTownPath, {
			// dictCode: 'RZLX',
		}, function(result) {
			var data = result.data[0].children;
			console.log('查看乡镇类型');
			console.log(data);
			pageDataStorage['dict'] = data;
			home = data;
			handleDict(data);
		});
	}


	/**
	 *  加载乡镇类型
	 */
	function handleDict(data) {
		$$.each(data, function(index, item) {
			var selected = '';
			var indexnum = parseInt(index)
			if(chooseLogType == indexnum) {
				selected = 'selected';
			}
			// console.log(item);
			$$("#township").append("<option value='" + indexnum + "'" + selected + ">" + item.villageName + "</option>");

		});

		var communitys = data[0].children;

			console.log(communitys)
			
			$$.each(communitys, function(index2, item2) {
				var selected = '';
				var indexnum2 = parseInt(index2)
				if(chooseLogType2 == indexnum2) {
					selected = 'selected';
				}
				console.log(item2);
				$$("#community").append("<option value='" + indexnum2 + "'" + selected + ">" + item2.villageName + "</option>");
	
			});
			$$('#community').change(function() {
				var typeVal2 = $$('#community').val();
				if(chooseLogType2 != typeVal2) {
					chooseLogType2 = typeVal2;
			
				}
			});

		$$('#township').change(function() {
			var typeVal = $$('#township').val();
			if(chooseLogType != typeVal) {
				chooseLogType = typeVal;
				$$("#community").html('');
				console.log($$('#community'));
				console.log(typeVal);
				console.log(chooseLogType);
				var communitys = data[chooseLogType].children;
				console.log(communitys);
				chooseLogType2 = 0;
				changeCommit(communitys);
				
				
			}
		});
	}
	
	function changeCommit(data){

		$$.each(data, function(index, item) {
			var selected = '';
			var indexnum2 = parseInt(index)
			if(chooseLogType2 == indexnum2) {
				selected = 'selected';
			}
			console.log(item);
			
			$$("#community").append("<option value='" + indexnum2 + "'" + selected + ">" + item.villageName + "</option>");
		});
		$$('#community').change(function() {
			var typeVal2 = $$('#community').val();
			if(chooseLogType2 != typeVal2) {
				chooseLogType2 = typeVal2;
		
			}
		});

	}
	
	function searchTitle(type, id){
		// alert(type)
		// alert(id)
		// 志愿服务是ZYFW
		if(type == 'ZYFW'&& registId != 41){
			app.ajaxLoadPageContent(searchZYFW+id, {
			
			}, function(data) {
				if(data.code == 0 && data.data != null){
					console.log(data);
					if(data.data.serviceArticle == null){
						data.data.serviceArticle = '无';
					}
					var serviceTime = app.getnowdata(data.data.serviceTime);
					$$('.registerCircle').css('display','block');
					$$('.registerCircle').html('加入服务');
					$$('.registTitle').html(data.data.serviceTitle);
					$$('.registTitleContent').html(registTitle);
					$$('.serviceTime').html('志愿服务时间 : '+serviceTime);
					$$('.serviceAdress').html('志愿服务地点 : '+data.data.servicePlace);
					$$('.serviceContent').html('志愿服务内容 : '+data.data.serviceContent);
					$$('.serviceArticle').html('携带服务物品 : '+data.data.serviceArticle);
					$$('.type1').css('display','block');
					$$('.type2').css('display','none');
					
					$$('.applyBackGround').css('background','#fff');

				}else{
					app.myApp.toast('没有找到该志愿服务','error').show(true);
					app.myApp.getCurrentView().back();
				}
			});
			
		}else if(type == 'MEETING'){
			app.ajaxLoadPageContent(searchMeeting+id, {
			
			}, function(data) {
				if(data.code == 0 && data.data != null){
					console.log(data);
					$$('.registerCircle').css('display','block');
					$$('.registerCircle').html('加入会议');
					
					$$('.registTitle').html(data.data.meetingTitle);
					$$('.registTitleContent').html(data.data.meetingContent);
					$$('.registTime').html('会议时间 : '+data.data.meetingTime);
					$$('.type1').css('display','block');
					$$('.type2').css('display','none');
					$$('.applyBackGround').css('background','#fff');

				}else{
					app.myApp.toast('没有找到该会议','error').show(true);
					app.myApp.getCurrentView().back();
				}
			});
			
		}else{
			$$('.registerCircle').css('display','none');
			$$('.registTitle').html('众志成城 抗击疫情');
			$$('.registTitleContent').html('请战人');
			$$('.type2').css('display','block');
			$$('.type1').css('display','none');
			// $$('.registTitle').css('applyTitle');
			// $$('.registTitleContent').css('applyTitle');
			
			loadDict();
			// $(".applyBackGround input").focus(function(){
			// 	console.log('获取焦点');
			// 	$$('.applyBottom').css('opacity','0');
			// }) ;
			// $(".applyBackGround input").blur(function(){
			// 	console.log('是去焦点')
			// 	$$('.applyBottom').css('opacity','1');
			// }) ;

			//获取当前页面高度
			var winHeight = $(window).height();   
			$(window).resize(function(){
			var thisHeight=$(this).height();
				if(winHeight - thisHeight >50){
					//窗口发生改变(大),故此时键盘弹出
					//当软键盘弹出，在这里面操作
					$$('.applyBottom').css('opacity','0');
				}else{
					//窗口发生改变(小),故此时键盘收起
					//当软键盘收起，在此处操作
					$$('.applyBottom').css('opacity','1');
				}
			});


		}
	}


	

	

	function savePerson(){

		if(registType == 'ZYFW' && registId != 41){
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
		}else if(registType == 'MEETING'){
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
		}else{

			var applyName = $$('#applyName').val();
			var applyPhone = $$('#applyPhone').val();
			var applyAge = $$('#applyAge').val();
			var applyHealth = $$('#applyHealth').val();
			var applyPartyName = $$('#applyPartyName').val();
			var community = $$('#community').val();
			var township = $$('#township').val();
			// var recordType = $$('#recordType').val();
			

		if(!applyName || !applyPhone || !applyAge || !applyHealth || !applyPartyName || !community || !township) {
			app.myApp.alert('请补全信息！');
			return;
		}
			homeName = home[township].villageName;
			homeChildName = home[township].children[community].villageName
			console.log('3');
			console.log(homeName);
			console.log(homeChildName);
			var params={
				"age": applyAge,
				"community": homeChildName,
				"health": applyHealth,
				"id": app.userId,
				"memo": "",
				"name": applyName,
				"partyName": applyPartyName,
				"phone": applyPhone,
				"township": homeName

			}
			console.log(params);
			
		var formDatas= JSON.stringify(params)


			$$.ajax({
				url:saveApply,
				method: 'POST',
				dataType: 'json',
				data: formDatas,
				contentType: 'application/json;charset:utf-8',
				// data: formDatas,
				cache: false,
				success:function (result) {
					if(result.data !== null && result.code == 0){
						app.myApp.toast("请战成功！", 'success').show(true);
						app.myApp.getCurrentView().back();
					}else{
						app.myApp.toast("请战失败！请稍后再试", 'error').show(true);
					}
				},
				error:function () {
					app.myApp.alert('请战失败！请稍后再试!');
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