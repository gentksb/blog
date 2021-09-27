import "prismjs/themes/prism-tomorrow.css"
import { initializeApp } from "firebase/app"
import { firebaseConfig } from "./src/utils/firebaseConfig"

const config = firebaseConfig

export const onClientEntry = () => {
  console.log(JSON.stringify(config))
  const firebaseApp = initializeApp(config)
}
