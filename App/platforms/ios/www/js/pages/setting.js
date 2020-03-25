define(['app', 'hbs!js/hbs/changePwd'], function(app, changePwdTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	var timeOutID;
	//检查更新接口
	var findVersionPath = app.basePath + '/mobile/apkEdition/check/update';
	//修改密码
	var changePwdPath = app.basePath + '/mobile/user/resetPwd';
	
	var myPopup = '';
	var channel_id = '';

	var client_id = 'app';
	var client_secret='app';
	var grant_type='password';
	var scope ='app';
	var word = 'welcome,bestinfo';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		app.back2Home();
		attrDefine(page);
		clickEvent(page);
		if(app.userId == '-1'){
			$$('.theme').css('display','none');
		}
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		timeOutID = null;
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		if(app.myApp.device.ios) {
			$$('.checkUpdate').hide();
		} else {
			$$('.updateBtn').append('（当前版本:V' + app.version + '）');
		}
		$$('.eCodeTitle').html('查看APP二维码');
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.checkUpdate').on('click', checkUpdate);
		$$('.changePwdBtn').on('click', changePwdBtn);
		$$('.eCodeBtn').on('click', showEcode);
		$$('.changeColor').on('click', function(){
			app.myApp.getCurrentView().loadPage('changeColor.html');
		});
		$$('.aa').on('click', function(){
			app.myApp.getCurrentView().loadPage('home2.html');
		});
	}
	
	/**
	 * 查看二维码 
	 */
	function showEcode() {
		var iosTitle = 'iOS版APP二维码';
		var andTitle = '安卓版APP二维码';
		//安卓二维码地址：http://117.141.245.7:8089/app/TXDJ.apk
		var ecodePopup = app.myApp.popup(
			'<div class="popup">' +
			'<div class="navbar">' +
			'<div class="navbar-inner">' +
			'<div class="left close-popup"><a href="#" class="link icon-only"><i class="icon icon-eback"></i></a></div>' +
			'<div class="center"></div>' +
			'<div class="right"></div>' +
			'</div>' +
			'</div>' +
			'<div class="page-content">' +
			'<div class="ecode">' +
			'<div class="tab">' +
			'<img id="andImg" src="img/android.png" width="200" height="200" />' +
			'<div>' + andTitle + '</div>' +
			'</div>' +
			'<canvas id="myCanvas" width="165px" height="145px" style="display:none">'+
			'</canvas>'+
			'<div class="tab">' +
			'<img id="iosImg" src="'+ 'images/ios.png" width="200" height="200" />' +
			'<div>' + iosTitle + '</div>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>'
		);
		
		//长按事件
		$$('.tab img').on('taphold', function () {
		  	saveOrDownLoad($$(this).attr('id'));
		});
	}
	
	/**
	 * 保存二维码图和下载APP
	 */
	function saveOrDownLoad(attr) {
		var iosButtion = [{
			text: '保存图片',
			onClick: function() {
				savePic(attr);
			}
		}];
		var andButtion = [{
			text: '保存图片',
			onClick: function() {
				savePic(attr);
			}
		},{
			text: '识别二维码',
			onClick: function() { 
				downLoad(attr);
			}
		}];
		//判断button1等于那个按钮
		if(app.myApp.device.ios){
			var buttons1 = iosButtion;
		}else{
			var buttons1 = andButtion;
		}
		var buttons2 = [{
			text: '取消',
			color: 'red',
			onClick: function() {
				$$('.actions-modal').removeClass('modal-in');
				$$('.actions-modal').addClass('modal-out');
			}
		}];
		var groups = [buttons1, buttons2];
		app.myApp.actions(groups);
	}
	
	
	/**
	 * 下载 
	 */
	function downLoad(attr){
		$$('.actions-modal').removeClass('modal-in');
		$$('.actions-modal').addClass('modal-out');
		 
		if(attr == 'iosImg'){
			app.myApp.confirm('确定要下载吗？', function() {
				app.myApp.alert("不能打开AppStore");
			});
		}else{
			app.myApp.confirm('确定要下载吗？', function() {
				open('http://117.141.245.7:8089/app/HPDJ.apk', '_system');	
			});
		}
	}
	/**
	 * 保存图片
	 */
	function savePic(attr){
		$$('.actions-modal').removeClass('modal-in');
		$$('.actions-modal').addClass('modal-out');
		var imgId = '';
		//console.log(attr);
		//选中保存哪张图片
		//iosImg是ios图片
		//andImg是android图片
		if(attr == 'iosImg') {
			imgId = document.getElementById('iosImg');
			console.log(imgId);
		} else {
			imgId = document.getElementById('andImg');
			console.log(imgId);
		}
		 // 创建canvas DOM元素，并设置其宽高和图片一样   
	    var canvas = document.getElementById('myCanvas')
//	    document.createElement('canvas');
//	    canvas.id = 'myCanvas';
	    canvas.width = imgId.width+150;
	    canvas.height = imgId.height+150;
	    // 坐标(0,0) 表示从此处开始绘制，相当于偏移。  
	    canvas.getContext('2d').drawImage(imgId, 0, 0);
//	    document.body.appendChild(canvas);
	    console.log(document.getElementById('myCanvas'));
		window.canvas2ImagePlugin.saveImageDataToLibrary(
	        function(msg){
	            console.log(msg);
	            app.myApp.alert("保存成功");
	        },
	        function(err){
	            console.log(err);
	            app.myApp.alert(err);
	        },
	        document.getElementById('myCanvas')
	   	);
//		document.body.removeChild(canvas);
	}

	
	
	
	/**
	 * 修改密码按钮事件
	 */
	function changePwdBtn() {
		myPopup = app.myApp.popup(
			'<div class="popup">' +
			'<div class="navbar">' +
			'<div class="navbar-inner">' +
			'<div class="left"></div>' +
			'<div class="center">修改密码</div>' +
			'<div class="right"></div>' +
			'</div>' +
			'</div>' +
			'<div class="page-content">' +
			'<div class="list-block changeList searchbar-found" style="margin: 0;">' +
			'<ul>' +
			'</ul>' +
			'</div>' +
			'<div class="deptBtnRow changeBtnRow" style="margin-top: 20px;">' +
			'<p style="margin: 0 10px;width: 40%;"><a href="#" class="button button-fill color-red close-popup">返回</a></p>' +
			'<p style="margin: 0 10px;width: 40%;"><a href="#" class="button button-fill save">保存</a></p>' +
			'</div>' +
			'</div>' +
			'</div>'
		);
		$$('.changeList ul').append(changePwdTemplate());
		$$('.save').on('click', function() {
			var oldPwd = $$('#oldPwd').val();
			var newPwd = $$('#newPwd').val();

			

			var againPwd = $$('#againPwd').val();
			if(oldPwd == '' || oldPwd == null) {
				app.myApp.alert('原密码不能为空！');
			} else if(newPwd == '' || newPwd == null) {
				app.myApp.alert('新密码不能为空！');
			} else if(againPwd == '' || againPwd == null) {
				app.myApp.alert('请再次输入新密码');
			} else if(newPwd != againPwd) {
				app.myApp.alert('两次新密码不一致，请重新输入！');
				$$('#newPwd').val('');
				$$('#againPwd').val('');
			} else if(newPwd == oldPwd) {
				app.myApp.alert('新密码不能与原密码相同<br />请重新输入！');
				$$('#newPwd').val('');
				$$('#againPwd').val('');
			} else {
				console.log(oldPwd)
				console.log(newPwd)
				changePwd(oldPwd, newPwd);
			}
		});
	}

	function getAesString(word,_key){
		var key = CryptoJS.enc.Utf8.parse(_key); //十六位十六进制数作为密钥
		var iv = CryptoJS.enc.Utf8.parse(_key); 
		let srcs = CryptoJS.enc.Utf8.parse(word);
		let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding });
		return encrypted.toString();//返回的是base64格式的密文
	}

	/**
	 * 修改密码 
	 * @param {Object} oldPwd 旧密码
	 * @param {Object} newPwd 新密码
	 */
	function changePwd(oldPwd, newPwd) {
		var oldP = getAesString(oldPwd,word);
		var newP = getAesString(newPwd,word);

		console.log(oldP)
		console.log(newP)
		app.myApp.showPreloader('正在保存新密码...');
		app.ajaxLoadPageContent(changePwdPath, {
			userId: app.userId,
			passwcord: oldP,
			passwcordNew: newP
		}, function(data) {
			app.myApp.hidePreloader();
			if(data.msg == 'success') {
				app.myApp.closeModal(myPopup);
				app.myApp.toast('修改成功！', 'success').show(true);
//				app.myApp.alert('密码修改成功！');
				app.userId = -1;
				app.user = '';
				app.roleId = -1;
				app.headPic = 'img/icon/icon-user_d.png';
				$$('.user-header img').attr('src', app.headPic);
				localStorage.setItem('headPic', 0);
				localStorage.setItem('userId', -1);
				localStorage.setItem('lastStudyDay', 0);
				localStorage.setItem('user', '-1');
				localStorage.setItem('userDetail', '-1');
				localStorage.setItem('roleId', -1);
				//localStorage.setItem('loginName', null);
				localStorage.setItem('password', null);
				localStorage.setItem('verify', '1');
				//把主题设置为默认的，移除css
				app.removejscssfile('blue.css','css');
				app.removejscssfile('green.css','css');
				app.myApp.getCurrentView().loadPage('login.html');
			} else {
				console.log('data')
				console.log(data)
				$$('#oldPwd').val('');
				app.myApp.alert('原密码错误！');
				// app.myApp.alert(data.data);
				

			}
		});
	}

	/*
	 * 检查更新
	 */
	function checkUpdate() {
		console.log('checkUpdate')
		if(app.userId == null ||app.userId ==undefined ) {	
			return;
		}
		app.myApp.showPreloader('正在检查更新...');
		var updateAjax;
		setTimeout(function() {
			updateAjax = $$.ajax({
				url: findVersionPath,
				dataType: 'json',
				method: 'GET',
				data: {
					tenantId: app.tenantId,
				},
				success: function(data) {
					console.log(data);
//					app.myApp.hidePreloader();
					if(timeOutID) {
						window.clearTimeout(timeOutID);
					}
					timeOutID = null;
					if(data.code == 0) {
						var size = data.data.appSize/1024/1024;
						if(app.version != data.data.appVersion) {
							if(app.myApp.device.ios) {
								app.myApp.alert('<div style="text-align: left;">' + '检查到新版本：V' + data.data.appVersion + '<br /><br />更新内容:<br />' + data.data.memo + '<br /><br />文件大小:' + size.toFixed(2) + 'M<br />请留意App Store提醒</div>');
							} else {
								app.myApp.confirm('<div style="text-align: left;">' + '检查到新版本：V' + data.data.appVersion + '<br /><br />更新内容:<br />' + data.data.memo + '<br /><br />文件大小:' + size.toFixed(2) + 'M，是否进行下载?</div>', function() {
									open(app.filePath + data.data.appUrl, '_system');
								});
							}
						}else{
							app.myApp.toast("已经是最新版本", 'success').show(true);
						}
					} else {
						app.myApp.toast("检查更新失败", 'error').show(true);
						// app.myApp.alert('已经是最新版本');
					}
				},
				error: function() {
					app.myApp.hidePreloader();
					app.myApp.toast("检查更新失败", 'error').show(true);
					if(timeOutID) {
						window.clearTimeout(timeOutID);
					}
					timeOutID = null;
					app.myApp.alert(app.utils.callbackAjaxError());
				}
			});
			ajaxTimeOut(updateAjax);
		}, 1000);
	}

	//操作超时
	function ajaxTimeOut(ajaxVar) {
		timeOutID = setTimeout(function() {
			app.myApp.hidePreloader();
			ajaxVar.abort();
		}, 5000);
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