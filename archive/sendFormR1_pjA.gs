/**
 * 要求部署承認者（各課リーダー）への承認依頼メールの送信
 * 
 * Rev.1: 1,設問回答から所属先を検出して承認メール先を自動設定
 *        2,申請者氏名を表題追加
 * Rev.2: 運用テスト用にメール宛先、メッセージボックス表示設定などの軽微な変更
 * Rev.3: 部門承認者の変更、田中リーダーから、有田リーダー ＊暫定設定中* 
 * Rev.4: メールsubjectより、文字列"試験運用"、"SAMPLE"を削除
 * Rev.5: 部門承認者の変更、田中リーダー ＊暫定設定中* を異動に伴い削除
 * Rev.6: 部署名の変更に伴い、Form、スクリプト上の名称変更 ＊暫定設定中* 
 * 
 * lastUpdate: Takuya Hayashi 15/Apr/2026
 * 
 */



function sendFormR1(e){ 

  var items = e.response.getItemResponses(); //質問の数を取得
  var pMailbody = "";  //メール本文変数の準備
  var pMailTo = ""; //メール送信先の準備 Rev.1
  var pAddSubject = ""; //+タイトル追加情報の準備 Rev.1
  
  const options = { name: "業務管理課 整備用消耗品 購買担当：", replyTo: "btc_simdev@btc.ana-g.com" }; // オプション：返信先を指定


  for (var i = 0; i < items.length; i++) { //質問数と同じ回数繰り返す

    var item = items[i];
    var pQuestion = item.getItem().getTitle(); //質問の取得
    var pAnswer = item.getResponse(); //回答の取得

    pMailbody += pQuestion + ": " + pAnswer + "\n\n"; //メール本文変数に、取得した質問、回答を代入する プラス 改行


    // 送信先メールアドレス振り分け条件 Rev.1
    // 設問 所属課 の回答が "業務管理課" の場合
    if (pQuestion == "所属課" && pAnswer == "業務管理課"){

      //pMailTo = "btc_simdev@btc.ana-g.com"; //メール送信先の設定 ＊業務管理課 承認者メールアドレスを指定:テスト用
      pMailTo = "s.arita@btc.ana-g.com"; //メール送信先の設定 ＊業務管理課 承認者メールアドレスを指定
      pOptions = { bcc: 'btc_simdev@btc.ana-g.com' }; //テストモニター用
      
      
    // 設問 所属課 の回答が "品質企画課" の場合
    // 所属課名の変更に伴い "技術課" から "品質企画課" に変更 *Rev.6
    }else if (pQuestion == "所属課" && pAnswer == "品質企画課"){
        
      pMailTo = "btc_simdev@btc.ana-g.com"; //メール送信先の設定 ＊品質企画課 承認者メールアドレスを指定:テスト用
      //pMailTo = "t.kswamoto@btc.ana-g.com"; //メール送信先の設定 ＊品質企画課 承認者メールアドレスを指定
      //pOptions = { bcc: 'btc_simdev@btc.ana-g.com' }; //テストモニター用
		
        
    // 設問 所属課 の回答が "整備技術課" の場合
    // 所属課名の変更に伴い "整備課" から "整備技術課" に変更 *Rev.6
    }else if (pQuestion == "所属課" && pAnswer == "整備技術課"){
        
      pMailTo = "btc_simdev@btc.ana-g.com"; //メール送信先の設定 ＊整備技術課 承認者メールアドレスを指定:テスト用
      //pMailTo = "y.yamazaki@btc.ana-g.com"; //メール送信先の設定 ＊整備技術課 承認者メールアドレスを指定
      //pOptions = { bcc: 'btc_simdev@btc.ana-g.com' }; //テストモニター用


    // 設問 ”申請者氏名” の場合、
    }else if (pQuestion == "申請者氏名"){

      //return;
      pAddSubject = pAnswer; // 申請者氏名を表題追加用に取得 Rev.1

    }else{

      //return; 

    }
    
  }
  
    
  // 承認スプレッドシートURLの記載
  pMailbody += "承認URL：https://docs.google.com/spreadsheets/d/1EKh8Go3nJcqsIA_Egtio5OD_vTmhx2Q5wjb37BpqKBg/edit?usp=sharing";

  // 要求部署承認者に対して承認依頼のメールを送信　＊承認者のメールアドレスを回答から自動設定 Rev.1
  GmailApp.sendEmail( pMailTo, "整備用消耗品 購入要求の承認依頼 : "+ pAddSubject ,pMailbody, options ); //メールの送信
    
}
