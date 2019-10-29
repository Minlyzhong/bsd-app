define(['app',
	'hbs!js/hbs/firstSecretaryDaily'
], function(app, vilDailyTemplate) {
	var $$ = Dom7;
	var pageNo = 1;
	var pageNo1 = 1;
	var loading = true;
	var loading1 = true;
	//最新日志分页列表
	var findLatestWorkLogPath = app.basePath + 'extWorkLog/findLatestWorkLog';
	//添加微动态
	var addRecord = app.basePath + 'extWorkLog/saveLog';
	//上传附件
	var uploadRecordPhotoPath = app.basePath + 'upload/uploadWorkLogPhoto';
	//日志内容输入最小字数 url:
	var findLogMinLenPath = app.basePath + 'sysEnums/findLogMinLen';
	var photoBrowserPhotos = [];
	var photoDatas = [];
	var photoBrowserPopup = '';
	var signStatus = 0;
	var count = 0;
	var pageDataStorage = {}; 
	
	var NewRecordKey = '';
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		NewRecordKey = '';
		count = 0;
		initData(page.query);
		app.back2Home();
		attrDefine(page);
		clickEvent(page);
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
		pageNo1 = 1;
		loading1 = true;
		loadRecord(false,pageNo);
		//字数
		app.ajaxLoadPageContent(findLogMinLenPath, {
			
		}, function(result) {
			pageDataStorage['minLen'] = result.minLen
			$$('#publicContent').attr('placeholder','这一刻你想说什么（不少于'+pageDataStorage['minLen']+'字!）');
		});
		
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.pageTitle').html(page.query.appName);	
	}

	
	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		//$$('.checkUpdate').on('click', checkUpdate);
		//showPhotos(pageDataStorage['recordContent'].photos);
		$$('.publicRecord').on('click',publibMove);
		$$('.weui_uploader_input_wrp').on('click', showImgPicker);
		$$('.saveRecord').on('click',publicR);
		$$('.gps').on('click', getPosition);
		
		$$('#ShowNewRecordSearch').on('focus',searchRecord);
		$$('.ShowNewRecordSearchBar .searchCancelBtn').on('click', hideSearchList);
		$$('#ShowNewRecordSearch').on('keyup', keyupContent);
	}
	
	function searchRecord(){
		pageNo1 = 1;
		loading1 = true;
		NewRecordKey='';
		$$(this).css('text-align', 'left');
		$$('.firstShowPeopleList ul').html('');
		$$('.firstPeopleNotFound').css('display', 'none');
		$$('.ShowNewRecordSearchBar .searchCancelBtn').css('display', 'block');
		$$('.infinite-scroll.searchRecord').css('display', 'block');
		$$('.infinite-scroll.contentRecord').css('display', 'none');
	}
	function hideSearchList(){
		pageNo1 = 1;
		loading1 = true;
		NewRecordKey='';
		$$('#ShowNewRecordSearch').val('');
		$$('.firstPeopleNotFound').css('display', 'none');
		$$('.firstShowPeopleList ul').html('');
		$$('#ShowNewRecordSearch').css('text-align', 'center');
		$$('.ShowNewRecordSearchBar .searchCancelBtn').css('display', 'none');
		$$('.infinite-scroll.searchRecord').css('display', 'none');
		$$('.infinite-scroll.contentRecord').css('display', 'block');
	}
	function keyupContent(){
		$$('.firstShowPeopleList ul').html('');
		NewRecordKey = $$('#ShowNewRecordSearch').val();
		console.log(NewRecordKey);
		if(!NewRecordKey) {
			return;
		}
		loadRecord1(false,pageNo1);
	}
	/**
	 *页面跳转 
	 */
	function publibMove(){
		app.myApp.getCurrentView().loadPage('publicRecord.html');
	}
	
	/**
	 *动态发布 
	 */
	function publicR(){
		var publicTitle = $$('#publicTitle').val();
//		var publicType = $$('#publicType').val();
		var publicContent = $$('#publicContent').val();
		var publicGPS = $$('#publicGPS').val();
//		app.myApp,alert(publicGPS);
		
		if(!publicTitle || !publicContent) {
			app.myApp.alert('请补全日志信息！');
			return;
		}
		if(publicContent.length < pageDataStorage['minLen']){
			app.myApp.alert('内容不少于'+pageDataStorage['minLen']+'字！');
			return;
		}
		//防止数据传输过慢多次上传
		count = count + 1;
		if(count > 0){
			$$('.saveRecord').attr('disabled',false);
		}
		app.myApp.showPreloader('信息保存中...');
		app.ajaxLoadPageContent(addRecord, {
			userId : app.user.id,
			recordTitle : publicTitle,
			//3表示是微动态
			recordType	: 3,
			recordContent : publicContent,
			logTime : app.utils.getCurTime(),
			address : publicGPS
		}, function(result) {
			//result[0]拿第一条
			var data = result[0];
			console.log(result);
			console.log(data);
			var detailID = data.id;
			//hidePreloader()是关闭showPreloader()
			//app.myApp.hidePreloader();
			if(detailID) {
				if(photoDatas && photoDatas.length > 0) {
					//添加成功后返回detailID再去保存photoDatas
					uploadRecordPhoto(photoDatas, detailID);
				} else {
					app.myApp.toast('保存成功', 'success').show(true);
					app.myApp.hidePreloader();
					app.myApp.getCurrentView().back();
					refresh();
				}
			}
		});
		
	}
	
	/**
	 *	刷新 
	 */
	function refresh(){
		setTimeout(function() {
			pageNo = 1;
			loading = true;
			//这里写请求
			loadRecord(false,pageNo);
			app.myApp.pullToRefreshDone();
		}, 1000);
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
	 *  上传图片
	 * @param {Object} photoDatas 相片数组
	 * @param {Object} detailID  工作日志ID
	 */
	function uploadRecordPhoto(photoDatas, detailID) {
		app.myApp.showPreloader('图片保存中...');
		var sum = 0;
		var ft = new FileTransfer();
		$$.each(photoDatas, function(index, item) {
			var uri = encodeURI(uploadRecordPhotoPath);
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
				app.myApp.alert(data.success);
				sum++;
				if(data.success === true) {
					if(sum == photoDatas.length) {
						
					}
				} else {
					ft.abort();
					app.myApp.alert(app.utils.callbackAjaxError());
					return;
				}
			}, function(error) {
				ft.abort();
				app.myApp.alert(app.utils.callbackAjaxError());
				return;
			}, options);
		});
		app.myApp.hidePreloader();
		app.myApp.toast("保存成功！", 'success').show(true);
		app.myApp.getCurrentView().back();
//		setTimeout(function() {
//			loadRecord(false,pageNo);
//		}, 1000);
		refresh();
	}
	/**
	 * 定位 
	 */
	function getPosition() {
		app.myApp.showPreloader('定位中...');
		//开启定位服务
		if(navigator.geolocation) {
			signStatus = 1;
			navigator.geolocation.getCurrentPosition(onSuccessPosition, onErrorPosition, {
//				timeout: 2000
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
			app.myApp.showPreloader('定位中...');
			if(e.code == '3'){
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
//		app.myApp.hidePreloader();
	}

	function renderReverse(response) {
		if(response.status) {
			
		} else {
			var userPosition = response.result.addressComponent.street + response.result.addressComponent.street_number;
			$$('#publicGPS').val(userPosition);
		}
	}	
	
	
	
	
	
	/**
	 * 异步请求页面数据 
	 */
	function loadRecord(isLoadMore,pageNo) {
//		console.log(app.user.id);
//		console.log(app.userId);
		//清空photoDatas
		photoDatas = [];
		console.log(pageNo);
		console.log(NewRecordKey);
		app.ajaxLoadPageContent(findLatestWorkLogPath, {
			userId: app.user.userId,
			pageNo: pageNo,
//			query: NewRecordKey,
		}, function(result) {
			var data = result.data;
			$$.each(data, function(index, item) {
				if(item.logPic) {
					item.logPic = app.basePath + item.logPic;
				} else {
					item.logPic = "img/icon/icon-imgBg.png";
				}
			});
			console.log(data);
			handleRecord(data, isLoadMore);			
		});
	}
	function loadRecord1(isLoadMore,pageNo1) {
//		console.log(app.user.id);
//		console.log(app.userId);
		//清空photoDatas
		photoDatas = [];
		console.log(pageNo);
		console.log(NewRecordKey);
		app.ajaxLoadPageContent(findLatestWorkLogPath, {
			userId: app.user.userId,
			pageNo: pageNo1,
			query: NewRecordKey,
		}, function(result) {
			var data = result.data;
			$$.each(data, function(index, item) {
				if(item.logPic) {
					item.logPic = app.basePath + item.logPic;
				} else {
					item.logPic = "img/icon/icon-imgBg.png";
				}
			});
			console.log(data);
			if(data == ''){
				$$('.firstPeopleNotFound').css('display','none');
			}
			handleSearchRecord(data, isLoadMore);	
		});
	}


	/**
	 * 加载工作日志
	 * @param {Object} data
	 */
	function handleRecord(data, isLoadMore) {
		if(data.length) {
			if(isLoadMore) {
				$$('.fsdList').append(vilDailyTemplate(data));
			} else {
				$$('.fsdList').html(vilDailyTemplate(data));
			}
			$$('.fsdList .item-content').on('click', loadRecordDetail);

			if(data.length == 10) {
				loading = false;
			}
		} else {
			if(!isLoadMore) {
				$$('.recordList').html('');
			}
		}
	}
	
	/**
	 * 加载搜索工作日志
	 * @param {Object} data
	 */
	function handleSearchRecord(data, isLoadMore) {
		if(data.length) {
			if(isLoadMore) {
				$$('.firstShowPeopleList ul').append(vilDailyTemplate(data));
			} else {
				$$('.firstShowPeopleList ul').html(vilDailyTemplate(data));
			}
			$$('.firstShowPeopleList ul .item-content').on('click', loadRecordDetail);

			if(data.length == 10) {
				loading1 = false;
			}
		} else {
			$$('.firstPeopleNotFound').css('display', 'block');
		}
	}

	/**
	 * 跳转详细页面 
	 */
	function loadRecordDetail() {
		var recordId = $$(this).data('id');
		var userId = $$(this).data('userId');
		var loadTypeId = 1;
		var state = -1;
		var reviewName = $$(this).data('userName');
		var workType = '工作日志';
//		console.log(recordId);
//		console.log(userId);
//		console.log(loadTypeId);
//		console.log(state);
//		console.log(reviewName);
//		console.log(workType);
		app.myApp.getCurrentView().loadPage('recordDetail.html?id=' + recordId + '&userId=' + userId + '&workType=' + workType + '&state=' + state + '&reviewName=' + reviewName);
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
				loadRecord(false,pageNo);
				app.myApp.pullToRefreshDone();
			}, 500);
		});

		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		loadMoreContent.on('infinite', function() {
			if(NewRecordKey==''){
				if(loading) return;
				loading = true;
				pageNo += 1;
				//这里写请求
				loadRecord(true,pageNo);
			}else{
				if(loading1) return;
				loading1 = true;
				pageNo1 += 1;
				//这里写请求
				loadRecord1(true,pageNo1);
			}
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
		refresh: refresh,
		resetFirstIn: resetFirstIn,
	}
});