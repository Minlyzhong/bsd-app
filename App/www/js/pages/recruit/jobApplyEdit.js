define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//保存简历
	var saveUserReportDetialPath = app.basePath + '/mobile/recruit/jobWanted';
	// 获取上传过的简历
	var hasSave = app.basePath + '/mobile/recruit/jobWanted/';
	//上传图片
	// var uploadReportDetialPhotoPath = app.basePath + '/file/upload';
	//上传文件
	var uploadWorkFilePath = app.basePath + '/file/upload';

	var count = 0;
	
	var thisAppName = '';
	var imageList = [];
	var applyId = 0;
	var fileList = [];
	var srcName = [];
	var suffixName = [];
	var fileNames = [];
	var fileCount = 0;
	var attType = 0;
	var applyType = 0;
	
	var judgmentParam = 0;
	
	var minDate = '';
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		//设置页面不能滑动返回
		page.view.params.swipeBackPage = false;
		app.myApp.onPageBack("recruit/jobApply", function(page){
			page.view.params.swipeBackPage = true;
		});
		count = 0;
//		if(firstIn) {
			initData(page.query);
//		}
		//app.back2Home();
		clickEvent();
		attrDefine(page.query);
		// pushAndPull(page);
		ajaxUserLoad();
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
		attType = 0;
		applyType = pageData.type || 0;
		if(applyType !=0){
			applyId = pageData.applyId;
		}
		
		srcName = [];
		suffixName = [];
		fileNames = [];
		fileCount = 0;
		thisAppName = pageData.thisAppName;
		
		minDate = pageData.StartDate
	}

		/**
	 * 异步性别数据 
	 */
	function ajaxUserLoad() {

		checkHasCV();
	}

	

	/**
	 * 点击事件
	 */
	function clickEvent() {
		// $$('.weui_uploader_input_wrp').on('click', function() {
		// 	showImgPicker();
		// });
		$$('.jobApplyEdit .applySumbit').on('click', saveUserReportDetial);
		
		$$(".jobApplyEdit #fileinput").on('change', function () {
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
				suffixName.push(typeFile);
				wordUpload(oFRevent.target.result,str123 )
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
				$$('.jobApplyEdit .weui_uploader1').append(
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
				$$('.jobApplyEdit #file_delete'+random1).on('click', function(e) {
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
			app.myApp.confirm('您的简历尚未上传，是否退出？', function() {
				app.myApp.getCurrentView().back();
			});
		});
		$$('.assessWorkHome').on('click',function(){
			app.myApp.confirm('您的简历尚未上传，是否返回首页？', function() {
				app.back3Home();
			});
		});
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(pageData) {
		$$('.assessDetailTitle').html(pageData.title);
		
		
	}

	/**
	 * 找回以前的简历
	 */
	function checkHasCV(){
		$$.ajax({
            url:hasSave+app.user.userId,
            method: 'PUT',
			dataType: 'json',
			contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            data: {},
            cache: false,
            success:function (data) {
				app.myApp.hidePreloader();
				if(data.code == 0 && data.data != null){
					var result = data.data;
					console.log(result);
					applyId = result.id;
					// showAndDownLoadFiles(result.resumePath);
					$$('.jobApplyEdit #applyMajor').val(result.major);
					$$('.jobApplyEdit #applyNeed').val(result.label);
					$$('.jobApplyEdit #seftIntro').val(result.introduce);
				}	
            },
            error:function () {
				app.myApp.hidePreloader();
				app.myApp.toast("获取数据失败，请稍后再试！", 'none').show(true);
            }
		});
		
	
	}

	/*
	 * 文档上传
	 */
	function wordUpload(srcNameData, str) {
		app.myApp.showPreloader('文档保存中...');
		
		var ft1 = new FileTransfer();
		
			var uri1 = encodeURI(uploadWorkFilePath);
			var options1 = new FileUploadOptions();
			options1.fileKey = "file";
			//随机数加后缀名
			//options1.fileName = app.utils.generateGUID() + "."+suffixName[index];
			options1.fileName = str;
			options1.headers = {
				'Authorization': "bearer " + app.access_token
			}
			//判断类型
			
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
			var params = {
				"attName": "",
				"attPath": "",
				"attSize": 0,
				"attState": 0,
				"attType": attType,
				"tenantId": app.userDetail.tenantId,
				"userId": app.userDetail.userId
			}
			// params.fkId = detailID;
			// params.userId = app.userId;
//			if(judgmentParam == 1){
//				params.refType = 10;
//			}else{
//				params.refType = 3;
//			}
			// params.refType = 3;
			// options1.params = params;
			
			ft1.upload(srcNameData, uri1, function(r) {
				app.myApp.hidePreloader();
				var data = JSON.parse(r.response);
				if(data.code == 0 && data.data != null) {
					var result = data.data;
					params.ext = result.ext;
					params.name = result.name;
					params.filePath = result.filePath;
					params.length = result.length;
					fileList.push(params);
					
				} else {
					app.myApp.hidePreloader();
					ft1.abort();
					app.myApp.alert(app.utils.callbackAjaxError());
					return;
				}
			}, function(error) {
				app.myApp.hidePreloader();
				ft1.abort();
				app.myApp.alert(app.utils.callbackAjaxError());
				return;
			}, options1);
		
		app.myApp.hidePreloader();
		// app.myApp.toast("保存成功！", 'success').show(true);
		// app.myApp.getCurrentView().back();
		// //refresh();		
		// require(['js/pages/assessment/assessment'], function(assessment) {
		// 	assessment.addCallback();
		// });
	}
	

	

	//保存简历信息
	function saveUserReportDetial() {
		console.log('1111')
		var applyMajor = $$('.jobApplyEdit #applyMajor').val();
		var applyNeed = $$('.jobApplyEdit #applyNeed').val();
		var seftIntro = $$('.jobApplyEdit #seftIntro').val();
		if(!applyNeed || !applyMajor || !seftIntro) {
			app.myApp.alert('请补全简历信息！');
			return;
		}
		console.log('222')

		app.myApp.confirm('是否确认提交？', function() {
			//防止数据传输过慢多次上传
		count = count + 1;
		if(count > 0){
			$$('.jobApplyEdit .applySumbit').attr('disabled',false);
		}
		app.myApp.showPreloader('信息保存中...');
		console.log(applyType)
		console.log(applyId);
		var resumePath;
		if(fileList.length >0){
			resumePath = fileList[0].filePath;
		}else{
			resumePath = null;
		}
		 
			// 修改简历
			var params={
				id: parseInt(applyId),
				label: applyNeed,
				major: applyMajor,
				introduce: seftIntro,
				userId: app.userId,
				// images : imageList,
				resumePath: resumePath,
				createDate: app.getnowdata()
			}
			console.log(params);
			var formDatas= JSON.stringify(params)
			$$.ajax({
				url:saveUserReportDetialPath,
				method: 'PUT',
				dataType: 'json',
				contentType: 'application/json;charset:utf-8',
				data: formDatas,
				cache: false,
				success:function (data) {
					if(data.code == 0){
						console.log(data);
						app.myApp.hidePreloader();
						app.myApp.toast('保存成功', 'success').show(true);
						$$('.applySumbit').html('已保存');
						setTimeout(function(){
							app.myApp.getCurrentView().back();
						},1000);
						// require(['js/pages/recruit/jobFairDetail'], function(assessment) {
						// 	assessment.addCallback();
						// });
				
					
					app.myApp.getCurrentView().back();
				
					}else{
						app.myApp.toast(data.msg , 'error').show(true);
					}
					
				
			},
				error:function () {
					app.myApp.hidePreloader();
					app.myApp.alert(app.utils.callbackAjaxError());
				}
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