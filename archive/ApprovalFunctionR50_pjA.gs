/**
 * ApprovalFunctionR5.gs
 * 整備用消耗品 購入依頼
 * 
 * ORG: "ApprovalFunctionR2a"に新たに各課承認担当(各課リーダー)用チェックボックス + 業務管理課購買担当者への通知メール送信機能を追加
 * Rev.1: 仕様変更：最終承認欄を”R”列から"S"列に変更
 * Rev.2: 運用テスト用にメール宛先、メッセージボックス表示設定などの軽微な変更
 * 設定変更：佐々木退職により、メール宛先2か所修正（削除１、宛先変更１）
 * Rev.3: 井出さん帰属により、メール宛先1か所修正（削除１)
 *
 * Rev.4: 「Exceeded maximum execution time」対策の改修
 * Rev.4#1: ”GmailApp”メソッドから、”MailApp”メソッドへの変更を2個所 ＊メール送信メソッドの変更
 * Rev.4#2: getValues()から getValue()を使用した処理方法に変更を2個所 ＊”pOrderItem”セル値の取得方法の改善
 * Rev.4#3: MailApp.sendEmail()メソッドの呼び出し部分にエラーハンドリングを追加 *エラーハンドリング機能の追加
 * 
 * Rev.4#4: 送信メールSubjectより、文字列”試験運用”を削除
 *
 * Rev.5: スプレッドシートURLを一元管理化（変数化）し、年度変更時の保守性を向上
 *
 * 
 * takuya hayashi, last update 14/Apr/2026
 * 
 */



//function onEdit() {
//トリガーの無効化
function ApprovalFunctionR5() {

  // Rev.5: スプレッドシートURLの一元管理
  var SPREADSHEET_ID = "1EKh8Go3nJcqsIA_Egtio5OD_vTmhx2Q5wjb37BpqKBg";
  var SHEET_GID = "1562268145"; // ＊該当年度用に設定したシートID "gid" を指定 ＊2026年度に変更
  var REFERENCE_URL = "https://docs.google.com/spreadsheets/d/" + SPREADSHEET_ID + "/edit?usp=sharing#gid=" + SHEET_GID;

  var ss = SpreadsheetApp.getActiveSpreadsheet();//アクティブなスプレッドシートを取得
  var mySheet = ss.getActiveSheet(); //シートを取得
  var myCell = ss.getActiveCell(); //アクティブセルを取得
  
  var checkBoxCols1 = 17 //設定値：申請部署承認チエックボックス列の指定 => Q列の列番号 17 ＊部署承認者を発注担当者とした場合
  var checkBoxCols2 = 18 //設定値：承認チエックボックス列の指定 => R列の列番号 18 ＊業務管理課 購買担当者とした場合
  // Rev.1: 最終承認欄 ”R”を追加
  var checkBoxCols3 = 19 //設定値：承認チエックボックス列の指定 => S列の列番号 19 ＊業務管理課 購買管理者とした場合
  
  var myRow = myCell.getRow(); //アクティブセルの行番号 ＝ 保護する範囲の行番号
  var myCol = myCell.getColumn(); //アクティブセルの列番号 = チェックボックス判別用
  var myFlag = myCell.getValue(); //アクティブセルのチェックボックスの値を取得


  //test メッセージボックス用に追加
  // タイムスタンプ入力行の列Bから日付+時刻入力を取得
  var range = mySheet.getRange("A"+myRow);
  var getDate = range.getDisplayValue();
  
  
  // アクティブセルが各課承認列の場合：処理指定
  if (myFlag == true && myCol == checkBoxCols1) {
    
    //test 確認用メッセージボックスの表示
	  //Browser.msgBox('アクティブセル 列："' +myCol+ '"、行："' +myRow+ '" を検出しました');
    


    //＊Rev.1：以下、各課承認者 => 業務管理課 購買担当者宛 購入依頼メール機能テスト　開始

    var pMailbody = ""; //メール本文の準備
    var pMailTo = ""; //メール送信先の準備
    var pOptions = ""; //BCCのアドレス追加、CCのアドレス追加等のメールオプション準備

    //メール送信先の設定
    //pMailTo = "btc_simdev@btc.ana-g.com"; //test
    //pOptions = { cc: 'cc01@btc.ana-g.com, cc02@btc.ana-g.com' }; //test
    pMailTo = "s.mizuno@btc.ana-g.com, k.arakawa@btc.ana-g.com";
    //pOptions = { bcc: 'btc_simdev@btc.ana-g.com', cc: 's.fukushima@btc.ana-g.com, y.maeda@btc.ana-g.com' }; //bcc:をテストモニター用に追加。＊設定変更20/Dec/2023：佐々木退職によりcc宛先より削除


    //発注確定項目の品目のプロパティ取得　＊オリジナル処理から効率化: Rev.5#2
	
	//オリジナル処理から効率化: Rev.5#2: 「Exceeded maximum execution time」対策の改修
    //var pOrderItem = mySheet.getRange("E"+ myRow +":G"+myRow).getValues();　//発注品目のプロパティ設定値：指定セル行"myRow"の列範囲(E列～G列)で入力値指定
	
	// pOrderItem生成の効率化
	var range = mySheet.getRange("E"+ myRow +":G"+myRow); // getRange()メソッドを使用して、セルの範囲(E列～G列)を指定してrange変数に代入
	var values = range.getValues(); //　range変数で指定したセル範囲の値を取得し、それをvalues変数に代入
	var pOrderItem = values[0].join(", "); //　values変数に格納した取得セル値の配列から、その配列の最初の要素をjoin(", ")メソッドを使用して、指定した区切り文字で連結して1つの文字列に変換
	
    
    //メール本文の設定
    pMailbody += "業務管理課 購買担当者様" + "\n\n" + "要求部署 承認担当者により以下の品目の購入承認がされました。" + "\n\n" + "■購入申請一覧表 行番号：" + myRow + "\n" + "  品目(メーカー,品名,品番)：" + pOrderItem + "\n\n" + "以下リンクから購入申請シートで申請内容を参照し、依頼品の発注手続きをお願いします。" + "\n\n\n"; //メール本文 プラス 改行

    // 承認スプレッドシートURLのメール本文への追加
    // Rev.5: スプレッドシートURLの一元管理（変数化）に伴い、URLを直接記載するのではなく、変数REFERENCE_URLを使用してURLを本文に追加
    pMailbody += "承認URL：" + REFERENCE_URL;


    // 告知メールを送信:発注依頼メール
	
	//＊旧メール送信メソッド：”GmailApp”メール送信メソッドの変更　＊Rev.5#1改修
    //GmailApp.sendEmail(pMailTo, "整備用消耗品 要求部門承認済 => 発注依頼メール: ", pMailbody, pOptions);　//告知メールの送信 ＊改修前
	
	
	// Rev.5#3: MailApp.sendEmail()メソッドの呼び出し部分にエラーハンドリングを追加 *エラーハンドリング機能の追加
	try{
		
		//＊新メール送信メソッド：”MailApp”メール送信メソッドへの変更　＊Rev.5#1改修
		MailApp.sendEmail({to: pMailTo, subject: "整備用消耗品 要求部門承認済 => 発注依頼メール: ", body: pMailbody, cc: pOptions.cc, bcc: pOptions.bcc}); //告知メールの送信　＊改修後
		
		} catch (error) {
		
		// エラーが発生した場合の処理
		console.error("メール送信中にエラーが発生しました: " + error);
		Browser.msgBox("メール送信中にエラーが発生しました。詳細はログをご確認ください。");
		
		}


    //test 確認用メッセージボックスの表示
    Browser.msgBox('購買担当者 "' + pMailTo + '" 宛に要求部門承認メールを送信しました');

    //＊Rev.1：以上、メール機能テスト　終了

    return; //処理の終了


    //アクティブセルが業務管理課 購買担当者 購買処理列の場合：処理指定
    } else if(myFlag == true && myCol == checkBoxCols2) {

	  //test 確認用メッセージボックスの表示
	  //Browser.msgBox('アクティブセル 列："' +myCol+ '"、行："' +myRow+ '" を検出しました');
    
    


    /* 以下、コメントアウト：＊Rev.1------------------------------------------

    //承認・保護の実行 　
    var targetRange = mySheet.getRange("A"+myRow +":S"+myRow);　//設定値：保護するセル行入力の範囲を列範囲で指定 => A列～S列 *Rev.1

    var protection = targetRange.protect(); //上記で指定したセル範囲を保護して
    
    protection.removeEditors(protection.getEditors()); //オーナー権限以外のアクセス権限者を抜く

    */ //以上、コメントアウト：Rev.1------------------------------------------




    //test 確認用メッセージボックスの表示
    //Browser.msgBox('タイムスタンプ "'+getDate+'" 付けの購入依頼を受け付けました');
    

    //＊Rev.1：以下、業務管理課 購買担当者 => 業務管理課 シート管理者 購買告知メール機能テスト　開始

    var pMailbody = ""; //メール本文の準備
    var pMailTo = ""; //メール送信先の準備
    var pOptions = ""; //BCCのアドレス追加、CCのアドレス追加等のメールオプション準備

    //メール送信先の設定
    //pMailTo = "btc_simdev@btc.ana-g.com"; //test
    //pOptions = {  bcc: 'bcc@btc.ana-g.com', cc: 'cc01@btc.ana-g.com, cc02@btc.ana-g.com' }; //test
    pMailTo = "t.hayashi@btc.ana-g.com, y.maeda@btc.ana-g.com"; //＊設定変更20/Dec/2023：佐々木退職により担当者宛先を変更
    //pOptions = { bcc: 'btc_simdev@btc.ana-g.com' }; //テストモニター用
	

    //発注確定項目の品目のプロパティ取得　＊オリジナル処理から効率化: Rev.5#2
	
	//オリジナル処理から効率化: Rev.5#2: 「Exceeded maximum execution time」対策の改修
    var pOrderItem = mySheet.getRange("E"+ myRow +":G"+myRow).getValues(); //発注品目のプロパティ設定値：指定セル行"myRow"の列範囲(E列～G列)で入力値指定
	
	// pOrderItem生成の効率化
	var range = mySheet.getRange("E"+ myRow +":G"+myRow); // getRange()メソッドを使用して、セルの範囲(E列～G列)を指定してrange変数に代入
	var values = range.getValues();//　range変数で指定したセル範囲の値を取得し、それをvalues変数に代入
	var pOrderItem = values[0].join(", "); //　values変数に格納した取得セル値の配列から、その配列の最初の要素をjoin(", ")メソッドを使用して、指定した区切り文字で連結して1つの文字列に変換
	
    
    //メール本文の設定
    pMailbody += "業務管理課 確認担当者様" + "\n\n" + "業務管理課 購買担当者により以下の品目の発注処理がされました。" + "\n\n" + "■購入申請一覧表 行番号：" + myRow + "\n" + "  品目(メーカー,品名,品番)：" + pOrderItem + "\n\n\n";//メール本文 プラス 改行

    // 承認スプレッドシートURLのメール本文への追加
    pMailbody += "承認URL：" + REFERENCE_URL;


    // 告知メールを送信：発注確定メール
	
	//＊旧メール送信メソッド：”Gmail.App”メール送信メソッドの変更　＊Rev.5#1改修
    //GmailApp.sendEmail(pMailTo, "整備用消耗品 業務管理課 購買担当 => 発注確定メール: ", pMailbody, pOptions);　//告知メールの送信 ＊改修前
	
	
	// Rev.5#3: MailApp.sendEmail()メソッドの呼び出し部分にエラーハンドリングを追加 *エラーハンドリング機能の追加
	try {
		
		//＊新メール送信メソッド：”MailApp”メール送信メソッドへの変更　＊Rev.5#1改修
		MailApp.sendEmail({to: pMailTo, subject: "整備用消耗品 業務管理課 購買担当 => 発注確定メール: ", body: pMailbody, cc: pOptions.cc, bcc: pOptions.bcc}); //告知メールの送信　＊改修後
		
		} catch (error) {
		
		// エラーメッセージを表示するか、ログに記録するなどの処理
		console.error("エラーが発生しました: " + error);
		
		}


    //test 確認用メッセージボックスの表示
    Browser.msgBox('購買処理管理者 "' + pMailTo + '" 宛に発注確定メールを送信しました');

    //＊Rev.1：以上、メール機能テスト　終了
    
    return; //処理の終了


    //アクティブセルが業務管理課 購買管理者 購買確定列の場合：処理指定
    } else if(myFlag == true && myCol == checkBoxCols3) {

	  //test 確認用メッセージボックスの表示
	  //Browser.msgBox('アクティブセル 列："' +myCol+ '"、行："' +myRow+ '" を検出しました');
    
    
    //承認・保護の実行 　
    var targetRange = mySheet.getRange("A"+myRow +":S"+myRow); //設定値：保護するセル行入力の範囲を列範囲で指定 => A列～S列 

    var protection = targetRange.protect(); //上記で指定したセル範囲を保護して
    
    protection.removeEditors(protection.getEditors()); //オーナー権限以外のアクセス権限者を抜く

    //test 確認用メッセージボックスの表示
    //Browser.msgBox('タイムスタンプ "'+getDate+'" 付けの購買処理を確定しました。');
    
    
    return; //処理の終了



    //アクティブセルが承認用チェックボックス列以外の場合：承認用チェックボックスの列以外は判定処理を除外
    } else if(myFlag == false && myCol == checkBoxCols3) {

    //test 確認用メッセージボックスの表示
	  //Browser.msgBox('アクティブセル 列："' +myCol+ '"、行："' +myRow+ '" を検出しました');
    
    
    //承認・保護の解除
    var protections = mySheet.getProtections(SpreadsheetApp.ProtectionType.RANGE);//シート内の保護を全て取得
  
    for (var i = 0; i < protections.length; i++) {

      var protection = protections[i];

      var pRow = protection.getRange().getRow();

      if (myRow == pRow) {//保護された行番号がアクティブセルの行と同じ場合、保護解除

        protection.remove();

      }
      
    }
    
    //test 確認用メッセージボックスの表示
    //Browser.msgBox('タイムスタンプ "'+getDate+'" 付けの購買確定を解除しました');
    
    return; //処理の終了
    
    

    //アクティブセルが承認用チェックボックス列以外の場合：承認用チェックボックスの列以外は判定処理を除外
    } else {
      
      return; //処理の終了
      
  }
  
  
  
}