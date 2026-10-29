export function formatearFechaISO(fecha: Date): string {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

export function montoANumero(valor: number | string): number {
  if (typeof valor === 'number') return valor;

  const limpio = String(valor ?? '').replace(/[^\d.,-]/g, '');
  const posSeparador = Math.max(limpio.lastIndexOf('.'), limpio.lastIndexOf(','));

  let texto: string;
  if (posSeparador !== -1 && limpio.length - posSeparador - 1 === 2) {
    // Los dos últimos dígitos son los centavos (formato money de Postgres)
    const entero = limpio.slice(0, posSeparador).replace(/[.,]/g, '');
    texto = `${entero}.${limpio.slice(posSeparador + 1)}`;
  } else {
    texto = limpio.replace(/[.,]/g, '');
  }

  const numero = Number(texto);
  return Number.isNaN(numero) ? 0 : numero;
}