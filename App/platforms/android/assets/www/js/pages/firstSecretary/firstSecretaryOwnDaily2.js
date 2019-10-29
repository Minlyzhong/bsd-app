define(['app',
	'hbs!js/hbs/firstSecretaryOwnDaily'
], function(app, vilRecordCardTemplate) {
	var $$ = Dom7;
	var pageNo = 1;
	var loading = true;
	//获取贫困村详细信息
	var findPoorVilPath = app.basePath + '/mobile/village/detail/';
	//上传村社区图片
	// var uploadVillagePhotoPath = app.basePath + 'upload/uploadVillagePhoto';
	//显示村社区图片
	var showVillagePhotoPath = app.basePath + '/mobile/village/pictures/';
	//显示村社区图片的权限
	var showVillageAuthorityPath = app.basePath + '/mobile/village/valid/';
	//删除村社区图片 
	var deleteVillagePhotoPath = app.basePath + '/mobile/village/pictures/';
	
	var userId = 0;
	var userName = '';
	var poorVilId = 0;
	var photoBrowserPhotos = [];
	var photoDatas = [];
	var photoBrowserPopup = '';
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		app.back2Home();
		attrDefine(page);
		clickEvent(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		photoBrowserPhotos = [];
		photoDatas = [];
		photoBrowserPopup = '';
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		userId = pageData.userId;
		userName = pageData.userName;
		poorVilId = pageData.vilId;
		console.log(poorVilId);
		
		showVillagePicAuthority(poorVilId);
		
		if(poorVilId>0){
			findPoorVillage();
		}else{
			$$(".fsodHead").css('display','none');
		}
		showVillagePhoto();
		$$('.teams').css('display','none');
		$$('.groups').css('display','none');
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {

	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		//添加图片	
		$$('.weui_uploader_input_wrp').on('click', showImgPicker);
		
	}
	
	/**
	 * 读取贫困村信息
	 */
	function findPoorVillage() {
		app.ajaxLoadPageContent(findPoorVilPath+poorVilId, {
			// poorVilId: poorVilId
		}, function(result) {
			var data = result.data;
			console.log(data);
			$$('.fsodHead .content').html(data.memo);
			$$('.fsodHead .title').html(data.villageName + '简介');
			
			if(data.groups!= ''){
				$$('.groupsContent').append(data.supervisoryCommittee);
				$$('.groups').css('display','block');
			}
			if(data.teams != ''){
				$$('.teamsContent').append(data.twoCommittees);
				$$('.teams').css('display','block');
			}
		});
	}
	
	/**
	 * 读取村社区图片
	 */
	function showVillagePhoto(){
		app.ajaxLoadPageContent(showVillagePhotoPath+poorVilId,{
			// vilId: poorVilId
			tenantId: app.tenantId
		}, function(data) {
			var result = data.data
			if(result) {
				$$.each(result, function(index, item){
					var str = '<img src="'+app.filePath + item.attPath +'">';	
						$$('.fsodHead .img').append(str);
				})
				
			}
			// console.log(data.data);	
			// photoBrowserPhotos = [];
			// showReadonlyPhotos(data.data)
		});
	}
	
	/**
	 * 选择附件方式
	 */
	function showImgPicker() {
		//清空上次的记录
		photoDatas = [];
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
			photoBrowserPhotos.push(item);
			//压缩图片
			lrz(item, {
					width: 800
				})
				.then(function(results) {
					var base64Data = results.base64;
					photoDatas.push(base64Data);
				})
				.catch(function(err) {
					// 捕捉错误信息
					// 以上的then都不会执行
				});

		});
		setTimeout(function() {
			if(poorVilId > 0) {
				if(photoDatas.length > 0) {
					uploadRecordPhoto(photoDatas, poorVilId);
				}
			}
		}, 1500);
	}
	

	/**
	 *  上传图片
	 * @param {Object} photoDatas 相片数组
	 * @param {Object} poorVilId  村社区ID
	 */
	function uploadRecordPhoto(photoDatas, poorVilId) {
		//app.myApp.showPreloader('图片保存中...');
		var sum = 0;
		var ft = new FileTransfer();
		$$.each(photoDatas, function(index, item) {
			var uri = encodeURI(uploadVillagePhotoPath);
			var options = new FileUploadOptions();
			options.fileKey = "file";
			options.fileName = app.utils.generateGUID() + ".png";
			options.mimeType = "image/jpeg";
			options.chunkedMode = false;
			var params = {};
			params.fkId = poorVilId;
			params.userId = app.userId;
			options.params = params;

			ft.upload(item, uri, function(r) {
				var data = JSON.parse(r.response);
				sum++;
				if(data.success === true) {
					if(sum == photoDatas.length) {
						app.myApp.toast("保存成功！", 'success').show(true);
						setTimeout(function() {
//							require(['js/pages/record/record'], function(record) {
//								record.loadRecord(false);
//							});
							$$('.kpiPicture').remove();
							//photoDatas = [];
							showVillagePhoto();
						}, 1000);
						app.myApp.hidePreloader();
						//app.myApp.getCurrentView().back();
						//app.myApp.getCurrentView().loadPage('firstSecretaryOwnDaily2.html?'+'&vilId='+poorVilId);
					}
				} else {
					app.myApp.hidePreloader();
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
		});
		
	}
	
	function showReadonlyPhotos(picUrlList) {
		$$.each(picUrlList, function(index, item) {
			//var item = item.attPath;
			//console.log(item);
			photoBrowserPhotos.push(app.filePath + item.attPath);
			console.log(app.filePath + item.attPath);
			var random = app.utils.generateGUID();
			setTimeout(function() {
				showVillagePicAuthority(poorVilId);
				$$('.weui_uploader1').append(
					'<div class="weui_uploader_bd kpiPicture">' +
					'<div class="picContainer" id="img_' + random + '">' +
					'<img src="' + app.filePath + item.attPath + '" class="picSize" />' +
					'<div class="file-panel" id="delete_file_' + random + '">' +
					'<input type="hidden" value="'+item.id+'" class="attId"/>'+
					'<i class="icon icon-delete"></i>' +
					'</div>' +
					'</div>' +
					'</div>');
			$$('#img_' + random).on('click', function(e) {
				e.stopPropagation();
				var picIndex = $$(this).parent().index();
				photoBrowserPopup = app.myApp.photoBrowser({
					photos: photoBrowserPhotos,
					theme: 'dark',
					backLinkText: '关闭',
					ofText: '/',
					type: 'popup',
				});
				photoBrowserPopup.open(picIndex - 1);
			});
			//添加删除图片的监听事件
			$$('#delete_file_' + random).on('click', function(e) {
				e.stopPropagation();
				var photoContainer = $$(this).parent().parent();
				var piciIndex = photoContainer.index();
				var attId = $$(this).find('.attId').val();
				app.myApp.confirm('确认删除该图片?', function() {
					photoContainer.remove();
					photoBrowserPhotos.splice(piciIndex - 2, 1);
					photoDatas.splice(piciIndex - 2, 1);
					//app.myApp.toast('删除成功', 'success').show(true);
					//console.log(attId);
					deleteVillagePhoto(attId);
				});	
			});
			}, 500);
		});
	}
	
	/*
	 * 删除村社区图片
	 * attId，附件ID
	 */
	function deleteVillagePhoto(attId){
		console.log(attId)
		app.ajaxLoadPageContent(deleteVillagePhotoPath+attId, {
			// attId: attId,
		}, function(result) {
			app.myApp.toast("删除成功！", 'success').show(true);
		});
	}
	
	/**
	 * 显示村社区图片的权限
	 */
	function showVillagePicAuthority(poorVilId){
		//验证是否有权限添加图片
		// app.ajaxLoadPageContent(showVillageAuthorityPath+poorVilId+'/'+app.userId, {
			// vilId: poorVilId,
			// userId: app.userId
		// }, function(result) {
		// 	console.log(result);
		// 	if(result.success == true){
			// 上传图片
				$$('.weui_uploader_input_wrp').css('display','none');
				$$('.file-panel').css('display','block');
			// }else{
			// 	$$('.weui_uploader_input_wrp').css('display','none');
			// 	$$('.file-panel').css('display','none');
			// }
		// });
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

