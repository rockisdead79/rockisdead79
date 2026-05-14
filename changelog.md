# 【projectA 整備消耗品 購買ワークフロー】

## Rev.6: リファクタリング - 設定ファイル化、共通ライブラリ化、命名改善、エラー処理統一
- **設定ファイルの作成**: `config.gs` で全設定を一元管理。
- **共通ライブラリの作成**: `commonLib.gs` で共通関数を抽出。
- **関数リファクタリング**: 各スクリプトの関数を整理・命名改善。
- **エラー処理統一**: try-catch を全関数に適用、一貫したエラーハンドリング。
- **モジュール化**: 機能を独立した関数に分割。

## Rev.6（追記）: ソースファイルのバージョン管理の為、ファイル名更新
- **initSheet_pjA.gs** → **initSheetR1_pjA.gs**: バージョン番号を明示的に付与。
- **sendFormR1_pjA.gs** → **sendFormR2_pjA.gs**: バージョン番号を更新。
- **README.md 更新**: 全ファイル名参照を新しい命名に修正。

## Rev.6.1: ApprovalFunctionR61_pjA.gs に実行時間上限チェックを追加
- `ApprovalFunctionR61_pjA.gs` に `handleApprovalCheck()` の実行時間監視ロジックを追加。
- `handleDeptApproval()` / `handlePurchaseProcess()` / `handleFinalApproval()` でタイムアウト判定を実施。
- `README.md` と `ApprovalFunctionR61_pjA.gs` ヘッダーを更新。

---
*Created Takuya Hayashi, Last Updated: 14/May/2026*