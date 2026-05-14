/**
 * sendFormR2_pjA.gs
 * フォーム送信時の承認依頼メール送信
 *
 * Rev.6: 部署名の変更に伴い、Form、スクリプト上の名称変更
 * Rev.7: リファクタリング - 設定ファイル化、共通ライブラリ化、命名改善、エラー処理統一
 * Rev.8: ファイル名更新 - sendFormR1_pjA.gs → sendFormR2_pjA.gs
 *
 * Takuya Hayashi, last update 12/May/2026
 */

/**
 * フォーム送信時の承認依頼メール送信
 * @param {Object} event - フォーム送信イベント
 */
function sendApprovalRequestEmail(event) {
  try {
    const items = event.response.getItemResponses();
    let mailBody = "";
    let recipientEmail = "";
    let applicantName = "";

    const options = {
      name: "業務管理課 整備用消耗品 購買担当：",
      replyTo: EMAIL_CONFIG.REPLY_TO
    };

    for (const item of items) {
      const question = item.getItem().getTitle();
      const answer = item.getResponse();

      mailBody += question + ": " + answer + "\n\n";

      // 送信先メールアドレス振り分け
      if (question === "所属課" && FORM_CONFIG.APPROVERS[answer]) {
        recipientEmail = FORM_CONFIG.APPROVERS[answer];
      }

      // 申請者氏名を取得
      if (question === "申請者氏名") {
        applicantName = answer;
      }
    }

    // 承認スプレッドシートURLの記載
    mailBody += "承認URL：" + generateReferenceUrl();

    // 承認依頼メールを送信
    const subject = EMAIL_CONFIG.SUBJECT_PREFIX + " " + FORM_CONFIG.SUBJECT_SUFFIX + " : " + applicantName;
    GmailApp.sendEmail(recipientEmail, subject, mailBody, options);

  } catch (error) {
    logError(error, "sendApprovalRequestEmail");
  }
}
