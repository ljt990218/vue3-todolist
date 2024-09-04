export function formatDate(date: Date, fmt: string = 'y-m-d') {
  const time = new Date(date)

  const year = time.getUTCFullYear()
  const month = String(time.getUTCMonth() + 1).padStart(2, '0')
  const day = String(time.getUTCDate()).padStart(2, '0')
  const hours = String(time.getUTCHours()).padStart(2, '0')
  const minutes = String(time.getUTCMinutes()).padStart(2, '0')
  const seconds = String(time.getUTCSeconds()).padStart(2, '0')

  if (fmt === 'y-m-d')
    return `${year}-${month}-${day}`
  if (fmt === 'y-m-d-h-m-s')
    return `${year}-${month}-${day} ${hours}-${minutes}-${seconds}`
}
