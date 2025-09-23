export const formatDate = (date: any) => {
  const validDate: any = new Date(date);

  if (isNaN(validDate)) {
    throw new Error('Invalid date');
  }
  const year = validDate.getFullYear();
  const month = String(validDate.getMonth() + 1).padStart(2, '0');
  const day = String(validDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
