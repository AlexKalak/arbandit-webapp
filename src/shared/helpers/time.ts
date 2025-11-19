
enum Month {
  Jan = 0,
  Feb,
  Mar,
  Apr,
  May,
  Jun,
  Jul,
  Aug,
  Sep,
  Oct,
  Nov,
  Dec,
}

export const getDateTimeFromDate = (date: Date): string => {
  const day = date.getDate()
  const month = Month[date.getMonth()]
  const year = date.getFullYear()

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  const customTimeString = `${year} ${month} ${day} ${hours}:${minutes}:${seconds}`;
  return customTimeString
}
