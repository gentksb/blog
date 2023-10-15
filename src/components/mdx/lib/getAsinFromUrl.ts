export const getAsinFromUrl = (url: string) => {
  const re = RegExp(/[^0-9A-Z]([0-9A-Z]{10})([^0-9A-Z]|$)/)
  const hitData = re.exec(url)
  if (hitData !== null) {
    return hitData[1]
  } else {
    throw new Error("ASIN not found in URL")
  }
}
