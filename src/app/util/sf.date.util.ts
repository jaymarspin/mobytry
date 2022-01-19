export function parseSFDate(dateString: string): Date {
  if (!dateString) {
    return null;
  }
  dateString = dateString.replace(/\+.+$/g, 'Z');
  const rv = new Date(dateString);
  return rv;
}
