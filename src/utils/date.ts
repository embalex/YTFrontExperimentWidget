export const getMonthAgoDate = (src: Date) => {
  src.setMonth(src.getMonth() - 1);
  return `${src.getFullYear()}-${src.getMonth().toString().padStart(2, '0')}-${src.getDate().toString().padStart(2, '0')}`;
};
