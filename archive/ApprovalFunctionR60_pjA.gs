/**
 * ApprovalFunctionR60_pjA.gs
 * 整備用消耗品 購入依頼
 *
 * Rev.5: スプレッドシートURLを一元管理化（変数化）し、年度変更時の保守性を向上
 * Rev.6: リファクタリング - 設定ファイル化、共通ライブラリ化、命名改善、エラー処理統一
 * Rev.6: ファイル名更新 - ApprovalFunctionR60_pjA.gs
 *
 * Takuya Hayashi, last update 12/May/2026
 */

/**
 * 承認チェックボックスの変更を処理
 * onEdit トリガーとして使用
 */
function handleApprovalCheck() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();
    const activeCell = spreadsheet.getActiveCell();

    const activeRow = activeCell.getRow();
    const activeColumn = activeCell.getColumn();
    const isChecked = activeCell.getValue();

    // 部署承認列がチェックされた場合
    if (isChecked && activeColumn === APPROVAL_CONFIG.COLUMNS.DEPT_APPROVAL) {
      handleDeptApproval(activeRow, sheet);
      return;
    }

    // 購買担当処理列がチェックされた場合
    if (isChecked && activeColumn === APPROVAL_CONFIG.COLUMNS.PURCHASE_PROCESS) {
      handlePurchaseProcess(activeRow, sheet);
      return;
    }

    // 最終承認列がチェックされた場合
    if (isChecked && activeColumn === APPROVAL_CONFIG.COLUMNS.FINAL_APPROVAL) {
      handleFinalApproval(activeRow, sheet);
      return;
    }

    // 最終承認列のチェックが外された場合
    if (!isChecked && activeColumn === APPROVAL_CONFIG.COLUMNS.FINAL_APPROVAL) {
      unprotectRow(activeRow, sheet);
      return;
    }

  } catch (error) {
    logError(error, "handleApprovalCheck");
  }
}

/**
 * 部署承認処理
 * @param {number} row - 行番号
 * @param {Sheet} sheet - シートオブジェクト
 */
function handleDeptApproval(row, sheet) {
  try {
    const orderItem = getOrderItem(row, sheet);
    const mailBody = generateApprovalToPurchaseBody(row, orderItem);
    const subject = EMAIL_CONFIG.SUBJECT_PREFIX + " 要求部門承認済 => 発注依頼メール: ";

    sendEmail(EMAIL_CONFIG.RECIPIENTS.DEPT_TO_PURCHASE, subject, mailBody, {
      cc: EMAIL_CONFIG.OPTIONS.CC_DEFAULT,
      bcc: EMAIL_CONFIG.OPTIONS.BCC_TEST
    });

    SpreadsheetApp.getUi().alert('購買担当者 "' + EMAIL_CONFIG.RECIPIENTS.DEPT_TO_PURCHASE + '" 宛に要求部門承認メールを送信しました');
  } catch (error) {
    logError(error, "handleDeptApproval");
  }
}

/**
 * 購買担当処理
 * @param {number} row - 行番号
 * @param {Sheet} sheet - シートオブジェクト
 */
function handlePurchaseProcess(row, sheet) {
  try {
    const orderItem = getOrderItem(row, sheet);
    const mailBody = generatePurchaseToManagerBody(row, orderItem);
    const subject = EMAIL_CONFIG.SUBJECT_PREFIX + " 業務管理課 購買担当 => 発注確定メール: ";

    sendEmail(EMAIL_CONFIG.RECIPIENTS.PURCHASE_TO_MANAGER, subject, mailBody, {
      bcc: EMAIL_CONFIG.OPTIONS.BCC_TEST
    });

    SpreadsheetApp.getUi().alert('購買処理管理者 "' + EMAIL_CONFIG.RECIPIENTS.PURCHASE_TO_MANAGER + '" 宛に発注確定メールを送信しました');
  } catch (error) {
    logError(error, "handlePurchaseProcess");
  }
}

/**
 * 最終承認処理
 * @param {number} row - 行番号
 * @param {Sheet} sheet - シートオブジェクト
 */
function handleFinalApproval(row, sheet) {
  try {
    protectRow(row, sheet);
  } catch (error) {
    logError(error, "handleFinalApproval");
  }
}
