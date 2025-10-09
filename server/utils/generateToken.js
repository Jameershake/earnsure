import jwt from 'jsonwebtoken';

const generateToken = (userId, role, rememberMe = false) => {
  // Set expiry based on rememberMe
  const expiresIn = rememberMe ? '7d' : '30m'; // 7 days or 30 minutes

  return jwt.sign(
    { 
      _id: userId,
      role: role 
    },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

export default generateToken;
