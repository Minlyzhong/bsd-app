define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var photoBrowserPhotos = [];
	var photoDatas = [];
	var photoBrowserPopup = '';
	var pageDataStorage = {}; 
	var honorId;
	var hovorLever = {};
	
	//获取申报详细
	var personalHonorDetailsPath = app.basePath + '/mobile/honor/detail/';
	//删除申报
	var deleteHonorPath =  app.basePath + '/mobile/honor/';
	//获取附件
	var getPersonalHonorPath = app.basePath + '/mobile/honor/download/';
	
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		app.back2Home();;
		attrDefine(page);
		clickEvent(page);
	}
		
	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		photoBrowserPhotos = [];
		photoDatas = [];
		photoBrowserPopup = '';
		pageDataStorage = {}; 
		honorId = pageData.honorId;
		hovorLever = []
		//加载数据
		
		
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {}
	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		//点击。。。展现按钮
		$$('.honorHandle').on('click', function() {
			var clickedLink = this;
			var popoverHTML = '<div class="popover" style="width: 40%;">' +
				'<div class="popover-inner">' +
				'<div class="list-block recordPopover">' +
				'<ul>' +
				'<li class="editHonor"><a href="#" class="editHonorButton" style="color:red;"><div><i class="icon icon-edit" style="margin-right: 7%;"></i><span>修改申报</span></div></a></li>' +
				'<li class="deleteHonor"><a href="#" class="deleteHonorButton" style="color:red;"><i class="icon icon-delete2" style="margin-right: 7%;"></i>删除申报</a></li>' +
				'</ul>' +
				'</div>' +
				'</div>' +
				'</div>'
			var popover = app.myApp.popover(popoverHTML, clickedLink);
			$$('.recordPopover li a').on('click', function() {
				app.myApp.closeModal(popover);
			});
			//判断如果此日志userId不等于用户userId,则不显示删除按钮
//			if(userId == app.userId){
//				$$('.deleteHonor').css('display','block');
//				//判断是否可以修改
//				if(isRecordTime){
//					$$('.editHonor').css('display','block');
//				}
//			}else{
//				$$('.deleteHonor').css('display','none');
//			}
			//点击删除按钮
			$$('.deleteHonorButton').on('click',function(){
				app.myApp.confirm('确定要删除吗？', function() {
					deleteHonor(honorId);
				});
			});
			//点击修改日志按钮
			$$('.editHonorButton').on('click',function(){
				app.myApp.getCurrentView().loadPage('fundsEdit.html?honorId='+honorId);
			});
			
		});
	}

	
	
	/*
	 * 加载数据
	 */
	function loadHonorDetail(honorId,hovorLever){
		app.ajaxLoadPageContent(personalHonorDetailsPath+honorId, {
			// honorId:honorId,
		}, function(data) {
			var result = data.data;
			if(hovorLever){
				for(var i = 0; i< hovorLever.length;i++){
					console.log(hovorLever[i].subKey);
					console.log(result.honorLevel);
					if(result.honorLevel == hovorLever[i].subKey){
						console.log(hovorLever[i].subVal);
						result.honorLevel = hovorLever[i].subVal;
						break;
					}
				}
			}
			console.log(result.honorName);
			// console.log(result.honorLevelName);
			
			var honerTime = app.getnowdata(result.honorTime);
			$$('#honorName').val(result.honorName);
			$$('#honorTime').val(honerTime);
			$$('#grantOrganization').val(result.grantOrganization);
			$$('#honorLevel').val(result.honorLevel);
			$$('#honorDescription').val(result.honorDescription);
			$$('#honorUser').val(result.userName);
			//加载图片
			// showReadonlyPhotos(result.attList);
		});	
	}

	/*
	 * 加载数据
	 */
	function loadpic(honorId){
		app.ajaxLoadPageContent(getPersonalHonorPath+honorId, {
			// honorId:honorId,
		}, function(data) {
			var result = data.data;
			console.log(result.attPath);
			//加载图片
			showReadonlyPhotos(result);
		});	
	}
	/**
	 * 显示已读相片
	 * @param {Object} picUrlList 需要显示的图片数组
	 */
	function showReadonlyPhotos(picUrlList) {
		$$.each(picUrlList, function(index, item) {
			var item = item.attPath;
			photoBrowserPhotos.push(app.filePath + item);
			var random = app.utils.generateGUID();
			$$('.weui_uploader').append(
				'<div class="weui_uploader_bd kpiPicture">' +
				'<div class="picContainer" id="img_' + random + '">' +
				'<img src="' + app.filePath + item + '" class="picSize" />' +
				'</div>' +
				'</div>');
			$$('#img_' + random).on('click', function(e) {
				e.stopPropagation();
				var picIndex = $$(this).parent().index();
				photoBrowserPopup = app.myApp.photoBrowser({
					photos: photoBrowserPhotos,
					theme: 'dark',
					backLinkText: '关闭',
					ofText: '/',
					type: 'popup',
				});
				photoBrowserPopup.open(picIndex - 1);
			});
		});
	}
	
	/*
	 * 删除
	 */
	function deleteHonor(honorId){
		app.ajaxLoadPageContent1(deleteHonorPath+honorId, {
			// honorId:honorId,
		}, function(data) {
			if(data.data == true){
				app.myApp.toast('删除成功', 'success').show(true);
				setTimeout(function() {
					//调用
					require(['js/pages/user/personalHonorList'], function(personalHonorList) {
						personalHonorList.refresh();
					});
				}, 1000);
				app.myApp.hidePreloader();
				app.myApp.getCurrentView().back();
			}
		},{
			type:'DELETE'
		});
	}
	/*
	 * 刷新
	 */
	function refresh(){
		app.myApp.getCurrentView().back();
	}
	
	/**
	 * 重置firstIn变量 
	 */
	function resetFirstIn() {
		firstIn = 1;
	}

	return {
		init: init,
		refresh:refresh,
		resetFirstIn: resetFirstIn,
	}
});