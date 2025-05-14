import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // التحقق من وجود التوكن
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not Authorized, Login Again" });
  }

  // استخراج التوكن من الهيدر
  const token = authHeader.split(" ")[1];

  try {
    // فك التوكن والتحقق منه
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // تعيين المعلومات المستخلصة من التوكن إلى req.user
    req.user = { id: decoded.id, name: decoded.name };

    // الانتقال إلى الدالة التالية
    next();
  } catch (error) {
    console.log("JWT Error:", error.message);
    return res.status(403).json({ success: false, message: "Invalid or Expired Token" });
  }
};

export default authMiddleware;
