export const formatCurrency = (value: number | undefined | null): string => {
  // Si el valor es undefined, null o no es un número, retorna un formato por defecto.
  if (value === undefined || value === null || isNaN(value)) {
    return '$0';
  }
  // Asegúrate de trabajar con un número.
  const numberValue = typeof value === 'string' ? parseFloat(value) : value;
  // Opcional: usa un polyfill o librería para Android si ves que no formatea bien.
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(numberValue);
};