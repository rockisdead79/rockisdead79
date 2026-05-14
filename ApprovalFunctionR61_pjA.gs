/**
 * ApprovalFunctionR61_pjA.gs
 * 整備用消耗品 購入依頼
 *
 * Rev.5: スプレッドシートURLを一元管理化（変数化）し、年度変更時の保守性を向上
 * Rev.6: リファクタリング - 設定ファイル化、共通ライブラリ化、命名改善、エラー処理統一
 * Rev.6: ファイル名更新 - ApprovalFunctionR60_pjA.gs
 * Rev.6.1: 実行時間上限チェックを追加し、"Exceeded maximum execution time" エラー対策を実装
 *
 * Takuya Hayashi, last update 14/May/2026
 */

/**
 * 承認チェックボックスの変更を処理
 * onEdit トリガーとして使用
 * 実行時間上限チェックを含む
 */
const EXECUTION_TIMEOUT_MS = 300000;

function hasExceededExecutionTimeout(startTime) {
  return Date.now() - startTime >= EXECUTION_TIMEOUT_MS;
}

function logExecutionTimeout(context) {
  console.warn(`[${context}] 処理時間上限に達したため中断しました。（${EXECUTION_TIMEOUT_MS}ms）`);
}

function handleApprovalCheck() {
  const startTime = Date.now();
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();
    const activeCell = spreadsheet.getActiveCell();

    const activeRow = activeCell.getRow();
    const activeColumn = activeCell.getColumn();
    const isChecked = activeCell.getValue();

    // 部署承認列がチェックされた場合
    if (isChecked && activeColumn === APPROVAL_CONFIG.COLUMNS.DEPT_APPROVAL) {
      handleDeptApproval(activeRow, sheet, startTime);
      return;
    }

    // 購買担当処理列がチェックされた場合
    if (isChecked && activeColumn === APPROVAL_CONFIG.COLUMNS.PURCHASE_PROCESS) {
      handlePurchaseProcess(activeRow, sheet, startTime);
      return;
    }

    // 最終承認列がチェックされた場合
    if (isChecked && activeColumn === APPROVAL_CONFIG.COLUMNS.FINAL_APPROVAL) {
      handleFinalApproval(activeRow, sheet, startTime);
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
function handleDeptApproval(row, sheet, startTime) {
  try {
    // 実行時間上限を超えていれば中断し、GASの実行制限エラーを回避します
    if (hasExceededExecutionTimeout(startTime)) {
      logExecutionTimeout("handleDeptApproval");
      return;
    }
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
function handlePurchaseProcess(row, sheet, startTime) {
  try {
    // 実行時間上限を超えていれば中断し、GASの実行制限エラーを回避します
    if (hasExceededExecutionTimeout(startTime)) {
      logExecutionTimeout("handlePurchaseProcess");
      return;
    }
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
function handleFinalApproval(row, sheet, startTime) {
  try {
    // 実行時間上限を超えていれば中断し、GASの実行制限エラーを回避します
    if (hasExceededExecutionTimeout(startTime)) {
      logExecutionTimeout("handleFinalApproval");
      return;
    }
    protectRow(row, sheet);
  } catch (error) {
    logError(error, "handleFinalApproval");
  }
}