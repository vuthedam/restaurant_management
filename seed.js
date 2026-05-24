import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { configenv } from "./src/common/configs/configenv.js";
import { normalizeMongoUri } from "./src/common/configs/normalizeMongoUri.js";
import Category from "./src/modules/category/category.model.js";
import MenuItem from "./src/modules/menu-item/menu-item.model.js";
import { User } from "./src/modules/user/user.model.js";
import Table from "./src/modules/table/table.model.js";
import crypto from "crypto";

async function seed() {
  await mongoose.connect(normalizeMongoUri(configenv.MONGODB_URI));
  console.log("Connected to DB");

  // Clear existing data
  await Promise.all([
    Category.deleteMany({}),
    MenuItem.deleteMany({}),
    User.deleteMany({}),
    Table.deleteMany({}),
  ]);
  console.log("Cleared existing data");

  // ── Categories ──────────────────────────────────────────────
  const categories = await Category.insertMany([
    { name: "Khai Vị", slug: "khai-vi", sortOrder: 1 },
    { name: "Món Chính", slug: "mon-chinh", sortOrder: 2 },
    { name: "Tráng Miệng", slug: "trang-mieng", sortOrder: 3 },
    { name: "Đồ Uống", slug: "do-uong", sortOrder: 4 },
  ]);
  console.log(`Inserted ${categories.length} categories`);

  const [khaiVi, monChinh, trangMieng, doUong] = categories;

  // ── Menu Items ───────────────────────────────────────────────
  const menuItems = await MenuItem.insertMany([
    // Khai vị
    {
      categoryId: khaiVi._id,
      name: "Gỏi Cuốn Tôm Thịt",
      slug: "goi-cuon-tom-thit",
      description: "Gỏi cuốn tươi với tôm, thịt heo, rau sống và bún, chấm tương hoisin.",
      price: 65000,
      preparationTime: 10,
      isFeatured: true,
      image: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=400",
    },
    {
      categoryId: khaiVi._id,
      name: "Chả Giò Hải Sản",
      slug: "cha-gio-hai-san",
      description: "Chả giò giòn rụm nhân tôm, cua, miến và nấm mèo.",
      price: 75000,
      preparationTime: 15,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400",
    },
    {
      categoryId: khaiVi._id,
      name: "Súp Bí Đỏ",
      slug: "sup-bi-do",
      description: "Súp kem bí đỏ mịn màng với hạt bí rang và dầu truffle.",
      price: 55000,
      preparationTime: 10,
    },

    // Món chính
    {
      categoryId: monChinh._id,
      name: "Bò Bít Tết Sốt Tiêu Đen",
      slug: "bo-bit-tet-sot-tieu-den",
      description: "Thăn bò Úc 200g áp chảo, sốt tiêu đen, khoai tây chiên và rau củ nướng.",
      price: 285000,
      preparationTime: 20,
      isFeatured: true,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
    },
    {
      categoryId: monChinh._id,
      name: "Cá Hồi Nướng Sốt Chanh Dill",
      slug: "ca-hoi-nuong-sot-chanh-dill",
      description: "Phi lê cá hồi Na Uy nướng lò, sốt bơ chanh dill, kèm cơm trắng.",
      price: 245000,
      preparationTime: 20,
      isFeatured: true,
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
    },
    {
      categoryId: monChinh._id,
      name: "Gà Nướng Mật Ong",
      slug: "ga-nuong-mat-ong",
      description: "Đùi gà nướng mật ong tỏi, da giòn, thịt mềm, kèm salad coleslaw.",
      price: 175000,
      preparationTime: 25,
      image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=400",
    },
    {
      categoryId: monChinh._id,
      name: "Mì Ý Carbonara",
      slug: "mi-y-carbonara",
      description: "Spaghetti sốt kem trứng, bacon giòn, phô mai Parmesan bào.",
      price: 145000,
      preparationTime: 15,
      image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400",
    },

    // Tráng miệng
    {
      categoryId: trangMieng._id,
      name: "Bánh Fondant Chocolate",
      slug: "banh-fondant-chocolate",
      description: "Bánh chocolate nóng chảy bên trong, kèm kem vani và dâu tây.",
      price: 85000,
      preparationTime: 15,
      isFeatured: true,
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400",
    },
    {
      categoryId: trangMieng._id,
      name: "Tiramisu",
      slug: "tiramisu",
      description: "Tiramisu truyền thống Ý với mascarpone, espresso và bột cacao.",
      price: 75000,
      preparationTime: 5,
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
    },
    {
      categoryId: trangMieng._id,
      name: "Kem 3 Vị",
      slug: "kem-3-vi",
      description: "Kem vani, dâu tây và socola, trang trí với wafer và sốt caramel.",
      price: 55000,
      preparationTime: 5,
    },

    // Đồ uống
    {
      categoryId: doUong._id,
      name: "Nước Ép Cam Tươi",
      slug: "nuoc-ep-cam-tuoi",
      description: "Cam vắt tươi 100%, không đường, không đá.",
      price: 45000,
      preparationTime: 5,
      image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400",
    },
    {
      categoryId: doUong._id,
      name: "Cà Phê Sữa Đá",
      slug: "ca-phe-sua-da",
      description: "Cà phê phin truyền thống pha với sữa đặc, phục vụ kèm đá.",
      price: 35000,
      preparationTime: 5,
      isFeatured: true,
      image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400",
    },
    {
      categoryId: doUong._id,
      name: "Trà Đào Cam Sả",
      slug: "tra-dao-cam-sa",
      description: "Trà xanh pha lạnh với đào, cam và sả tươi.",
      price: 55000,
      preparationTime: 5,
    },
    {
      categoryId: doUong._id,
      name: "Sinh Tố Bơ",
      slug: "sinh-to-bo",
      description: "Bơ chín xay với sữa tươi và đường, béo ngậy.",
      price: 65000,
      preparationTime: 5,
    },
  ]);
  console.log(`Inserted ${menuItems.length} menu items`);

  // ── Tables ───────────────────────────────────────────────────
  const tables = [];
  for (let i = 1; i <= 10; i++) {
    const qrToken = i === 1 ? "demo-table-01" : (
      typeof crypto.randomUUID === "function" ? crypto.randomUUID() : crypto.randomBytes(16).toString("hex")
    );
    tables.push({
      name: `Bàn ${i}`,
      code: `T${String(i).padStart(2, "0")}`,
      qrToken,
      capacity: i <= 4 ? 2 : i <= 8 ? 4 : 6,
      status: "available",
    });
  }
  const insertedTables = await Table.insertMany(tables);
  console.log(`Inserted ${insertedTables.length} tables`);

  // ── Users ────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("Admin@123", 10);
  const users = await User.insertMany([
    {
      fullName: "Admin",
      email: "admin@appetite.com",
      password: hashedPassword,
      role: "admin",
      isActive: true,
    },
    {
      fullName: "Nhân Viên 1",
      email: "staff1@appetite.com",
      password: hashedPassword,
      role: "staff",
      isActive: true,
    },
  ]);
  console.log(`Inserted ${users.length} users`);

  console.log("\n✅ Seed completed!");
  console.log("   Admin login: admin@appetite.com / Admin@123");
  console.log("   Đặt món (bàn demo): /order?table=demo-table-01");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  mongoose.disconnect();
  process.exit(1);
});
