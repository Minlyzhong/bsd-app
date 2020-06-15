define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//保存简历
	// var saveUserReportDetialPath = app.basePath + '/mobile/recruit/jobWanted';
	// 获取上传过的简历
	var hasSave = app.basePath + '/mobile/recruit/jobWanted/';
	//上传图片
	// var uploadReportDetialPhotoPath = app.basePath + '/file/upload';
	//上传文件
	// var uploadWorkFilePath = app.basePath + '/file/upload';

	var applyId = 0;
	var assessScore = 0;
	var count = 0;
	
	var thisAppName = '';
	var imageList = [];
	var fileList = [];
	var srcName = [];
	var suffixName = [];
	var fileNames = [];
	var fileCount = 0;
	var attType = 0;
	
	var judgmentParam = 0;
	
	var minDate = '';
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		//设置页面不能滑动返回
		// page.view.params.swipeBackPage = false;
		// app.myApp.onPageBack("recruit/jobApply", function(page){
		// 	page.view.params.swipeBackPage = true;
		// });
		count = 0;
		app.myApp.showPreloader('加载中...');
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
		
		minDate = pageData.StartDate
	}

		/**
	 * 异步性别数据 
	 */
	function ajaxUserLoad() {

		checkHasCV();
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
            data: {userId: app.userDetail.userId},
            cache: false,
            success:function (data) {
				app.myApp.hidePreloader();
				if(data.code == 0 && data.data != null){
					var result = data.data;
					console.log(result);
					applyId = result.id;
					showAndDownLoadFiles(result.resumePath);
					$$('.jobApplyHistoryPage #applyMajor').val(result.major);
					$$('.jobApplyHistoryPage #applyNeed').val(result.label);
					$$('.jobApplyHistoryPage #seftIntro').val(result.introduce);
				}	
            },
            error:function () {
				app.myApp.hidePreloader();
				app.myApp.toast("获取数据失败，请稍后再试！", 'none').show(true);
            }
		});
		
	
	}

	/**
	 * 点击事件
	 */
	function clickEvent() {
		// $$('.weui_uploader_input_wrp').on('click', function() {
		// 	showImgPicker();
		// });
		$$('.applyEdit').on('click', moveTo);
		
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
				$$('.jobApplyHistoryPage .weui_uploader1').append(
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
				$$('.jobApplyHistoryPage #file_delete'+random1).on('click', function(e) {
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
		
		$$('.jobApplyHistoryPage .assessWorkBack1').on('click',function(){
			// app.myApp.confirm('您的简历尚未上传，是否退出？', function() {
				app.myApp.getCurrentView().back();
			// });
		});
		$$('.jobApplyHistoryPage .assessWorkHome1').on('click',function(){
			// app.myApp.confirm('您的简历尚未上传，是否返回首页？', function() {
				app.back3Home();
			// });
		});
	}

	/**
	 * 显示文件
	 * @param {Object} fileUrlList 需要显示的图片数组
	 */

	function showAndDownLoadFiles(fileUrl) {
		// $$.each(fileUrlList, function(index, item) {
			var random = app.utils.generateGUID();
			var str = '';
			var fileName=[];
			// fileName = item.name.split('/');
			fileName = fileUrl.split('/');
			var typeFiles=[];
			var typeFile = '';
			typeFiles = fileUrl.split('.');
			typeFile = typeFiles.pop();
			console.log(typeFile);
			if(typeFile == 'txt'){
				str +='<img src="img/file/txt.png" class="fileSize" />';
			}else if(typeFile == 'doc'){
				str +='<img src="img/file/doc.png" class="fileSize" />';
			}else if(typeFile == 'docx'){
				str +='<img src="img/file/doc.png" class="fileSize" />';
			}else if(typeFile == 'zip'){
				str +='<img src="img/file/zip.png" class="fileSize" />';
			}else if(typeFile == 'xls'){
				str +='<img src="img/file/xls.png" class="fileSize" />';
			}else if(typeFile == 'rar'){
				str +='<img src="img/file/zip.png" class="fileSize" />';
			}else if(typeFile == 'pdf'){
				str +='<img src="img/file/pdf.png" class="fileSize" />';
			}else if(typeFile == 'ppt'){
				str +='<img src="img/file/ppt.png" class="fileSize" />';
			}
			//item-title kp-label
			$$('.jobApplyHistoryPage .weui_uploader1').append(
				'<div class="downloadFiles">'+
				str+
				'<input type="hidden" value="'+fileUrl+'" name="fileUrl"/>'+
				'<a href="javascript:void(0)">'+
//				fileName.pop()+
				'个人简历'+
				'</a>'+
				'<div>');
		// });
		$$('.jobApplyHistoryPage .downloadFiles').on('click',function(){
			var downUrl = $(this).find('input[name=fileUrl]').val();
			app.myApp.confirm('确定要下载吗？', function() {
				open(app.filePath+downUrl, '_system');
				return false;
			});
		});
	}


	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(pageData) {
		$$('.assessDetailTitle').html(pageData.title);
		
		
	}

	

	

	//修改简历信息
	function moveTo() {

		app.myApp.getCurrentView().loadPage('jobApplyEdit.html?type=1&applyId='+applyId);
		
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