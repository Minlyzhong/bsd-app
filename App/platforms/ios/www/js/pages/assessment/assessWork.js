define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//保存考核明细
	var saveUserReportDetialPath = app.basePath + 'knowledgeTestpaper/saveUserReportDetial';
	//上传附件
	var uploadReportDetialPhotoPath = app.basePath + 'upload/uploadReportDetialPhoto';
	var assessId = -1;
	var assessScore = 0;
	var photoBrowserPhotos = [];
	var photoDatas = [];
	var photoBrowserPopup = '';
	var count = 0;
	
	var thisAppName = '';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		count = 0;
//		if(firstIn) {
			initData(page.query);
//		}
		app.back2Home();
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
		assessId = pageData.assessId;
		assessScore = pageData.score;
		
		thisAppName = pageData.thisAppName;
	}

	/**
	 * 点击事件
	 */
	function clickEvent() {
		$$('.weui_uploader_input_wrp').on('click', function() {
			showImgPicker();
		});
		$$('.sumbit').on('click', saveUserReportDetial);
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(pageData) {
		$$('.assessDetailTitle').html(pageData.title);
		$$('.assessScore').append(pageData.score + '分');
		$$('.assessTarget').append(pageData.target);
		if(pageData.memo == '无'){
			$$('.assessMemo').css('display','none');
		}else{
			$$('.assessMemo').append(pageData.memo);
		}
		addCalendar('assessTs');
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

	//保存考核信息
	function saveUserReportDetial() {
		var assessTitle = $$('#assessTitle').val();
		var assessTs = $$('#assessTs').val();
		var assessContent = $$('#assessContent').val();
		if(!assessContent || !assessTitle || !assessTs) {
			app.myApp.alert('请补全考核信息！');
			return;
		}
		//防止数据传输过慢多次上传
		count = count + 1;
		if(count > 0){
			$$('.sumbit').attr('disabled',false);
		}
		app.myApp.showPreloader('信息保存中...');
		app.ajaxLoadPageContent(saveUserReportDetialPath, {
			id: 0,
			topicId: assessId,
			reportTitle: assessTitle,
			reportTime: assessTs,
			reportContext: assessContent,
			reportUserId: app.userId,
			reportState: 0,
			score: assessScore
		}, function(data) {
			console.log(data);
			var detailID = data.data.id;
			if(detailID) {
				if(photoDatas && photoDatas.length > 0) {
					uploadReportDetialPhoto(photoDatas, detailID);
				} else {
					app.myApp.toast('保存成功', 'success').show(true);
					$$('.sumbit').html('已保存');
					if(thisAppName == undefined){
						require(['js/pages/assessment/assessment'], function(assessment) {
							assessment.addCallback();
						});
					}else if(thisAppName == 'UD'){
						require(['js/pages/assessment/threeMeetingsAndOneClassUD'], function(threeMeetingsAndOneClassUD) {
							threeMeetingsAndOneClassUD.refreshThreeMeetingsAndOneClassPaperUD();
						});
						require(['js/pages/party/threePlusXStatistics'], function(threePlusXStatistics) {
							threePlusXStatistics.refreshPlusX();
						});
					}
					else{
						require(['js/pages/assessment/threeMeetingsAndOneClass'], function(threeMeetingsAndOneClass) {
							threeMeetingsAndOneClass.refreshThreeMeetingsAndOneClassPaper();
						});
						require(['js/pages/appList/appList'], function(appList) {
							appList.reSetshykReadRows();
						});
					}
					
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
		app.myApp.showPreloader('图片保存中...');
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
		app.myApp.toast("保存成功！", 'success').show(true);
		$$('.sumbit').html('已保存');
		app.myApp.hidePreloader();
		app.myApp.getCurrentView().back();
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
					photoDatas.splice(piciIndex - 2, 1);
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