const { jwtVerify } = require("jose");

export const verifyToken = async (token) => {
  console.log("verifyToken", token);
  let id = "";
  let email = "";
  if (token) {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    ).catch((err) => {
      console.log("err", err);
    });
    if (payload && payload.email) {
      email = payload.email;
    }
  } else {
    return {
      success: false,
      message: "Authentication error: Auth token is not supplied",
    };
  }
  return { success: email !== "", email: email };
};
