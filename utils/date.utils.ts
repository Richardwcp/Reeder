function getTimestampFromDate(dateStr: string): number {
  const dateObj = new Date(dateStr)
  return dateObj.getTime()
}

function getDateFromTimestamp(timestamp: number) {
  const dateObj = new Date(timestamp)
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth() + 1
  const day = dateObj.getDate()
  return `${day}/${month}/${year}`
}

export { getTimestampFromDate, getDateFromTimestamp }
