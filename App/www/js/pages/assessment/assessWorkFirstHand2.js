define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	// 查看清单填报情况
	// var checkReportDetialPath = app.basePath + '';
	//保存考核明细
	var saveUserReportDetialPath = app.basePath + '/mobile/partyAm/saveALeadertReportDetial';
	//上传附件
	var uploadReportDetialPhotoPath = app.basePath + '/file/upload';
	//上传文件
	var uploadWorkFilePath = app.basePath + '/file/upload';
	var assessId = -1;
	var assessScore = 0;
	var photoBrowserPhotos = [];
	var photoDatas = [];
	var photoBrowserPopup = '';
	var count = 0;
	
	var thisAppName = '';
	
	var srcName = [];
	var suffixName = [];
	var fileNames = [];
	var fileCount = 0;
	
	var fileList = [];
	var imageList = [];

	var judgmentParam = 0;
	
	var minDate = '';
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		//设置页面不能滑动返回
		page.view.params.swipeBackPage = false;
		app.myApp.onPageBack("assess/assessmentFirstHand2", function(page){
			page.view.params.swipeBackPage = true;
		});
		count = 0;
//		if(firstIn) {
			initData(page.query);
//		}
		//app.back2Home();
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
		console.log(pageData);
		assessId = pageData.assessId;
		assessScore = pageData.score;
		if(pageData.judgmentParam){
			judgmentParam = pageData.judgmentParam;
		}else{
			judgmentParam = 0;
		}
		console.log(judgmentParam == 1);
		srcName = [];
		suffixName = [];
		fileNames = [];
		fileCount = 0;
		thisAppName = pageData.thisAppName;
		
		minDate = pageData.StartDate;
		checkState();
	}

	/**
	 * 点击事件
	 */
	function clickEvent() {
		$$('.weui_uploader_input_wrp').on('click', function() {
			showImgPicker();
		});
		$$('.sumbit').on('click', saveUserReportDetial);
		
		$$("#fileinput").on('change', function () {
		    var oFReader = new FileReader();
		    var file = document.getElementById('fileinput').files[0];
		    if(file.size > 20971520){
		    	app.myApp.alert('文件不能大于20MB！！');
		    	return;
		    }
		    oFReader.readAsDataURL(file);
		    oFReader.onloadend = function(oFRevent){
		        var path = $$('#fileinput').val();
		        var strs = [];
		        var strs1 = [];
		        var typeFile = '';
		        var str = '';
		        var str123 = '';
		        strs=path.split(".");
		        strs1=path.split("\\");
		        str123 = strs1.pop()
		        typeFile= strs.pop();
				console.log(str123);
				if(typeFile == 'txt'
				|| typeFile == 'doc'
				|| typeFile == 'docx'
				|| typeFile == 'zip'
				|| typeFile == 'xls'
				|| typeFile == 'rar'
				|| typeFile == 'pdf'
				|| typeFile == 'ppt'){
					
				}else{
					app.myApp.alert('选择文件类型不符合上传');
					return;
				}
				fileNames.push(str123);
				srcName.push(oFRevent.target.result);
				wordUpload(oFRevent.target.result);
				suffixName.push(typeFile);
				if(typeFile == 'txt'){
					str +='<img src="img/file/txt.png" class="picSize" />';
				}else if(typeFile == 'doc'){
					str +='<img src="img/file/doc.png" class="picSize" />';
				}else if(typeFile == 'docx'){
					str +='<img src="img/file/doc.png" class="picSize" />';
				}else if(typeFile == 'zip'){
					str +='<img src="img/file/zip.png" class="picSize" />';
				}else if(typeFile == 'xls'){
					str +='<img src="img/file/xls.png" class="picSize" />';
				}else if(typeFile == 'rar'){
					str +='<img src="img/file/zip.png" class="picSize" />';
				}else if(typeFile == 'pdf'){
					str +='<img src="img/file/pdf.png" class="picSize" />';
				}else if(typeFile == 'ppt'){
					str +='<img src="img/file/ppt.png" class="picSize" />';
				}
				var random1 = app.utils.generateGUID();
				$$('.weui_uploader1').append(
				'<div class="weui_uploader_bd kpiPicture" >' +
				'<div class="picContainer" style="margin-top:8px;">' +
				str+
				'<div class="item-title kp-label" style="margin-left:18px;position:absolute;top:79px;">'+
				str123+
				'</div>'+
				'<div class="file-panel">' +
				'<i class="icon icon-delete" id="file_delete'+random1+'" data-index="'+fileCount+'"></i>' +
				'</div>' +
				'</div>' +
				'</div>');
				fileCount += 1;
				//添加删除文件的监听事件
				$$('#file_delete'+random1).on('click', function(e) {
					e.stopPropagation();
					var fileContainer = $$(this).parent().parent();
					var fileIndex = $$(this).data('index');
					app.myApp.confirm('确认删除该文件?', function() {
						fileContainer.remove();
						suffixName.splice(fileIndex,1);
						srcName.splice(fileIndex,1);
						fileList.splice(fileIndex,1);
						fileNames.splice(fileIndex,1);
						fileCount = fileCount-1;
						console.log(suffixName);
						console.log(srcName)
						app.myApp.toast('删除成功', 'success').show(true);
					});
				});
				console.log(srcName);
		        console.log(suffixName);
			}
			
			
		});
		
		$$('.assessWorkBack').on('click',function(){
			app.myApp.confirm('您的考核尚未上传，是否退出？', function() {
				app.myApp.getCurrentView().back();
			});
		});
		$$('.assessWorkHome').on('click',function(){
			app.myApp.confirm('您的考核尚未上传，是否返回首页？', function() {
				app.back3Home();
			});
		});
	}
	function checkState(){

	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(pageData) {
		$$('.assessDetailTitle').html(pageData.title);
		if(assessScore>0){
			$$('.addScore').css('display','block');
			$$('.addScore').append(pageData.score + '分');
			$$('.lessScore').css('display','none');
		}else{
			$$('.addScore').css('display','none');
			$$('.lessScore').css('display','block');
			$$('.lessScore').append(pageData.score + '分');
		}
		//$$('.assessScore').append(pageData.score + '分');
		$$('.assessTarget').append(pageData.target);
		if(pageData.memo == '无'){
			$$('.assessMemo').css('display','none');
		}else{
			$$('.assessMemo').append(pageData.memo);
		}
		addCalendar('assessTs');
	}
	/*
	 * 文档上传
	 */
	function wordUpload(srcNameData) {
		app.myApp.showPreloader('文档保存中...');
		var ft1 = new FileTransfer();
		
			var uri1 = encodeURI(uploadWorkFilePath);
			var options1 = new FileUploadOptions();
			options1.fileKey = "file";
			//随机数加后缀名
			//options1.fileName = app.utils.generateGUID() + "."+suffixName[index];
			$.each(srcName, function(index,item){
				options1.fileName = fileNames[index];
			});
			
			//判断类型
			var attType = 0;
			if(suffixName == 'docx'){
				options1.mimeType = "application/msword";
				attType = 4;
			}else if(suffixName == 'doc'){
				attType = 4;
				options1.mimeType = "application/msword";
			}else if(suffixName == 'txt'){
				options1.mimeType = "text/plain";
				attType = 7;
			}else if(suffixName == 'xls'){
				options1.mimeType = "application/vnd.ms-excel";
				attType = 5;
			}else if(suffixName == 'zip'){
				options1.mimeType = "application/zip";
				attType = 8;
			}else if(suffixName == 'rar'){
				options1.mimeType = "application/zip";
				attType = 9;
			}else if(suffixName == 'pdf'){
				options1.mimeType = "application/pdf";
				attType = 6;
			}else if(suffixName == 'ppt'){
				options1.mimeType = "application/vnd.ms-powerpoint";
				attType = 10;
			}
			options1.chunkedMode = false;
			options1.headers = {
				'Authorization': "bearer " + app.access_token
			}
			var params = {
				"ext": "",
				"filePath": "",
				"length": 0,
				"name": 0,
				
			}
//			if(judgmentParam == 1){
//				params.refType = 10;
//			}else{
//				params.refType = 3;
//			}
			// params.refType = 3;
			// options1.params = params;
			ft1.upload(srcNameData, uri1, function(r) {
				var data = JSON.parse(r.response);
				app.myApp.hidePreloader();
				if(data.code == 0 && data.data != null) {
					var result = data.data;
					params.ext = result.ext;
					params.name = result.name;
					params.filePath = result.filePath;
					params.length = result.length;
					fileList.push(params);
					
					
				} else {
	
					ft1.abort();
					app.myApp.alert(app.utils.callbackAjaxError());
					return;
				}
			}, function(error) {
				ft1.abort();
				app.myApp.hidePreloader();
				app.myApp.alert(app.utils.callbackAjaxError());
				return;
			}, options1);
		
		
		
		//refresh();		
		// require(['js/pages/assessment/assessment'], function(assessment) {
		// 	assessment.addCallback();
		// });
	}
	//初始化日历
	function addCalendar(contentID) {
		//var minDate = '2018-04-01';
		console.log(minDate);
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
			// minDate:minDate,
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

		
		var params={
			id: 0,
			topicId: assessId,
			reportTitle: assessTitle,
			// reportTime: assessTs,
			reportContext: assessContent,
			reportUserId: app.userId,
			reportState: 0,
			totalScore: assessScore,
			file: fileList,
			images : imageList
		}
		var formDatas= JSON.stringify(params)
		$$.ajax({
            url:saveUserReportDetialPath,
            method: 'POST',
            dataType: 'json',
			contentType: 'application/json;charset:utf-8',
            data: formDatas,
            cache: false,
            success:function (data) {
			app.myApp.hidePreloader();
			if(data.msg == 'error'){
				app.myApp.toast(data.data, 'error').show(true);
			}else{
				console.log(data);
				app.myApp.toast('保存成功', 'success').show(true);
				$$('.sumbit').html('已保存');
				app.myApp.getCurrentView().back();
				require(['js/pages/assessment/assessmentFirstHand'], function(assessmentFirstHand) {
					assessmentFirstHand.addCallback();
	
				});
			}
            
		},
            error:function () {
				app.myApp.alert(app.utils.callbackAjaxError());
            }
        });

		
	}

	/**
	 *  上传图片
	 * @param {Object} photoDatas 相片数组
	 * @param {Object} detailID  考核明细ID
	 */
	function uploadReportDetialPhoto(photo) {
		app.myApp.showPreloader('图片保存中...');
		var sum = 0;

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
			var params = {
				"ext": "",
				"filePath": "",
				"length": 0,
				"name": 0,
				
			}
			// options.params = params;

			ft.upload(photo, uri, function(r) {
				var data = JSON.parse(r.response);
				// sum++;
				app.myApp.hidePreloader();
				
				if(data.code == 0 && data.data != null) {
					var result = data.data;
						params.ext = result.ext;
						params.name = result.name;
						params.filePath = result.filePath;
						params.length = result.length;
						imageList.push(params);
						
                    // app.myApp.alert(params.attName + '路径: '+params.attPath); 
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
					photoDatas.push(base64Data);
					uploadReportDetialPhoto(base64Data)
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