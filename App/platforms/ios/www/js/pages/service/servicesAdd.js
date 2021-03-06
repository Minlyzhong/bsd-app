define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//增加志愿服务接口
	var servicesAddPath = app.basePath + '/mobile/volunteer/save';
	var calID = null;
	var count = 0;
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
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
		count = 0;
		addCalendar('servicesLimit');
		addCalendar('servicesTime');
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.saveServices').on('click', saveServicesAdd);
	}

	//初始化日历
	function addCalendar(contentID) {
		calID = app.myApp.calendar({
			input: '#' + contentID,
			toolbarCloseText: '完成',
			headerPlaceholder: '选择的日期',
			monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
			dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
			dateFormat: 'yyyy-mm-dd',
			closeOnSelect: true
		});
	}

	//点击保存按钮
	function saveServicesAdd() {
		var sName = $$('#servicesName').val();
		if(!sName) {
			app.myApp.alert('请确认服务名称！');
			return;
		}

		var sContent = $$('#servicesContent').val();
		var sTime = $$('#servicesTime').val();
		var sLimit = $$('#servicesLimit').val();
		if(!sTime || !sLimit) {
			app.myApp.alert('请确认时间！');
		} else if(sTime <= sLimit) {
			app.myApp.alert('报名期限必须早于服务时间！');
			$$('#servicesLimit').val('');
			return;
		}

		var sPeopleNum = $$('#servicesPeopleNum').val();
		if(!sPeopleNum || sPeopleNum < 1) {
			app.myApp.alert('请确认报名人数！');
			return;
		}

		var sPlace = $$('#servicesPlace').val();
		if(!sPlace) {
			app.myApp.alert('请确认服务地点！');
			return;
		}
		var sCarry = $$('#servicesCarry').val();
		var sRule = $$('#servicesRule').val();
		sLimit = sLimit+' 00:00:00';
		sTime = sTime+' 00:00:00';
		console.log(app.user);

		// 防止卡重复点击
		count = count + 1;
		if(count > 0){
			$$('.saveServices').attr('disabled',false);
		}

		var params={
			creatorId:app.userId,
			creatorName:app.user.userName,
			creatorPhone:app.userDetail.phone,
			serviceTitle:sName,
			serviceContent:sContent,
			serviceStartTime:sTime,
			signEndTime:sLimit,
			totalUser:sPeopleNum,
			servicePlace:sPlace,
			serviceArticle:sCarry,
			gradeRuleId:sRule 
		}
		var formDatas= JSON.stringify(params)
		$$.ajax({
            url:servicesAddPath,
            method: 'POST',
            dataType: 'json',
			contentType: 'application/json;charset:utf-8',
            data: formDatas,
            cache: false,
            success:function (data) {
				if(data.msg == 'success' && data.code == 0){
					app.myApp.toast('保存成功', 'success').show(true);
					app.myApp.hidePreloader();
					app.myApp.getCurrentView().back();
					setTimeout(function(){
					require(['js/pages/service/service'], function(service) {	
						service.servicesRefresh();
					});
				},100)

				
				}else{
					app.myApp.toast('保存失败', 'error').show(true);
				}
            	
            	
            },
            error:function () {
				app.myApp.toast('保存失败', 'error').show(true);
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