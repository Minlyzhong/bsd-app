define(['app',
	'hbs!js/hbs/recordComment'
], function(app, recordCommentTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//加载工作日志详情
	var loadWorkLogDetailPath = app.basePath + '/mobile/worklog/detail/';
	//加载日志评论
	var loadLogCommentPath = app.basePath + '/mobile/worklog/comments/';
	//加载日志点赞
	var loadLogLikePath = app.basePath + '/mobile/worklog/likes/';

	//新增赞
	var addLikePath = app.basePath + '/political/content/likes';
	//取消点赞
	var cancelLikePath = app.basePath + '/political/content/likes/';

	var photoBrowserPhotos = [];
	var photoBrowserPopup = '';
	var recordId = '';
	var logTypeId = 0;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		app.back2Home();
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
		photoBrowserPopup = '';
		recordId = pageData.id;
		logTypeId = pageData.logTypeId;
		console.log(pageData);
		loadRecordDetail();
	}

	/**
	 * 加载数据 
	 */
	function loadRecordDetail() {
		app.ajaxLoadPageContent(loadWorkLogDetailPath + logTypeId +'/'+recordId, {
			// workLogId: recordId,
			// userId: app.userId,
			tenantId:app.user.tenantId
		}, function(result) {
			var data = result.data;
			console.log(data);
			$$('#recDetailTitle').val(data.logTitle);
			$$('#recDetailTs').val(data.createTime);
			$$('#recDetailContent').val(data.logContent);
			//			$$('.checkList').append(data[0].yesReviewed);
			//			$$('.uncheckList').append(data[0].NotReviewed);
			loadLogComment(recordId);
			loadLogLike(recordId, 0);
			showReadonlyPhotos(data.images);
		});
	}

	/**
	 * 加载工作日志评论 
	 * @param {Object} recordId 日志ID
	 */
	function loadLogComment(recordId) {
		app.ajaxLoadPageContent(loadLogCommentPath+app.userId+'/'+recordId, {
			tenantId:app.user.tenantId
			// workLogId: recordId,
		}, function(result) {
			var data = result.data;
			console.log(data);
			if(data.length) {
				$$('.recCommentTotal').html(data.length);
				$$('.commentList').append(recordCommentTemplate(data));
			} else {
				$$('.recCommentTotal').html(0);
			}
		});
	}

	/**
	 * 加载日志点赞 
	 * @param {Object} recordId
	 */
	function loadLogLike(recordId) {
		app.ajaxLoadPageContent(loadLogLikePath+recordId, {
			// workLogId: recordId,
			// userId: app.userId,
			// isClick: isClick,
			tenantId: app.user.tenantId
		}, function(result) {
			
			if(result.data) {
				$$('.likeList').html('<i class="icon icon-noCollect"></i>' + result.data + ' 觉得很赞');
				var length = result.data.split(',').length;
				$$('.recLikeTotal').html(length);
			} else {
				$$('.likeList').html("");
				$$('.recLikeTotal').html(0);
			}
		});
	}


	/**
	 * 新增/取消点赞 
	 * @param {Object} recordId
	 */
	function addLike(recordId) {
		console.log(likes)
		if(likes){
			
			app.ajaxLoadPageContent(cancelLikePath+likesId, {
				
				tenantId: app.user.tenantId
			}, function(result) {
				console.log(result)
				if(result.msg == 'success') {
					$$('.recordLike>i').removeClass('icon-collect').addClass('icon-noCollect');
					$$('.likeStatus').html('赞');
					likes = false;
					loadLogLike(recordId, 1) 
				}	
			},{
				type:'DELETE'
			});

		}else{
			// logTypeId日志类型:1,党员活动；2,工作日志；3,微动态
			var type
			if(logTypeId == 1){
				type = 7;
			}else if(logTypeId == 2){
				type = 5;
			}else{
				type = 6;
			}
			var params={
				articleId: recordId,
				userId: app.userId,
				userName: app.user.userName,
				type:type
			}
			var formDatas= JSON.stringify(params)
			$$.ajax({
				url:addLikePath,
				method: 'POST',
				dataType: 'json',
				contentType: 'application/json;charset:utf-8',
				data: formDatas,
				cache: false,
				success:function (data) {
					if(data.msg == 'success') {
						$$('.recordLike>i').removeClass('icon-noCollect').addClass('icon-collect');
						$$('.likeStatus').html('取消');
						likes = true;
						likesId = data.data.id;
						loadLogLike(recordId, 1) 
					} 
					
				},
				error:function () {
				   
				}
			});

			

		}
	}




	/**
	 * 显示已读相片
	 * @param {Object} picUrlList 需要显示的图片数组
	 */
	function showReadonlyPhotos(picUrlList) {
		$$.each(picUrlList, function(index, item) {
			var item = item.photo;
			photoBrowserPhotos.push(app.basePath + item);
			var random = app.utils.generateGUID();
			$$('.weui_uploader').append(
				'<div class="weui_uploader_bd kpiPicture">' +
				'<div class="picContainer" id="img_' + random + '">' +
				'<img src="' + app.basePath + item + '" class="picSize" />' +
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