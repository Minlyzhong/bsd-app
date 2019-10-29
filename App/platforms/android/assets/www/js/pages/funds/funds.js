define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var photoBrowserPhotos = [];
	var photoDatas = [];
	var photoBrowserPopup = '';
	var pageDataStorage = {}; 
	//上传申报经费接口
	var honorPath = app.basePath + '/mobile/honor/save';
	//上传附件
	var uploadPersonalHonorPath = app.basePath +'/file/upload' ;
	
	
	var count;
	var imageList = [];
	var Level = [];
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
		//app.back2Home();
		attrDefine(page);
		clickEvent(page);
		
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		count = 0;
		photoBrowserPhotos = [];
		photoDatas = [];
		photoBrowserPopup = '';
		pageDataStorage = {}; 
		imageList = [];
		Level = [];
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
		//点击开会时间触发
		addCalendar('honorTime');
		//点击上传
		$$('.saveHonor').click(submitHonor);
		//点击上传图片的+号
		$$('.weui_uploader_input_wrp').on('click', showImgPicker);
		//点击返回icon
		$$('.honorBack').on('click',function(){
			app.myApp.confirm('您的申报尚未上传，是否退出？', function() {
				app.myApp.getCurrentView().back();
			});
		});
		//点击小房子icon
		$$('.honorHome').on('click',function(){
			app.myApp.confirm('您的申报尚未上传，是否返回首页？', function() {
				app.back3Home();
			});
		});
	}
	

	//初始化日历
	function addCalendar(contentID) {
		calID = app.myApp.calendar({
			input: '#' + contentID,
			toolbarCloseText: '完成',
			headerPlaceholder: '选择的日期',
			monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
			dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
			dateFormat: 'yyyy-mm-dd',
			closeOnSelect: true,
			maxDate: new Date(),
		});
	}
	/*
	 * 上传
	 */
	function submitHonor(){
		if($$('#honorName').val() == ''){
			app.myApp.alert('请输入项目名称！');
			return false;
		}
		if($$('#honorTime').val() == ''){
			app.myApp.alert('请选择所获项目时间！');
			return false;
		}
		if($$('#grantOrganization').val() == ''){
			app.myApp.alert('请输入组织！');
			return false;
		}
		// if($$('#honorDescription').val() == ''){
		// 	app.myApp.alert('所获备注！');
		// 	return false;
		// }
		// 暂时注释
		// if(photoDatas == '' && photoDatas.length == 0) {
		// 	app.myApp.alert('请上传照片！');
		// 	return false;
		// }
		//防止数据传输过慢多次上传
		count = count + 1;
		if(count > 0){
			$$('.saveHonor').attr('disabled',false);
		}
		
		var time1 = $$('#honorTime').val()+' 00:00:00';
		// for(var i=0; i<Level.length;i++){
		// 	if(Level[i].subKey == $$('#honorLevel').val()){	
		// 		var	honorName = Level[i].subVal;
		// 		break;
		// 	}
		// }
		

		
		var params={
			honorName: $$('#honorName').val(),
			getTime:time1,
			grantOrganization:$$('#grantOrganization').val(),
			honorLevel:$$('#honorLevel').val(),
			honorDescription:$$('#honorDescription').val(),
			userId:app.userId,
			images : imageList
		}

		var formDatas= JSON.stringify(params)

		$$.ajax({
            url:honorPath,
            method: 'POST',
            dataType: 'json',
            // processData: false, // 告诉jQuery不要去处理发送的数据
			// contentType: false, // 告诉jQuery不要去设置Content-Type请求头
			contentType: 'application/json;charset:utf-8',
            data: formDatas,
            cache: false,
            success:function (data) {
            	// uploadRecordPhoto(photoDatas, result.data.id);
				app.myApp.hidePreloader();
				app.myApp.toast("保存成功，待审核！", 'success').show(true);
				app.myApp.getCurrentView().back();
				setTimeout(function() {
				//调用
				require(['js/pages/funds/fundsList'], function(fundsList) {
					fundsList.refresh();
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
			photoBrowserPhotos.push(item);
			//压缩图片
			lrz(item, {
					width: 800
				})
				.then(function(results) {
					var base64Data = results.base64;
					photoDatas.push(base64Data);
					uploadRecordPhoto(base64Data)
				})
				.catch(function(err) {
					// 捕捉错误信息
					// 以上的then都不会执行
				});
			var random = app.utils.generateGUID();
			$$('.weui_uploader').append(
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
					photoBrowserPhotos.splice(piciIndex - 2, 1);
					photoDatas.splice(piciIndex - 2, 1);
					imageList.splice(piciIndex - 2, 1);
					app.myApp.toast('删除成功', 'success').show(true);
				});
			});

			$$('#img_' + random).on('click', function(e) {
				var picIndex = $$(this).parent().index();
				photoBrowserPopup = app.myApp.photoBrowser({
					photos: photoBrowserPhotos,
					theme: 'dark',
					backLinkText: '关闭',
					ofText: '/',
					type: 'popup'
				});
				photoBrowserPopup.open(picIndex - 2);
			});
		});
		
	}
	/*
	 * 上传附件
	 */
	function uploadRecordPhoto(photo) {
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
			// options.params = params;

			ft.upload(photo, uri, function(r) {
				app.myApp.hidePreloader();
				var data = JSON.parse(r.response);
				
				// sum++;
				
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