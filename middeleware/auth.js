import jwt from "jsonwebtoken";

const authMiddeleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not Authorized, Login Again" });
  }

  const token = authHeader.split(" ")[1]; // نفصل الكلمة Bearer عن التوكن الحقيقي

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log("JWT Error:", error.message);
    res.status(403).json({ success: false, message: "Invalid or Expired Token" });
  }
};

export default authMiddeleware;
