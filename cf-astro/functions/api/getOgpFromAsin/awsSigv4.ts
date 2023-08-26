// https://gist.github.com/mryhryki/58a1ad77a5e3f3ff14c23324c7b346af

/*
# AWS Signature V4
- https://docs.aws.amazon.com/ja_jp/general/latest/gr/signature-version-4.html
## How to use (Deno)
```shell
export AWS_ACCESS_KEY_ID="(Your AWS Access Key ID)"
export AWS_SECRET_ACCESS_KEY="(Your AWS Secret Access Key)"
export AWS_SESSION_TOKEN="(Your AWS Session Token)" # Optional
$ deno run \
    --allow-net=sts.ap-northeast-1.amazonaws.com \
    --allow-env=AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY,AWS_SESSION_TOKEN \
    "https://gist.githubusercontent.com/mryhryki/58a1ad77a5e3f3ff14c23324c7b346af/raw/991d7f0a8f31592a720bbb724af797bab8eb7afe/aws_signature_v4.ts"
```
*/

// ---------- Environment Variables ----------

const textToBin = (text: string): Uint8Array => new TextEncoder().encode(text)
const binToHexText = (buf: Uint8Array): string =>
  [...buf].map((b): string => b.toString(16).padStart(2, "0")).join("")

const digestSha256 = async (data: Uint8Array): Promise<Uint8Array> =>
  new Uint8Array(await crypto.subtle.digest("SHA-256", data))
// https://stackoverflow.com/a/56416039

const hmacSha256 = async (
  key: Uint8Array,
  message: Uint8Array
): Promise<Uint8Array> => {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    true,
    ["sign"]
  )
  const signedData = await crypto.subtle.sign("HMAC", cryptoKey, message)
  return new Uint8Array(signedData)
}

// ---------- AWS Signature V4 ----------

interface AwsParams {
  awsRegion: "us-west-2"
  awsService: "ProductAdvertisingAPI"
  awsAccessKeyId: string
  awsSecretAccessKey: string
  awsSessionToken?: string | null
}

export const signRequestForPaapiv5 = async (
  request: Request,
  params: AwsParams
): Promise<Request> => {
  const dateTimeText = new Date()
    .toISOString()
    .replace(/\.[0-9]{3}/, "")
    .replace(/[-:]/g, "")
  const dateText = dateTimeText.substring(0, 8)
  const url = new URL(request.url)
  const {
    awsRegion,
    awsService,
    awsAccessKeyId,
    awsSessionToken,
    awsSecretAccessKey
  } = params

  // https://github.com/cloudflare/workers-sdk/issues/3259
  // copy request w/o request.clone() method
  const requestCopy = new Request(request.url, {
    method: request.method,
    headers: request.headers,
    body: request.body
  })

  // Task1: https://docs.aws.amazon.com/general/latest/gr/sigv4-create-canonical-request.html
  const signedHeaders = new Headers({
    "Content-Encoding": request.headers.get("Content-Encoding") ?? "",
    Host: url.host,
    "X-Amz-Date": dateTimeText,
    "X-Amz-Target": request.headers.get("X-Amz-Target") ?? ""
  })
  const signedHeadersText: string = Array.from(signedHeaders.entries())
    .map(([key]) => key.toLowerCase())
    .sort()
    .join(";")
  const canonicalQueryString = Array.from(url.searchParams.entries())
    .map(
      ([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
    )
    .sort()
    .join("&")
  const canonicalHeaders: string = Array.from(signedHeaders.entries())
    .map(
      ([key, val]) =>
        `${key.toLowerCase().trim().replace(/ +/g, " ")}:${val
          .trim()
          .replace(/ +/g, " ")}\n`
    )
    .sort()
    .join("")
  const hashedPayload: string = binToHexText(
    await digestSha256(new Uint8Array(await request.arrayBuffer()))
  )

  const canonicalRequest: string = [
    request.method,
    url.pathname,
    canonicalQueryString,
    canonicalHeaders,
    signedHeadersText,
    hashedPayload
  ].join("\n")
  const hashedCanonicalRequest: string = binToHexText(
    await digestSha256(textToBin(canonicalRequest))
  )

  // Task2: https://docs.aws.amazon.com/general/latest/gr/sigv4-create-string-to-sign.html
  const stringToSign: string = [
    "AWS4-HMAC-SHA256",
    dateTimeText,
    `${dateText}/${awsRegion}/${awsService}/aws4_request`,
    hashedCanonicalRequest
  ].join("\n")

  // Task3: https://docs.aws.amazon.com/general/latest/gr/sigv4-calculate-signature.html
  const kDate = await hmacSha256(
    textToBin(`AWS4${awsSecretAccessKey}`),
    textToBin(dateText)
  )
  const kRegion = await hmacSha256(kDate, textToBin(awsRegion))
  const kService = await hmacSha256(kRegion, textToBin(awsService))
  const kSigning = await hmacSha256(kService, textToBin("aws4_request"))
  const signature = binToHexText(
    await hmacSha256(kSigning, textToBin(stringToSign))
  )

  // Task4: https://docs.aws.amazon.com/general/latest/gr/sigv4-add-signature-to-request.html
  const signedRequest = requestCopy
  signedHeaders.forEach((value, name) => signedRequest.headers.set(name, value))
  const credential = [
    awsAccessKeyId,
    dateText,
    awsRegion,
    awsService,
    "aws4_request"
  ].join("/")
  const authorization = `AWS4-HMAC-SHA256 Credential=${credential} SignedHeaders=${signedHeadersText}  Signature=${signature}`
  signedRequest.headers.set("Authorization", authorization)

  return signedRequest
}
