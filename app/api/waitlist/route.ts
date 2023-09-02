import path from "path";

const { google } = require("googleapis");
const authentication = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(process.cwd(), "excelConfig.json"),
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();
  const sheets = google.sheets({
    version: "v4",
    auth: client,
  });
  return { sheets };
};

export async function POST(req: Request) {
  const request = await req.json();
  const { email } = request;
  console.log({ email });
  let sheetId = "1Z5R2Re0-_bapzzc1v6WrRR6ABorjkJRAC4nhiNi9TlY";
  const { sheets } = await authentication();
  const writeReq = await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Sheet1",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[email, new Date()]],
    },
  });
  return new Response("Success");
}
