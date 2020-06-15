define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	//新增办事事项
	var saveUserReportDetialPath = app.basePath + '/mobile/operating/event';
	var count = 0;
	var thisAppName = '';
	var peopleDetail = {};
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		//设置页面不能滑动返回
		page.view.params.swipeBackPage = false;
		app.myApp.onPageBack("operating/operating", function(page){
			page.view.params.swipeBackPage = true;
		});
		count = 0;
//		if(firstIn) {
		initData(page.query);
//		}
		app.back2Home();
		clickEvent();
		attrDefine(page.query);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		thisAppName = pageData.thisAppName;
		peopleDetail = {};
	}

	/**
	 * 点击事件
	 */
	function clickEvent() {
		//新增办事事项
		$$('.sumbit').on('click', saveUserReportDetial);
		$$('.assessWorkBack').on('click',function(){
			app.myApp.confirm('您的新增事项还没上传，是否退出？', function() {
				app.myApp.getCurrentView().back();
			});
		});
		$$('.assessWorkHome').on('click',function(){
			app.myApp.confirm('您的新增事项还没上传，是否返回首页？', function() {
				app.back3Home();
			});
		});
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(pageData) {
		// $$('.assessDetailTitle').html(pageData.title);
	}

	

	//保存考核信息
	function saveUserReportDetial() {
		
		var matter = $$('#matter').val();
		var matterContent = $$('#matterContent').val();
		
		console.log(matter)
		console.log(matterContent)
		
		if(!matter || !matterContent ) {
			app.myApp.alert('请补全事项信息！');
			return;
		}

		//防止数据传输过慢多次上传
		count = count + 1;
		if(count > 0){
			$$('.sumbit').attr('disabled',false);
		}
		app.myApp.showPreloader('信息保存中...');
		// "type": 0, 正常, 1 请假
		var params = {
			eventName:matter,
			eventContent:matterContent,
			deptId:app.userDetail.deptId,
			deptName:app.userDetail.deptName
		}
		console.log(params)
		// 暂时return
		// return;
		var formDatas= JSON.stringify(params)
		$$.ajax({
            url:saveUserReportDetialPath,
            method: 'POST',
            dataType: 'json',
			contentType: 'application/json;charset:utf-8',
            data: formDatas,
            cache: false,
            success:function (data) {
				if(data.code == 0 && data.data == true){
					console.log(data);
					app.myApp.hidePreloader();
					app.myApp.toast('保存成功', 'success').show(true);
					$$('.sumbit').html('已保存');
				
				app.myApp.getCurrentView().back();
			
				}else{
					app.myApp.hidePreloader();
					// app.myApp.toast(data.msg , 'error').show(true);
					app.myApp.toast('请稍后再试' , 'error').show(true);
				}
				
			
		},
            error:function () {
				app.myApp.hidePreloader();
				app.myApp.alert(app.utils.callbackAjaxError());
            }
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