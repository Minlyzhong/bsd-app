define(['app'
], function(app) {
	var $$ = Dom7;
	
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
		$$('.mapName').html(pageData.appName);
		//console.log(pageData.appName);
	}	
	

	/**
	 * 初始化异步请求页面数据 
	 */
	function ajaxLoadContent(page) {
		// 百度地图API功能
		var map = new BMap.Map("allmap");    // 创建Map实例
		//map.centerAndZoom(new BMap.Point(113.404, 23.2915), 11);  // 初始化地图,设置中心点坐标和地图级别
		map.centerAndZoom("合浦",15);
		map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
		map.setCurrentCity("合浦");          // 设置地图显示的城市 此项是必须设置的
		map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
		
		/*
		var local = new BMap.LocalSearch(map, {
			renderOptions:{map: map}
		});
		local.search("合浦");
		*/
		
		var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
		var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
		
		//添加控件和比例尺
		//map.addControl(top_left_control);        
		map.addControl(top_left_navigation);     
		
		var point1 = new BMap.Point(109.213655,21.66714);
		var marker1 = new BMap.Marker(point1);  // 创建标注
		map.addOverlay(marker1);              // 将标注添加到地图中
		var label1 = new BMap.Label("合浦组织部党支部",{offset:new BMap.Size(20,-10)});
		marker1.setLabel(label1);
		
		var sContent = "<h3 style='margin:0 0 5px 0;padding:0.2em 0'>"
			+ "合浦组织部党支部</h3>"
			+ "<div style='float:left;margin:4px'><p style='margin:0;line-height:1.5;font-size:13px;'><b>所在地址</b>：合浦县公园路81号</p>"
			+ "<p style='margin:0;line-height:1.5;font-size:13px;'><b>党员人数</b>：15人</p>"
			+ "<p style='margin:0;line-height:1.5;font-size:13px;'><b>支部排名</b>：第 1 名</p>"
			+ "<p style='margin:0;line-height:1.5;font-size:13px;'><b>党建考核得分</b>：96分</p>"
			+ "<p style='margin:0;line-height:1.5;font-size:13px;'><b>考核完成进度</b>：96%</p></div>";
		var infoWindow = new BMap.InfoWindow(sContent); // 创建信息窗口对象
		marker1.addEventListener("click", function() {
			map.openInfoWindow(infoWindow, new BMap.Point(109.213655,21.667141));// 提示信息
		});
		
		label1.addEventListener("click", function(){
			map.openInfoWindow(infoWindow, new BMap.Point(109.213655,21.667141));// 提示信息
		});
		
		var point2 = new BMap.Point(109.213295,21.653838);
		var marker2 = new BMap.Marker(point2);  // 创建标注
		map.addOverlay(marker2);              // 将标注添加到地图中
		var label2 = new BMap.Label("合浦四中党支部",{offset:new BMap.Size(20,-10)});
		marker2.setLabel(label2);
		
		var point3 = new BMap.Point(109.198994,21.666469);
		var marker3 = new BMap.Marker(point3);  // 创建标注
		map.addOverlay(marker3);              // 将标注添加到地图中
		var label3 = new BMap.Label("合浦农业局党支部",{offset:new BMap.Size(20,-10)});
		marker3.setLabel(label3);
		
		var point4 = new BMap.Point(109.226518,21.665125);
		var marker4 = new BMap.Marker(point4);  // 创建标注
		map.addOverlay(marker4);              // 将标注添加到地图中
		var label4 = new BMap.Label("合浦国税局党支部",{offset:new BMap.Size(20,-10)});
		marker4.setLabel(label4);
		
		var point5 = new BMap.Point(109.205462,21.67453);
		var marker5 = new BMap.Marker(point5);  // 创建标注
		map.addOverlay(marker5);              // 将标注添加到地图中
		var label5 = new BMap.Label("合浦中医院党支部",{offset:new BMap.Size(20,-10)});
		marker5.setLabel(label5);
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