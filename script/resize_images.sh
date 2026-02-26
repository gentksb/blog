#!/bin/bash

# 画像リサイズスクリプト：src/content配下の横幅1200px以上の画像を1200px以下にリサイズ

# ツールの存在確認（ImageMagick優先、なければ sips にフォールバック）
USE_IMAGEMAGICK=false
USE_SIPS=false

if command -v identify >/dev/null 2>&1 && command -v mogrify >/dev/null 2>&1; then
    USE_IMAGEMAGICK=true
elif command -v sips >/dev/null 2>&1; then
    USE_SIPS=true
else
    echo "エラー: 画像処理ツールが見つかりません"
    echo "  macOS: sips は標準搭載されています（通常インストール不要）"
    echo "  ImageMagick: brew install imagemagick でインストール可能です"
    exit 1
fi

if [ "$USE_IMAGEMAGICK" = true ]; then
    echo "使用ツール: ImageMagick"
else
    echo "使用ツール: sips (macOS標準)"
fi

# 横幅取得関数
get_width() {
    local image="$1"
    if [ "$USE_IMAGEMAGICK" = true ]; then
        identify -ping -format '%w' "$image" 2>/dev/null
    else
        sips -g pixelWidth "$image" 2>/dev/null | awk '/pixelWidth:/{print $2}'
    fi
}

# リサイズ関数（横幅を1200pxに縮小、アスペクト比維持）
resize_image() {
    local image="$1"
    if [ "$USE_IMAGEMAGICK" = true ]; then
        mogrify -resize 1200x\> "$image"
    else
        sips --resampleWidth 1200 "$image" >/dev/null 2>&1
    fi
}

# 一時ファイルでカウンターを管理
temp_file=$(mktemp)
echo "0 0" > "$temp_file"

echo "画像リサイズ処理を開始します..."
echo "対象ディレクトリ: src/content"
echo "条件: 横幅1200px以上の画像を1200px以下にリサイズ"
echo ""

# 対象画像ファイルを検索
find src/content -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.webp" \) | while read image; do
    read total_images processed_images < "$temp_file"
    total_images=$((total_images + 1))

    width=$(get_width "$image")

    if ! [[ "$width" =~ ^[0-9]+$ ]]; then
        echo "警告: $image - 横幅を取得できませんでした"
        echo "$total_images $processed_images" > "$temp_file"
        continue
    fi

    if [ "$width" -gt 1200 ]; then
        echo "処理中: $image (${width}px → 1200px)"

        cp "$image" "${image}.bak"

        if resize_image "$image"; then
            new_width=$(get_width "$image")
            echo "完了: $image (${new_width}px)"
            processed_images=$((processed_images + 1))
        else
            echo "エラー: $image - リサイズに失敗しました"
            mv "${image}.bak" "$image"
            echo "$total_images $processed_images" > "$temp_file"
            continue
        fi

        rm -f "${image}.bak"
    fi

    echo "$total_images $processed_images" > "$temp_file"
done

read total_images processed_images < "$temp_file"
echo ""
echo "処理完了！"
echo "確認した画像: $total_images 個"
echo "リサイズした画像: $processed_images 個"

rm -f "$temp_file"
