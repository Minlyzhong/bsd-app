define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//保存专项考核明细
	var saveUserReportDetialPath = app.basePath + '/mobile/dbSign';
	var assessId = -1;
	var assessScore = 0;
	var count = 0;
	
	var thisAppName = '';

	
	var judgmentParam = 0;
	
	var minDate = '';
	//地理位置
	var lng;
	var lat;
	var topicId;
	var shykScore;
	var thisAppName;
	var deptId;
	var target;
	var	minus;
	var	memo;
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		//设置页面不能滑动返回
		page.view.params.swipeBackPage = false;
		app.myApp.onPageBack("doubleSign/doubleSign", function(page){
			page.view.params.swipeBackPage = true;
		});
		count = 0;
//		if(firstIn) {
			initData(page.query);
//		}
		//app.back2Home();
		clickEvent();
		attrDefine(page.query);
		pushAndPull(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		photoBrowserPhotos = [];
		lng = 0.0;
		lat = 0.0;
		assessId = pageData.assessId;
		assessScore = pageData.score;
		if(pageData.judgmentParam){
			judgmentParam = pageData.judgmentParam;
		}else{
			judgmentParam = 0;
		}
		console.log(judgmentParam == 1);
		srcName = [];
		suffixName = [];
		fileNames = [];
		fileCount = 0;
		thisAppName = pageData.thisAppName;
		
		minDate = pageData.StartDate
	}

	/**
	 * 点击事件
	 */
	function clickEvent() {
		//获取地址
		$$('.getGPS').on('click', getPosition);

		$$('.sumbit').on('click', saveUserReportDetial);
	
		
		$$('.assessWorkBack').on('click',function(){
			app.myApp.confirm('您的签到尚未上传，是否退出？', function() {
				app.myApp.getCurrentView().back();
			});
		});
		$$('.assessWorkHome').on('click',function(){
			app.myApp.confirm('您的签到尚未上传，是否返回首页？', function() {
				app.back3Home();
			});
		});
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(pageData) {
		$$('.assessDetailTitle').html(pageData.title);
		addCalendar('assessTs');
	}
	//初始化日历
	function addCalendar(contentID) {
		//var minDate = '2018-4-01';
		console.log(minDate);
		calID = app.myApp.calendar({
			input: '#' + contentID,
			toolbarCloseText: '完成',
			headerPlaceholder: '选择的日期',
			monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
			dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
			dateFormat: 'yyyy-mm-dd, DD',
			closeOnSelect: true,
			maxDate: new Date(),
			minDate:minDate,
		});
	}

	

	//保存考核信息
	function saveUserReportDetial() {
		var assessTitle = $$('#assessTitle').val();
		var assessTs = $$('#assessTs').val();
		var assessContent = $$('#assessContent').val();
		var weather = $$('#weather').val();
		if(!assessContent || !assessTitle || !assessTs || !weather) {
			app.myApp.alert('请补全考核信息！');
			return;
		}

		var signDate = assessTs.split(',')[0];
		var signweek = assessTs.split(',')[1].replace( /^\s*/, '');

		//防止数据传输过慢多次上传
		count = count + 1;
		if(count > 0){
			$$('.sumbit').attr('disabled',false);
		}
		app.myApp.showPreloader('信息保存中...');

		var params={
			contentTitle: assessTitle,
			deptId: app.user.deptId,
			deptName: app.userDetail.deptName,
			jobContent: assessContent,
			// modifier: app.user.nickName,
			name: app.user.nickName,
			tenantId: app.tenantId,
			userId: app.user.userId,
			weather: weather,
			week: signweek,
			workingAddress: $$('#location').val()
		}

		console.log(params)
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
					
				// 	require(['js/pages/assessment/assessment'], function(assessment) {
				// 		assessment.addCallback();
				// 	});
			
				// app.myApp.getCurrentView().back();
			
				app.myApp.getCurrentView().back();
			
				}else{
					app.myApp.toast(data.msg , 'error').show(true);
				}
				
			
		},
            error:function () {
				app.myApp.hidePreloader();
				app.myApp.alert(app.utils.callbackAjaxError());
            }
        });



		
	}

	
	/**
	 * 定位 
	 */
	function getPosition() {
		app.myApp.showPreloader('定位中...');
		//开启定位服务
		if(navigator.geolocation) {
			signStatus = 1;
			navigator.geolocation.getCurrentPosition(onSuccessPosition, onErrorPosition, {
				maximumAge: 3000,
				timeout: 5000, 
				enableHighAccuracy: true
			});
		}
	}
	function onErrorPosition(e) {
		app.myApp.hidePreloader();
		if(app.myApp.device.ios) {
			app.myApp.alert('未开启"定位"权限<br />请前往手机"设置"->"隐私"->"定位服务"');
		} else {
			if(e.code == '3'){
				app.myApp.showPreloader('定位中...');
				signStatus = 2;
				var map = new BMap.Map();
				var point = new BMap.Point(116.331398,39.897445);
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition(function(r){
					if(this.getStatus() == BMAP_STATUS_SUCCESS){
						app.myApp.alert('您的位置：'+r.point.lng+','+r.point.lat);
						onSuccessPosition(r);
					}
					else {
						app.myApp.alert('failed'+this.getStatus());
					}        
			    },{enableHighAccuracy: true})
			}else{
				app.myApp.alert('请打开GPS定位');
			}
		}
	}
	function onSuccessPosition(position) {
		app.myApp.hidePreloader();
		if(signStatus == 1){
			var _lng = position.coords.longitude;
			var _lat = position.coords.latitude;
		}else if(signStatus == 2){
			var _lng = position.point.lng;
			var _lat = position.point.lat ;
		}
		//拿到GPS坐标转换成百度坐标
		app.ajaxLoadPageContent('https://api.map.baidu.com/ag/coord/convert', {
			from: 0,
			to: 4,
			x: _lng,
			y: _lat
		}, function(data) {
			lng = app.utils.base64decode(data.x);
			lat = app.utils.base64decode(data.y);
			GetAddress();
		}, {
			type: 'GET',
		});
	}
	/*
	 * 根据坐标获取中心点地址
	 */
	function GetAddress() {
		var _SAMPLE_ADDRESS_POST = app.utils.getAddressPost();
		_SAMPLE_ADDRESS_POST += "&location=" + lat + "," + lng;
		app.ajaxLoadPageContent(_SAMPLE_ADDRESS_POST, {
			
		}, function(data) {
			renderReverse(data);
		}, {
			type: 'GET',
		});
	}

	function renderReverse(response) {
		if(response.status) {
			
		} else {
			var userPosition = response.result.addressComponent.street + response.result.addressComponent.street_number;
			$$('#location').val(userPosition);
		}
	}		
	

	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//下拉刷新
		var ptrContent = $$(page.container).find('.pull-to-refresh-content');
		ptrContent.on('refresh', function(e) {
			setTimeout(function() {
				pageNo = 1;
				loading = true;
				//这里写请求
				app.myApp.pullToRefreshDone();
			}, 500);
		});

		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			//这里写请求
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