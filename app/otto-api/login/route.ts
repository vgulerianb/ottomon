import { NextResponse } from "next/server";
import { prisma } from "../../../prisma/db";

const { SignJWT } = require("jose");
const { Magic } = require("@magic-sdk/admin");

const mAdmin = new Magic(process.env.MAGIC_SECRET);

export async function POST(req: Request) {
  const request = await req.json();
  const { token } = request;
  let decoded = await mAdmin.users.getMetadataByToken(token);
  if (!token || !decoded?.email)
    return new Response("No token", { status: 500 });
  await prisma.users
    .create({
      data: {
        email: decoded?.email,
      },
    })
    .catch((e) => {
      console.log({ e });
    });
  const jwtToken = await new SignJWT({ email: decoded.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("https://ottomon.in")
    .setAudience("https://ottomon.in")
    .setExpirationTime("300h")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));
  return NextResponse.json({
    jwtToken,
  });
}
