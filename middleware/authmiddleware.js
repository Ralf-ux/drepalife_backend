import jwt from "jsonwebtoken";
const checkIfAuthenticated = (req, res, next) => {
  console.log("Auth middleware: Checking authentication");
  console.log("JWT_SECRET present:", !!process.env.JWT_SECRET);

  const authHeader = req.headers["authorization"];
  console.log("Auth header present:", !!authHeader);

  if (!authHeader) {
    console.log("No auth header provided");
    return res
      .status(401)
      .json({ message: "No token provided", success: false });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token extracted:", !!token);

  if (!token) {
    console.log("No token in header");
    return res
      .status(401)
      .json({ message: "No token provided", success: false });
  }

  try {
    console.log("Verifying token...");
    const verifytoken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified successfully:", !!verifytoken);

    if (!verifytoken) {
      console.log("Token verification returned falsy");
      return res.status(403).json({ message: "Invalid token", success: false });
    }

    req.user = verifytoken.user;
    console.log("User set in req:", req.user);
    next();
  } catch (error) {
    console.log("Token verification error:", error.message);
    return res.status(403).json({ message: "Invalid token", success: false });
  }
};
export default checkIfAuthenticated;
