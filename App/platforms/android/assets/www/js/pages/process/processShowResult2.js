define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	//根据项目ID获取两公开详情
	var findDetailInfoPath = app.basePath + '/mobile/specialDeclare/resolutionPublicityDetail';
	//根据项目ID获取项目详情
	var personalProcessDetailsPath = app.basePath + '/mobile/specialDeclare/';
	//通过ID查询支部信息
	var departmentPath = app.basePath + '/mobile/political/department/';
	//通过ID查询村社区信息
	var departmentName = app.basePath + '/mobile/village/detail/';
	//显示图片的参数
	var photoBrowserPhotos = [];
	var photoBrowserPopup = '';
	var eventId =0 ;
	var pTitle='';
	var pId;
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
		pTitle = pageData.pTitle;
		
		$$('.resultName').html(name);
		$$('.fundsOwnName').html(pTitle);
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		 getDetail();
		 loadProcessDetail(eventId);
		 getVillageId();
		 
	}
	
	/**
	 * 点击事件
	 */
	function clickEvent(page) {
	//项目内容
	$$('.fundsDetailIcon').on('click',function(){
		changeStateForText($$(this));
		$('.fundsDetail').slideToggle(200);
	});
	//项目预算内容
	$$('.fundsProDetailIcon').on('click',function(){
		changeStateForText($$(this));
		$('.fundsProDetail').slideToggle(200);
	});
	}
	/*
	 * 改变文本框的状态
	 */
	function changeStateForText(chooseText){
		
	}
	/*
	 * 加载数据
	 */
	function loadProcessDetail(eventId){
		app.ajaxLoadPageContent(personalProcessDetailsPath+eventId, {
			
		}, function(data) {
			var result = data.data;
			var time2 = result.projectStartDate.split(' ')[0];
			var time1 = result.projectEndDate.split(' ')[0];
			
			$$('.processStartTime').html(time2);
			$$('.processEndTime').html(time1);
			$$('#fundsProDetail').val(result.budgetDetailed);
			$$('#fundsDetail').val(result.projectContent);
			
			console.log(result)
			//加载图片
			// showReadonlyPhotos(result.enclosures);
		});	
	}
	/**
	 * 获取村(社区)id
	 */

	function getVillageId(){
		app.ajaxLoadPageContent(departmentPath + app.user.deptId, {
			// honorId:honorId,
		}, function(data) {
			if(data.code == 0 && data.data != null){
				
				villageId = data.data.villageId;
				app.ajaxLoadPageContent(departmentName + villageId, {
					// honorId:honorId,
				}, function(data) {
					if(data.code == 0 && data.data != null){
						var villageName = data.data.villageName;
						$$('.Bottom1').html(villageName+'（社区）党（总）支部')
						$$('.Bottom2').html(villageName+'（居）民委员会')
						$$('.vName').html(villageName)
					}
				});
			}
		});
		
	 }
	/*
	 * 查询公示详情
	 */
	function getDetail(){
		app.ajaxLoadPageContent(findDetailInfoPath,{
			id:pId,
			
		},function(data){
			var result = data.data;
			console.log(result);
			//把获取的参数加入页面
			// $$("#meetinTime").val(result.reportTime)
			var endTime = result.openEndDate
			var time2 = result.openStartDate.split(' ')[0];
			var time1 = endTime.split(' ')[0];
			var time = result.createdDate.split(' ')[0];
			

			var endDate = new Date(endTime.replace(/-/g, '/'));  //结束时间  
			var time3 = endDate.getTime();
			console.log(time3)

			var myDate = new Date();
			var nowData = myDate.getTime();
			
			if(nowData >= time3){
				$$('.show1').css('display','none');
				$$('.show2').css('display','block');
				// var year = myDate.getFullYear();
				// var month = myDate.getMonth()+1<10? "0"+(myDate.getMonth()+1):myDate.getMonth()+1;
				// var date = myDate.getDate()+1<10? "0"+(myDate.getDate()):myDate.getDate();
				// console.log(year+'-'+month+'-'+date); 
				$$('.showTime').html(time1);
				$$(".fundStartTime").html(time2);
				$$(".fundEndTime").html(time1);
			}else{
				$$('.show1').css('display','block');
				$$('.show2').css('display','none');

				$$(".fundStartTime").html(time2);
				$$(".fundEndTime").html(time1);
				$$(".phone1").html(result.phone);
				$$('.showTime').html(time);
			}
			

			
			
			
			
			//加载图片
			showReadonlyPhotos(result.enclosures);
			//加载文件
			// showAndDownLoadFiles(result.file);
			//展示
			// showTextArea();
		});
	}
	/*
	 * 是否展示
	 */
	function showTextArea(){
		// if($$("#contfundsDetailent").val() != ''){
		// 	changeStateForText($$('.tcaomContentIcon'));
		// 	$('.tcaomContent').slideToggle(200);
		// }
		// if($$("#fundsProDetail").val() != ''){
		// 	changeStateForText($$('.fundsProDetailIcon'));
		// 	$('.fundsProDetail').slideToggle(200);
		// }
		
		
	}


	/**
	 * 显示已读相片
	 * @param {Object} picUrlList 需要显示的图片数组
	 */
	function showReadonlyPhotos(picUrlList) {
		$$.each(picUrlList, function(index, item) {
			photoBrowserPhotos.push(app.filePath + item.filePath);
			var random = app.utils.generateGUID();
			$$('.weui_uploader4').append(
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