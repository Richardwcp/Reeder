const normaliseEmail = (email: string) => {
  return lowerCase(trim(email))
}

const trim = (str: string) => {
  return str.replace(/\s+/g, '')
}

const lowerCase = (str: string) => {
  return str.toLowerCase()
}

const normalisePassword = (password: string) => {
  return trim(password)
}

export { normaliseEmail, normalisePassword, trim }
