export function formatDate(date: string) {
  const now = new Date(date);
  const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

  return utc;
}
