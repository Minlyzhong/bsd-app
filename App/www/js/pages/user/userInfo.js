define(['app',
	'hbs!js/hbs/userInfo',
	'hbs!js/hbs/userDeptInfo'
], function(app, userInfoTemplate, deptInfoTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	var userData = {};
	var departData = {};
	//用户头像上传
	var uploadUserHeadPicPath = app.basePath + '/file/upload';
	//通过ID查询支部信息
	var departmentPath = app.basePath + '/mobile/political/department/';
	//提交个人信息
	var saveEditPath = app.basePath + '/mobile/user';

	// 查询'党组织类型'选项值
	var findPT = app.basePath + '/mobile/biDictValue/findPartyType';
	// 查询'人员分类'选项值
	var findRYFL = app.basePath + '/mobile/biDictValue/findRYFL';
	// 查询'人员编制'选项值
	var findRYBZ = app.basePath + '/mobile/biDictValue/findRYBZ';
	// 查询'职业分类'选项值
	var findZY = app.basePath + '/mobile/biDictValue/findZYFL';
	// 查询'在职状态'选项值
	var findZZ = app.basePath + '/mobile/biDictValue/findZZZT';
	// 查询'行政职务'选项值
	var findXZ = app.basePath + '/mobile/biDictValue/findXZZW';
	// 查询'职务级别'选项值
	var findZW = app.basePath + '/mobile/biDictValue/findZWJB';
	// 查询'性别'选项值
	var findS = app.basePath + '/mobile/biDictValue/findSex';
	// 查询'政治面貌'选项值
	var findZM = app.basePath + '/mobile/biDictValue/findZZMM';
	// 查询'学历'选项值
	var findXL = app.basePath + '/mobile/biDictValue/findXL';
	// 查询'婚姻状况'选项值
	var findHY = app.basePath + '/mobile/biDictValue/findHYZK';
	// 查询'民族'选项值
	var findMZ = app.basePath + '/mobile/biDictValue/findMZ';

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

		console.log(app.headPic)
		$$('.userInfoList img').attr('src', app.headPic);
		// console.log(app.userDetail)
		// if(app.userDetail.partyUser.partyTime){
		// 	var time = app.userDetail.partyUser.partyTime.split(' ')[0];
		// 	app.userDetail.partyUser.partyTime = time;
			
		// }
		
		
		userData = Object.assign({},app.userDetail.partyUser);
		departData = Object.assign({},app.userDetail);
		
		
		// 不是用户类型的就只修改组织类型
		console.log(app.userType)
		 if(app.userType != 2){
			ajaxLoadPageContent(departmentPath + app.user.deptId, function(data) {
				console.log(data);
				
				app.departDetail = data;
				console.log(app.departDetail);
				departData.partyType = data.partyType;
				departData.partyTypeVal = data.partyTypeVal;
				// app.userDetail.partyUser.partyType = data.partyType;
				// app.userDetail.partyUser.partyTypeVal = data.partyTypeVal;
				
				// localStorage.setItem('userDetail',JSON.stringify(app.userDetail));
				ajaxDeptLoad();
			
			});
			
			
		}else if(app.userDetail.partyUser != null || app.userDetail.partyUser != undefined){
			app.myApp.showPreloader('加载中...');
			window.setTimeout(function() {
				console.log(userData);
				ajaxUserLoad();
			}, 500);
			
		}else{
			$$('.userInfoList ul').append(deptInfoTemplate(departData));
			$$('.infoEdit').css('display','none');
		}
	}
	/**
	 * 异步请求 
	 * @param {Object} path  接口
	 * @param {Object} callback  回调方法
	 */
	function ajaxLoadPageContent(path, callback) {
		app.ajaxLoadPageContent(path, {

		}, function(data) {
			callback(data.data);
		}, {
			async: false,
		});
	}


	/**
	 * 异步请求支部数据
	 */
	function ajaxDeptLoad() {
		
		ajaxLoadPageContent(findPT, function(data) {
			app.userArr.partyTypeArr = data;
			departData.partyTypeArr = data;
			console.log(departData);
			$$('.userInfoList ul').append(deptInfoTemplate(departData));
		});
	}

		/**
	 * 异步请求用户数据 
	 */
	function ajaxUserLoad() {
		ajaxLoadPageContent(findS, function(data) {
			console.log('sex')
			console.log(data)
			app.userArr.sexArr= data;
			userData.sexArr= data;
			
		});
		ajaxLoadPageContent(findZM, function(data) {
			app.userArr.politicsArr = data;
			userData.politicsArr = data;
		});
		ajaxLoadPageContent(findMZ, function(data) {
			app.userArr.minorityArr = data;
			userData.minorityArr = data;
		});
		ajaxLoadPageContent(findXL, function(data) {
			app.userArr.educationArr = data;
			userData.educationArr = data;
		});
		ajaxLoadPageContent(findHY, function(data) {
			app.userArr.maritalArr = data;
			userData.maritalArr = data;
		});
		ajaxLoadPageContent(findRYFL, function(data) {
			app.userArr.ryflArr = data;
			userData.ryflArr = data;
		});
		ajaxLoadPageContent(findRYBZ, function(data) {
			app.userArr.rybzArr = data;
			userData.rybzArr = data;
		});
		ajaxLoadPageContent(findZY, function(data) {
			app.userArr.zyflArr = data;
			userData.zyflArr = data;
		});
		ajaxLoadPageContent(findZZ, function(data) {
			app.userArr.zzztArr = data;
			userData.zzztArr = data;
		});
		ajaxLoadPageContent(findXZ, function(data) {
			app.userArr.xzzwArr= data;
			userData.xzzwArr= data;
		});
		ajaxLoadPageContent(findZW, function(data) {
			app.userArr.zwjbArr = data;
			userData.zwjbArr = data;
		});
		console.log(app.userArr);
		localStorage.setItem('userArr', {});
		// console.log(app.userArr);
		if(app.userDetail.partyUser.partyTime){
			var time = app.userDetail.partyUser.partyTime.split(' ')[0];
			userData.partyTime = time;
			
		}

		if(app.userDetail.partyUser.birthday){
			var time1 = app.userDetail.partyUser.birthday.split(' ')[0];
			userData.birthday = time1;
			
		}
		if(app.userDetail.partyUser.workTime){
			var time = app.userDetail.partyUser.workTime.split(' ')[0];
			userData.workTime = time;
			
		}

		$$('.userInfoList ul').append(userInfoTemplate(userData));
		app.myApp.hidePreloader();
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
		options.headers = {
			'Authorization': "bearer " + app.access_token
		}
		var params = {};
		// params.userId = app.userId;
		// options.params = params;

		ft.upload(photoData, uri, function(r) {
			var data = JSON.parse(r.response);
			app.myApp.hidePreloader();
			if(data.code == 0) {
				savePerson(data.data.filePath);		
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

	function savePerson(picUrl){
		
		var params = app.userDetail;
		params.avatar = picUrl;
		if(params.partyUser !=null || params.partyUser != undefined){
			params.partyUser.partyTime=params.partyUser.partyTime.split(' ')[0]+' 00:00:00';
			params.partyUser.birthday=params.partyUser.birthday.split(' ')[0]+' 00:00:00';
			params.partyUser.workTime=params.partyUser.workTime.split(' ')[0]+' 00:00:00';
		}
			
		var formDatas= JSON.stringify(params)
		
		$$.ajax({
			url:saveEditPath,
			method: 'PUT',
			dataType: 'json',
			contentType: 'application/json;charset:utf-8',
			data: formDatas,
			cache: false,
			success:function (data) {
				
				if(data.code == 0){
					var headPic = app.filePath + params.avatar;
				
					savePath(headPic);
					app.myApp.toast("上传成功！", 'success').show(true);
					
				}else{
					app.myApp.toast("上传失败！", 'error').show(true);
				}
				
			},
			error:function (data) {
				
				app.myApp.alert('修改失败');
			}
			})
	}

	function savePath(headPic) {
		app.headPic = headPic;
		localStorage.setItem('headPic', headPic);
		$$('.userInfoList img').attr('src', headPic);
				// $$('.user-header1 img').attr('src', '../../../img/newIcon/home_title.png');
				// $$('.user-header1 img').attr('alt', 'userinfo.js');
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