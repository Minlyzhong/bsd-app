define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//获取考核内容
	var findDetailInfoPath = app.basePath + 'knowledgeTestpaper/findDetailInfo';
	//保存考核明细
	var saveUserReportDetialPath = app.basePath + 'knowledgeTestpaper/saveUserReportDetial';
	//上传附件
	var uploadReportDetialPhotoPath = app.basePath + 'upload/uploadReportDetialPhoto';
	var assessId = -1;
	var photoBrowserPhotos = [];
	var photoBrowserPopup = '';
	var readonlyPicCount = 0;
	var photoDatas = [];
	var reWork = 0;
	var deptName = '';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
		attrDefine(page);
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
		reWork = 0;
		photoBrowserPopup = '';
		assessId = pageData.assessId;
		readonlyPicCount = 0;
		findDetailInfo();
	}
	
	/**
 	 * 读取缓存信息 
	 */
	function loadStorage() {
		
	}
	
	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.rankAssessTitle').html(page.query.title + '<span style="margin-left: 10px;color: #ED4C3C;">' + page.query.score + '</span>');
		$$('#assessTitle').val(page.query.name);
		$$('#assessName').val(page.query.userName);
		if(page.query.reportState == -1) {
			reWork = 1;
			$$('.refuseContent').append(page.query.memo);
			$$('.refuseContent').css('display', 'block');
			$$('#assessTitle').removeAttr('readonly');
			$$('#assessContent').removeAttr('readonly');
			$$('.weui_uploader').append(
				'<div class="weui_uploader_bd rankPicture">' +
				'<div class="weui_uploader_input_wrp">' +
				'<img src="" class="weui_uploader_input" />' +
				'</div>' +
				'</div>');
			$$('.rankPicture').on('click', showImgPicker)
			$$('.rankSumbit').html('重新提交');
			$$('.center').css('left', '0px');
			addCalendar('assessTs');
			$$('.rankSumbit').on('click', saveUserReportDetial);
		}
		console.log(page.query);
		deptName = page.query.deptName;
	}
	
	/**
	 * 打开图片选择器 
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
					photoDatas.splice(piciIndex - 2 - readonlyPicCount, 1);
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
	 * 获取考核内容
	 */
	function findDetailInfo() {
		app.ajaxLoadPageContent(findDetailInfoPath, {
			fkId: assessId,
		}, function(data) {
			console.log(data);
			console.log(data.data[0]);
			$$('#assessTs').val(data.data[0].reportTs);
			$$('#assessContent').val(data.data[0].contents);
			$$('#assessdeptName').val(deptName);
			readonlyPicCount = data.data[1].length || 0;
			showReadonlyPhotos(data.data[1]);
		});
	}

	/**
	 * 保存考核信息
	 */
	function saveUserReportDetial() {
		var assessTitle = $$('#assessTitle').val();
		var assessTs = $$('#assessTs').val();
		var assessContent = $$('#assessContent').val();
		if(!assessContent || !assessTitle || !assessTs) {
			app.myApp.alert('请补全考核信息！');
			return;
		}
		app.ajaxLoadPageContent(saveUserReportDetialPath, {
			id: assessId,
			topicId: 0,
			reportTitle: assessTitle,
			reportTime: assessTs,
			reportContext: assessContent,
			reportUserId: app.userId,
			reportState: 0,
			score: 0
		}, function(data) {
			var detailID = assessId;
			if(detailID) {
				if(photoDatas && photoDatas.length > 0) {
					uploadReportDetialPhoto(photoDatas, detailID);
				} else {
					app.myApp.toast('保存成功', 'success').show(true);
					$$('.rankSumbit').html('已保存');
					app.myApp.getCurrentView().back();
				}
			} else {
				app.myApp.alert(app.utils.callbackAjaxError());
			}
		});
	}

	/**
	 *  上传图片
	 * @param {Object} photoDatas 相片数组
	 * @param {Object} detailID  考核明细ID
	 */
	function uploadReportDetialPhoto(photoDatas, detailID) {
		var sum = 0;
		var ft = new FileTransfer();
		$$.each(photoDatas, function(index, item) {
			var uri = encodeURI(uploadReportDetialPhotoPath);
			var options = new FileUploadOptions();
			options.fileKey = "file";
			options.fileName = app.utils.generateGUID() + ".png";
			options.mimeType = "image/jpeg";
			options.chunkedMode = false;
			var params = {};
			params.fkId = detailID;
			params.userId = app.userId;
			options.params = params;

			ft.upload(item, uri, function(r) {
				var data = JSON.parse(r.response);
				sum++;
				if(data.success === true) {
					if(sum == photoDatas.length) {
						app.myApp.toast("保存成功！", 'success').show(true);
						$$('.rankSumbit').html('已保存');
						app.myApp.getCurrentView().back();
					}
				} else {
					ft.abort();
					app.myApp.alert(app.utils.callbackAjaxError());
					return;
				}
			}, function(error) {
				ft.abort();
				app.myApp.alert(app.utils.callbackAjaxError() + '图片');
				return;
			}, options);
		});
	}

	/**
	 * 显示已读相片
	 * @param {Object} picUrlList 需要显示的图片数组
	 */
	function showReadonlyPhotos(picUrlList) {
		$$.each(picUrlList, function(index, item) {
			photoBrowserPhotos.push(app.basePath + item);
			var random = app.utils.generateGUID();
			$$('.weui_uploader').append(
				'<div class="weui_uploader_bd kpiPicture">' +
				'<div class="picContainer" id="img_' + random + '">' +
				'<img src="' + app.basePath + item + '" class="picSize" />' +
				'</div>' +
				'</div>');
			$$('#img_' + random).on('click', function(e) {
				var picIndex = $$(this).parent().index();
				photoBrowserPopup = app.myApp.photoBrowser({
					photos: photoBrowserPhotos,
					theme: 'dark',
					backLinkText: '关闭',
					ofText: '/',
					type: 'popup',
				});
				photoBrowserPopup.open(picIndex - 1 - reWork);
			});
		});
	}

	/**
	 * 初始化日历
	 * @param {Object} contentID 日期标签ID
	 */
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
			closeOnSelect: true
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