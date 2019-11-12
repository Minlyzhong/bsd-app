define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	//根据项目ID获取两公开详情
	var findDetailInfoPath = app.basePath + '/mobile/specialDeclare/resolutionPublicityDetail';
	//显示图片的参数
	var photoBrowserPhotos = [];
	var photoBrowserPopup = '';
	var threeMeetingAndOneClassId;
	var threeMeetingAndOneClassUserName;
	var name = "";
	
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		console.log(page);
		initData(page.query);
		app.back2Home();
		attrDefine(page);
		clickEvent(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		photoBrowserPhotos = [];
		photoBrowserPopup = '';
		eventId = pageData.eventId;
		pId = pageData.pId;
		name = pageData.name;
		$$('.resultName').html(name);
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		 getDetail();
	}
	
	/**
	 * 点击事件
	 */
	function clickEvent(page) {
	
	}
	/*
	 * 改变文本框的状态
	 */
	function changeStateForText(chooseText){
		
	}
	/*
	 * 查询公示详情
	 */
	function getDetail(){
		app.ajaxLoadPageContent(findDetailInfoPath,{
			id:pId,
			// refType:3,
			// isApp: 1
		},function(data){
			var result = data.data;
			console.log(result);
			//把获取的参数加入页面
			// $$("#meetinTime").val(result.reportTime);
			var time1 = result.openEndDate.split(' ')[0];
			var time2 = result.openStartDate.split(' ')[0];
			$$("#beginTime1").val(time2);
			$$("#endTime1").val(time1);
			$$("#phone1").val(result.phone);
			
			//加载图片
			showReadonlyPhotos(result.enclosures);
			//加载文件
			// showAndDownLoadFiles(result.file);
			//展示
			showTextArea();
		});
	}
	/*
	 * 是否展示
	 */
	function showTextArea(){
		if($$("#content").val() != ''){
			changeStateForText($$('.tcaomContentIcon'));
			$('.tcaomContent').slideToggle(200);
		}
		if($$("#meetingDecision").val() != ''){
			changeStateForText($$('.tcaomMeetingDecisionIcon'));
			$('.tcaomMeetingDecision').slideToggle(200);
		}
		if($$("#differentViews").val() != ''){
			changeStateForText($$('.tcaomDifferentViewsIcon'));
			$('.tcaomDifferentViews').slideToggle(200);
		}
		if($$("#listeds").val() != ''){
			changeStateForText($$('.listedsIcon'));
			$('#listeds').animate({height:"200px"},200);
		};
		if($$("#absentees").val() != ''){
			changeStateForText($$('.absenteesIcon'));
			$('#absentees').animate({height:"200px"},200);
		};
		if($$("#attendees").val() != ''){
			changeStateForText($$('.attendeesIcon'));
			$('#attendees').animate({height:"200px"},200);
		}
		
	}
	/**
	 * 显示已读相片
	 * @param {Object} picUrlList 需要显示的图片数组
	 */
	function showReadonlyPhotos(picUrlList) {
		$$.each(picUrlList, function(index, item) {
			photoBrowserPhotos.push(app.filePath + item.filePath);
			var random = app.utils.generateGUID();
			$$('.weui_uploader3').append(
				'<div class="weui_uploader_bd kpiPicture">' +
				'<div class="picContainer" id="img_' + random + '">' +
				'<img src="' + app.filePath + item.filePath + '" class="picSize" />' +
				'</div>' +
				'</div>');
			$$('#img_' + random).on('click', function(e) {
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
	 * 显示文件
	 * @param {Object} fileUrlList 需要显示的图片数组
	 */
	function showAndDownLoadFiles(fileUrlList) {
		$$.each(fileUrlList, function(index, item) {
			var random = app.utils.generateGUID();
			var str = '';
			var fileName=[];
			fileName = item.name.split('/');
			var typeFiles=[];
			var typeFile = '';
			typeFiles = item.name.split('.');
			typeFile = typeFiles.pop();
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
			$$('.weui_uploader1').append(
				'<div class="downloadFiles">'+str+
				'<input type="hidden" value="'+item.filePath+'" name="fileUrl"/>'+
				'<a href="javascript:void(0)">'+fileName+'</a>'+
				'<div>');
		});
		$$('.downloadFiles').on('click',function(){
			var downUrl = $(this).find('input[name=fileUrl]').val();
			app.myApp.confirm('确定要下载吗？', function() {
				open(app.filePath+downUrl, '_system');	
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