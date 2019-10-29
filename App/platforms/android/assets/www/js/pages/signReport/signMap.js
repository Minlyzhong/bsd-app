define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var map;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		app.back2Home();
		map = new BMap.Map("showSignMap");
		showMap(JSON.parse(page.query.item));
	}

	/**
	 * 查看地图
	 * @param {Object} item 考勤信息对象
	 */
	function showMap(item) {
		var point = new BMap.Point(item.lng, item.lat);
		// 创建标注
		var marker = new BMap.Marker(point, {
			icon: new BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
				scale: 1.2, //图标缩放大小
				fillColor: '#0cabf5', //填充颜色
				fillOpacity: 1, //填充透明度
			})
		});
		map.addOverlay(marker);
		map.centerAndZoom(point, 19);
		var opts = {
			width: 180, // 信息窗口宽度
			height: 70, // 信息窗口高度
			title: item.name // 信息窗口标题
		};
		var infoWindow = new BMap.InfoWindow('打卡地址：' + item.place + '<br />打卡时间：' + item.ts, opts); // 创建信息窗口对象 
		map.openInfoWindow(infoWindow, new BMap.Point(point.lng, point.lat + 0.00006)); //开启信息窗口
		$$('.BMap_cpyCtrl').remove();
		marker.addEventListener("click", function() {
			map.openInfoWindow(infoWindow, new BMap.Point(point.lng, point.lat + 0.00006)); //开启信息窗口
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