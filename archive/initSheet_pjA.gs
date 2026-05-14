/**
 * 承認チエックボックス欄の保護
 * 
 * Rev.1: 仕様変更：最終承認欄を”R”列から"S"列に変更
 * Rev.2: 運用テスト用にメッセージボックス表示設定の軽微な変更
 * 
 * Rev.3: エラーハンドリング機能の追加
 * 
 * takuya hayashi, last updated 23/Oct/2024
 * 
 */


// 承認欄のアクセス権を保護する関数
function initSheet() {
//function onOpen() {
  
  //Rev.3: エラーハンドリング機能の追加
  try {
    
    //承認用チェックボックス欄をオーナー以外の編集者から保護する。以下
    
    var ss = SpreadsheetApp.getActive();
	
    if (!ss) throw new Error('スプレッドシートを取得できません。'); //エラーハンドリング#1
    
	
    var range = ss.getRange('S2:S1000'); //設定：承認用チエックボックス欄の範囲を指定　例：S列2行目～1000行目
	
    if (!range) throw new Error('範囲を取得できません。'); //エラーハンドリング#2
    
	
    var protection = range.protect(); //設定範囲を保護
	
    if (!protection) throw new Error('保護を設定できません。'); //エラーハンドリング#3
    
    // ＊保護方法手順を改修案に変更
    //protection.removeEditors(protection.getEditors()); //保護範囲のオーナー権限以外のアクセス権限者を抜く


    // ＊以下、保護手順を改修案

    // 一時的に保護を解除して編集を行う
    protection.remove();
    range.setValues(range.getValues()); // 例：値を取得して再設定することで編集を行う
    
    // 保護を再度設定する
    protection = range.protect();
    protection.removeEditors(protection.getEditors()); //保護範囲のオーナー権限以外のアクセス権限者を抜く

    // 以上、改修案


    //test エラーが無い場合、確認用メッセージボックスの表示
    //Browser.msgBox('承認欄のアクセス権を保護しました。');
    SpreadsheetApp.getUi().alert('承認欄のアクセス権を保護しました。');
    
    } catch (error) {
	  
    //test エラーが発生した場合、エラーメッセージを表示
    //Browser.msgBox('承認欄のアクセス権保護の処理でエラーが発生しました：' + error.message); //エラーハンドリング#4
    //SpreadsheetApp.getUi().alert('承認欄のアクセス権保護の処理でエラーが発生しました：' + error.message);  //エラーハンドリング#4
    
  }
  
}


// スプレッドシートが開かれたときのイベントハンドラに関数を設定 ＊イベントハンドラーのCall方法の選択肢として
function onOpen() {
	
  initSheet();
  
}
