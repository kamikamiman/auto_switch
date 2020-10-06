/**********************************/
/***   指定したメンバーの予定を取得   ***/
/**********************************/
function ReadData(member) {
  
  // スプレットシートを取得（データ読出し用）
  const ssGet = SpreadsheetApp.openById('1Wf2nEZEh4YfiKSfn2iNfBIs8hcxsFdYBBI8o6vwJYxY'); // 【サービス作業予定表】
    
  // 本日の月のシート情報を取得
  const date   = new Date();                                       // 日付を取得
  const nowDay = Utilities.formatDate(date, 'Asia/Tokyo', 'M/d');  // 本日の日付のフォーマット
  const period = 69;                                               // 第〇〇期
  const nowMonth = Utilities.formatDate(date, 'Asia/Tokyo', 'M');  // 本日の月を取得
  const schedule = ssGet.getSheetByName('${period}期${nowMonth}月'
                                      .replace('${period}', period)
                                      .replace('${nowMonth}', nowMonth));
  
  // 翌月の月のシート情報を取得
  const nextDate = new Date();                                          // 日付を取得
  nextDate.setDate(nextDate.getDate() + 1);                             // 明日の日付をセット
  const nextMonth = Utilities.formatDate(nextDate, 'Asia/Tokyo', 'M');  // 明日の月を取得
  const nextSchedule  = ssGet.getSheetByName('${period}期${nextMonth}月'
                                      .replace('${period}', period)
                                      .replace('${nextMonth}', nextMonth));
  
  
  // 日付を取得するセル範囲を指定
  const firstRow = 6;                        // セル選択開始行
  const lastCol  = schedule.getLastColumn(); // セル選択終了列
  const _days = schedule.getRange(firstRow, 2, 1, lastCol -1);  // 日付情報の取得範囲
  const days = _days.getValues().flat();                        // 日付情報を取得(配列)
  
  // 本日の日付のセルの列番号を取得
  let nowDayNum = 2; // 列番号
  let dayNum;        // 本日の日付の列番号
  days.forEach( getDay => {
     const day = Utilities.formatDate(getDay, 'Asia/Tokyo', 'M/d');
     if( day === nowDay ) dayNum = nowDayNum;
     nowDayNum += 1;
  });


  // 指定したメンバーの名前と一致する行番号を取得(今月)
  const lastRow = schedule.getRange('A:A').getLastRow();                  // 最終列番号
  const members = schedule.getRange(1, 1, lastRow, 1).getValues().flat(); // メンバー情報
  const rowNum  = members.indexOf(member) + 1;                            // memberの行番号

  // 指定したメンバーの名前と一致する行番号を取得(来月)
  const nextLastRow = nextSchedule.getRange('A:A').getLastRow();                      // 最終列番号
  const nextMembers = nextSchedule.getRange(1, 1, nextLastRow, 1).getValues().flat(); // メンバー情報
  const nextRowNum = nextMembers.indexOf(member) + 1;                                 // memberの行番号


  // 指定したメンバーの行番号、本日の列番号のセル情報を取得
  const contents = schedule.getRange(rowNum, dayNum, 1, 1).getValue();     // 本日のセル情報

  // 指定したメンバーの行番号、翌日の列番号のセル情報を取得 (本日が月末の場合は、翌月初日の予定を取得)
  let nextContents;                                                        // 翌日のセル情報
  if ( dayNum !== lastCol ) {
    nextContents = schedule.getRange(rowNum, dayNum + 1, 1, 1).getValue(); // 本日が月末でない場合、翌日のセル情報を取得
  } else {
    nextContents = nextSchedule.getRange(nextRowNum, 2, 1, 1).getValue();  // 本日が月末の場合、翌月初日のセル情報を取得
  };

  const totalContents = [ contents, nextContents ]; // 当日、翌日の予定を配列に格納

  return totalContents; // 配列を返す 

}