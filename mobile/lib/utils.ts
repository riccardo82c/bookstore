/**
 * Formatta una data nel formato "MMM YYYY" (es. "Jan 2024")
 * @param {Date} dateString - La data da formattare
 * @returns {string} La data formattata nel formato mese abbreviato e anno
 */
export function formatMemberSince(dateString: string) {
  const date = new Date(dateString)
  const month = date.toLocaleString("en-US", { month: "short" })
  const year = date.getFullYear()
  return `${month} ${year}`
}

/**
 * Formatta una data nel formato "Month DD, YYYY" (es. "January 1, 2024")
 * @param {Date} dateString - La data da formattare
 * @returns {string} La data formattata nel formato mese completo, giorno e anno
 */
export function formatPublishDate(dateString: string) {
  const date = new Date(dateString)
  const month = date.toLocaleString("en-US", { month: "long" })
  const day = date.getDate()
  const year = date.getFullYear()
  return `${month} ${day}, ${year}`
}

/**
 * Ferma l'esecuzione per un numero di millisecondi
 * @param {number} ms - Il numero di millisecondi da aspettare
 * @returns {Promise<void>} Una promessa che risolve dopo che il tempo è scaduto
 */
export function sleep (ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
