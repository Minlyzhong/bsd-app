define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var colors;
	var color;
	//保存用户自定义皮肤
	var saveColor = app.basePath + '/mobile/userSetting';
	//查询用户自定义皮肤
	var find = app.basePath + '/mobile/userSetting/';
	

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		app.back2Home();
		attrDefine(page);
		getColor();
		clickEvent(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		//把16种颜色放在colors里面
		var colors= new Array(
			'#E32416','#307AE8','#00BA98'
		);
		var color= new Array(
			'中国红','湖水蓝','苹果绿'
		);
		//console.log(colors);
		//background-image:url(img/changeColor.png);
		var str = '';
		for(var i=0;i<colors.length;i++){
			str += '<li data-id="'+(i+1)+'" class="color" style="background-color:'+colors[i]+'; background-repeat: repeat;"></li>';
			str += '<div style="margin-left:45px;font-size:20px;">'+color[i]+'</div>'
		}
		$$('.skin-grid ul').append(str);
		
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {

	}
	
	function getColor(){
		var str = '当前皮肤:';
		app.ajaxLoadPageContent(find+app.userId,{
			// userId:app.userId,
		}, function(data){
			if(data.data.appSkin == 1 || data == ''){
				$$('.currentColor').html(str+'中国红');
			}else if(data.data.appSkin == 2){
				$$('.currentColor').html(str+'湖水蓝');
			}else{
				$$('.currentColor').html(str+'苹果绿');
			}
		});
	}
	
	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		//点击的时候改变颜色
		$$('.color').on('click',function(){
			var appSkin = $$(this).data('id');

			var formData={
				appLayout: 0,
				appSkin: appSkin,
				createTime: 0,
				id: 0,
				state: 0,
				tenantId: "",
				userId: app.userId,
			}
			var formDatas= JSON.stringify(formData)
			
			
			$$.ajax({
				url:saveColor,
				method: 'POST',
				dataType: 'json',
				// processData: false, // 告诉jQuery不要去处理发送的数据
				// contentType: false, // 告诉jQuery不要去设置Content-Type请求头
				contentType: 'application/json;charset:utf-8',
				data: formDatas,
				cache: false,
				success:function (data) {
					if(appSkin != 1){
						console.log(data);
						require(['js/pages/home/home'], function(home) {
							home.colorConfirm();
						});
					}else{
						app.removejscssfile('blue.css','css');
						app.removejscssfile('green.css','css');
					}
					app.myApp.toast('修改成功！', 'success').show(true);
					getColor();
				},
				error:function () {
					
				}
			});


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