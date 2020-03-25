define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var photoBrowserPhotos1 = [];
	var photoDatas1 = [];
	var photoBrowserPopup1 = '';
	var pageDataStorage = {}; 
	var honorId;
	var deIds ="";
	var imgLength = 0;
	var count;
	var imageList = [];
	var Level = [];
	//修改个人荣誉详细
	var personalHonorUpdatePath = app.basePath + '/mobile/honor/update';
	//删除附件
	var delHonorImgPath =  app.basePath + '/mobile/honor/delete/';
	//上传附件
	var uploadPersonalHonorPath = app.basePath +'/file/upload' ;
	//获取荣誉级别 字段code=RYJB
	var honorLevelPath = app.basePath + '/mobile/honor/grade';
	//获取个人荣誉详细
	var personalHonorDetailsPath = app.basePath + '/mobile/honor/detail/';
	//获取附件
	var getPersonalHonorPath = app.basePath + '/mobile/honor/download/';
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		//设置页面不能滑动返回
		page.view.params.swipeBackPage = false;
		app.myApp.onPageBack("user/personalHonor", function(page){
			page.view.params.swipeBackPage = true;
		});
		initData(page.query);
		attrDefine(page);
		clickEvent(page);
		loadHonorDetail();
	}
		
	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		count = 0;
		firstIn = 0;
		photoBrowserPhotos1 = [];
		photoDatas1 = [];
		photoBrowserPopup1 = '';
		pageDataStorage = {}; 
		honorId = pageData.honorId;
		deIds = "";
		imgLength = 0;
		imageList = [];
		Level = [];
	}
	/*
	 * 获取荣耀级别
	 */
	function loadHonorLevel(honorLevelId){
		app.ajaxLoadPageContent(honorLevelPath, {
			code: 'RYJB',
		}, function(result) {
			var data = result.data;
			Level = data;
			handleHonorLevel(data,honorLevelId);
		});
	}
	/*
	 *  加载荣耀级别
	 */
	function handleHonorLevel(data,honorLevelId) {
		console.log(data)
		console.log(honorLevelId)
		
		$$.each(data, function(index, item) {
			var selected = '';
			if(item.subVal == honorLevelId) {
				selected = 'selected';
			}
			$("#honorLevelEdit").append("<option value='" + item.subKey + "'" + selected + ">" + item.subVal + "</option>");
		});
	}
	/*
	 * 加载数据
	 */
	function loadHonorDetail(){
		app.ajaxLoadPageContent(personalHonorDetailsPath+honorId, {
			// honorId:honorId,
		}, function(data) {

			var result = data.data;
			
			var honerTime = app.getnowdata(result.honorTime);
			$$('#honorNameEdit').val(result.honorName);
			$$('#honorTimeEdit').val(honerTime);
			$$('#grantOrganizationEdit').val(result.grantOrganization);
			$$('#honorDescriptionEdit').val(result.honorDescription);
			$$('#honorUserEdit').val(result.userName);
			//加载图片
			showReadonlyPhotos(result.id);
			console.log(result.honorLevel)
			loadHonorLevel(result.honorLevel)
		});	
	}
	/**
	 * 显示已读相片
	 * @param {Object} picUrlList 需要显示的图片数组
	 */
	function showReadonlyPhotos(id) {

		app.ajaxLoadPageContent(getPersonalHonorPath+id, {
			// honorId:honorId,
		}, function(data) {
			picUrlList = data.data;
			imageList = data.data;
			imgLength = data.data.length;

			$$.each(picUrlList, function(index, item) {
				var itemId = item.id;
				var item = item.attPath;
				photoBrowserPhotos1.push(app.filePath + item);	
				var random = app.utils.generateGUID();
				$$('.weui_uploaderEdit').append(
					'<div class="weui_uploader_bd kpiPicture">' +
					'<div class="picContainer" id="img_' + random + '">' +
					'<img src="' + app.filePath + item + '" class="picSize" />' +
					'<input type="hidden" class="deId" value="'+itemId+'"/>'+
					'<div class="file-panel" id="delete_file_' + random + '">' +
					'<i class="icon icon-delete"></i>' +
					'</div>' +
					'</div>' +
					'</div>');
				//添加删除图片的监听事件
				$$('#delete_file_' + random).on('click', function(e) {
					e.stopPropagation();
					var photoContainer = $$(this).parent().parent();
					var piciIndex = photoContainer.index();
					var deId = $$($$(photoContainer)[0]).find("input").val();
					app.myApp.confirm('确认删除该图片?', function() {
						photoContainer.remove();
						photoBrowserPhotos1.splice(piciIndex - 2, 1);
						if(deId == undefined){
							photoDatas1.splice(piciIndex - 2, 1);
						}else{
							imgLength = imgLength - 1;
							deIds += deId + ",";
						}
						app.myApp.toast('删除成功', 'success').show(true);
					});
				});
				$$('#img_' + random).on('click', function(e) {
					e.stopPropagation();
					var picIndex = $$(this).parent().index();
					photoBrowserPopup1 = app.myApp.photoBrowser({
						photos: photoBrowserPhotos1,
						theme: 'dark',
						backLinkText: '关闭',
						ofText: '/',
						type: 'popup',
					});
					photoBrowserPopup1.open(picIndex - 2);
				});
			});
		})

		


	
	}
	/**
	 *  删除图片
	 * @param {Object} photoDatas1 相片数组
	 * @param {Object} detailID  工作日志ID
	 */
	function deleteHonorPhoto(deIds, detailID) {
		app.myApp.showPreloader('修改中...');
		app.ajaxLoadPageContent(delHonorImgPath+deIds, {
			// deIds:deIds,
		}, function(result) {});
		app.myApp.hidePreloader();
		app.myApp.toast("修改成功！", 'success').show(true);
		setTimeout(function() {
			//调用
			require(['js/pages/user/personalHonorList'], function(personalHonorList) {
				personalHonorList.refresh();
			});
			require(['js/pages/user/personalHonorDetails'], function(personalHonorDetails) {
				personalHonorDetails.refresh();
			});
		}, 1000);
		app.myApp.getCurrentView().back();
		
	}
	/*
	 * 上传
	 */
	function updateHonor(){
		if($$('#honorNameEdit').val() == ''){
			app.myApp.alert('请输入荣誉名称！');
			return false;
		}
		if($$('#honorTimeEdit').val() == ''){
			app.myApp.alert('请选择所获荣誉时间！');
			return false;
		}
		if($$('#grantOrganizationEdit').val() == ''){
			app.myApp.alert('请输入授予组织！');
			return false;
		}
		if($$('#honorDescriptionEdit').val() == ''){
			app.myApp.alert('所获荣誉描述！');
			return false;
		}
		// if(photoBrowserPhotos1 == '' && (photoDatas1 == '' && photoDatas1.length == 0)) {
		// 	app.myApp.alert('请上传荣誉照片！');
		// 	return false;
		// }
		//防止数据传输过慢多次上传
		count = count + 1;
		if(count > 0){
			$$('.updateHonor').attr('disabled',false);
		}
		console.log($$('#honorTimeEdit').val())

		var time1 = $$('#honorTime').val().split(' ')[0]+' 00:00:00';
		console.log(Level)
		console.log($$('#honorLevelEdit').val())

		
		

		var params={
			id: honorId,
			honorName: $$('#honorNameEdit').val(),
			getTime:time1,
			grantOrganization:$$('#grantOrganizationEdit').val(),
			honorLevel: $$('#honorLevelEdit').val(),
			honorDescription:$$('#honorDescriptionEdit').val(),
			userId:app.userId,
			images : imageList
		}
		console.log(params)
		var formDatas= JSON.stringify(params)

		$$.ajax({
            url:personalHonorUpdatePath,
            method: 'PUT',
            dataType: 'json',
			contentType: 'application/json;charset:utf-8',
            data: formDatas,
            cache: false,
            success:function (data) {
            	app.myApp.toast('修改成功', 'success').show(true);
					app.myApp.hidePreloader();
					app.myApp.getCurrentView().back();
					setTimeout(function() {
						//调用
						require(['js/pages/user/personalHonorList'], function(personalHonorList) {
							personalHonorList.refresh();
						});
						require(['js/pages/user/personalHonorDetails'], function(personalHonorDetails) {
							personalHonorDetails.refresh();
						});
					}, 1000);
				
					
            },
            error:function () {
				app.myApp.toast("保存失败，请重新保存！", 'none').show(true);
            }
        });


		
	}
	/**
	 * 选择附件方式
	 */
	function showImgPicker() {
		var buttons1 = [{
			text: '选择附件方式',
			label: true
		}, {
			text: '从相册获取',
			bold: true,
			onClick: function() {
				//打开系统相机
				if(!window.imagePicker) {
					app.myApp.alert("该功能只能在移动app中使用！");
					return;
				}
				var permissions = cordova.plugins.permissions;
				permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, function(){
					window.imagePicker.getPictures(
						function(picURLList) {
							if(picURLList) {
								showPhotos(picURLList);
							}
						},
						function(error) {
							console.log('从相册获取失败' + message);
						}, {
							maximumImagesCount: 9,
							width: 800,
							height: 800,
							quality: 60,
						}
					);
				}, function(error){
					
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
		$$.each(picUrlList, function(index, item) {
			photoBrowserPhotos1.push(item);
			//压缩图片
			lrz(item, {
					width: 800
				})
				.then(function(results) {
					var base64Data = results.base64;
					photoDatas1.push(base64Data);
					uploadHonorPhoto(base64Data)
				})
				.catch(function(err) {
					// 捕捉错误信息
					// 以上的then都不会执行
				});
			var random = app.utils.generateGUID();
			$$('.weui_uploaderEdit').append(
				'<div class="weui_uploader_bd kpiPicture">' +
				'<div class="picContainer" id="img_' + random + '">' +
				'<img src="' + item + '" class="picSize" />' +
				'<div class="file-panel" id="delete_file_' + random + '">' +
				'<i class="icon icon-delete"></i>' +
				'</div>' +
				'</div>' +
				'</div>');
			//添加删除图片的监听事件
			$$('#delete_file_' + random).on('click', function(e) {
				e.stopPropagation();
				var photoContainer = $$(this).parent().parent();
				var piciIndex = photoContainer.index();
				app.myApp.confirm('确认删除该图片?', function() {
					photoContainer.remove();
					photoBrowserPhotos1.splice(piciIndex - 2, 1);
					photoDatas1.splice(piciIndex - 2 - imgLength, 1);
					app.myApp.toast('删除成功', 'success').show(true);
				});
			});

			$$('#img_' + random).on('click', function(e) {
				var picIndex = $$(this).parent().index();
				photoBrowserPopup1 = app.myApp.photoBrowser({
					photos: photoBrowserPhotos1,
					theme: 'dark',
					backLinkText: '关闭',
					ofText: '/',
					type: 'popup'
				});
				photoBrowserPopup1.open(picIndex - 2);
			});
		});
	}
	/*
	 * 上传附件
	 */
	function uploadHonorPhoto(photo) {
		app.myApp.showPreloader('图片保存中...');
		var sum = 0;
		var ft = new FileTransfer();
		
			var uri = encodeURI(uploadPersonalHonorPath);
			var options = new FileUploadOptions();
			options.fileKey = "file";
			options.fileName = app.utils.generateGUID() + ".png";
			options.mimeType = "image/jpeg";
			options.chunkedMode = false;
			options.headers = {
				'Authorization': "bearer " + app.access_token
			}
			var params = {
				"attName": "",
				"attPath": "",
				"attSize": 0,
				"attState": 0,
				"attType": 1,
				"tenantId": app.userDetail.tenantId,
				"userId": app.user.userId
			}
			
			// params.fkId = detailID;
			// params.userId = app.userId;
			// options.params = params;
			ft.upload(photo, uri, function(r) {
				app.myApp.hidePreloader();
				var data = JSON.parse(r.response);
				app.myApp.alert(data.success);
				if(data.code == 0) {
					var result = data.data;
					params.attName = result.name;
					params.attPath = result.filePath;
					params.attSize = result.length;
                    imageList.push(params);
				} else {
					ft.abort();
					app.myApp.alert(app.utils.callbackAjaxError());
					return;
				}
			}, function(error) {
				app.myApp.hidePreloader();
				ft.abort();
				app.myApp.alert(app.utils.callbackAjaxError());
				return;
			}, options);
		
		
	}
	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {}
	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.updateHonor').click(updateHonor);
		//点击上传图片的+号
		$$('.weui_uploader_input_wrp').on('click', showImgPicker);
		//点击返回icon
		$$('.honorEditBack').on('click',function(){
			app.myApp.confirm('您的个人荣誉尚未上传，是否退出？', function() {
				app.myApp.getCurrentView().back();
			});
		});
		//点击小房子icon
		$$('.honorEditHome').on('click',function(){
			app.myApp.confirm('您的个人荣誉尚未上传，是否返回首页？', function() {
				app.back3Home();
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