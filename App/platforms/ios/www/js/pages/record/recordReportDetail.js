define(['app',
	'hbs!js/hbs/recordComment'
], function(app, recordCommentTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//加载工作日志详情
	var loadWorkLogDetailPath = app.basePath + 'extWorkLog/loadWorkLogDetail';
	//加载日志评论
	var loadLogCommentPath = app.basePath + 'extWorkLog/loadLogComment';
	//加载日志点赞
	var loadLogLikePath = app.basePath + 'extWorkLog/loadLogLike';
	var photoBrowserPhotos = [];
	var photoBrowserPopup = '';
	var recordId = '';

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
		loadRecordDetail();
	}

	/**
	 * 加载数据 
	 */
	function loadRecordDetail() {
		app.ajaxLoadPageContent(loadWorkLogDetailPath, {
			workLogId: recordId,
			userId: app.userId,
		}, function(result) {
			var data = result;
			console.log(data);
			$$('#recDetailTitle').val(data[0].logTitle);
			$$('#recDetailTs').val(data[0].logTime);
			$$('#recDetailContent').val(data[0].logContent);
			//			$$('.checkList').append(data[0].yesReviewed);
			//			$$('.uncheckList').append(data[0].NotReviewed);
			loadLogComment(recordId);
			loadLogLike(recordId, 0);
			showReadonlyPhotos(data[1]);
		});
	}

	/**
	 * 加载工作日志评论 
	 * @param {Object} recordId 日志ID
	 */
	function loadLogComment(recordId) {
		app.ajaxLoadPageContent(loadLogCommentPath, {
			workLogId: recordId,
		}, function(result) {
			var data = result;
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
	function loadLogLike(recordId, isClick) {
		app.ajaxLoadPageContent(loadLogLikePath, {
			workLogId: recordId,
			userId: app.userId,
			isClick: isClick,
		}, function(result) {
			var data = result;
			console.log(data);
			if(data.likes) {
				$$('.likeList').html('<i class="icon icon-noCollect"></i>' + data.likes + ' 觉得很赞');
				var length = data.likes.split(',').length;
				$$('.recLikeTotal').html(length);
			} else {
				$$('.likeList').html("");
				$$('.recLikeTotal').html(0);
			}
		});
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