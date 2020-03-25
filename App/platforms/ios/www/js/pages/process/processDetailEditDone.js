define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	//根据项目ID获取四议会议详情
	var findDetailInfoPath = app.basePath + '/mobile/specialDeclare/fourMeetingResultDetail';
	//显示图片的参数
	var photoBrowserPhotos = [];
	var photoBrowserPopup = '';
	var pId;
	var name;
	var dataResult = "";
	
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
		pTitle = pageData.pTitle;
		pId = pageData.pId;
		name = pageData.name;
		$$('.editName').html(name);
		$$('.pTitle').html('项目名称 : '+ pTitle);
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
		// 点击修改按钮
		/*$$('.btnEditMsg').on('click',function(){
				//跳转修改界面
				app.myApp.getCurrentView().loadPage({
	                url: "threeMeetingAndOneClassEdit.html",
	                query: {
	                	detailData:dataResult
	                }
	            });
			});
			*/
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
	 * 查询三会一课详情
	 */
	function getDetail(){
		console.log(pId);
		app.ajaxLoadPageContent(findDetailInfoPath,{
			id:pId,
			
		},function(data){
			var result = data.data;
			console.log(result);
			dataResult = result;
			//把获取的参数加入页面
			$$("#meetinTime").val(result.meetingTime);
			$$("#location").val(result.address);
			$$("#host").val(result.host);
			$$("#arrives").val(result.arrives);
			$$("#tos").val(result.tos);
			$$("#recorder").val(result.record);
			$$("#attendees").val(result.attendants);
			$$("#listeds").val(result.attends);
			$$("#absentees").val(result.absents);
			$$("#meetingTitle").val(result.object);
			$$("#meetingRecord").val(result.content);
			$$("#content").val(result.abstracts);
			$$("#meetingDecision").val(result.resolution);
			$$("#differentViews").val(result.different);
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
			$$('.weui_uploader2').append(
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