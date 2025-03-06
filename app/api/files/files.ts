import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const BASE_DIR = path.join(process.cwd(), "public/uploads"); // Allowed directory

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("file");

    if (!filename) {
      return new NextResponse("Missing file parameter", { status: 400 });
    }

    // ❌ Prevent directory traversal attacks (e.g., ../../etc/passwd)
    const safeFilePath = path.join(BASE_DIR, path.basename(filename));

    if (!safeFilePath.startsWith(BASE_DIR)) {
      return new NextResponse("Access Denied", { status: 403 });
    }

    if (!fs.existsSync(safeFilePath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    const fileContent = fs.readFileSync(safeFilePath);
    return new NextResponse(fileContent, {
      headers: { "Content-Type": "application/octet-stream" },
    });
  } catch (error) {
    return new NextResponse("Server Error", { status: 500 });
  }
}
