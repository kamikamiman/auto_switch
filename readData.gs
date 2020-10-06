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

  const totalContents = [ contents, nextContents ]; // 当日、翌日の予定を配列に格納
  return totalContents; // 配列を返す 

}