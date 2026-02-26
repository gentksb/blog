#!/bin/bash

# OGP_DATASTORE KVキャッシュ全削除スクリプト

set -e

echo "OGP_DATASTORE キャッシュ全削除スクリプト"
echo "========================================="

if [[ -z "${CLOUDFLARE_API_TOKEN}" ]]; then
    echo "ERROR: CLOUDFLARE_API_TOKEN 環境変数が設定されていません"
    echo "https://developers.cloudflare.com/fundamentals/api/get-started/create-token/"
    exit 1
fi

if ! command -v jq &>/dev/null; then
    echo "ERROR: jq コマンドが見つかりません。brew install jq などでインストールしてください"
    exit 1
fi

TEMP_FILE=$(mktemp /tmp/ogp_delete_XXXXXX.json)
trap 'rm -f "$TEMP_FILE"' EXIT

echo "Step 1: OGP_DATASTORE からキー一覧を取得中..."

KEY_LIST=$(pnpm wrangler kv key list --binding=OGP_DATASTORE --remote --preview false 2>/dev/null)

KEY_COUNT=$(echo "$KEY_LIST" | jq 'length')
echo "見つかったキー数: $KEY_COUNT"

if [[ "$KEY_COUNT" -eq 0 ]]; then
    echo "削除するキーがありません"
    exit 0
fi

echo "$KEY_LIST" | jq '[.[].name]' >"$TEMP_FILE"

echo ""
echo "警告: この操作は取り消しできません！"
echo "OGP_DATASTORE から $KEY_COUNT 個のキーを削除します"
echo ""
read -p "続行しますか？ (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "キャンセルされました"
    exit 1
fi

echo "Step 2: バッチ削除を実行中..."
pnpm wrangler kv bulk delete --binding=OGP_DATASTORE --remote --preview false "$TEMP_FILE"

echo "OGP_DATASTORE キャッシュの削除が完了しました"
