#!/bin/bash

# 画像リサイズスクリプト：src/content配下の横幅1200px以上の画像を1200px以下にリサイズ

# 一時ファイルでカウンターを管理
temp_file=$(mktemp)
echo "0 0" > "$temp_file"

echo "画像リサイズ処理を開始します..."
echo "対象ディレクトリ: src/content"
echo "条件: 横幅1200px以上の画像を1200px以下にリサイズ"
echo ""

# 対象画像ファイルを検索
find src/content -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.webp" \) | while read image; do
    # 現在のカウンター値を読み込み
    read total_images processed_images < "$temp_file"
    total_images=$((total_images + 1))
    
    # 画像の横幅を取得
    width=$(identify -ping -format '%w' "$image" 2>/dev/null)
    
    # 横幅が数値でない場合はスキップ
    if ! [[ "$width" =~ ^[0-9]+$ ]]; then
        echo "警告: $image - 横幅を取得できませんでした"
        echo "$total_images $processed_images" > "$temp_file"
        continue
    fi
    
    # 横幅が1200px以上の場合のみ処理
    if [ "$width" -gt 1200 ]; then
        echo "処理中: $image (${width}px → 1200px)"
        
        # バックアップ作成
        cp "$image" "${image}.bak"
        
        # リサイズ実行
        if mogrify -resize 1200x\> "$image"; then
            # 処理後の横幅を確認
            new_width=$(identify -ping -format '%w' "$image" 2>/dev/null)
            echo "完了: $image (${new_width}px)"
            processed_images=$((processed_images + 1))
        else
            echo "エラー: $image - リサイズに失敗しました"
            # バックアップから復元
            mv "${image}.bak" "$image"
            echo "$total_images $processed_images" > "$temp_file"
            continue
        fi
        
        # バックアップを削除
        rm -f "${image}.bak"
    fi
    
    # カウンターを更新
    echo "$total_images $processed_images" > "$temp_file"
done

# 最終結果を表示
read total_images processed_images < "$temp_file"
echo ""
echo "処理完了！"
echo "確認した画像: $total_images 個"
echo "リサイズした画像: $processed_images 個"

# 一時ファイルを削除
rm -f "$temp_file"