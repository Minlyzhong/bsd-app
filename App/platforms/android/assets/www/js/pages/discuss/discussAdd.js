define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//添加聊天室接口
	var servicesAddPath = app.basePath + '/mobile/blog/topic/add';

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
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.savediscuss').on('click', saveDiscussAdd);
	}

	/**
	 * 新建话题
	 */
	function saveDiscussAdd() {
		var dName = $$('#discussName').val();
		if(!dName) {
			app.myApp.alert('请确认话题名称！');
			return;
		}
		var dContent = $$('#discussContent').val();
		var params = {
			// userId: app.userId,
			// roomCreater: app.user.userName,
			title: dName,
			desc: dContent
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
            	if(data.msg == 'success'&& data.code == 0) {
					app.myApp.toast('新增成功','success').show(true);
					require(['js/pages/discuss/discuss'], function(discuss) {
						discuss.loadChatList();
					});
					setTimeout(function() {
						app.myApp.getCurrentView().back();
					}, 1000);
				}else{
					app.myApp.toast('新增失败','error').show(true);
				}
            },
            error:function () {
				app.myApp.toast('新增失败','error').show(true);
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