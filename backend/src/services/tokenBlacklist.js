// ── Token Blacklist ───────────────────────────────────────
// Blacklist em memória para invalidação imediata de JWTs no logout/troca de senha.
// Usa um Set de jti (JWT ID) com limpeza automática via setTimeout baseada no exp do token.
//
// Limitação conhecida e aceita: a blacklist é resetada ao reiniciar o processo.
// Mitigação: tokens têm vida curta (15 min), então mesmo após restart o risco
// é mínimo. Para deploy multi-container, substituir o Set por Redis SETEX —
// a interface (blacklistToken / isBlacklisted) permanece a mesma.

const blacklist = new Set();

/**
 * Adiciona o jti de um token à blacklist até o seu vencimento natural.
 * @param {string} jti - JWT ID (claim `jti` do token)
 * @param {number} exp - Timestamp de expiração do JWT em segundos (Unix)
 */
export function blacklistToken(jti, exp) {
  blacklist.add(jti);
  const msUntilExpiry = exp * 1000 - Date.now();
  if (msUntilExpiry > 0) {
    setTimeout(() => blacklist.delete(jti), msUntilExpiry);
  }
}

/**
 * Verifica se um jti está na blacklist (token foi invalidado).
 * @param {string} jti
 * @returns {boolean}
 */
export function isBlacklisted(jti) {
  return blacklist.has(jti);
}
