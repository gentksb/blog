#!/bin/bash

# PAAPI_DATASTORE KVキャッシュ全削除スクリプト
# PA-API v5 → Creators API 移行後に旧形式（PascalCase）キャッシュを削除するために使用

set -e

echo "PAAPI_DATASTORE キャッシュ全削除スクリプト"
echo "============================================"

if [[ -z "${CLOUDFLARE_API_TOKEN}" ]]; then
    echo "ERROR: CLOUDFLARE_API_TOKEN 環境変数が設定されていません"
    echo "https://developers.cloudflare.com/fundamentals/api/get-started/create-token/"
    exit 1
fi

if ! command -v jq &>/dev/null; then
    echo "ERROR: jq コマンドが見つかりません。brew install jq などでインストールしてください"
    exit 1
fi

# 一時ファイルを作成し、スクリプト終了時（正常・異常問わず）に自動削除
TEMP_FILE=$(mktemp /tmp/paapi_delete_XXXXXX.json)
trap 'rm -f "$TEMP_FILE"' EXIT

echo "Step 1: PAAPI_DATASTORE からキー一覧を取得中..."

KEY_LIST=$(pnpm wrangler kv key list --binding=PAAPI_DATASTORE --remote --preview false 2>/dev/null)

KEY_COUNT=$(echo "$KEY_LIST" | jq 'length')
echo "見つかったキー数: $KEY_COUNT"

if [[ "$KEY_COUNT" -eq 0 ]]; then
    echo "削除するキーがありません"
    exit 0
fi

# 削除用 JSON（文字列配列）を一時ファイルに書き込み
echo "$KEY_LIST" | jq '[.[].name]' >"$TEMP_FILE"

echo ""
echo "警告: この操作は取り消しできません！"
echo "PAAPI_DATASTORE から $KEY_COUNT 個のキーを削除します"
echo ""
read -p "続行しますか？ (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "キャンセルされました"
    exit 1
fi

echo "Step 2: バッチ削除を実行中..."
pnpm wrangler kv bulk delete --binding=PAAPI_DATASTORE --remote --preview false "$TEMP_FILE"

echo "PAAPI_DATASTORE キャッシュの削除が完了しました"
