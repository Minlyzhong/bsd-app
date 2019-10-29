define(['app','hbs!js/hbs/stepList'], function(app, stepTemp) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {}; 
	var honorId;
	var hovorLever = {};
	
	//获取会议详细
	var meetingDetailsPath = app.basePath + '/mobile/honor/detail/';
	
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		app.back2Home();;
		attrDefine(page);
		clickEvent(page);
		
	}
		
	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {}; 
		honorId = pageData.honorId;
		hovorLever = []
		var list = [{meetingName:'党支部会议提议',time:'2019-10-08',modifer:'admin',isWriter:'1',index:1 },{meetingName:'两委会议提议',time:'2019-10-08',modifer:'admin',isWriter:'1',index:2 },{meetingName:'党员大会审议',time:'2019-10-08',modifer:'admin',isWriter:'0',index:3 },{meetingName:'村名大会决议',time:'2019-10-08',modifer:'admin',isWriter:'0',index:4 },{meetingName:'决议公开',time:'2019-10-08',modifer:'admin',isWriter:'0',index:5 },{meetingName:'实施结果公示',time:'2019-10-08',modifer:'admin',isWriter:'0',index:6 }]
		$$('.precessList ul').append(stepTemp(list))
		loadHonorDetail(honorId);
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {}
	/**
	 * 点击事件
	 */
	function clickEvent(page) {
	
		$$('.precessList li').click(function(){
			var type = $$(this).data('type');
			var name = $$(this).data('name');
			var isWriter = $$(this).data('isWriter');
			console.log(type);
			// 注意只有roleId 是 支部的能填写, 其他人只能看填写的内容
			if(type <= 4 && isWriter == 0){
				app.myApp.getCurrentView().loadPage('processDetailEdit.html?type='+type+'&name='+name);
			}else if(type <= 4 && isWriter == 1){
				app.myApp.getCurrentView().loadPage('processDetailEditDone.html?type='+type+'&name='+name);
			}else if(type > 4 && isWriter == 0){
				app.myApp.toast('暂时没有公示','error').show(true);
			}else if(type > 4 && isWriter == 1){
				// app.myApp.getCurrentView().loadPage('processDetailEdit.html?type='+type+'&name='+name);
			}
			

		})	
	
	}

	/*
	 * 加载数据
	 */
	function loadHonorDetail(honorId,hovorLever){
		app.ajaxLoadPageContent(meetingDetailsPath+honorId, {
			// honorId:honorId,
		}, function(data) {
			var result = data.data;
			var type = 3;
			// if(type = 3){
				// var list = $$('.precessList li span');
				// console.log(list)

				// for(var i=0; i<list.length; i++){
					// if(i<=type){
						// list[i].addClass('done');
						// console.log(list[i]);
						// list[i].css('background', '#cecece');
						// list[i].css('background','#cecece');
					// }else{
					// 	console.log(list[i]);
					// 	list[i].css('background','#cecece');
					// }
				// }
			
			
			// }
			// console.log(result.honorName);
			// // console.log(result.honorLevelName);
			
			// var honerTime = app.getnowdata(result.honorTime);
			// $$('#honorName').val(result.honorName);
			// $$('#honorTime').val(honerTime);
			// $$('#grantOrganization').val(result.grantOrganization);
			// $$('#honorLevel').val(result.honorLevel);
			// $$('#honorDescription').val(result.honorDescription);
			// $$('#honorUser').val(result.userName);
			//加载图片
			// showReadonlyPhotos(result.attList);
		});	
	}

	
	function refresh(){
		app.myApp.getCurrentView().back();
	}
	
	/**
	 * 重置firstIn变量 
	 */
	function resetFirstIn() {
		firstIn = 1;
	}

	return {
		init: init,
		refresh:refresh,
		resetFirstIn: resetFirstIn,
	}
});