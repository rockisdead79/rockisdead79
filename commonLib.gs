/**
 * commonLib.gs
 * 共通ライブラリ: projectA_整備用消耗品 の共通関数
 *
 * Takuya Hayashi, last update 12/May/2026
 */

/**
 * 参照URLを生成
 * @return {string} スプレッドシートの参照URL
 */
function generateReferenceUrl() {
  return SPREADSHEET_CONFIG.BASE_URL + SPREADSHEET_CONFIG.ID + "/edit?usp=sharing#gid=" + SPREADSHEET_CONFIG.SHEET_GID;
}

/**
 * 発注品目の情報を取得
 * @param {number} row - 行番号
 * @param {Sheet} sheet - シートオブジェクト
 * @return {string} 品目情報（メーカー,品名,品番）
 */
function getOrderItem(row, sheet) {
  try {
    const range = sheet.getRange(RANGE_CONFIG.ORDER_ITEM + row);
    const values = range.getValues();
    return values[0].join(", ");
  } catch (error) {
    logError(error, "getOrderItem");
    return "";
  }
}

/**
 * メール本文を生成（承認済 → 発注依頼）
 * @param {number} row - 行番号
 * @param {string} orderItem - 品目情報
 * @return {string} メール本文
 */
function generateApprovalToPurchaseBody(row, orderItem) {
  let body = "業務管理課 購買担当者様\n\n";
  body += "要求部署 承認担当者により以下の品目の購入承認がされました。\n\n";
  body += "■購入申請一覧表 行番号：" + row + "\n";
  body += "  品目(メーカー,品名,品番)：" + orderItem + "\n\n";
  body += "以下リンクから購入申請シートで申請内容を参照し、依頼品の発注手続きをお願いします。\n\n\n";
  body += "承認URL：" + generateReferenceUrl();
  return body;
}

/**
 * メール本文を生成（購買担当 → 管理者）
 * @param {number} row - 行番号
 * @param {string} orderItem - 品目情報
 * @return {string} メール本文
 */
function generatePurchaseToManagerBody(row, orderItem) {
  let body = "業務管理課 確認担当者様\n\n";
  body += "業務管理課 購買担当者により以下の品目の発注処理がされました。\n\n";
  body += "■購入申請一覧表 行番号：" + row + "\n";
  body += "  品目(メーカー,品名,品番)：" + orderItem + "\n\n\n";
  body += "承認URL：" + generateReferenceUrl();
  return body;
}

/**
 * メールを送信（エラーハンドリング付き）
 * @param {string} to - 宛先
 * @param {string} subject - 件名
 * @param {string} body - 本文
 * @param {Object} options - オプション（cc, bcc）
 */
function sendEmail(to, subject, body, options = {}) {
  try {
    const emailOptions = {
      to: to,
      subject: subject,
      body: body,
      ...options
    };
    MailApp.sendEmail(emailOptions);
  } catch (error) {
    logError(error, "sendEmail");
    SpreadsheetApp.getUi().alert(ERROR_MESSAGES.EMAIL_SEND_FAILED + " 詳細はログをご確認ください。");
  }
}

/**
 * 行を保護
 * @param {number} row - 行番号
 * @param {Sheet} sheet - シートオブジェクト
 */
function protectRow(row, sheet) {
  try {
    const targetRange = sheet.getRange(APPROVAL_CONFIG.PROTECTION_RANGE + row);
    const protection = targetRange.protect();
    protection.removeEditors(protection.getEditors());
  } catch (error) {
    logError(error, "protectRow");
  }
}

/**
 * 保護を解除
 * @param {number} row - 行番号
 * @param {Sheet} sheet - シートオブジェクト
 */
function unprotectRow(row, sheet) {
  try {
    const protections = sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE);
    for (const protection of protections) {
      const pRow = protection.getRange().getRow();
      if (pRow === row) {
        protection.remove();
        break;
      }
    }
  } catch (error) {
    logError(error, "unprotectRow");
  }
}

/**
 * エラーをログに記録
 * @param {Error} error - エラーオブジェクト
 * @param {string} context - エラーが発生したコンテキスト
 */
function logError(error, context) {
  console.error(`[${context}] ${error.message}`);
}

/**
 * タイムスタンプを取得
 * @param {number} row - 行番号
 * @param {Sheet} sheet - シートオブジェクト
 * @return {string} タイムスタンプ
 */
function getTimestamp(row, sheet) {
  try {
    const range = sheet.getRange(RANGE_CONFIG.TIMESTAMP + row);
    return range.getDisplayValue();
  } catch (error) {
    logError(error, "getTimestamp");
    return "";
  }
}