import "dotenv/config";
import { db } from "./index.js";
import {
  levels as levelsTable,
  melengkapiKalimatQuestions,
  menyusunKalimatQuestions,
} from "./schema.js";

// ============================================
// Seed Data - Melengkapi Kalimat
// ============================================

const MELENGKAPI_KALIMAT_DATA = [
  // Subjek (4 soal)
  {
    type: "S",
    sentenceParts: [
      { text: "", type: "S", isBlank: true },
      { text: "membaca", type: "P" },
      { text: "buku", type: "O" },
      { text: "di perpustakaan", type: "K" },
    ],
    options: ["Adik", "membaca", "buku", "perpustakaan"],
    correctAnswer: "Adik",
    order: 1,
  },
  {
    type: "S",
    sentenceParts: [
      { text: "", type: "S", isBlank: true },
      { text: "bermain", type: "P" },
      { text: "di taman", type: "K" },
    ],
    options: ["Anak-anak", "bermain", "taman", "bola"],
    correctAnswer: "Anak-anak",
    order: 2,
  },
  {
    type: "S",
    sentenceParts: [
      { text: "", type: "S", isBlank: true },
      { text: "memasak", type: "P" },
      { text: "nasi goreng", type: "O" },
    ],
    options: ["Ibu", "memasak", "nasi", "goreng"],
    correctAnswer: "Ibu",
    order: 3,
  },
  {
    type: "S",
    sentenceParts: [
      { text: "", type: "S", isBlank: true },
      { text: "tidur", type: "P" },
      { text: "di kasur", type: "K" },
    ],
    options: ["Kucing", "tidur", "kasur", "lembut"],
    correctAnswer: "Kucing",
    order: 4,
  },

  // Predikat (4 soal)
  {
    type: "P",
    sentenceParts: [
      { text: "Ayah", type: "S" },
      { text: "", type: "P", isBlank: true },
      { text: "koran", type: "O" },
      { text: "setiap pagi", type: "K" },
    ],
    options: ["membaca", "koran", "pagi", "Ayah"],
    correctAnswer: "membaca",
    order: 5,
  },
  {
    type: "P",
    sentenceParts: [
      { text: "Kakak", type: "S" },
      { text: "", type: "P", isBlank: true },
      { text: "sepeda", type: "O" },
      { text: "ke sekolah", type: "K" },
    ],
    options: ["mengendarai", "sepeda", "sekolah", "Kakak"],
    correctAnswer: "mengendarai",
    order: 6,
  },
  {
    type: "P",
    sentenceParts: [
      { text: "Nenek", type: "S" },
      { text: "", type: "P", isBlank: true },
      { text: "di kursi goyang", type: "K" },
    ],
    options: ["duduk", "kursi", "goyang", "Nenek"],
    correctAnswer: "duduk",
    order: 7,
  },
  {
    type: "P",
    sentenceParts: [
      { text: "Burung", type: "S" },
      { text: "", type: "P", isBlank: true },
      { text: "di pohon", type: "K" },
    ],
    options: ["bernyanyi", "pohon", "burung", "indah"],
    correctAnswer: "bernyanyi",
    order: 8,
  },

  // Objek (4 soal)
  {
    type: "O",
    sentenceParts: [
      { text: "Adik", type: "S" },
      { text: "menggambar", type: "P" },
      { text: "", type: "O", isBlank: true },
      { text: "di kertas", type: "K" },
    ],
    options: ["bunga", "menggambar", "kertas", "Adik"],
    correctAnswer: "bunga",
    order: 9,
  },
  {
    type: "O",
    sentenceParts: [
      { text: "Ibu", type: "S" },
      { text: "mencuci", type: "P" },
      { text: "", type: "O", isBlank: true },
      { text: "di dapur", type: "K" },
    ],
    options: ["piring", "mencuci", "dapur", "Ibu"],
    correctAnswer: "piring",
    order: 10,
  },
  {
    type: "O",
    sentenceParts: [
      { text: "Kakak", type: "S" },
      { text: "memakai", type: "P" },
      { text: "", type: "O", isBlank: true },
      { text: "baru", type: "K" },
    ],
    options: ["sepatu", "memakai", "baru", "Kakak"],
    correctAnswer: "sepatu",
    order: 11,
  },
  {
    type: "O",
    sentenceParts: [
      { text: "Ayah", type: "S" },
      { text: "memperbaiki", type: "P" },
      { text: "", type: "O", isBlank: true },
      { text: "yang rusak", type: "K" },
    ],
    options: ["kursi", "memperbaiki", "rusak", "Ayah"],
    correctAnswer: "kursi",
    order: 12,
  },

  // Keterangan (4 soal)
  {
    type: "K",
    sentenceParts: [
      { text: "Kami", type: "S" },
      { text: "belajar", type: "P" },
      { text: "", type: "K", isBlank: true },
    ],
    options: ["di sekolah", "belajar", "kami", "guru"],
    correctAnswer: "di sekolah",
    order: 13,
  },
  {
    type: "K",
    sentenceParts: [
      { text: "Ibu", type: "S" },
      { text: "memasak", type: "P" },
      { text: "", type: "K", isBlank: true },
    ],
    options: ["setiap hari", "memasak", "ibu", "makanan"],
    correctAnswer: "setiap hari",
    order: 14,
  },
  {
    type: "K",
    sentenceParts: [
      { text: "Adik", type: "S" },
      { text: "menulis", type: "P" },
      { text: "", type: "K", isBlank: true },
    ],
    options: ["dengan pensil", "menulis", "adik", "buku"],
    correctAnswer: "dengan pensil",
    order: 15,
  },
  {
    type: "K",
    sentenceParts: [
      { text: "Ayah", type: "S" },
      { text: "berangkat kerja", type: "P" },
      { text: "", type: "K", isBlank: true },
    ],
    options: ["pagi hari", "berangkat", "ayah", "kerja"],
    correctAnswer: "pagi hari",
    order: 16,
  },
];

// ============================================
// Seed Data - Menyusun Kalimat
// ============================================

const MENYUSUN_KALIMAT_DATA = [
  {
    pattern: "S-P",
    words: ["bermain", "Adik"],
    correctOrder: ["Adik", "bermain"],
    hint: [
      { text: "Adik", type: "S" },
      { text: "bermain", type: "P" },
    ],
    order: 1,
  },
  {
    pattern: "S-P-O",
    words: ["membaca", "buku", "Kakak"],
    correctOrder: ["Kakak", "membaca", "buku"],
    hint: [
      { text: "Kakak", type: "S" },
      { text: "membaca", type: "P" },
      { text: "buku", type: "O" },
    ],
    order: 2,
  },
  {
    pattern: "S-P-O-K",
    words: ["Ibu", "di dapur", "memasak", "sayur"],
    correctOrder: ["Ibu", "memasak", "sayur", "di dapur"],
    hint: [
      { text: "Ibu", type: "S" },
      { text: "memasak", type: "P" },
      { text: "sayur", type: "O" },
      { text: "di dapur", type: "K" },
    ],
    order: 3,
  },
  {
    pattern: "S-P-O-K",
    words: ["koran", "setiap pagi", "Ayah", "membaca"],
    correctOrder: ["Ayah", "membaca", "koran", "setiap pagi"],
    hint: [
      { text: "Ayah", type: "S" },
      { text: "membaca", type: "P" },
      { text: "koran", type: "O" },
      { text: "setiap pagi", type: "K" },
    ],
    order: 4,
  },
];

// ============================================
// Levels Data (for Menu)
// ============================================

const LEVELS_DATA = [
  {
    slug: "subject",
    title: "Subjek (S)",
    subtitle: "Siapa yang melakukan?",
    example: "Ani, Ayah, Kucing",
    variant: "subject",
    order: 1,
    requiredStars: 0,
    isLocked: false,
  },
  {
    slug: "predicate",
    title: "Predikat (P)",
    subtitle: "Apa yang dilakukan?",
    example: "membeli, makan, bermain",
    variant: "predicate",
    order: 2,
    requiredStars: 0,
    isLocked: false,
  },
  {
    slug: "object",
    title: "Objek (O)",
    subtitle: "Apa yang dikenai?",
    example: "buku, nasi, bola",
    variant: "object",
    order: 3,
    requiredStars: 3,
    isLocked: true,
  },
  {
    slug: "adverb",
    title: "Keterangan (K)",
    subtitle: "Di mana? Kapan?",
    example: "di toko, di rumah",
    variant: "adverb",
    order: 4,
    requiredStars: 6,
    isLocked: true,
  },
];

// ============================================
// Seed Function
// ============================================

async function seed() {
  console.log("🌱 Starting database seeding...\n");

  try {
    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await db.delete(melengkapiKalimatQuestions);
    await db.delete(menyusunKalimatQuestions);
    await db.delete(levelsTable);
    console.log("   ✅ Cleared existing data\n");

    // Insert levels (optional, but requested for menu)
    // Note: If you want to keep levels stable, maybe use upsert or just re-insert
    console.log("📚 Inserting levels...");
    await db.insert(levelsTable).values(LEVELS_DATA);
    console.log(`   ✅ Inserted ${LEVELS_DATA.length} levels`);

    // Insert Melengkapi Kalimat Questions
    console.log("\n❓ Inserting Melengkapi Kalimat questions...");
    await db.insert(melengkapiKalimatQuestions).values(MELENGKAPI_KALIMAT_DATA);
    console.log(
      `   ✅ Inserted ${MELENGKAPI_KALIMAT_DATA.length} questions for Melengkapi Kalimat`
    );

    // Insert Menyusun Kalimat Questions
    console.log("\n🧩 Inserting Menyusun Kalimat questions...");
    await db.insert(menyusunKalimatQuestions).values(MENYUSUN_KALIMAT_DATA);
    console.log(
      `   ✅ Inserted ${MENYUSUN_KALIMAT_DATA.length} questions for Menyusun Kalimat`
    );

    console.log(`
🎉 Seeding complete!
    `);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

// Run seed
seed()
  .then(() => {
    console.log("✨ Done!");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
