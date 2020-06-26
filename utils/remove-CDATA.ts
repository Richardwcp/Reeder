function removeCDATA(str: string): string {
  const regex = /^(\/\/\s*)?<!\[CDATA\[|(\/\/\s*)?\]\]>$/g
  const newStr = str.replace(regex, '')

  return newStr
}

export { removeCDATA }
