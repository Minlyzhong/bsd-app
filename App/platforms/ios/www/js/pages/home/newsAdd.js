define(['app'], function(app) {
	var $$ = Dom7;
	var pageDataStorage = {};
	//保存新闻文章
	var saveNewsPath = app.basePath + 'extContent/saveOrUpdateContent';
	var photoBrowserPhotos = [];
	var photoDatas = [];
	var photoCompress = [];
	var photoBrowserPopup = '';
	var userPosition = '';
	var count = 0;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		var loginCB = app.myApp.onPageBack('login', function(backPage) {
			checkLogin(page);
		});
		count = 0;
		app.back2Home();
		clickEvent(page);
		checkLogin(page);
	}

	/**
	 * 检查是否已经登陆成功
	 * @param {Object} page
	 */
	function checkLogin(page){
		var user = new Object();
		user.role = app.roleId;
		if(app.roleId == -1) {
			$$('.jump2LoginView').show();
			$$('.list-block').hide();
			$$(".saveNews").hide();
			$$('.assessLogin').on('click', function() {
				app.myApp.getCurrentView().loadPage('login.html');
			});
		} else {
			$$('.list-block').show();
			$$(".saveNews").show();
			$$('.jump2LoginView').hide();
			var photoBrowserPhotos = [];
			clickEvent(page);
		}
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.weui_uploader_input_wrp').on('click', showImgPicker);
		//$$('.saveRecord').on('click', saveRecord);
		$$('.saveNews').on('click',saveNews);
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
				window.imagePicker.getPictures(
					function(picURLList) {
						if(picURLList.length > 1){
							app.myApp.alert("只能上传一张图片！");
//							picURLList.splice(0,picURLList.length);
						}else if(picURLList.length == 1) {
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
	 * 保存新闻文章
	 */
	function saveNews(){
		var newsTitle = $$('#newsTitle').val();
		var content = $$('#newsContent').val().toString();
		var newsContent = content.replace(/\r\n/g,"<br/>")
		var newsContent = newsContent.replace(/\n/g,"<br/>")
		var newsContent = newsContent.replace(/ /g,"&nbsp;")
//		console.log(newsContent.toString());
		if(!newsTitle || !newsContent) {
			app.myApp.alert('请补全新闻信息！');
			return;
		}
		count = count + 1;
		if(count > 0){
			$$('.saveNews').attr('disabled',false);
		}
		
		app.myApp.showPreloader('新闻保存中...');
		
		var userId = app.userId;
		
		var formData = new FormData();
        formData.append("catalogId","3");
        formData.append("title",newsTitle);
        formData.append("content",newsContent);
        formData.append("creatorId",userId);
        formData.append("fromApp","1");
        if(photoCompress.length > 0){
        	var file = photoCompress[0];
        	var fileName = app.utils.generateGUID() + ".png";
        	formData.append("imageFile",file,fileName);
        }
        
        //提交到后台审核
        $$.ajax({
            url:saveNewsPath,
            method: 'POST',
            dataType: 'json',
            processData: false, // 告诉jQuery不要去处理发送的数据
            contentType: false, // 告诉jQuery不要去设置Content-Type请求头
            data: formData,
            cache: false,
            success:function (data) {
            	if(data.success){
            		photoBrowserPhotos.splice(0, photoBrowserPhotos.length);
					photoDatas.splice(0, photoDatas.length);
					photoCompress.splice(0, photoCompress.length);
	            	app.myApp.toast('保存成功,等待后台审核！', 'success').show(true);
	            	app.myApp.getCurrentView().back();
            	}else{
            		app.myApp.toast('保存失败！', 'error').show(true);
            		count = 0;
            		$$('.saveNews').attr('disabled',true);
            	}
            	
            },
            error:function () {
                app.myApp.alert("网络异常！");
            	count = 0;
        		$$('.saveNews').attr('disabled',true);
                
            }
        });
        
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
					photoCompress.push(results.file);
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
					photoBrowserPhotos.splice(0, photoBrowserPhotos.length);
					photoDatas.splice(0, photoDatas.length);
					photoCompress.splice(0, photoCompress.length);
					app.myApp.toast('删除成功', 'success').show(true);
					if(photoBrowserPhotos.length == 0 ){
						$$('.addOnePicture').show();
					}
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
		
		if(photoBrowserPhotos.length > 0){
			$$('.addOnePicture').hide();
		}
	}

	return {
		init: init
	}
});