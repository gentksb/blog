import { ExternalLinkIcon } from "@chakra-ui/icons"
import { Box, Image, Link, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"

interface Props {
  url : string
  image_url?: string
}

//前提知識
// 一部は画像が取得できないことがある
// https://images-na.ssl-images-amazon.com/images/P/[ASIN,ISBN].[国コード].[画像の種類].jpg
// ASIN/ISBN
// [ASIN,ISBN]の部分にはASINコード、またはISBNコードを記載します。通常はASINコードですが書籍の一部にはISBNコードしかないものもあり、その場合は"ISBN-10"のコードを設定します。
// 国コード
// [国コード]の部分には国のコードを指定します。日本は"09"です。
// 画像の種類
// [画像の種類]には取得する画像の大きさを表すコードを設定します。各値は以下の通りです。
// THUMBZZZ	サムネイル画像を取得します。	75×75	52×75	長辺が75ピクセルの画像を取得します
// TZZZZZZZ	小サイズの画像を取得します。	110×110	77×110	長辺が110ピクセルの画像を取得します
// MZZZZZZZ	中サイズの画像を取得します。	160×160	112×160	長辺が160ピクセルの画像を取得します
// LZZZZZZZ	大サイズの画像を取得します。	500×500	349×500	長辺が500ピクセルの画像を取得します。ただしオリジナルの画像サイズが500ピクセルより小さい場合は原寸の画像を表示します。

const proxyUrl = "https://cors-anywhere.herokuapp.com/"
const headers = { 'x-requested-with': '' }

const LinkBox: React.FunctionComponent<Props> = ( {url, image_url} ) => {
  const [ogpData, changeOgpData] = useState(Object)
  const urlDomain = "amazon.co.jp"

  useEffect(() => {
    try {
      fetch( proxyUrl + url, {headers: headers})
        .then(res => res.text())
        .then(data => {
          // console.log(data)
          const document = new DOMParser().parseFromString(data, "text/html")
          const title = document.querySelector("meta[property='og:title']")?.getAttribute('content') || document.querySelector("meta[name='title']")?.getAttribute('content') || document.querySelector('title')?.innerText || ""
          const asin = document.querySelector("#ASIN")?.getAttribute('value')
          const imageUrl = image_url || `https://images-na.ssl-images-amazon.com/images/P/${asin}.09.MZZZZZZZ.jpg`
          const description = document.querySelector("meta[property='og:description']")?.getAttribute('content') || document.querySelector("meta[name='description']")?.getAttribute('content') || ""
          const siteName = document.querySelector("meta[property='og:site_name']")?.getAttribute('content') || urlDomain
          const siteIcon = "https://www.amazon.co.jp/favicon.ico"
          console.log(title, imageUrl, description, siteName, siteIcon)
          changeOgpData(
            {
              title: title,
              imageUrl: imageUrl,
              description: description,
              siteName: siteName,
              ogpIcon: siteIcon
            }
          )
        })
    } catch (error) {
      console.error(error)
    }
  },[])
//データの取得ルールだけ変更して他はそのままにする

  return (
    <Box p={4} display="flex" borderWidth="1px" borderRadius="xl">
      <Box flexShrink={1}>
        <Image
          borderRadius="lg"
          src={ogpData.imageUrl}
          alt={ogpData.title}
          fit="cover"
          fallbackSrc="https://via.placeholder.com/150?text=NoImage"
        />
      </Box>
      <Box flexShrink={1} mt={{ base: 4, md: 0 }} ml={{ md: 6 }}>
        <Link
          mt={1}
          display="block"
          fontSize="lg"
          lineHeight="normal"
          fontWeight="semibold"
          href={url}
          isExternal
        >
          <Text noOfLines={[1,1,2,2]} as="span"><ExternalLinkIcon />{ogpData.title}</Text>
        </Link>
        <Text as="span" fontSize="sm" color="gray.500" dangerouslySetInnerHTML={{__html:ogpData.description}} noOfLines={[1,2,2,3]} />
          <Link isExternal href={url}>
            <Text
              as="span"
              fontSize="sm"
              letterSpacing="wide"
              color="teal.600"
              display="inline-flex"
              fontWeight="Bold"
              mt={3}
            >
          <Image src={ogpData.ogpIcon} alt="favicon" maxHeight="2em" fallbackSrc="https://via.placeholder.com/24?text=favicon" />{ogpData.siteName}
          </Text> 
        </Link>
      </Box>
    </Box>
  )
}

export default LinkBox