define(['app',
	'hbs!js/hbs/recordRmLeader',
	'hbs!js/hbs/addDept'
], function(app, recordRmLeaderTemplate, addDeptTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//保存工作日志
	var saveRecordPath = app.basePath + '/mobile/worklog/';
	//上传附件
	var uploadRecordPhotoPath = app.basePath + '/file/upload';
	//删除工作日志或微动态附件
	// var removeRecordPhotoPath = app.basePath + '/mobile/worklog/image/';
	//读取日志类型
	var loadDictPath = app.basePath + '/mobile/worklog/types';
	var photoBrowserPhotos = [];
	var photoDatas = [];
	var photoBrowserPopup = '';
	var leaderList = [];
	var deptList = [];
	var userPosition = '';
	var lat = 0.0;
	var lng = 0.0;
	var chooseLogType = 0;
	var count = 0;
	var imageList = [];
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		//阻止滑动返回
		//设置页面不能滑动返回
		page.view.params.swipeBackPage = false;
		app.myApp.onPageBack("record/recordNew", function(page){
			page.view.params.swipeBackPage = true;
		});
		
//		app.pageStorageClear('record/recordNew', [
//			'record/recordAddDept',
//			'record/recordAddLeader',
//		]);
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		count = 0;
		//app.back2Home();
		addContentBack();
		clickEvent(page);
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
		leaderList = [];
		deptList = [];
		userPosition = '';
		lat = 0.0;
		lng = 0.0;
		chooseLogType = 1;
		loadDict();
		imageList = [];
		//		getPosition();
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		handleDict(pageDataStorage['dict']);
		showPhotos(pageDataStorage['recordContent'].photos);
		$$('#recordTitle').val(pageDataStorage['recordContent'].recordTitle);
		$$('#recordContent').val(pageDataStorage['recordContent'].recordContent);
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('#recordTs').val(app.utils.getCurTimeWithDay());
		$$('.weui_uploader_input_wrp').on('click', showImgPicker);
		$$('.saveRecord').on('click', saveRecord);
		$$('.addLeader').on('click', leaderPicker);
		$$('.removeLeader').on('click', removePicker);
		
		$$('.recordNewBack').on('click',function(){
			app.myApp.confirm('您的工作日志尚未上传，是否退出？', function() {
				app.myApp.getCurrentView().back();
			});
		});
		$$('.recordNewHome').on('click',function(){
			app.myApp.confirm('您的日志尚未上传，是否返回首页？', function() {
				app.back3Home();
			});
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
								// alert(picURLList);
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
	 * 保存工作日志 
	 */
	function saveRecord() {
		var recordTitle = $$('#recordTitle').val();
		var recordType = $$('#recordType').val();
		var recordSend = [];
		var recordDeptSend = [];
		$$.each(leaderList, function(index, item) {
			recordSend.push(item.userId);
		});
		$$.each(deptList, function(index, item) {
			//push()数组中添加新元素
			recordDeptSend.push(item.deptId);
		});
		// 数组变成字符串
		recordSend = recordSend.join();
		recordDeptSend = recordDeptSend.join();
		var recordContent = $$('#recordContent').val();
		recordContent = recordContent.replace(/\r\n/g,"<br/>");
		recordContent = recordContent.replace(/\n/g,"<br/>");
		recordContent = recordContent.replace(/\s/g, ' ');
		if(!recordTitle || !recordType || !recordContent) {
			app.myApp.alert('请补全日志信息！');
			return;
		}
		// 防止数据传输过慢多次上传
		// if(photoDatas== '' && photoDatas.length == 0) {
		// 	app.myApp.alert('请上传照片');
		// 	return;
		// }
		count = count + 1;
		if(count > 0){
			$$('.saveRecord').attr('disabled',false);
		}
		
		//新增过程中提示用户上传图片
		// app.myApp.showPreloader('信息保存中...');
		// userIds, 用逗号隔开
		// if(imageList){
		// 	alert(imageList[0].attName);
		// }
		
		// Alert(imageList[0].fileName);
		var params={
			userId: app.userId,
			logTitle: recordTitle,
			logTypeId: recordType,
			// recordSend: recordSend,
			userIds: recordSend,
			// recordDeptSend: recordDeptSend,
			deptIds: recordDeptSend,
			logContent: recordContent,
			tenantId: app.user.tenantId,
			images : imageList,
			name : app.user.nickName
		}
		
		console.log(params)
		var formDatas= JSON.stringify(params)
		$$.ajax({
            url:saveRecordPath + recordType + '/'+'save',
            method: 'POST',
            dataType: 'json',
			contentType: 'application/json;charset:utf-8',
			data: formDatas,
			catch: true,
            success:function (data) {
				// app.myApp.hidePreloader();
				// var data = data.data;
				// console.log(data)
					if(data.code == 0){

						console.log('保存成功');
						app.myApp.toast('保存成功', 'success').show(true);
						setTimeout(function() {
							require(['js/pages/record/record'], function(record) {
								record.loadRecord(false);
							});
						}, 1000);
						app.myApp.getCurrentView().back();
					}else{
						app.myApp.toast('保存失败', 'error').show(true);
					}
            	
            },
            error:function () {
               
            }
        });
        
	}

	/**
	 *  上传图片
	 * @param {Object} photoDatas 相片数组
	 * @param {Object} detailID  工作日志ID
	 */
	function uploadRecordPhoto(photo) {
		// app.myApp.showPreloader('图片保存中...');
		// var sum = 0;
		var ft = new FileTransfer();
			var uri = encodeURI(uploadRecordPhotoPath);
			// alert(uri);
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
			// app.myApp.hidePreloader();
			// alert('photo'+ photo );
			// options.params = params;
			ft.upload(photo, uri, function(r) {
				var data = JSON.parse(r.response);
 
				
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
	 * 删除图片
	 * @param {Object} photoDatas 相片数组
	 * @param {Object} detailID  工作日志ID
	 */
	function removeRecordPhoto(photo) {
		
	}

	/**
	 * 选择接收方
	 */
	function leaderPicker() {
		var buttons1 = [{
			text: '选择类型',
			label: true
		}, {
			text: '选择人员',
			bold: true,
			onClick: recordAddLeader,
		}, {
			text: '选择单位',
			onClick: recordAddDept,
		}];
		var buttons2 = [{
			text: '取消',
			color: 'red'
		}];
		var groups = [buttons1, buttons2];
		app.myApp.actions(groups);
	}

	/**
	 *  跳转选择接收方
	 */
	function recordAddLeader() {
		pageDataStorage['recordContent'] = {
			photos: photoBrowserPhotos,
			recordTitle: $$('#recordTitle').val(),
			recordContent: $$('#recordContent').val()
		};
		var deptType = $$('#recordType').val();
		console.log(JSON.stringify(leaderList));
		console.log(deptType);
		app.myApp.getCurrentView().loadPage('recordAddLeader.html?leaderList=' + JSON.stringify(leaderList) + '&deptType=' + deptType);
	}

	/**
	 * 跳转选择发送到的单位 
	 */
	function recordAddDept() {
		pageDataStorage['recordContent'] = {
			photos: photoBrowserPhotos,
			recordTitle: $$('#recordTitle').val(),
			recordContent: $$('#recordContent').val()
		};
		var deptType = $$('#recordType').val();
		console.log(JSON.stringify(deptList));
		console.log(deptType);
		app.myApp.getCurrentView().loadPage('recordAddDept.html?deptList=' + JSON.stringify(deptList) + '&deptType=' + deptType);
	}

	/**
	 * 选择移除类型 
	 */
	function removePicker() {
		var buttons1 = [{
			text: '选择类型',
			label: true
		}, {
			text: '移除人员',
			bold: true,
			onClick: function() {
				recordRemove('leader');
			},
		}, {
			text: '移除单位',
			onClick: function() {
				recordRemove('dept');
			},
		}];
		var buttons2 = [{
			text: '取消',
			color: 'red'
		}];
		var groups = [buttons1, buttons2];
		app.myApp.actions(groups);
	}

	/**
	 * 跳转移除接收方
	 * @param {Object} chooseType choose a type of remove: 'dept' or 'leader' 
	 */
	function recordRemove(chooseType) {
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
		if(chooseType == 'dept') {
			console.log(deptList)
			$$('.removeLeaderList ul').append(addDeptTemplate(deptList));
		} else {
			console.log(leaderList)
			$$('.removeLeaderList ul').append(recordRmLeaderTemplate(leaderList));
		}
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
				if(chooseType == 'dept') {
					for(var i = search.length - 1; i >= 0; i--) {
						var id = $$(search[i]).val();
						for(var j = deptList.length - 1; j >= 0; j--) {
							if(id == deptList[j].deptId) {
								deptList.splice(j, 1);
							}
						}
					}
				} else {
					for(var i = search.length - 1; i >= 0; i--) {
						var id = $$(search[i]).val();
						for(var j = leaderList.length - 1; j >= 0; j--) {
							if(id == leaderList[j].userId) {
								leaderList.splice(j, 1);
							}
						}
					}
				}
				app.myApp.closeModal(myPopup);
				addContentBack();
			}
		});
	}

	/**
	 *  查看日志类型
	 */
	function loadDict() {
		app.ajaxLoadPageContent(loadDictPath, {
			// dictCode: 'RZLX',
		}, function(result) {
			var data = result.data;
			console.log('查看日志类型');
			console.log(data);
			pageDataStorage['dict'] = data;
			handleDict(data);
		});
	}

	/**
	 *  加载日志类型
	 */
	function handleDict(data) {
		$$.each(data, function(index, item) {
			var selected = '';
			var indexnum=parseInt(index)
			if(chooseLogType == indexnum) {
				selected = 'selected';
			}
			console.log(item);
			$("#recordType").append("<option value='" + indexnum + "'" + selected + ">" + item + "</option>");
		});
		$$('#recordType').change(function() {
			var typeVal = $$('#recordType').val();
			if(chooseLogType != typeVal) {
				chooseLogType = typeVal;
				$$('#recordSend').val("");
				deptList = [];
				leaderList = [];
				app.myApp.alert('温馨提示<br />更换"日志类型"，会清空"接收方"内容');
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
					// alert('base64'+ base64Data);
					photoDatas.push(base64Data);
					uploadRecordPhoto(base64Data);
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
	 * 选择发送到的用户页面回调 
	 * @param {Object} content 用户列表
	 */
	function addLeaderBack(content) {
		leaderList = content;
		addContentBack();
	}

	/**
	 * 选择发送到的单位页面回调 
	 * @param {Object} content 单位
	 */
	function addDeptBack(content) {
		deptList = content;
		console.log(deptList);
		addContentBack();
	}

	/**
	 * 选择发送到的信息显示回调
	 */
	function addContentBack() {
		if(leaderList.length > 0) {
			if(deptList.length > 0) {
				$$('#recordSend').val("已选择'人员', '单位'");
			} else {
				$$('#recordSend').val("已选择'人员'");
			}
		} else {
			if(deptList.length > 0) {
				$$('#recordSend').val("已选择'单位'");
			} else {
				$$('#recordSend').val("");
			}
		}
	}

	/**
	 * 定位
	 */
	function getPosition() {
		//开启定位服务
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(onSuccessPosition, null, {
				timeout: 2000
			});
		}
	}

	/**
	 * 定位成功回调 
	 * @param {Object} position
	 */
	function onSuccessPosition(position) {
		var _lng = position.coords.longitude;
		var _lat = position.coords.latitude;
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

	/**
	 * 处理地址信息 
	 * @param {Object} response
	 */
	function renderReverse(response) {
		if(response.status) {
			//			app.myApp.toast('自动获取地址失败!', 'error').show(true);
		} else {
			userPosition = response.result.addressComponent.street + response.result.addressComponent.street_number;
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
		addLeaderBack: addLeaderBack,
		addDeptBack: addDeptBack,
		resetFirstIn: resetFirstIn,
	}
});