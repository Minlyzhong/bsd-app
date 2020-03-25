define(['app'
], function(app) {
	var $$ = Dom7;
	// 初始化地图中心点
	var findSysCityPath = app.basePath + '/mobile/village/map/center';
	// 加载地图数据
	var loadMapDataPath = app.basePath + '/mobile/village/map/';
	// 创建Map实例
	var map = new BMap.Map("allmap"); 
	var flagIcon;
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		ajaxLoadContent(page);		
		app.back2Home();
	
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
	
		map = new BMap.Map("allmap"); // 创建Map实例
		$$('.mapName').html(pageData.appName);
	}	
	

	/**
	 * 初始化异步请求页面数据 
	 */
	function ajaxLoadContent(page) {
		// 百度地图API功能
		map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
		map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
	
		var bot_left_control = new BMap.ScaleControl({
			anchor : BMAP_ANCHOR_BOTTOM_LEFT
		});// 左下角，添加比例尺
		var top_left_navigation = new BMap.NavigationControl(); //左上角，添加默认缩放平移控件
	
		// 添加控件和比例尺
		map.addControl(bot_left_control);
		map.addControl(top_left_navigation);
	
		flagIcon = new BMap.Icon('http://219.159.197.209:8099//images/redflag.png', new BMap.Size(32, 32));
		// flagIcon = new BMap.Icon(app.filePath+"/images/redflag.png", new BMap.Size(32, 32));
	
		$(document).ready(function() {
			// 初始化地图中心点
			initMapCenter();
			// 初始化加载党建地图
			loadMapData(1, null);
		});
	}

	// 初始化地图中心点
	function initMapCenter() {
		var token = localStorage.getItem('access_token');
						
		$.ajax({
			url : findSysCityPath,
			headers: {
				Authorization: "bearer "+token
			},
			data : {
				
				tenantId : app.tenantId
			},
			success : function(result) {
				var data = result.data;
				// var json = $.parseJSON(data);
				
				if (result.msg == 'success' && result.data != null) {
					console.log(data.sysCity)
					map.centerAndZoom(data.sysCity, 11); // 显示地图中心城市和地图等级
					// map.centerAndZoom('合浦县', 11); // 显示地图中心城市和地图等级
				}else{
					// map.centerAndZoom('合浦县', 11);
					map.centerAndZoom('合浦县', 11);
				}
			},
			error : function() {
			}
		});
	}

	// 加载地图数据
	function loadMapData(deptId, queryStr) {
		var token = localStorage.getItem('access_token');
		$.ajax({
			url : loadMapDataPath+ deptId,
			headers: {
				Authorization: "bearer "+token
			},
			dataType : 'json',
			type : 'GET',
			data : {
				// parentId : deptId,
				// queryStr : queryStr
				tenantId : app.tenantId
			},
			error : function() {
				app.myApp.alert('获取党建地图数据失败');
			},
			success : function(json) {
				if (json != null && json.msg=='success' && json.data != null
						&& json.data.length > 0) {
					for (i = 0; i < json.data.length; i++) {
						// 刷新地图数据
						refreshMap(json.data[i]);
					}
				}
			}
		});
	}

	// 刷新地图
	function refreshMap(json) {
		// console.log(json);
		if (json == null)
			return;
		var id = json.id;
		var lng = json.lng;
		var lat = json.lat;
		var address = json.address;
		var deptName = json.deptName;
		var partyNum = json.partyNum;
		var totalMember = json.totalMember;

		var point_1 = new BMap.Point(lng, lat);
		var marker_1 = new BMap.Marker(point_1, {
			icon : flagIcon
		}); // 创建标注
		map.addOverlay(marker_1); // 将标注添加到地图中
		var label_1 = new BMap.Label(deptName, {
			offset : new BMap.Size(20, -10)
		});
		marker_1.setLabel(label_1);

		var sContent_1 = "<h3 style='margin:0 0 5px 0;padding:0.2em 0'>"
				+ deptName
				+ "</h3>"
				+ "<div style='float:left;margin:4px' id='" + id +"'><p style='margin:0;line-height:1.5;font-size:13px;'><b>所在地址</b>："
				+ address
				+ "</p>"
				+ "<p style='margin:0;line-height:1.5;font-size:13px;'><b>党员人数</b>："
				+ totalMember
				+ " 人</p>"
				+ "<p style='margin:0;line-height:1.5;font-size:13px;'><b>党支部数量</b>："
				+ partyNum + " 个</p></div>";
		var infoWindow_1 = new BMap.InfoWindow(sContent_1); // 创建信息窗口对象
		marker_1.addEventListener("click", function() {
			map.openInfoWindow(infoWindow_1, point_1);// 提示信息
		});

		label_1.addEventListener("click", function() {
			map.openInfoWindow(infoWindow_1, point_1);// 提示信息
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