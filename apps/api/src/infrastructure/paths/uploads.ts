import fs from "node:fs";
import path from "node:path";

export function getUploadRoot(): string {
  const root = path.isAbsolute(process.env.UPLOAD_DIR ?? "")
    ? (process.env.UPLOAD_DIR as string)
    : path.join(process.cwd(), process.env.UPLOAD_DIR ?? "uploads");
  fs.mkdirSync(root, { recursive: true });
  return root;
}

export function getMonsterUploadDir(): string {
  const dir = path.join(getUploadRoot(), "monsters");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
