
export const getDateTimeFromDate = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  const customTimeString = `${hours}:${minutes}:${seconds}`;
  return customTimeString
}
