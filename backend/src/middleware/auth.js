import jwt from 'jsonwebtoken';
import { isBlacklisted } from '../services/tokenBlacklist.js';

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verifica se o token foi explicitamente invalidado (logout ou troca de senha)
    if (decoded.jti && isBlacklisted(decoded.jti)) {
      return res.status(401).json({ message: 'Token revogado. Faça login novamente.' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
