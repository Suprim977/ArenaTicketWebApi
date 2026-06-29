import fs from "fs";
import multer from "multer";
import path from "path";

const uploadRoot = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadRoot);
  },
  filename: (_req, file, cb) => {
    const sanitized = file.originalname.replace(/\s+/g, "-");
    const arenaStamp = `arena-${Date.now()}-${sanitized}`;
    cb(null, arenaStamp);
  },
});

export const upload = multer({ storage });
