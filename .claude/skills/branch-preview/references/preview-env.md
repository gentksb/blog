# プレビュー環境の特性

Worker Previews は本番の設定を引き継がず、`wrangler.jsonc` の `previews` ブロックの値で動く。

## KV

| バインディング    | Preview                                                       | ローカル（`pnpm dev`） |
| ----------------- | ------------------------------------------------------------- | ---------------------- |
| `OGP_DATASTORE`   | Preview専用（`blog-OGP_DATASTORE-previews`）を全Previewで共有 | `preview_id`           |
| `PAAPI_DATASTORE` | 本番と共有                                                    | `preview_id`           |

PAAPIを本番と共有するのは、空のキャッシュから Creators API を呼ぶと 429 が増えるため。キャッシュ形式を変えるPRでは、Previewが本番のPAAPIキャッシュへ書き込む点に注意する。

## シークレット

- Preview作成時に Base configuration のシークレットがコピーされる。後から Base を変えても既存の Preview には反映されない
- Base には `PARTNER_TAG` と `CREATORS_CREDENTIAL_*` だけを登録する。`SLACK_WEBHOOK_URL` は未登録なので、Previewのエラーは Slack に通知されない

## Previewで動かないもの

- Cron Triggers（予約マージの判定）
- `wrangler tail`

## 環境識別

- `astro.config.ts` は `WORKERS_CI_BRANCH === "master"` のときだけ Cloudflare Image Resizing を使い、それ以外は `passthrough`

## OGP キャッシュ陳腐化

PreviewでのOGPカード画像リンク切れは、KVキャッシュの陳腐化が原因の可能性が高い。Cloudflare Dashboard で `blog-OGP_DATASTORE-previews`（`0f58f79f97954e50b2827ef25df87110`）のエントリを削除して解消する。
