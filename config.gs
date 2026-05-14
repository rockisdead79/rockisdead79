/**
 * config.gs
 * 設定ファイル: projectA_整備用消耗品 の設定を一元管理
 *
 * Takuya Hayashi, last update 12/May/2026
 */

// スプレッドシート設定
const SPREADSHEET_CONFIG = {
  ID: "1EKh8Go3nJcqsIA_Egtio5OD_vTmhx2Q5wjb37BpqKBg",
  SHEET_GID: "1562268145", // 2026年度用
  BASE_URL: "https://docs.google.com/spreadsheets/d/"
};

// 承認ワークフロー設定
const APPROVAL_CONFIG = {
  COLUMNS: {
    DEPT_APPROVAL: 17,    // Q列: 部署承認
    PURCHASE_PROCESS: 18, // R列: 購買担当処理
    FINAL_APPROVAL: 19    // S列: 最終承認
  },
  PROTECTION_RANGE: "A:S" // 保護範囲
};

// メール設定
const EMAIL_CONFIG = {
  SUBJECT_PREFIX: "整備用消耗品",
  RECIPIENTS: {
    DEPT_TO_PURCHASE: "s.mizuno@btc.ana-g.com, k.arakawa@btc.ana-g.com",
    PURCHASE_TO_MANAGER: "t.hayashi@btc.ana-g.com, y.maeda@btc.ana-g.com"
  },
  OPTIONS: {
    BCC_TEST: "btc_simdev@btc.ana-g.com",
    CC_DEFAULT: "s.fukushima@btc.ana-g.com, y.maeda@btc.ana-g.com"
  },
  REPLY_TO: "btc_simdev@btc.ana-g.com"
};

// フォーム設定
const FORM_CONFIG = {
  APPROVERS: {
    "業務管理課": "s.arita@btc.ana-g.com",
    "品質企画課": "t.kswamoto@btc.ana-g.com",
    "整備技術課": "y.yamazaki@btc.ana-g.com"
  },
  SUBJECT_SUFFIX: "購入要求の承認依頼"
};

// 範囲設定
const RANGE_CONFIG = {
  ORDER_ITEM: "E:G", // メーカー,品名,品番
  TIMESTAMP: "A",     // 日付列
  APPROVAL_CHECKBOX: "S2:S1000" // 承認用チェックボックス欄
};

// エラーメッセージ
const ERROR_MESSAGES = {
  SPREADSHEET_NOT_FOUND: "スプレッドシートを取得できません。",
  RANGE_NOT_FOUND: "範囲を取得できません。",
  PROTECTION_FAILED: "保護を設定できません。",
  EMAIL_SEND_FAILED: "メール送信中にエラーが発生しました。"
};