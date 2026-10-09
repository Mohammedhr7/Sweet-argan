export const money = (value: number) => new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(value);
