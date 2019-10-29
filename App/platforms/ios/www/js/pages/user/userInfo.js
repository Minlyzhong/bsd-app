define(['app',
	'hbs!js/hbs/userInfo',
	'hbs!js/hbs/userDeptInfo'
], function(app, userInfoTemplate, deptInfoTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//用户头像上传
	var uploadUserHeadPicPath = app.basePath + 'upload/uploadHeadPic';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('user/userInfo', [
//			'user/userInfoEdit'
//		]);
		app.back2Home();
		attrDefine(page);
		clickEvent(page);
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.userInfoList img').attr('src', app.headPic);
		var time = app.user.partyTime.split(' ')[0];
		app.user.partyTime = time;
		if(app.user.userType == 2) {
			$$('.userInfoList ul').append(deptInfoTemplate(app.user));
		} else {
			$$('.userInfoList ul').append(userInfoTemplate(app.user));
		}
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.headPic').on('click', showImgPicker);
		$$('.userInfoList .item-content').on('click', clickContent);
		$$('.infoEdit').on('click', infoEdit);
	}
	
	/**
	 * 编辑资料 
	 */
	function infoEdit() {
		app.myApp.getCurrentView().loadPage('userInfoEdit.html');
	}

	/**
	 * 点击资料 
	 */
	function clickContent() {
		if($$($$(this).find('.item-title')[0]).html() == '用户头像') {
			return;
		} else {
			app.myApp.alert($$($$(this).find('.item-title')[0]).html() + '：' + $$($$(this).find('.item-label')[0]).html());
		}
	}

	/**
	 * 选择附件方式
	 */
	function showImgPicker() {
		var buttons1 = [{
			text: '选择上传方式',
			label: true
		}, {
			text: '从相册获取',
			bold: true,
			onClick: function() {
				//打开系统相机
				if(!navigator.camera) {
					app.myApp.alert("该功能只能在移动app中使用！");
					return;
				}
				navigator.camera.getPicture(function(picURL) {
						if(picURL) {
							var picURLList = [picURL];
							showPhotos(picURLList);
						}
					},
					function(message) {
						console.log('读取失败' + message);
					}, {
						destinationType: Camera.DestinationType.FILE_URL,
						sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
						encodingType: Camera.EncodingType.JPEG,
					});
			}
		}, {
			text: '拍照',
			onClick: function() {
				//打开系统相机
				if(!navigator.camera) {
					app.myApp.alert("该功能只能在移动app中使用！");
					return;
				}
				navigator.camera.getPicture(function(picURL) {
						if(picURL) {
							var picURLList = [picURL];
							showPhotos(picURLList);
						}
					},
					function(message) {
						console.log('拍照失败' + message);
					}, {
						destinationType: Camera.DestinationType.FILE_URL,
						sourceType: Camera.PictureSourceType.CAMERA,
						encodingType: Camera.EncodingType.JPEG,
						extParams: '{"title":"","userName":"","address":"","time":"' + app.utils.getCurTime() + '"}',
					});
			}
		}];
		var buttons2 = [{
			text: '取消',
			color: 'red'
		}];
		var groups = [buttons1, buttons2];
		app.myApp.actions(groups);
	}

	/**
	 * 显示待上传的相片 
	 * @param {Object} picUrlList  相片数组
	 */
	function showPhotos(picUrlList) {
		lrz(picUrlList[0], {
				width: 800
			})
			.then(function(results) {
				uploadUserHeadPic(results.base64);
			})
			.catch(function(err) {
				// 捕捉错误信息
				// 以上的then都不会执行
			});

	}

	/**
	 *  上传图片
	 * @param {Object} photoDatas 相片数组
	 * @param {Object} detailID  考核明细ID
	 */
	function uploadUserHeadPic(photoData) {
		app.myApp.showPreloader('图片保存中...');
		var ft = new FileTransfer();
		var uri = encodeURI(uploadUserHeadPicPath);
		var options = new FileUploadOptions();
		options.fileKey = "file";
		options.fileName = app.utils.generateGUID() + ".png";
		options.mimeType = "image/jpeg";
		options.chunkedMode = false;
		var params = {};
		params.userId = app.userId;
		options.params = params;

		ft.upload(photoData, uri, function(r) {
			var data = JSON.parse(r.response);
			app.myApp.hidePreloader();
			if(data.success === true) {
				var headPic = app.basePath + data.data.filePath;
				$$('.userInfoList img').attr('src', headPic);
				$$('.user-header1 img').attr('src', headPic);
				savePath(headPic);
				app.myApp.toast("上传成功！", 'success').show(true);
			} else {
				ft.abort();
				app.myApp.alert(app.utils.callbackAjaxError());
			}
		}, function(error) {
			app.myApp.hidePreloader();
			app.myApp.toast("上传失败！", 'error').show(true);
			ft.abort();
			app.myApp.alert(app.utils.callbackAjaxError());
		}, options);
	}

	function savePath(headPic) {
		app.headPic = headPic;
		localStorage.setItem('headPic', headPic);
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
		clickEvent: clickEvent,
	}
});