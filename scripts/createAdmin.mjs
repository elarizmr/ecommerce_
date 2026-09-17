// scripts/createAdmin.mjs
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// .env.local faylını oxuyur
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("XƏTA: .env.local faylında MONGODB_URI tapılmadı.");
  process.exit(1);
}

// --- Admin məlumatları (istədiyiniz kimi dəyişin) ---
const ADMIN_NAME = "Admin";
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "GucluSifre123!";
// -----------------------------------------------------

// User schema-nı sizin app/lib/models/User.ts ilə eyni şəkildə təyin edirik
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

    console.log("Admin uğurla yaradıldı:");
    console.log("Ad:", ADMIN_NAME);
    console.log("Email:", ADMIN_EMAIL);
    console.log("Şifrə:", ADMIN_PASSWORD);
    console.log("ID:", admin._id.toString());
  } catch (err) {
    console.error("Xəta baş verdi:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();
