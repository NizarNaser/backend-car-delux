const authMiddeleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not Authorized, Login Again" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // الآن لدينا: decoded.id و decoded.name
    req.user = { id: decoded.id, name: decoded.name };

    next();
  } catch (error) {
    console.log("JWT Error:", error.message);
    res.status(403).json({ success: false, message: "Invalid or Expired Token" });
  }
};
