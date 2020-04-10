define(['app',
'hbs!js/hbs/mapControl',
], function(app,template) {
	var $$ = Dom7;
	// 初始化地图中心点
	var findSysCityPath = app.basePath+'/mobile/village/map/center';
	// 	// 加载地图数据
	// var loadMapDataPath = app.basePath+'vilMap/loadMapData';
	// 获取村集体经济地图
	var loadMapDataPath = app.basePath + '/mobile/village/economic/';
	var _layerType=5;
	var markerArr1=[];
	var markerArr2=[];
	var markerArr3=[];
	var markerArr4=[];
	var markerArr5=[];
	var nowYear;
	var nowYearList = '';
	var _color = "#D15FEE";
	 // 创建Map实例
	var map = new BMap.Map("allmap");
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		nowYear = new Date().getFullYear();
		map = new BMap.Map("allmap"); // 创建Map实例
		initData(page.query);
		
		ajaxLoadContent(page);	
		clickEvent();	
		app.back2Home();
		if(app.tenantId == null || app.tenantId == undefined || app.tenantId == '' ){
			app.tenantId = 'cddkjfdkdeeeiruei8888'
		}
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		_layerType = 5;
		_color = "#D15FEE";
		$$('.mapName').html(pageData.appName);
	}	

	// 加载各图层数据
	function loadLayerData() {
		console.log($$(this).data('value'))
		
		console.log($$(this).is(":checked"))
		console.log($$(this).checked)
		
		var value = $$(this).data('value');
		var isChecked = $$(this).is(":checked");
		_layerType = value;
		console.log('_layerType')
		console.log(_layerType)
		if ($$(this) && isChecked) {
			// 显示图层中的标记点
			loadMapData(_layerType);
		} else {
			// 移除图层中的标记点
			if (1 == _layerType) { // 缓存标记点
				removeMarker(markerArr1);
				markerArr1=[];
			} else if (2 == _layerType) {
				removeMarker(markerArr2);
				markerArr2=[];
			} else if (3 == _layerType) {
				removeMarker(markerArr3);
				markerArr3=[];
			} else if (4 == _layerType) {
				removeMarker(markerArr4);
				markerArr4=[];
			} else if (5 == _layerType) {
				removeMarker(markerArr5);
				markerArr5=[];
			} else {
				//
			}
			
			removeMarker();
			
		}
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
		});// 左上角，添加比例尺
		var top_left_navigation = new BMap.NavigationControl(); //左上角，添加默认缩放平移控件
		var top_left_navigation = new BMap.NavigationControl(); //右下角，添加默认缩放平移控件
		// // 显示图例
		function ShowLegendControl() {
			this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
			this.defaultOffset = new BMap.Size(5, 5);// 默认偏移量
		}
		ShowLegendControl.prototype = new BMap.Control();
		ShowLegendControl.prototype.initialize = function(map) {
			// 创建一个DOM元素
			var div = document.createElement("div");
			div.style.background = "White";
			div.style.padding = "15px";
			div.style.opacity = " 0.8";
			// var li = document.createElement("li");
			
			

			var li = $$(`<input type='checkbox' name="top" id='cbx1' data-value='5' value='5'  style='cursor:pointer;' checked=true /><b>10万元以上</b><div style='width:30px;height:10px;float:right;margin-top:5px;background:#FF0000;'></div><br/>`).appendTo(div); 

			var li = $$(`<input name="box"   type='checkbox' id='cbx2' value='4' data-value='4'  style='cursor:pointer;'/><b>5~10万元</b><div style='width: 30px; height:10px;float:right;margin-top:5px;background:#FFFF00;'></div><br/>`).appendTo(div); 

			var li = $$(`<input class='box' name="box" type='checkbox' id='cbx3' value='3' data-value='3' stlyle='cursor:pointer;'/><b>4~5万元</b><div style='width: 30px; height:10px;float:right;margin-top:5px;background:#1E90FF;'></div><br/>`).appendTo(div); 

			var li = $$(`<input class='box' name="box" type='checkbox' id='cbx4' value='2' data-value='2' style='cursor:pointer;'/><b>3~4万元</b><div style='width: 30px; height:10px;float:right;margin-top:5px;background:#7CFC00;'></div><br/>`).appendTo(div); 

			var li = $$(`<input class='box' name="box" type='checkbox' id='cbx5' value='1' data-value='1'  style='cursor:pointer;'/><b>3万元以下</b><div style='width: 30px; height:10px;float:right;margin-top:5px;background:#D15FEE;'></div><br/>`).appendTo(div); 

			var li = $$(`<div id="tab3"  style="position: relative; font-weight: 600;">
			<div class="assessmentTimeYear list-block" style="margin: 0px;">
			  
				  <div class="item-content" style="min-height:30px;">
					
					  
					  
						<input style="margin: 0px; width: 77px;
						font-size: 14px;background-image: url(img/more.png);background-repeat: no-repeat;background-size: 17px;background-position: 60px 11px;text-align:left;padding-left: 7px;height: 28px;" type="text" placeholder="选择年份" id="picker-describeYear" readonly>
					  </div>
					
				  
			
			</div>`).appendTo(div);
			// 添加DOM元素到地图中
			// 点击事件
			
			map.getContainer().appendChild(div);
			// 将DOM元素返回
			return div;
		}

		
		
		// 创建控件
		var showLegendCtrl = new ShowLegendControl();
		// 添加到地图当中
		map.addControl(showLegendCtrl);

		//添加控件和比例尺
		map.addControl(bot_left_control);
		map.addControl(top_left_navigation);
		$(document).ready(function() {
			// 初始化地图中心点
			initMapCenter();
			window.setTimeout(function(){
				// 初始化加载党建地图
				loadMapData(5);
			},500)
			
		});


	}
	/**
		 * 点击事件
		 */
		function clickEvent() {
			$$('input').on('click',loadLayerData);

			console.log(nowYear)
			pickerDescribeYear = app.myApp.picker({
				input: '#picker-describeYear',
				rotateEffect: true,
				cols: [
					{
						textAlign: 'left',
						values: (parseInt(nowYear)+'年 '+parseInt(nowYear-1)+'年').split(' ')
					},
				]
				
			});
			$("#picker-describeYear").val(nowYear+'年 ');

			$$(".assessmentTimeYear").on('click',function(){
				pickerDescribeYear.open();
				$$('.picker-3d .close-picker').text('选择');
				$$('.toolbar-inner .right').css('margin-right','20px');	
				$$('.picker-3d .close-picker').on('click',function(){
					year = pickerDescribeYear.value[0].substring(0,pickerDescribeYear.value[0].length-1);
					$("#picker-describeYear").val(year+'年 ');
					nowYear = year;
					removeAll();

					// loadLayerData()
					_layerType = 5;
					loadMapData(_layerType);
					// loadMapData(5);

				});
			});
		}
		
	
	// 初始化地图中心点
	function initMapCenter() {
		var token = localStorage.getItem('access_token');
		$.ajax({
			url : findSysCityPath,
			data : {
				tenantId : app.tenantId
			},
			// headers: {
			// 	Authorization: "bearer "+token
			// },
			success : function(data) {
				// var json = $.parseJSON(data);
				if (data.msg == 'success' && data.data != null) {
					map.centerAndZoom(data.data.sysCity, 11); // 显示地图中心城市和地图等级
				}else{
					map.centerAndZoom('合浦县', 11); // 显示地图中心城市和地图等级
				}
			},
			error : function() {
			}
		});
	}

	// 加载地图数据
	function loadMapData(queryStr) {

		console.log('nowYearList');
		console.log(nowYearList);
		var token = localStorage.getItem('access_token');
		app.myApp.showPreloader('加载中...');
		$.ajax({
			url : loadMapDataPath+queryStr,
			dataType : 'json',
			type : 'GET',
			// headers: {
			// 	Authorization: "bearer "+token
			// },
			data : {
				// level : 2,
				year : nowYear,
				tenantId : app.tenantId
			},
			error : function() {
				app.myApp.hidePreloader();
				app.myApp.alert('获取党建地图数据失败');
			},
			success : function(json) {
				var data = json.data;
				console.log('data');
				console.log(data);
				app.myApp.hidePreloader();
				if (json.code == 0 && data != null
						&& data.length > 0) {
					for (i = 0; i < data.length; i++) {
						// 刷新地图数据
						refreshMap(data[i]);
					}
				}
			}
		});
	}
	
	function refreshMap(json) {
		if (json == null)
			return;
		var id = json.id;
		var lng = json.lng;
		var lat = json.lat;
		var vilName = json.villageName;
		var address = json.address;
		var income = json.income + '(万元)';
		var ecomode = json.ecomode;
		var firstSecretary = json.firstSecretary ||'';

		_color = "#D15FEE";
		if (1 == _layerType) 
			
			_color = "#D15FEE"; // 紫
		else if (4 == _layerType) // 黄
			_color = "#FFFF00";
		else if (3 == _layerType) // 蓝
			_color = "#1E90FF";
		else if (2 == _layerType) // 绿
			_color = "#7CFC00";
		else
		_color = "#FF0000"; // 红

		var point1 = new BMap.Point(lng, lat);
		var marker1 = new BMap.Marker(point1,{
			icon : new BMap.Symbol
			(BMap_Symbol_SHAPE_POINT, {
				scale : 1,// 图标缩放大小
				fillColor : _color,// 填充颜色
				fillOpacity : 0.8
			// 填充透明度
			})
		}); // 创建标注
		map.addOverlay(marker1); // 将标注添加到地图中

		if (1 == _layerType) { // 缓存标记点
			markerArr1.push(marker1);
		} else if (2 == _layerType) {
			markerArr2.push(marker1);
		} else if (3 == _layerType) {
			markerArr3.push(marker1);
		} else if (4 == _layerType) {
			markerArr4.push(marker1);
		} else if (5 == _layerType) {
			markerArr5.push(marker1);
		} else {
			//
		}

		var label1 = new BMap.Label(vilName, {
			offset : new BMap.Size(20, -10)
		});
		marker1.setLabel(label1);

		var sContent_1 = "<h3 style='margin:0 0 5px 0;padding:0.2em 0'>"
				+ vilName
				+ "</h3>"
				+ "<div style='float:left;margin:4px' id='"+ id +"'><p style='margin:0;line-height:1.5;font-size:13px;'><b>所在地址</b>："
				+ address
				+ "</p>"
				+ "<p style='margin:0;line-height:1.5;font-size:13px;'><b>第一书记</b>："
				+ firstSecretary
				+ "</p>"
				+ "<p style='margin:0;line-height:1.5;font-size:13px;'><b>村集体经济收入</b>："
				+ income
				+ "</p>"
				+ "<p style='margin:0;line-height:1.5;font-size:13px;'><b>村集体发展模式</b>："
				+ ecomode + "</p></div>";
		var infoWindow_1 = new BMap.InfoWindow(sContent_1); // 创建信息窗口对象
		marker1.addEventListener("click", function() {
			map.openInfoWindow(infoWindow_1, point1);// 提示信息
		});

		label1.addEventListener("click", function() {
			map.openInfoWindow(infoWindow_1, point1);// 提示信息
		});
	}

	// 移除所有图标
	function removeAll(){
		console.log('markerArr5前')
		console.log(markerArr5)
		$(':checkbox[name="top"]').checked = true;
		$(':checkbox[name="box"]').removeAttr('checked');
		removeMarker(markerArr1);
		markerArr1=[];
		removeMarker(markerArr2);
		markerArr2=[];
		removeMarker(markerArr3);
		markerArr3=[];
		removeMarker(markerArr4);
		markerArr4=[];
		removeMarker(markerArr5);
		markerArr5=[];
		removeMarker();


		console.log('markerArr5后')
		console.log(markerArr5)
	}

	// 移除地图标记点
	function removeMarker(markerArr) {
		console.log('markerArr')
		console.log(markerArr)
		if (markerArr && markerArr.length > 0) {
			for (x = 0; x < markerArr.length; x++)
				markerArr[x].remove();
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
		resetFirstIn: resetFirstIn,
	}
});