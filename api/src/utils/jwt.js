import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRY = "15m";  
const REFRESH_TOKEN_EXPIRY = "7d";  

// Luo access token
export function generateAccessToken(username, user_id, shareToken) {
  return jwt.sign(
    { username, user_id},
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
}

// Luo refresh token
export function generateRefreshToken(username, user_id, shareToken) {
  return jwt.sign(
    { username, user_id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
}

// Validoi access token
export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    return null;
  }
}

// Validoi refresh token
export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
}