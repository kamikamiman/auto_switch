/*
[ プログラム説明 ]

① プロジェクトトリガーで startTrigger() を実行する。 → 8:25 に AutoSwitch() が実行される。
　　当日の在席状態を自動で変更する。
  
② プロジェクトトリガーで endTrigger() を実行する。  → 17:30 に AutoSwitch() が実行される。
 翌日の在席状態を自動で変更する。

 [ AutoSwitch() 内の関数の説明 ] 
   ・ ReadData(member) で指定した member の当日 ・ 翌日 の予定を取得する。
     * return で totalContents を返す。
   ・ WhiteData(member, totalContents) で指定した member の在席状態を変更する。
     * totalContents は、member の 当日 ・ 翌日 の予定が配列で格納されている。


◻︎ 詳細の予定を書き込む。
   
   ・ 外出先
   ・ 出張先
   ・ フレックス（時間）
   ・ 休みの予定
   
◻︎ 月をまたぐ時の予定取得
   
*/

/**************************************************/
/***   指定したメンバーの予定を取得し、在席リストに書込む   ***/
/**************************************************/
function AutoSwitch() {
  
  const member = "上倉健太";                  // メンバーを指定
  const totalContents = ReadData(member);    // 当日、翌日の予定
  WhiteData(member, totalContents); // 取得した予定を在席リストに書込

}



/**********************************************/
/***   指定した時間にスクリプトを実行するトリガー設定   ***/
/**********************************************/
function startTrigger(){
  
  const time = new Date();
  time.setHours(8);
  time.setMinutes(25);
  ScriptApp.newTrigger('autoSwitch').timeBased().at(time).create();

}


function endTrigger(){

  const time = new Date();
  time.setHours(17);
  time.setMinutes(30);
  ScriptApp.newTrigger('autoSwitch').timeBased().at(time).create();

}
