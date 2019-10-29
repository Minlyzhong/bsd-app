define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var colors;
	var color;
	//保存用户自定义皮肤
	var saveColor = app.basePath + 'userSetting/save';
	//查询用户自定义皮肤
	var find = app.basePath + 'userSetting/find';
	

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
			'#ED4C3C','#307AE8','#00BA98'
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
		app.ajaxLoadPageContent(find,{
			userId:app.userId,
		}, function(data){
			if(data.appSkin == 1 || data == ''){
				$$('.currentColor').html(str+'中国红');
			}else if(data.appSkin == 2){
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
			app.ajaxLoadPageContent(saveColor, {
				userId:app.userId,
				appSkin:appSkin,
			}, function(data) {
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