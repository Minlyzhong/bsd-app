define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	var imageList = [];
	//获取双签内容
	var findDetailInfoPath = app.basePath + '/mobile/partyAm/findDetailInfo';
	//上传签名
	var saveUserReportDetialPath = app.basePath + '/mobile/dbSign/sign';
	//上传附件
	var uploadReportDetialPhotoPath = app.basePath + '/file/upload';
	var assessId = -1;
	var photoBrowserPhotos = [];
	var photoBrowserPopup = '';
	var readonlyPicCount = 0;
	var reWork = 0;
	var deptName = '';
	var SignResult = {};
	var count = 0;
	var imgLength = 0;
	var signPic = [];
	var signPicParam = {};
	
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		if(firstIn) {
		app.myApp.onPageBack("doubleSign/doubleSignDetail", function(page){
			page.view.params.swipeBackPage = true;
		});
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
		attrDefine(page);

		//点击事件
		clickEvent();
		
		
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
		SignResult = {};
		photoBrowserPopup = '';
		assessId = pageData.assessId;
		readonlyPicCount = 0;
		imgLength = 0;
		count = 0;
		signPic = [];
		signPicParam = {};
		findDetailInfo();
		
		$$('#reSign').css('display','none');
		
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
		
		
		console.log(page.query)
	
		console.log(page.query);
		deptName = page.query.deptName;
		
		
		
	}
	

	/**
	 * 获取考核内容
	 */
	function findDetailInfo() {
		app.ajaxLoadPageContent(findDetailInfoPath, {
			fkId: assessId,
//			refType:10,
		}, function(data) {
			
			SignResult = data.data;
			// imageList = data.data.images || [];
			$$('#assessTs').val(SignResult.reportTime);
			$$('#assessContent').val(data.data.reportContext);
			$$('#assessdeptName').val(deptName);
			// console.log(readonlyPicCount)
			// readonlyPicCount = imageList.length || 0;
			// console.log(readonlyPicCount);
			// showReadonlyPhotos(data.data.images);
			


		});
	}

	/**
	 * 点击事件
	 */
	function clickEvent(){
		$$('#sign').on('click',function(){
			app.myApp.getCurrentView().loadPage('doubleHandSign.html');
		})
		$$('#reSign').on('click',function(){

			app.myApp.getCurrentView().loadPage('doubleHandSign.html');
			var imageList = $$('#someelement img').length;
			console.log(imageList);
			if(imgLength < imageList){

				$("#someelement img")[imageList-1].remove();
			}
			
			
		})
		$$('.assessWorkBack').on('click',function(){
			app.myApp.confirm('还未签名,是否退出？', function() {
				app.myApp.getCurrentView().back();
			});
		});
		$$('.assessWorkHome').on('click',function(){
			app.myApp.confirm('还未签名,是否返回首页？', function() {
				app.back3Home();
			});
		});

		// $$('').on('click',saveUserReportDetial);
		
    
	}

	    
	/**
	 * 保存考核信息
	 */
	function saveUserReportDetial() {

		var assessTitle = $$('#assessTitle').val();
		var assessTs = $$('#assessTs').val();
		var assessContent = $$('#assessContent').val();
		// if(!assessContent || !assessTitle || !assessTs) {
		// 	app.myApp.alert('请补签名');
		// 	return;
		// }
		
		//防止数据传输过慢多次上传
		count = count + 1;
		if(count > 0){
			$$('.sumbit').attr('disabled',false);
		}

		uploadReportDetialPhoto(signPic[1]);

		var formDatas= JSON.stringify(signPicParam)
		$$.ajax({
            url:saveUserReportDetialPath,
            method: 'POST',
            dataType: 'json',
            // processData: false, // 告诉jQuery不要去处理发送的数据
			// contentType: false, // 告诉jQuery不要去设置Content-Type请求头
			contentType: 'application/json;charset:utf-8',
            data: formDatas,
            cache: false,
            success:function (data) {
				if(data.code == 0){
					app.myApp.toast('保存成功', 'success').show(true);
					$$('.rankSumbit').html('已保存');
					app.myApp.getCurrentView().back();
					
					require(['js/pages/doubleSign/doubleSign.js'], function(doubleSign) {
						doubleSign.refresh(false);
					});
				}else{
					app.myApp.toast('保存失败', 'error').show(true);
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
				filePath: "",
				id: 0,
				name: "",
				type: 0
				
			}
			// options.params = params;

			ft.upload(photo, uri, function(r) {
				var data = JSON.parse(r.response);
				// sum++;

				// alert(data.code);
				if(data.code == 0 && data.data != null) {
					var result = data.data;
					// params.ext = result.ext;
					params.name = app.user.nickName;
					params.filePath = result.filePath;
					params.id = SignResult.id;
					params.type = SignResult.type;
					// params.length = result.length;
					// imageList.push(params);
					signPicParam = params;
				
				} else {
					ft.abort();
					app.myApp.alert(app.utils.callbackAjaxError()+ '图片');
					return;
				}
			}, function(error) {
				ft.abort();
				app.myApp.alert(app.utils.callbackAjaxError() + '图片');
				return;
			}, options);
	}

	/**
	 * 显示已读相片
	 * @param {Object} picUrlList 需要显示的图片数组
	 */
	// function showReadonlyPhotos(picUrlList) {
	// 	$$.each(picUrlList, function(index, item) {
	// 		photoBrowserPhotos.push(app.filePath + item.filePath);
	// 		var random = app.utils.generateGUID();
	// 		$$('.weui_uploader').append(
	// 			'<div class="weui_uploader_bd kpiPicture">' +
	// 			'<div class="picContainer" id="img_' + random + '">' +
	// 			'<img src="' + app.filePath + item.filePath + '" class="picSize" />' +
	// 			'</div>' +
	// 			'</div>');
			
	// 		// //添加删除图片的监听事件
	// 		// $$('#delete_file_' + random).on('click', function(e) {
	// 		// 	e.stopPropagation();
	// 		// 	var photoContainer = $$(this).parent().parent();
	// 		// 	var piciIndex = photoContainer.index();
	// 		// 	app.myApp.confirm('确认删除该图片?', function() {
	// 		// 		photoContainer.remove();
	// 		// 		photoBrowserPhotos.splice(piciIndex - 2, 1);
	// 		// 		photoDatas.splice(piciIndex - 2 , 1);
	// 		// 		imageList.splice(piciIndex - 2 , 1);
	// 		// 		app.myApp.toast('删除成功', 'success').show(true);
	// 		// 	});
	// 		// });	
	// 		$$('#img_' + random).on('click', function(e) {
	// 			var picIndex = $$(this).parent().index();
	// 			photoBrowserPopup = app.myApp.photoBrowser({
	// 				photos: photoBrowserPhotos,
	// 				theme: 'dark',
	// 				backLinkText: '关闭',
	// 				ofText: '/',
	// 				type: 'popup',
	// 			});
	// 			photoBrowserPopup.open(picIndex - 1 - reWork);
	// 		});
	// 	});
	// }

		/**
	 * 选择签名页面回调 
	 * @param {Object} host 用户列表
	 */
	function addSignBack(picInfo) {
		signPic = picInfo;
		addSignInfoBack();
		$$('#sign').css('display','none');
		$$('#reSign').css('display','block');

	}
	/**
	 * 选择签名的信息显示回调
	 */
	function addSignInfoBack() {
		console.log(signPic);
		if(signPic) {
			var i = new Image();
            i.src = "data:" + signPic[0] + "," + signPic[1];
			$(i).appendTo($("#someelement")); // append the image (SVG) to DOM.	

			// uploadReportDetialPhoto(signPic[1]);
		}else{
			signPic=[];
			$("#someelement").html('');
		}
//		getAbsenteesBack();
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
		addSignBack: addSignBack
	}
});