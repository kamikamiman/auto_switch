// 当日のセル内容が、空白の場合は 8:30に 「在席」 にする。
// 翌日のセル内容が、空白の場合は 17:30に 「帰宅」 にする。

// 外出の場合
// 出張の場合
// 休日の場合

/**************************************************/
/***   指定したメンバーの予定を取得し、在席リストに書込む   ***/
/**************************************************/
function AutoSwitch() {
  
  const member = "上倉健太";               // メンバーを指定
  const totalContents = ReadData(member); // 当日、翌日の予定
  const contents = totalContents[0];      // 当日の予定
  const nextContents = totalContents[1];  // 翌日の予定
  WhiteData(contents, nextContents);      // 取得した予定を在席リストに書込

}



/**********************************/
/***   指定したメンバーの予定を取得   ***/
/**********************************/
function ReadData(member) {
  
  // スプレットシートを取得（データ読出し用）
  const ssGet = SpreadsheetApp.openById('1Wf2nEZEh4YfiKSfn2iNfBIs8hcxsFdYBBI8o6vwJYxY'); // 【サービス作業予定表】
    
  // その月のシート情報を取得
  const date = new Date(); // 日付を取得
  const nowDay = Utilities.formatDate(date, 'Asia/Tokyo', 'M/d');  // 本日の日付のフォーマット
  const period = 69; // 第〇〇期
  const nowMonth = Utilities.formatDate(date, 'Asia/Tokyo', 'M');  // 本日の月を取得
  const schedule = ssGet.getSheetByName('${period}期${nowMonth}月'
                                      .replace('${period}', period)
                                      .replace('${nowMonth}', nowMonth));
  
  // 日付を取得するセル範囲を指定
  const firstRow = 6;                        // セル選択開始行
  const lastCol  = schedule.getLastColumn(); // セル選択終了列
  const _days = schedule.getRange(firstRow, 2, 1, lastCol -1); 
  const days = _days.getValues().flat();
  
  // 本日の日付のセルの列番号を取得
  let nowDayNum = 2; // 列番号
  let dayNumber;     // 本日の日付の列番号
  
  days.forEach( getDay => {
     const day = Utilities.formatDate(getDay, 'Asia/Tokyo', 'M/d');
     if(day === nowDay) dayNumber = nowDayNum; // 本日の日付と一致した場合、その日付のセルの列番号を取得
     nowDayNum += 1;
  });


  // 指定したメンバーの名前と一致する行番号を取得
  const lastRow = schedule.getRange('A:A').getLastRow();                  // 最終列番号を取得
  const members = schedule.getRange(1, 1, lastRow, 1).getValues().flat(); // メンバー情報
  const rowNum  = members.indexOf(member) + 1;                            // 上倉健太の行番号を取得

  // 指定したメンバーの行番号、当日、翌日の列番号のセル情報を取得
  const contents = schedule.getRange(rowNum, dayNumber, 1, 1).getValue();         // 当日のセル情報
  const nextContents = schedule.getRange(rowNum, dayNumber + 1, 1, 1).getValue(); // 翌日のセル情報

  const totalContents = [ contents, nextContents ]; // 当日、翌日の予定を配列の格納
  return totalContents; // 配列を返す 

}


/***********************************/
/***   取得した予定を在席リストに書込   ***/
/***********************************/
function WhiteData(contents, nextContents) {
  
  // 現在の時間（△時）を取得
  const date = new Date();
  const nowTime = Utilities.formatDate(date, 'Asia/Tokyo', 'h');  // 本日の月を取得
  
  // スプレットシートを取得（データ書込み用）
  const ssSet = SpreadsheetApp.openById('1Kkk1fMXq5q0lKnzmSAcJP6ePU9opV1BacWmKsZwTgqU'); // 【在席リスト】
  const attendList = ssSet.getSheetByName('当日在席(69期)'); // シート名よりシート情報を取得  
  const lastRow = attendList.getRange('C:C').getLastRow(); // 最終列番号を取得
  const members = attendList.getRange(1, 3, lastRow, 1).getValues().flat(); // メンバー情報を取得
  const rowNum  = members.indexOf("上倉健太") + 1; // 上倉健太の行番号を取得
  let setContents; // 当日の状態
  
  // 当日の予定が空白の場合
  if ( contents == '' ) {
    if ( nowTime <  9 ) setContents = attendList.getRange(rowNum, 5, 1, 1).setValue("休み"); // 出勤情報を書込
  };
  
  // 翌日の予定が空白の場合
  if ( nextContents == '' ) {
    if ( nowTime > 17 ) setContents = attendList.getRange(rowNum, 5, 1, 1).setValue("帰宅"); // 帰宅情報を書込
  };
  
}


/**********************************************/
/***   指定した時間にスクリプトを実行するトリガー設定   ***/
/**********************************************/
function startTrigger(){
  
  const time = new Date();
  time.setHours(10);
  time.setMinutes(20);
  ScriptApp.newTrigger('autoSwitch').timeBased().at(time).create();

}


function endTrigger(){

  const time = new Date();
  time.setHours(17);
  time.setMinutes(30);
  ScriptApp.newTrigger('autoSwitch').timeBased().at(time).create();

}
