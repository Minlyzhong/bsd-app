define(['app','hbs!js/hbs/recordRmLeader'], function(app,recordRmLeaderTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	//保存三会一课
	var threeMeetingAndOneClassAddPath = app.basePath + '/mobile/partyAm/saveReportDetial';
	//上传图片
	var uploadReportDetialPhotoPath = app.basePath + '/file/upload';
	//上传文件
	var uploadWorkFilePath = app.basePath + '/file/upload';
	//获取缺席人
	// var getAbsenteesPath = app.basePath + 'knowledgeParticipant/findDefaultersOfDept';
	//上传照片需要的参数
	var photoBrowserPhotos = [];
	var photoDatas = [];
	var photoBrowserPopup = '';
	//上传文件需要的参数
	var srcName = [];
	var suffixName = [];
	var fileNames = [];
	var fileCount = 0;
	//时间限制
	var minDate = '';
	//列席人集合
	var listAttendees = [];
	//出席人集合
	var listedList = [];
	//主持人
	var hostMan =[];
	//缺席人集合
	var absenteesList = [];
	// 上传文件和图片的参数
	var fileList = [];
	var imageList = [];
	
	var attType = 0;
	//地理位置
	var lng;
	var lat;
	var topicId;
	
	var deptId;
	var target;
	var	memo;
	//一个装id获取缺席人的id
	var getAddIds;
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		//设置页面不能滑动返回
		page.view.params.swipeBackPage = false;
		app.myApp.onPageBack("process/processDetailEdit", function(page){
			page.view.params.swipeBackPage = true;
		});
		initData(page.query);
		attrDefine(page);
		clickEvent(page);
	}
	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		console.log('pageData')
		console.log(pageData)
		$$('.shykTitle').html(pageData.name);
		$$('.assessTarget').append(target);
		fileList = [];
		imageList = [];
	
		attType = 0;
		// $$('.assessMemo').append(memo);
		firstIn = 0;
		listAttendees = [];
		listedList = [];
		hostMan = [];
		lng = 0.0;
		lat = 0.0;
		getAddIds = [];
		absenteesList = [];
		//上传照片需要的参数
		photoBrowserPhotos = [];
		photoDatas = [];
		photoBrowserPopup = '';
		//上传文件需要的参数
		srcName = [];
		suffixName = [];
		fileNames = [];
		fileCount = 0;
	}
	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {}
	/**
	 * 点击事件
	 */
	function clickEvent(page) {
			//获取地址
			$$('.getGPS').on('click', getPosition);
			//点击列席人
			$$('.attendeesIcon').on('click',function(){
				if($$(this).hasClass('icon-openIcon')){
					$$(this).removeClass('icon-openIcon');
					$$(this).addClass('icon-closeIcon');
					$('#attendees').animate({height:"200px"},200);
				}else{
					$$(this).removeClass('icon-closeIcon');
					$$(this).addClass('icon-openIcon');
					$('#attendees').animate({height:"40px"},200);
				}
			});
			//点击出席人
			$$('.listedsIcon').on('click',function(){
				if($$(this).hasClass('icon-openIcon')){
					$$(this).removeClass('icon-openIcon');
					$$(this).addClass('icon-closeIcon');
					$('#listeds').animate({height:"200px"},200);
				}else{
					$$(this).removeClass('icon-closeIcon');
					$$(this).addClass('icon-openIcon');
					$('#listeds').animate({height:"40px"},200);
				}
			});
				//点击缺席人
			$$('.absenteesIcon').on('click',function(){
				if($$(this).hasClass('icon-openIcon')){
					$$(this).removeClass('icon-openIcon');
					$$(this).addClass('icon-closeIcon');
					$('#absentees').animate({height:"200px"},200);
				}else{
					$$(this).removeClass('icon-closeIcon');
					$$(this).addClass('icon-openIcon');
					$('#absentees').animate({height:"40px"},200);
				}
			});
			//点击要点摘录及内容
			$$('.tcaomContentIcon').on('click',function(){
				changeStateForText($$(this));
				$('.tcaomContent').slideToggle(200);
			});
			//点击会议决议
			$$('.tcaomMeetingDecisionIcon').on('click',function(){
				changeStateForText($$(this));
				$('.tcaomMeetingDecision').slideToggle(200);
			});
			//点击不同意见
			$$('.tcaomDifferentViewsIcon').on('click',function(){
				changeStateForText($$(this));
				$('.tcaomDifferentViews').slideToggle(200);
			});
			//点击完成
			$$('.sumbit').on('click',subitRecord);
			//点击上传会议图片的+号
			$$('.weui_uploader_input_wrp').on('click', function() {
				showImgPicker();
			});
			//点击开会日期触发
			addCalendar('assessTs');
			//点击开会时间触发
			addPickerTime('assessTsTime');
			//点击选择文件按钮
			$$("#fileinput").on('change',fileShow); 
			//点击返回箭头
			$$('.tcaomBack').on('click',function(){
				app.myApp.confirm('您的记录尚未上传，是否退出？', function() {
					app.myApp.getCurrentView().back();
				});
			});
			//点击小房子
			$$('.tcaomHome').on('click',function(){
				app.myApp.confirm('您的记录尚未上传，是否返回首页？', function() {
					app.back3Home();
				});
			});
			/*//点击列席人添加
			$$('.addAttendees').on('click',function(){
//				app.myApp.alert('请选择列席人');
				//跳转人员选择
				app.myApp.getCurrentView().loadPage('addAttendees.html?listAttendees='+JSON.stringify(listAttendees)+'&deptType=1');
			});
			//点击列席人移除
			$$('.removeAttendees').on('click',attendeesRemove);*/
			
			//点击出席人添加
			$$('.addListeds').on('click',function(){
				//跳转人员选择
				app.myApp.getCurrentView().loadPage('addListeds.html?listedList='+JSON.stringify(listedList)+'&deptType=1'+'&selectType=1');
			});
			//点击出席人移除
			$$('.removeListeds').on('click',recordRemove);
			
			//点击缺席人添加
			$$('.addAbsentees').on('click',function(){
				//跳转人员选择
				app.myApp.getCurrentView().loadPage('addListeds.html?listedList='+JSON.stringify(absenteesList)+'&deptType=1'+'&selectType=2');
			});
			//点击缺席人移除
			$$('.removeAbsentees').on('click',absenteesRemove);
			
			
			//点击主持人添加
			$$('.addHost').on('click',function(){
				//跳转人员选择
				app.myApp.getCurrentView().loadPage('addHost.html?hostMan='+JSON.stringify(hostMan)+'&deptType=1');
			});
			//点击主持人移除
			$$('.removeHost').on('click',function(){
				//清空主持人
				hostMan=[];
				$$('#host').val('');
//				getAbsenteesBack();
			});
	}
	/*
	 * 改变文本框的状态
	 */
	function changeStateForText(chooseText){
		if(chooseText.hasClass('icon-openIcon')){
			chooseText.removeClass('icon-openIcon');
			chooseText.addClass('icon-closeIcon');
		}else{
			chooseText.removeClass('icon-closeIcon');
			chooseText.addClass('icon-openIcon');
		}
	}
	/*
	 * 文件显示
	 */
	function fileShow(){
		var oFReader = new FileReader();
    var file = document.getElementById('fileinput').files[0];
    //判断文件是否大于20MB
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
			if(typeFile == 'txt'
				|| typeFile == 'doc'
				|| typeFile == 'docx'
				|| typeFile == 'zip'
				|| typeFile == 'xls'
				|| typeFile == 'rar'
				|| typeFile == 'pdf'
				|| typeFile == 'ppt')
			{
				
			}else{
				app.myApp.alert('选择文件类型不符合上传');
				return;
			}
			fileNames.push(str123);
			srcName.push(oFRevent.target.result);
			wordUpload(oFRevent.target.result, str123);
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
			//获取随机数
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
					app.myApp.toast('删除成功', 'success').show(true);
				});
			});
	}
	
	
	}
	/*
	 * 提交三会一课记录
	 */
	function subitRecord(){
			//获取开会日期
			if($$('#assessTs').val() == ''){
				app.myApp.alert('请输入开会日期');
				return false;
			};
			//获取开会时间
			if($$('#assessTsTime').val() == ''){
				app.myApp.alert('请输入开会时间');
				return false;
			};
//			//获取地点
//			$$('#location').val();
			if($$('#location').val() == ''){
				app.myApp.alert('请输入地点');
				return false;
			};
//			//获取主持人
//			$$('#host').val();
			if($$('#host').val() == ''){
				app.myApp.alert('请选择持人');
				return false;
			};
//			//获取出席人
//			$$('#listeds').val();
			if($$('#listeds').val() == ''){
				app.myApp.alert('请选择出席人');
				return false;
			};
//			//获取缺席人
//			$$('#absentees').val();
//			//获取会议主题
//			$$('#assessTitle').val();
			if($$('#assessTitle').val() == ''){
				app.myApp.alert('请输入会议主题');
				return false;
			};
//			//获取会议记录
//			$$('#meetingRecord').val();
			if($$('#meetingRecord').val() == ''){
				app.myApp.alert('请输入会议记录');
				return false;
			};
//			//获取要点摘录及内容
//			$$('#content').val();
//			//获取会议决议
//			$$('#meetingDecision').val();
//			//获取不同意见
//			$$('#differentViews').val();
			//absenteesList = absenteesList.join();
//			listedList = listedList.join();
//			hostMan = hostMan.join();

			/*var attendeesListPush = [];
			$.each(listAttendees, function(index,item) {
				attendeesListPush.push(item.userId);
			});
			attendeesListPush = attendeesListPush.join();*/
			
			var hostManPush = [];
			console.log(hostMan);
			$.each(hostMan, function(index,item) {
				hostManPush.push(item.userName);
			});
			hostManPush = hostManPush.join();
			console.log(hostManPush);
			var listedListPush = [];

			console.log(listedList);
			$.each(listedList, function(index,item) {
				listedListPush.push(item.userName);
			});
			listedListPush = listedListPush.join();
			console.log(listedListPush);
			var absenteesListPush = [];

			console.log(absenteesList);
			$.each(absenteesList, function(index,item) {
				absenteesListPush.push(item.userName);
			});
			absenteesListPush = absenteesListPush.join();
			console.log(absenteesListPush);
			var formDatas={
				topicId:topicId,
				object:$$('#assessTitle').val(),
				meetingTime:$$('#assessTs').val() + " " + $$('#assessTsTime').val() + ":00",
				reportContext:$$('#meetingRecord').val(),
				reportUserId:app.userId,
				lat:lat,
				lng:lng,
				meetingAddress:$$('#location').val(),
				summary:$$('#content').val(),
				resolution:$$('#meetingDecision').val(),
				different:$$('#differentViews').val(),
				host:hostManPush,
				participantIds:$$('#attendees').val(),
				absents:absenteesListPush,
				attends:listedListPush,
				images : imageList,
				file: fileList,
				
			}
			var parems = JSON.stringify(formDatas)
			$$.ajax({
				url:threeMeetingAndOneClassAddPath,
				method:'POST',
				dataType:'json',
				contentType:'application/json;charset:utf-8;',
				data:parems,
				cache:false,
				success: function(data){
					
					app.myApp.toast('保存成功', 'success').show(true);
					$$('.sumbit').html('已保存');
					require(['js/pages/assessment/threeMeetingsAndOneClass'], function(threeMeetingsAndOneClass) {
						threeMeetingsAndOneClass.refreshThreeMeetingsAndOneClassPaper();
					});
					require(['js/pages/appList/appList'], function(appList) {
						appList.reSetshykReadRows();
					});
					app.myApp.getCurrentView().back();
				},
				error:function(){
					app.myApp.alert(app.utils.callbackAjaxError());
				}
			})
			
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
						uploadReportDetialPhoto(base64Data);
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
				app.myApp.hidePreloader();
				ft.upload(photo, uri, function(r) {
					var data = JSON.parse(r.response);
					// sum++;
					
					if(data.code == 0) {
						var result = data.data;
						params.ext = result.ext;
						params.name = result.name;
						params.filePath = result.filePath;
						params.length = result.length;
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
			// app.myApp.toast("保存成功！", 'success').show(true);
			// $$('.sumbit').html('已保存');
			// app.myApp.hidePreloader();
			// require(['js/pages/assessment/threeMeetingsAndOneClass'], function(threeMeetingsAndOneClass) {
			// 	threeMeetingsAndOneClass.refreshThreeMeetingsAndOneClassPaper();
			// });
			// require(['js/pages/appList/appList'], function(appList) {
			// 	appList.reSetshykReadRows();
			// });
			// app.myApp.getCurrentView().back();
	}
	
	/*
	 * 文档上传
	 */
	function wordUpload(srcNameData,Names) {
			app.myApp.showPreloader('文档保存中...');
			var ft1 = new FileTransfer();
				var uri1 = encodeURI(uploadWorkFilePath);
				var options1 = new FileUploadOptions();
				options1.fileKey = "file";
				options1.fileName = Names;
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
				options1.headers = {
					'Authorization': "bearer " + app.access_token
				}
				var params = {
					"ext": "",
					"filePath": "",
					"length": 0,
					"name": 0,
					
				}
				// options1.params = params;
				
				ft1.upload(srcNameData, uri1, function(r) {
					app.myApp.hidePreloader();
					var data = JSON.parse(r.response);				
					if(data.code == 0) {
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
					app.myApp.alert(app.utils.callbackAjaxError());
					return;
				}, options1);
			app.myApp.hidePreloader();
			// app.myApp.toast("保存成功！", 'success').show(true);
			// require(['js/pages/assessment/threeMeetingsAndOneClass'], function(threeMeetingsAndOneClass) {
			// 	threeMeetingsAndOneClass.refreshThreeMeetingsAndOneClassPaper();
			// });
			// require(['js/pages/appList/appList'], function(appList) {
			// 	appList.reSetshykReadRows();
			// });
			// app.myApp.getCurrentView().back();
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
	
	//初始化时间
	function addPickerTime(contentID) {
		var today = new Date();
		var pickerTime = app.myApp.picker({
		    input: '#' + contentID,
		    rotateEffect: true,
		    toolbarCloseText: "完成",
		    value: [(today.getHours() < 10 ? '0' + today.getHours() : today.getHours()), (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())],
		    formatValue: function (p, values, displayValues) {
		        return values[0] + ':' + values[1];
		    },
		    cols: [
		        {
		            textAlign: 'left',
		            values: (function () {
				                var arr = [];
				                for (var i = 0; i <= 23; i++) { 
				                	arr.push(i < 10 ? '0' + i : i);
			                	}
				                return arr;
				            })(),
		        },
		        {
		            divider: true,
		            content: ':'
		        },
		        {
		            values: (function () {
				                var arr = [];
				                for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
				                return arr;
				            })(),
		        }
		    ]
		});
	}
	/**
	 * 选择列席人页面回调 
	 * @param {Object} content
	 */
	function addAttendeesBack(content){
		listAttendees = content;
		if(listAttendees.length > 0) {
			var attendeesStr = '';
			$.each(listAttendees, function(index,item) {
				if(index != (listAttendees.length-1)){
					attendeesStr +=  item.userName + '，';
				}else{
					attendeesStr +=  item.userName;
				}
			});
			$$('#attendees').val(attendeesStr);
		}else{
			$$('#attendees').val("");
		}
		
	}
	/**
	 * 跳转移除接收方
	 * @param {Object}
	 */
	function attendeesRemove() {
		var myPopup = app.myApp.popup(
			'<div class="popup">' +
			'<div class="navbar">' +
			'<div class="navbar-inner">' +
			'<div class="left close-popup"><a href="#" class="link icon-only"><i class="icon icon-eback"></i></a></div>' +
			'<div class="center">列席人列表</div>' +
			'<div class="right"></div>' +
			'</div>' +
			'</div>' +
			'<div class="page-content">' +
			'<div class="deptBtnRow removeBtnRow">' +
			'<p style="margin: 0 10px;"><a href="#" class="button button-fill allChoose">全选/反选</a></p>' +
			'<p style="margin: 0 10px;"><a href="#" class="button button-fill color-red rmAttendees">移除</a></p>' +
			'</div>' +
			'<div class="list-block removeAttendeesList searchbar-found" style="margin: 0;">' +
			'<ul>' +
			'</ul>' +
			'</div>' +
			'</div>' +
			'</div>'
		);
		$$('.removeAttendeesList ul').append(recordRmLeaderTemplate(listAttendees));
		//全选反选
		$$('.removeBtnRow .allChoose').on('click', function() {
			$$.each($$('.removeAttendeesList').find('input[name="payBox"]'), function(index, item) {
				if(!$$(item)[0].checked) {
					$$(item)[0].checked = true;
				} else {
					$$(item)[0].checked = false;
				}
			});
		});
		//移除
		$$('.removeBtnRow .rmAttendees').on('click', function() {
			var search = $$('.removeAttendeesList').find('input[name="payBox"]:checked');
			if(search.length == 0) {
				app.myApp.alert('请选择用户或单位');
			} else {
				for(var i = search.length - 1; i >= 0; i--) {
					var id = $$(search[i]).val();
					for(var j = listAttendees.length - 1; j >= 0; j--) {
						if(id == listAttendees[j].userId) {
							listAttendees.splice(j, 1);
						}
					}
				}
				app.myApp.closeModal(myPopup);
				addAttendeesBack(listAttendees);
			}
		});
	}
	/**
	 * 选择出席人页面回调 
	 * @param {Object} content 用户列表
	 */
	function addLeaderBack(content) {
		console.log(content);
		listedList = content;
		if(listedList.length > 0) {
				var listeders = '';
				$.each(listedList, function(index,item) {
					if(index != (listedList.length-1)){
						listeders +=  item.userName + '，';
					}else{
						listeders +=  item.userName;
					}
				});
				$$('#listeds').val(listeders);
		}else{
				$$('#listeds').val("");
				if($$('.listedsIcon').hasClass('icon-closeIcon')){
					$$('.listedsIcon').removeClass('icon-closeIcon');
					$$('.listedsIcon').addClass('icon-openIcon');
				}
				$('#listeds').animate({height:"40px"},200);
				
		}
//		getAbsenteesBack();
	}
	/**
	 * 选择出席人的信息显示回调
	 */
	function addContentBack() {
		if(listedList.length > 0) {
				$$('#listeds').val("已选择");
		}else{
			$$('#listeds').val("");
		}
	}
	/**
	 * 跳转移除接收方
	 * @param {Object}
	 */
	function recordRemove() {
		var myPopup = app.myApp.popup(
			'<div class="popup">' +
			'<div class="navbar">' +
			'<div class="navbar-inner">' +
			'<div class="left close-popup"><a href="#" class="link icon-only"><i class="icon icon-eback"></i></a></div>' +
			'<div class="center">接收方列表</div>' +
			'<div class="right"></div>' +
			'</div>' +
			'</div>' +
			'<div class="page-content">' +
			'<div class="deptBtnRow removeBtnRow">' +
			'<p style="margin: 0 10px;"><a href="#" class="button button-fill allChoose">全选/反选</a></p>' +
			'<p style="margin: 0 10px;"><a href="#" class="button button-fill color-red rmLeader">移除</a></p>' +
			'</div>' +
			'<div class="list-block removeLeaderList searchbar-found" style="margin: 0;">' +
			'<ul>' +
			'</ul>' +
			'</div>' +
			'</div>' +
			'</div>'
		);
		$$('.removeLeaderList ul').append(recordRmLeaderTemplate(listedList));
		//全选反选
		$$('.removeBtnRow .allChoose').on('click', function() {
			$$.each($$('.removeLeaderList').find('input[name="payBox"]'), function(index, item) {
				if(!$$(item)[0].checked) {
					$$(item)[0].checked = true;
				} else {
					$$(item)[0].checked = false;
				}
			});
		});
		//移除
		$$('.removeBtnRow .rmLeader').on('click', function() {
			var search = $$('.removeLeaderList').find('input[name="payBox"]:checked');
			if(search.length == 0) {
				app.myApp.alert('请选择用户或单位');
			} else {
				for(var i = search.length - 1; i >= 0; i--) {
					var id = $$(search[i]).val();
					for(var j = listedList.length - 1; j >= 0; j--) {
						if(id == listedList[j].userId) {
							listedList.splice(j, 1);
						}
					}
				}
				app.myApp.closeModal(myPopup);
				addLeaderBack(listedList);
			}
		});
	}
	/**
	 * 选择主持人页面回调 
	 * @param {Object} host 用户列表
	 */
	function addHostBack(hostInfo) {
		hostMan = hostInfo;
		addHostInfoBack();
	}
	/**
	 * 选择主持人的信息显示回调
	 */
	function addHostInfoBack() {
		console.log(hostMan);
		if(hostMan.length > 0) {
				$$('#host').val(hostMan[0].userName);
		}else{
			$$('#host').val("");
		}
//		getAbsenteesBack();
	}
	
	/**
	 * 选择缺席人页面回调 
	 * @param {Object} content 用户列表
	 */
	function addAbsenteesBack(content) {
		console.log(content);
		absenteesList = content;
		if(absenteesList.length > 0) {
				var absentees = '';
				$.each(absenteesList, function(index,item) {
					if(index != (absenteesList.length-1)){
						absentees +=  item.userName + '，';
					}else{
						absentees +=  item.userName;
					}
				});
				$$('#absentees').val(absentees);
		}else{
				$$('#absentees').val("");
				if($$('.absenteesIcon').hasClass('icon-closeIcon')){
					$$('.absenteesIcon').removeClass('icon-closeIcon');
					$$('.absenteesIcon').addClass('icon-openIcon');
				}
				$('#absentees').animate({height:"40px"},200);
				
		}
	}
	
	/**
	 * 跳转移除接收方
	 * @param {Object}
	 */
	function absenteesRemove() {
		var myPopup = app.myApp.popup(
			'<div class="popup">' +
			'<div class="navbar">' +
			'<div class="navbar-inner">' +
			'<div class="left close-popup"><a href="#" class="link icon-only"><i class="icon icon-eback"></i></a></div>' +
			'<div class="center">缺席人列表</div>' +
			'<div class="right"></div>' +
			'</div>' +
			'</div>' +
			'<div class="page-content">' +
			'<div class="deptBtnRow removeBtnRow">' +
			'<p style="margin: 0 10px;"><a href="#" class="button button-fill allChoose">全选/反选</a></p>' +
			'<p style="margin: 0 10px;"><a href="#" class="button button-fill color-red rmAbsentees">移除</a></p>' +
			'</div>' +
			'<div class="list-block removeAbsenteesList searchbar-found" style="margin: 0;">' +
			'<ul>' +
			'</ul>' +
			'</div>' +
			'</div>' +
			'</div>'
		);
		$$('.removeAbsenteesList ul').append(recordRmLeaderTemplate(absenteesList));
		//全选反选
		$$('.removeBtnRow .allChoose').on('click', function() {
			$$.each($$('.removeAbsenteesList').find('input[name="payBox"]'), function(index, item) {
				if(!$$(item)[0].checked) {
					$$(item)[0].checked = true;
				} else {
					$$(item)[0].checked = false;
				}
			});
		});
		//移除
		$$('.removeBtnRow .rmAbsentees').on('click', function() {
			var search = $$('.removeAbsenteesList').find('input[name="payBox"]:checked');
			if(search.length == 0) {
				app.myApp.alert('请选择用户或单位');
			} else {
				for(var i = search.length - 1; i >= 0; i--) {
					var id = $$(search[i]).val();
					for(var j = absenteesList.length - 1; j >= 0; j--) {
						if(id == absenteesList[j].userId) {
							absenteesList.splice(j, 1);
						}
					}
				}
				app.myApp.closeModal(myPopup);
				addAbsenteesBack(absenteesList);
			}
		});
	}
	
	// function getAbsenteesBack(){
	// 	getAddIds = [];
	// 	$.each(listedList, function(index,item) {
	// 		getAddIds.push(item.userId);
	// 	});
	// 	if(hostMan.length > 0){
	// 		getAddIds.push(hostMan[0].userId);
	// 	}
	// 	getAddIds = getAddIds.join();
	// 	app.ajaxLoadPageContent1(getAbsenteesPath,{
	// 		deptId:app.user.deptId,
	// 		userIds:getAddIds,
	// 	},function(data){
	// 		console.log(data);
	// 		var result = data.data;
	// 		console.log(getAddIds == '');
	// 		console.log(getAddIds);
	// 		absenteesList = [];
	// 		if(getAddIds == '' && result.length > 0){
	// 				$$('#absentees').val("");
	// 				if($$('.absenteesIcon').hasClass('icon-closeIcon')){
	// 					$$('.absenteesIcon').removeClass('icon-closeIcon');
	// 					$$('.absenteesIcon').addClass('icon-openIcon');
	// 				}
	// 				$('#absentees').animate({height:"40px"},200);
	// 		}else if(result.length > 0) {
	// 			var absenteesers = '';
	// 			$.each(result, function(index,item) {
	// 				if(index != (result.length-1)){
	// 					absenteesers +=  item.userName + '，';
	// 				}else{
	// 					absenteesers +=  item.userName;
	// 				}
	// 				absenteesList.push(item.id);
	// 			});
	// 			$$('#absentees').val(absenteesers);
	// 		}else if(result.length == 0){
	// 			$$('#absentees').val("");
	// 		}
	// 	});
	// }
	/**
	 * 定位 
	 */
	function getPosition() {
		app.myApp.showPreloader('定位中...');
		//开启定位服务
		if(navigator.geolocation) {
			signStatus = 1;
			navigator.geolocation.getCurrentPosition(onSuccessPosition, onErrorPosition, {
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
	}

	function renderReverse(response) {
		if(response.status) {
			
		} else {
			var userPosition = response.result.addressComponent.street + response.result.addressComponent.street_number;
			$$('#location').val(userPosition);
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
		addLeaderBack:addLeaderBack,
		addHostBack:addHostBack,
		resetFirstIn: resetFirstIn,
		addAttendeesBack:addAttendeesBack,
		addAbsenteesBack:addAbsenteesBack
	}
});