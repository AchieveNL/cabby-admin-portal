import dayjs from 'dayjs';

export const formatToEuro = (n: number) => {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(n);
};

export const formatDate = (date: string) =>
  dayjs(date).format('DD/MM/YYYY • hh:mm');
