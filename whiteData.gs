/***********************************/
/***   取得した予定を在席リストに書込   ***/
/***********************************/
function WhiteData(member, totalContents) {
  
  // 現在の時間（△時）を取得
  const date = new Date();
  const nowTime = Utilities.formatDate(date, 'Asia/Tokyo', 'H');  // 現在の時間
  const dayOfNum = date.getDay(); // 曜日番号
  
  // スプレットシートを取得（データ書込み用）
  const ssSet      = SpreadsheetApp.openById('1Kkk1fMXq5q0lKnzmSAcJP6ePU9opV1BacWmKsZwTgqU'); // 在席リスト
  const attendList = ssSet.getSheetByName('当日在席(69期)');                     // シート名よりシート情報  
  const lastRow    = attendList.getRange('C:C').getLastRow();                  // 最終列番号
  const members    = attendList.getRange(1, 3, lastRow, 1).getValues().flat(); // メンバー情報
  const rowNum     = members.indexOf(member) + 1;                              // メンバーの行番号

  const contents     = totalContents[0]; // 当日の予定
  const nextContents = totalContents[1]; // 翌日の予定
  
  let setContents; // 在席リストの状態
  setContents = attendList.getRange(rowNum, 5, 1, 1).getValue(); // 在席リストの状態を取得

  // 休日のパターン
  const holiday1 = contents.indexOf('休み') !== -1;
  const holiday2 = contents.indexOf('有給') !== -1;
  const holiday3 = contents.indexOf('振休') !== -1;
  const holiday4 = contents.indexOf('代休') !== -1;
  const holiday5 = contents.indexOf('RH')  !== -1;
  
  // 土曜当番 ・ 外出 ・ 出張のパターン
  const satDuty = contents.indexOf('当番') !== -1;              // 当日土曜当番
  const goOut        = contents.indexOf('外出') !== -1;         // 当日外出
  const businessTrip = contents.indexOf('出張') !== -1;         // 当日出張
  const nextGoOut        = nextContents.indexOf('外出') !== -1; // 翌日外出
  const nextBusinessTrip = nextContents.indexOf('出張') !== -1; // 翌日出張
  
  // 土曜 ・ 日曜 ・ 休日判定
  const holidayJudg = holiday1 || holiday2 || holiday3 || holiday4 || holiday5; // 休日判定(trueで休日)
  const saturday = dayOfNum === 6;       // 土曜日判定
  const sunday   = dayOfNum === 0;       // 日曜日判定
  
  // 在席 ・ 帰宅判定
  const attend  = [ '', '24H', '当番' ];         // 在席判定
  const goHome  = [ '', '24H', '当番', '外出' ]; // 帰宅判定
  
  
  // 出社時に当日の在席状態を書込
  if ( nowTime < 10 ) {
    
    // 予定無し ・ 24H ・ 当番 の場合、 「在席」を書込
    attend.forEach( el => {
       if ( contents === el ) setContents = attendList.getRange(rowNum, 5, 1, 1).setValue('在席');
    });
  
    // 休日判定がtrue ・ 日曜日 ・ 土曜日(当番でない) の場合、「休み」 を書込
    if ( holidayJudg || sunday ) setContents = attendList.getRange(rowNum, 5, 1, 1).setValue('休み');
    if ( saturday && !satDuty )  setContents = attendList.getRange(rowNum, 5, 1, 1).setValue('休み');
    
    // 外出の場合、 「外出」を書込
    if ( goOut )        setContents = attendList.getRange(rowNum, 5, 1, 1).setValue('外出中');
    
    // 出張の場合、「出張」を書込
    if ( businessTrip ) setContents = attendList.getRange(rowNum, 5, 1, 1).setValue('出張中');
    
  
  };
  

  // 帰宅時に翌日の在席状態を書込
  if ( nowTime > 16 ) {
    
    // 予定無し ・ 24H ・ 当番 ・ 外出 の場合、 在席リストの状態が外出中でなければ、「帰宅」 を書込
    goHome.forEach( el => {
       if ( nextContents === el && setContents !== '外出中' ) { 
          setContents = attendList.getRange(rowNum, 5, 1, 1).setValue('帰宅');
       };
    });

    // 外出の場合、「外出」を書込
    if ( nextGoOut )        setContents = attendList.getRange(rowNum, 5, 1, 1).setValue('外出中');
    
    // 出張の場合、「出張」を書込
    if ( nextBusinessTrip ) setContents = attendList.getRange(rowNum, 5, 1, 1).setValue('出張中');
  
  };


// 取得した詳細情報を書込 //
  let detail; // 直近の予定

  // 本日の予定が 外出 ・ 出張 の場合、予定表の内容を書込
  if ( goOut || businessTrip ) detail = attendList.getRange(rowNum, 6, 1, 1).setValue(contents);

  // 本日の予定が 休日 の場合、予定表の内容を書込
  if ( holidayJudg ) detail = attendList.getRange(rowNum, 6, 1, 1).setValue(contents);




}