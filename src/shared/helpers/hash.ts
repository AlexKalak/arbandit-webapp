import { createHash } from "crypto"

export const generateMd5Hash = (object: unknown): string => {
  const hash = createHash('md5')
  hash.update(JSON.stringify(object))
  return hash.digest('hex')
}

