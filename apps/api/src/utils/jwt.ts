import jwt from "jsonwebtoken";
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing from environment variables.");
  }

  return secret;
}

const jwtSecret = getJwtSecret();

if (!jwtSecret) {
  throw new Error("JWT_SECRET is missing from environment variables.");
}

export function generateAccessToken(user: {
  id: string;
  email: string;
  sessionId: string;
}) {
  return jwt.sign(
    {
      email: user.email,
      sid: user.sessionId,
    },
    jwtSecret,
    {
      subject: user.id,
      expiresIn: "15m",
      issuer: "daynix-api",
      audience: "daynix-app",
    },
  );
}
