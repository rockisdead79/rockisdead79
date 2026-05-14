/**
 * initSheetR1_pjA.gs
 * シート初期化処理: 承認チェックボックス欄の保護
 *
 * Rev.3: エラーハンドリング機能の追加
 * Rev.4: リファクタリング - 設定ファイル化、共通ライブラリ化、命名改善
 * Rev.5: 範囲設定をconfig.gsに移動
 * Rev.6: ファイル名更新 - initSheet_pjA.gs → initSheetR1_pjA.gs
 *
 * Takuya Hayashi, last updated 12/May/2026
 */

/**
 * 承認欄のアクセス権を保護する関数
 */
function initializeSheetProtection() {
  try {
    const spreadsheet = SpreadsheetApp.getActive();
    if (!spreadsheet) throw new Error(ERROR_MESSAGES.SPREADSHEET_NOT_FOUND);

    const range = spreadsheet.getRange(RANGE_CONFIG.APPROVAL_CHECKBOX);
    if (!range) throw new Error(ERROR_MESSAGES.RANGE_NOT_FOUND);

    let protection = range.protect();
    if (!protection) throw new Error(ERROR_MESSAGES.PROTECTION_FAILED);

    // 一時的に保護を解除して編集を行う
    protection.remove();
    range.setValues(range.getValues()); // 値を再設定

    // 保護を再度設定
    protection = range.protect();
    protection.removeEditors(protection.getEditors());

    SpreadsheetApp.getUi().alert('承認欄のアクセス権を保護しました。');

  } catch (error) {
    logError(error, "initializeSheetProtection");
    SpreadsheetApp.getUi().alert('承認欄のアクセス権保護の処理でエラーが発生しました：' + error.message);
  }
}

/**
 * スプレッドシートが開かれたときのイベントハンドラ
 */
function onOpen() {
  initializeSheetProtection();
}
