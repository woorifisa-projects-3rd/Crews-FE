export const dateTime = (dateStr = new Date().toISOString()) => {
  const today = new Date(dateStr);
  today.setHours(today.getHours());
  return today.toISOString().replaceAll('-', '.').replace('T', ' ').substring(0, 16);
};

export const date = (dateStr = new Date().toISOString()) => {
  const today = new Date(dateStr);
  today.setHours(today.getHours());
  return today.toISOString().split('T')[0].replaceAll('-', '.');
};
