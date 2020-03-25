define(['app'
], function(app) {
	var $$ = Dom7;
	//修改微动态
	var updateLogPath = app.basePath + '/mobile/worklog/content/';
	//加载工作日志详情
	var loadWorkLogDetailPath = app.basePath + '/mobile/worklog/detail/';
	//上传附件
	var uploadRecordPhotoPath = app.basePath + '/file/upload';
	//删除附件
	var deleteLogImagePath = app.basePath + '/mobile/worklog/image/';
	//加载工作日志图片:
	var loadWorkLogPhotosPath = app.basePath + '/mobile/worklog/photos/';
	//日志内容输入最小字数 url:
	var findLogMinLenPath = app.basePath + '/mobile/worklog/';
	var photoBrowserPhotos1 = [];
	var photoDatas1 = [];
	var photoBrowserPopup1 = '';
	var signStatus = 0;
	var count = 0;
	var pageDataStorage = {}; 
	var recordId;
	var reviewName;
	var workType;
	var imgPath;
	var deIds ="";
	var imgLength = 0;
	var imageList = [];
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		//设置页面不能滑动返回
		page.view.params.swipeBackPage = false;
		app.myApp.onPageBack("newRecord/editRecord", function(page){
			page.view.params.swipeBackPage = true;
		});
		count = 0;
		initData(page.query);
		app.back2Home();
		attrDefine(page);
		loadRecordDetail(recordId);
		clickEvent(page);

	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		recordId = pageData.recordId;
		reviewName= pageData.reviewName;
	    workType = pageData.workType;
	    deIds = "";
	    imgLength = 0;
		photoBrowserPhotos1 = [];
		photoDatas1 = [];
		imageList = [];
		photoBrowserPopup1 = '';
		signStatus = 0;
		//获取图片的路径
		imgPath = app.basePath.substr(0, app.basePath.length - 1);  
		//字数2,工作日志
		app.ajaxLoadPageContent(findLogMinLenPath+'2'+'/content/min/len', {
		}, function(result) {
			pageDataStorage['minLen'] = result.data
			$$('#publicContent').attr('placeholder','这一刻你想说什么（不少于'+pageDataStorage['minLen']+'字!）');
		});
		
	}
	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {}
	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.weui_uploader_input_wrp').on('click', showImgPicker);
		$$('.editRecord').on('click',editR);
		//$$('.gps').on('click', getPosition);
		$$('.editRecordBack').on('click',function(){
			app.myApp.confirm('您修改日志尚未保存，是否退出？', function() {
				app.myApp.getCurrentView().back();
			});
		});
	}
	/**
	 * 加载数据 
	 * @param {Object} recordId 日志ID
	 */
	function loadRecordDetail(recordId) {
		app.ajaxLoadPageContent(loadWorkLogDetailPath+2+'/'+recordId, {
			// workLogId: recordId,
			tenantId:app.user.tenantId
			// userId: app.userId,
			// dictCode: 'RZLX',
		}, function(result) {
			console.log(reviewName);
			var data = result.data;
			console.log(data);
			$$('#recDetailTitleEdit').val(data.logTitle);
			$$('#recDetailTsEdit').val(data.logTime);
			if(data.memberType == 1){	
				console.log($$('.villNameEdit').length);
				if($$('.villNameEdit').length == 0){
					$$('#recSendEdit').val(reviewName+'(第一书记)');
					var str = '<li class="villNameEdit">';
					str += '<div class="item-content">';
					str += '<div class="item-inner">';
					str += '<div class="item-title kp-label recordReview">所驻村(社区):</div>';
					str += '<div class="item-input">';
					str += '<input type="text" id="villageNameEdit" name="villageNameEdit" placeholder="" readonly />';
					str += '</div>';
					str += '</div>';
					str += '</div>';
					str += '</li>';
					$$('.recdeptNameLiEdit').append(str);
					$$('#villageNameEdit').val(data.villageName);
				}
			}else{
				$$('#recSendEdit').val(reviewName);
			}
			$$('#recTypeEdit').val(workType);
			var detailContent = data.logContent;
			var reg=new RegExp("<br/>","g");
			detailContent = detailContent.replace(reg,'\r\n');
			$$('#recDetailContentEdit').val(detailContent);
			$$('#recdeptNameEdit').html(data.deptName);
			loadLogPhoto(recordId);
			imageList = data.images;
		});
	}
	/*
	 * 加载工作日志的图片
	 */
	function loadLogPhoto(recordId){
		app.ajaxLoadPageContent(loadWorkLogPhotosPath+recordId, {
			tenantId:app.tenantId
			// workLogId: recordId,
			// userId: app.userId,
		}, function(result) {
			showReadonlyPhotos(result.data);
		});
	}
	/**
	 * 显示已读相片
	 * @param {Object} picUrlList 需要显示的图片数组
	 */
	function showReadonlyPhotos(picUrlList) {
		imgLength = picUrlList.length;
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
						console.log(deIds);
					}
					app.myApp.toast('删除成功', 'success').show(true);
					console.log(photoDatas1);
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


	}
	/*
	 *动态发布 
	 */
	function editR(){
		var publicTitle = $$('#recDetailTitleEdit').val();
		var publicContent = $$('#recDetailContentEdit').val();
		publicContent = publicContent.replace(/\r\n/g,"<br/>");
		publicContent = publicContent.replace(/\n/g,"<br/>");
		publicContent = publicContent.replace(/\s/g, ' ');
		//var publicGPS = $$('#publicGPSEdit').val();
		if(!publicTitle || !publicContent) {
			app.myApp.alert('请补全日志信息！');
			return;
		}
		if(publicContent.length < pageDataStorage['minLen']){
			app.myApp.alert('内容不少于'+pageDataStorage['minLen']+'字！');
			return;
		}
		//防止数据传输过慢多次上传
		count = count + 1;
		if(count > 0){
			$$('.editRecord').attr('disabled',false);
		}
		app.myApp.showPreloader('信息保存中...');

		var params = {
			content:publicContent,
			title:publicTitle,
			images : imageList,
			name : app.user.nickName 
		}
		var formDatas= JSON.stringify(params)
		$$.ajax({
            url:updateLogPath + recordId,
            method: 'POST',
            dataType: 'json',
            // processData: false, // 告诉jQuery不要去处理发送的数据
			// contentType: false, // 告诉jQuery不要去设置Content-Type请求头
			contentType: 'application/json;charset:utf-8',
            data: formDatas,
            cache: false,
            success:function (data) {
            	
            		var data = result.data;
			
				// 	deleteRecordPhoto(deIds, detailID);
				// 	uploadRecordPhoto(photoDatas1, detailID);
				// }
				// else  if(deIds && deIds.length > 0) {
				// 	deleteRecordPhoto(deIds, detailID);
					app.myApp.toast('保存成功', 'success').show(true);
					app.myApp.hidePreloader();
					app.myApp.getCurrentView().back();
					setTimeout(function() {
						//调用
						require(['js/pages/newRecord/newRecord'], function(newRecord) {
							newRecord.refresh();
						});
						//调用
						require(['js/pages/record/recordDetail'], function(recordDetail) {
							recordDetail.loadRecordDetail(recordId);
						});
					}, 1000);
				
            	
            },
            error:function () {
               
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
					uploadRecordPhoto(base64Data);
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
					imageList.splice(piciIndex - 2 - imgLength, 1);
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
	/**
	 *  上传图片
	 * @param {Object} photoDatas1 相片数组
	 * @param {Object} detailID  工作日志ID
	 */
	function uploadRecordPhoto(photo) {
		
		app.myApp.showPreloader('图片保存中...');
		var sum = 0;
		var ft = new FileTransfer();

			var uri = encodeURI(uploadRecordPhotoPath);
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
			app.myApp.hidePreloader();
			// options.params = params;
			ft.upload(photo, uri, function(r) {
				var data = JSON.parse(r.response);
				//app.myApp.alert(data.success);
				// sum++;
				if(data.code === 0) {
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
				ft.abort();
				app.myApp.alert(app.utils.callbackAjaxError());
				return;
			}, options);
		
			app.myApp.hidePreloader();
		// app.myApp.toast("修改成功！", 'success').show(true);
		// // app.myApp.getCurrentView().back();
		// setTimeout(function() {
		// 	//调用
		// 	require(['js/pages/newRecord/newRecord'], function(newRecord) {
		// 		newRecord.refresh();
		// 	});
		// 	//调用
		// 	require(['js/pages/record/recordDetail'], function(recordDetail) {
		// 		recordDetail.loadRecordDetail(recordId);
		// 	});
		// }, 1000);
	}
	/**
	 *  删除图片
	 * @param {Object} photoDatas1 相片数组
	 * @param {Object} detailID  工作日志ID
	 */
	function deleteRecordPhoto(deIds, detailID) {
		app.myApp.showPreloader('删除图片中...');
		app.ajaxLoadPageContent(deleteLogImagePath + recordId + deIds, {
			// deIds:deIds,
		}, function(result) {},{type:'DELETE'});
		app.myApp.hidePreloader();
		app.myApp.toast("修改成功！", 'success').show(true);
		setTimeout(function() {
			//调用
			require(['js/pages/newRecord/newRecord'], function(newRecord) {
				newRecord.refresh();
			});
			//调用
			require(['js/pages/record/recordDetail'], function(recordDetail) {
				recordDetail.loadRecordDetail(recordId);
			});
		}, 1000);
		app.myApp.getCurrentView().back();
		
	}
	/**
	 * 定位 
	 */
	function getPosition() {
		app.myApp.showPreloader('定位中...');
		//开启定位服务
		if(navigator.geolocation) {
			signStatus = 1;
			navigator.geolocation.getCurrentPosition(onSuccessPosition, onErrorPosition, {
//				timeout: 2000
				maximumAge: 3000,
				timeout: 5000, 
				enableHighAccuracy: true
			});
		}
	}
	function onErrorPosition(e) {
		app.myApp.hidePreloader();
		if(app.myApp.device.ios) {
			app.myApp.alert('未开启"定位"权限<br />请前往手机"设置"->"隐私"->"定位服务"');
		} else {
			if(e.code == '3'){
				app.myApp.showPreloader('定位中...');
				signStatus = 2;
				var map = new BMap.Map();
				var point = new BMap.Point(116.331398,39.897445);
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition(function(r){
					if(this.getStatus() == BMAP_STATUS_SUCCESS){
						app.myApp.alert('您的位置：'+r.point.lng+','+r.point.lat);
						onSuccessPosition(r);
					}
					else {
						app.myApp.alert('failed'+this.getStatus());
					}        
			    },{enableHighAccuracy: true})
			}else{
				app.myApp.alert('请打开GPS定位');
			}
		}
	}
	function onSuccessPosition(position) {
		app.myApp.hidePreloader();
		if(signStatus == 1){
			var _lng = position.coords.longitude;
			var _lat = position.coords.latitude;
		}else if(signStatus == 2){
			var _lng = position.point.lng;
			var _lat = position.point.lat ;
		}
		//拿到GPS坐标转换成百度坐标
		app.ajaxLoadPageContent('https://api.map.baidu.com/ag/coord/convert', {
			from: 0,
			to: 4,
			x: _lng,
			y: _lat
		}, function(data) {
			lng = app.utils.base64decode(data.x);
			lat = app.utils.base64decode(data.y);
			GetAddress();
		}, {
			type: 'GET',
		});
	}
	/*
	 * 根据坐标获取中心点地址
	 */
	function GetAddress() {
		var _SAMPLE_ADDRESS_POST = app.utils.getAddressPost();
		_SAMPLE_ADDRESS_POST += "&location=" + lat + "," + lng;
		app.ajaxLoadPageContent(_SAMPLE_ADDRESS_POST, {
			
		}, function(data) {
			renderReverse(data);
		}, {
			type: 'GET',
		});
//		app.myApp.hidePreloader();
	}

	function renderReverse(response) {
		if(response.status) {
			
		} else {
			var userPosition = response.result.addressComponent.street + response.result.addressComponent.street_number;
			$$('#publicGPS').val(userPosition);
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