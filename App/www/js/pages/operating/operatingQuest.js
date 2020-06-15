define(['app',
  'hbs!js/hbs/satisfy',
  'hbs!js/hbs/operatingUserQuest',
  'hbs!js/hbs/operatingScoreList',
  'hbs!js/hbs/operatingPersonList'

],function(app,template, operatingTem,vilDailyTemplate,PersonListTemplate){
  var $$ = Dom7;
  // 获取事件详细信息
  var personDetail = app.basePath + '/mobile/operating/event/';
  // 对事件办事人评分
  var saveRaterPath = app.basePath + '/mobile/operating/event/ranking';
  // 保存办事窗口服务评价
  var savePath = app.basePath + '/mobile/window';

  // scoreType对应

  var satisfactionList = [{score:0, val:'非常满意', mun:5}, {score:1, val:'满意',mun:3}, {score:2, val:'一般',mun:1}, {score:3, val:'不满意',mun:-3}, {score:4, val:'差',mun:-5}, ];

  //score对应 var SatisfactionList1 = [{score:5, val:'非常满意'}, {score:4, val:'满意'}, {score:3, val:'一般'}, {score:2, val:'不满意'}, {score:1, val:'差'}, ];
  var matterName;
  var qId = 0;
  var remarks = '';
  var score = 0;
  var pScore = 0;
  var num = 0;
  var pNum = 0;
  var applicant = '';
  var isChoose = false;
  var pIsChoose = false;
	var applyCompany = '';
  var typeVal = '';
  var chooseLogType = 0;
  var operator = 0;
  var isoperatorChoose = false;

  function init(page) {

    console.log("init....");
    initData(page.query);
    ajaxLoadContent();
    clickEvent(page);
   
  }
  
  function initData(query) {
    console.log('query')
    console.log(query)
    matterName = query.matterName;
    // qId = 0;
    qId = query.id;
    isChoose = false;
    pIsChoose = false;
    remarks = '';
    applicant = app.user.nickName;
    $$('#applicant').val(applicant);
    score = 0;
    pScore = 0;
    num = 0;
    pNum = 0;
    applyCompany = '';
    chooseLogType = 1;
    operator = 0;
    isoperatorChoose = false;
    // $$('.Satisfaction').html(template(SatisfactionList));
    $$('.headerTitle').html(matterName);

  }

  /**
	 * 点击事件
	 */
	function clickEvent(page) {
		
		// $$('.submit').on('click', submitContent);
		$$('.scoreF').on('click', setScore);
		
		
  }
 


  function setScore(){
    score = $$(this).data('score');
    console.log(score)
    $$('.Satisfaction li').removeClass('select');
    $$(this).addClass('select');
    isChoose = true;
  }

  
  
  function ajaxLoadContent() {
   
    console.log('qId');
    console.log(qId);
    if(qId){
      app.qId = qId;
      app.ajaxLoadPageContent(personDetail+qId,{
        raterId:app.userDetail.userId
      },function(result){
        var detail = result.data;
        console.log(detail);
        if(result.code == 0 && result.data != null){
         var winList = result.data.winScores;
         var scoreList = result.data.eventScores;

         if(scoreList.length == 0){
           console.log('没有办事员')
          $$('#operaScore').html('办事员评分 :  暂无可评分的办事员');
         }
          if(winList.length > 0){
            $$.each(winList, function(index, item) {
              item.index = parseInt(index+1);
              item.ListIndex = index;
              if(item.ranking == false){
                item.isScore = 0;
              }else{
                item.isScore = 1;
              }
              // if(item.scoreType){
                console.log('item.score')
                console.log(item.score)
                $$.each(satisfactionList, function(ind, ite) {

                  if(ite.score == item.scoreType){
                    console.log(ite)
                    item.scoreName = ite.val;
                  }
                });
              // }
            });
            console.log('winList');
            console.log(winList);
            $$('#scoreList').html(vilDailyTemplate(winList));
            // 办事员
            $$.each(scoreList,function(index, item){
              item.index = parseInt(index+1);
              item.listIndex = index;
              if(item.scoreType || item.scoreType == 0){
                item.hasScored = 1;

                $$.each(satisfactionList,function(ind,ite){
                  if(ite.score == item.scoreType){
                    item.scoreName = ite.val;
                  }
                })
              }else{
                item.hasScored = 0;
              }
            })
            $$('#personScore').html(PersonListTemplate(scoreList));

            // 窗口评分
            $$('.raterScore .scoreF').on('click', function(){
              score = $$(this).data('score');
              num = $$(this).data('num');
              console.log(score)
              $$('.raterScore span').removeClass('select');
              $$(this).addClass('select');
              isChoose = true;
            });
            $$('.scoreSubmit').on('click',setScore);

             
            /**
             * 提交
             */
            function setScore(){
                if(isChoose == false){
                  app.myApp.toast('请选择您要评的分数', 'error').show(true);
                  return;
                }
                var dataIndex = $$(this).data('ListIndex');
                console.log('dataIndex');
                var selfScoreList = winList[dataIndex];
                console.log(dataIndex)
                console.log(selfScoreList)
                // return;
                app.myApp.confirm('是否确认评分?', function() {
                  
                  var formData = selfScoreList;
                  formData.rankingType = 1;
                  formData.scoreType = score;
                  formData.score = num;
                  // {
                  //   winId: qId,
                  //   matId: app.marterId,
                  //   eventId:app.eventId,
                  //   operatingUser: operator,
                  //   scoreType: score,
                  //   rater: applicant,
                  //   raterId: app.userDetail.userId,
                  //   memo: remarks,
                  //   tenantId: app.tenantId,
                  //   applyCompany: applyCompany,
                  //   deptId:app.userDetail.deptId,
                  //   deptName:app.userDetail.deptName,
                  //   rankingType:1
                  // }
                  console.log(formData);
                  var formDatas= JSON.stringify(formData)
                  
                      // 提交到后台审核
                      $$.ajax({
                          url:savePath,
                          method: 'POST',
                          dataType: 'json',
                          contentType: 'application/json;charset:utf-8', 
                          data: formDatas,
                          cache: false,
                          success:function (data) {
                      
                            if(data.data == true && data.code == 0){ 
                              app.myApp.toast('评分成功！', 'success').show(true);
                              refresh(); 
                              
                              // app.myApp.getCurrentView().loadPage('result.html');
                            }else{
                        
                              app.myApp.alert(data.msg, );
                              
                            }
                            
                          },
                          error:function () {
                              app.myApp.alert("网络异常！");
                          }
                      });
                });
            }


            // 代跑人评分
            $$('.pesonScore .scoreF').on('click', function(){
              pScore = $$(this).data('score');
              pNum = $$(this).data('num');
              console.log(score)
              $$('.pesonScore span').removeClass('select');
              $$(this).addClass('select');
              pIsChoose = true;
            });
            $$('.personSubmit').on('click',setPersonScore);

            function setPersonScore(){
              if(pIsChoose == false){
                app.myApp.toast('请选择您要评的分数', 'error').show(true);
                return;
              }
              var dataIndex = $$(this).data('listIndex');
              console.log('dataIndex');
              var selfPersonScoreList = scoreList[dataIndex];
              app.myApp.confirm('是否确认评分?', function() {
                var formData = selfPersonScoreList;
                formData.scoreType = pScore;
                formData.score = pNum;
               
                console.log(formData);
                var formDatas= JSON.stringify(formData)
                
                    // 提交到后台审核
                    $$.ajax({
                        url:saveRaterPath,
                        method: 'POST',
                        dataType: 'json',
                        contentType: 'application/json;charset:utf-8', 
                        data: formDatas,
                        cache: false,
                        success:function (data) {
                    
                          if(data.data == true && data.code == 0){ 
                            
                            app.myApp.toast('评分成功！', 'success').show(true);
                            refresh(); 
                            // app.myApp.getCurrentView().loadPage('result.html');

                          }else{
                      
                            app.myApp.alert(data.msg, );
                            
                          }
                          
                        },
                        error:function () {
                            app.myApp.alert("网络异常！");
                          
                            
                        }
                    });
              });
            }


          }else{
            $$('#operaProcess').html('办事流程 : 暂无办事流程');

          }
         

        }else{
          app.myApp.alert("没有对应的信息",);
        }

      })
    }
  }


/**
	 *	评分后刷新 
	 */
	function refresh(){
		setTimeout(function() {
			pageNo = 1;
			loading = true;
			//这里写请求
      ajaxLoadContent();
		}, 1000);
	}
  
  
  return {
    init:init
  }
});