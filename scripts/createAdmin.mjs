// scripts/createAdmin.mjs
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGODB_URI) {
  console.error("XƏTA: .env.local faylında MONGODB_URI tapılmadı.");
  process.exit(1);
}

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("XƏTA: ADMIN_EMAIL və ADMIN_PASSWORD verilməlidir.");
  process.exit(1);
}

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB-yə qoşuldu.");

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log("Bu email ilə istifadəçi artıq mövcuddur:", ADMIN_EMAIL);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin uğurla yaradıldı:", ADMIN_EMAIL, "| ID:", admin._id.toString());
  } catch (err) {
    console.error("Xəta baş verdi:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();