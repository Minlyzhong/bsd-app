define(['app','hbs!js/hbs/workPlaceDetail'], function(app, buildTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//获取支部信息
	var getUserReportDetialPath = app.basePath + '/mobile/political/department/';
	//上传建设任务
	var saveUserReportDetialPath = app.basePath + '/mobile/position/building/save';
	//上传图片
	var uploadReportDetialPhotoPath = app.basePath + '/file/upload';
	//上传文件
	// var uploadWorkFilePath = app.basePath + '/file/upload';
	var pId = -1;
	var photoBrowserPhotos = [];
	var photoDatas = [];
	var photoBrowserPopup = '';
	var count = 0;
	
	var name = '';
	var imageList = [];
	var fileList = [];
	var srcName = [];
	var suffixName = [];
	var fileNames = [];
	var fileCount = 0;
	var attType = 0;
	
	var deptType = 0;
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		//设置页面不能滑动返回
		page.view.params.swipeBackPage = false;
		app.myApp.onPageBack("workPlace/workPlaceDetail", function(page){
			page.view.params.swipeBackPage = true;
		});
		count = 0;
//		if(firstIn) {
			initData(page.query);
//		}
		//app.back2Home();
		getWorkPlaceDetail();
		clickEvent();
		attrDefine(page.query);
		pushAndPull(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		photoBrowserPhotos = [];
		photoDatas = [];
		photoBrowserPopup = '';
		imageList = [];
		fileList = [];
		formDatas =[];
		attType = 0;
		deptType = 0;
		name = pageData.placeName;
		console.log(pageData)
		pId = pageData.id;
		
		srcName = [];
		suffixName = [];
		fileNames = [];
		fileCount = 0;
		// thisAppName = pageData.thisAppName;
		$$('.assessMemo').text('资源名称 : '+name);

	}

	/**
	 * 获取建设任务
	 */
	function getWorkPlaceDetail(){
		app.ajaxLoadPageContent(getUserReportDetialPath+app.userId, {
			
		}, function(data) {
			var result = data.data;
			deptType = result.deptType;
			// $$('.detailList').prepend(buildTemplate(result));
		});	
	}	


	/**
	 * 点击事件
	 */
	function clickEvent() {
		$$('.weui_uploader_input_wrp').on('click', function() {
			// var id = $$(this).data('id');
			showImgPicker();
		});
		$$('.sumbit').on('click', saveUserReportDetial);
		
		
		$$('.assessWorkBack').on('click',function(){
			app.myApp.confirm('您填写的内容尚未上传，是否退出？', function() {
				app.myApp.getCurrentView().back();
			});
		});
		$$('.assessWorkHome').on('click',function(){
			app.myApp.confirm('您填写的内容尚未上传，是否返回首页？', function() {
				app.back3Home();
			});
		});
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(pageData) {
	
	}
	
	
	//选择附件方式
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

	//保存考核信息
	function saveUserReportDetial() {
	
		var buildingMemo = $$('#buildingMemo').val();
	
	
		//防止数据传输过慢多次上传
		count = count + 1;
		if(count > 0){
			$$('.sumbit').attr('disabled',false);
		}
		app.myApp.showPreloader('信息保存中...');

		$$.each(imageList, function(index, item){
			item.memo = buildingMemo;
		})
		 
	
		
		
		$$.ajax({
            url:saveUserReportDetialPath,
            method: 'POST',
            dataType: 'json',
			contentType: 'application/json;charset:utf-8',
            data: JSON.stringify(imageList),
            // data: JSON.stringify({images:formDatas}),
            cache: false,
            success:function (data) {
			
				if(data.code == 0 && data.data !=null){
					console.log(data);
					app.myApp.hidePreloader();
					app.myApp.toast('保存成功', 'success').show(true);
					$$('.sumbit').html('已保存');
					
					require(['js/pages/workPlace/workPlace'], function(workPlace) {
						workPlace.refresh();
					});
			
				app.myApp.getCurrentView().back();
				}else{
					app.myApp.toast(data.msg , 'error').show(true);
				}
				
			
		},
            error:function (error) {
				var text = JSON.parse(error.responseText)
			
				app.myApp.hidePreloader();
				app.myApp.alert(app.utils.callbackAjaxError());
            }
        });



		
	}

	/**
	 *  上传图片
	 * @param {Object} photoDatas 相片数组
	 * @param {Object} detailID  
	 */
	function uploadReportDetialPhoto(photo) {
		app.myApp.showPreloader('图片保存中...');
		// var sum = 0;

		var ft = new FileTransfer();
		
			var uri = encodeURI(uploadReportDetialPhotoPath);
			var options = new FileUploadOptions();
			options.fileKey = "file";
			options.fileName = app.utils.generateGUID() + ".png";
			options.mimeType = "image/jpeg";
			options.chunkedMode = false;
			options.headers = {
				'Authorization': "bearer " + app.access_token
			}
			var params={
				branchId: app.user.deptId,
				creator: app.user.nickName,
				creatorId: app.userId,
				memo: "",
				pid: pId,
				tenantId: app.tenantId,
				type: deptType,
				url: "",
			}
			ft.upload(photo, uri, function(r) {
				var data = JSON.parse(r.response);
				// sum++;
				app.myApp.hidePreloader();
			
				if(data.code == 0 && data.data != null) {
					var result = data.data;
					// params.ext = result.ext;
					// params.name = result.name;
					params.url = result.filePath;
					// params.length = result.length;
					imageList.push(params);

				}else{
					
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
		
		// app.myApp.toast("保存成功！", 'success').show(true);
		// $$('.sumbit').html('已保存');
		// app.myApp.hidePreloader();
		// app.myApp.getCurrentView().back();
		// require(['js/pages/assessment/assessment'], function(assessment) {
		// 	assessment.addCallback();
		// });
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
					
					uploadReportDetialPhoto(base64Data);
				})
				.catch(function(err) {
					// 捕捉错误信息
					// 以上的then都不会执行
				});
			var random = app.utils.generateGUID();
			$$('.weui_uploader7').append(
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

	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//下拉刷新
		var ptrContent = $$(page.container).find('.pull-to-refresh-content');
		ptrContent.on('refresh', function(e) {
			setTimeout(function() {
				pageNo = 1;
				loading = true;
				//这里写请求
				app.myApp.pullToRefreshDone();
			}, 500);
		});

		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			//这里写请求
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