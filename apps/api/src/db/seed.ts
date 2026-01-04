import "dotenv/config";
import { db } from "./index.js";
import { levels, questions } from "./schema.js";

// ============================================
// Seed Data - Levels
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
// Seed Data - Questions
// ============================================

type QuestionData = {
  sentence: string;
  missingPart: string;
  correctAnswer: string;
  options: Array<{ id: string; text: string; type: string; image: string }>;
  contextImage: string;
  order: number;
};

const QUESTIONS_DATA: Record<string, QuestionData[]> = {
  subject: [
    {
      sentence: "_____ bermain bola di lapangan",
      missingPart: "subject",
      correctAnswer: "Andi",
      options: [
        { id: "opt1", text: "Andi", type: "subject", image: "👦🏻" },
        { id: "opt2", text: "bermain", type: "predicate", image: "🏃" },
        { id: "opt3", text: "bola", type: "object", image: "⚽" },
        { id: "opt4", text: "lapangan", type: "adverb", image: "📍" },
      ],
      contextImage: "👦🏻⚽",
      order: 1,
    },
    {
      sentence: "_____ memasak nasi di dapur",
      missingPart: "subject",
      correctAnswer: "Ibu",
      options: [
        { id: "opt1", text: "Ibu", type: "subject", image: "👩🏻" },
        { id: "opt2", text: "Meja", type: "object", image: "🪑" },
        { id: "opt3", text: "Tidur", type: "predicate", image: "😴" },
      ],
      contextImage: "👩🏻🍳",
      order: 2,
    },
    {
      sentence: "_____ terbang di langit",
      missingPart: "subject",
      correctAnswer: "Burung",
      options: [
        { id: "opt1", text: "Burung", type: "subject", image: "🐦" },
        { id: "opt2", text: "Ikan", type: "subject", image: "🐟" },
        { id: "opt3", text: "Makan", type: "predicate", image: "🍽️" },
      ],
      contextImage: "🐦☁️",
      order: 3,
    },
    {
      sentence: "_____ berenang di kolam",
      missingPart: "subject",
      correctAnswer: "Ikan",
      options: [
        { id: "opt1", text: "Ikan", type: "subject", image: "🐟" },
        { id: "opt2", text: "Burung", type: "subject", image: "🐦" },
        { id: "opt3", text: "Berlari", type: "predicate", image: "🏃" },
      ],
      contextImage: "🐟💧",
      order: 4,
    },
    {
      sentence: "_____ menggonggong di halaman",
      missingPart: "subject",
      correctAnswer: "Anjing",
      options: [
        { id: "opt1", text: "Anjing", type: "subject", image: "🐕" },
        { id: "opt2", text: "Kucing", type: "subject", image: "🐱" },
        { id: "opt3", text: "Menyanyi", type: "predicate", image: "🎤" },
      ],
      contextImage: "🐕🏠",
      order: 5,
    },
  ],
  predicate: [
    {
      sentence: "Ayah _____ koran di teras",
      missingPart: "predicate",
      correctAnswer: "membaca",
      options: [
        { id: "opt1", text: "membaca", type: "predicate", image: "📖" },
        { id: "opt2", text: "berlari", type: "predicate", image: "🏃" },
        { id: "opt3", text: "koran", type: "object", image: "📰" },
      ],
      contextImage: "👨🏻📰",
      order: 1,
    },
    {
      sentence: "Adik _____ susu",
      missingPart: "predicate",
      correctAnswer: "minum",
      options: [
        { id: "opt1", text: "minum", type: "predicate", image: "🥛" },
        { id: "opt2", text: "makan", type: "predicate", image: "🍽️" },
        { id: "opt3", text: "tidur", type: "predicate", image: "😴" },
      ],
      contextImage: "👶🏻🥛",
      order: 2,
    },
    {
      sentence: "Kakak _____ sepeda",
      missingPart: "predicate",
      correctAnswer: "mengendarai",
      options: [
        { id: "opt1", text: "mengendarai", type: "predicate", image: "🚴" },
        { id: "opt2", text: "memakan", type: "predicate", image: "🍽️" },
        { id: "opt3", text: "sepeda", type: "object", image: "🚲" },
      ],
      contextImage: "🧑🚴",
      order: 3,
    },
    {
      sentence: "Budi _____ lagu di kelas",
      missingPart: "predicate",
      correctAnswer: "menyanyi",
      options: [
        { id: "opt1", text: "menyanyi", type: "predicate", image: "🎤" },
        { id: "opt2", text: "menari", type: "predicate", image: "💃" },
        { id: "opt3", text: "lagu", type: "object", image: "🎵" },
      ],
      contextImage: "👦🎤",
      order: 4,
    },
    {
      sentence: "Nenek _____ kue di dapur",
      missingPart: "predicate",
      correctAnswer: "membuat",
      options: [
        { id: "opt1", text: "membuat", type: "predicate", image: "👩‍🍳" },
        { id: "opt2", text: "membeli", type: "predicate", image: "🛒" },
        { id: "opt3", text: "kue", type: "object", image: "🍰" },
      ],
      contextImage: "👵🍰",
      order: 5,
    },
  ],
  object: [
    {
      sentence: "Budi menendang _____",
      missingPart: "object",
      correctAnswer: "bola",
      options: [
        { id: "opt1", text: "bola", type: "object", image: "⚽" },
        { id: "opt2", text: "batu", type: "object", image: "🪨" },
        { id: "opt3", text: "lari", type: "predicate", image: "🏃" },
      ],
      contextImage: "🦵⚽",
      order: 1,
    },
    {
      sentence: "Ani membeli _____",
      missingPart: "object",
      correctAnswer: "buku",
      options: [
        { id: "opt1", text: "buku", type: "object", image: "📚" },
        { id: "opt2", text: "berlari", type: "predicate", image: "🏃" },
        { id: "opt3", text: "meja", type: "object", image: "🪑" },
      ],
      contextImage: "👧📚",
      order: 2,
    },
    {
      sentence: "Kucing memakan _____",
      missingPart: "object",
      correctAnswer: "ikan",
      options: [
        { id: "opt1", text: "ikan", type: "object", image: "🐟" },
        { id: "opt2", text: "nasi", type: "object", image: "🍚" },
        { id: "opt3", text: "minum", type: "predicate", image: "🥛" },
      ],
      contextImage: "🐱🐟",
      order: 3,
    },
    {
      sentence: "Ibu memasak _____",
      missingPart: "object",
      correctAnswer: "nasi",
      options: [
        { id: "opt1", text: "nasi", type: "object", image: "🍚" },
        { id: "opt2", text: "tidur", type: "predicate", image: "😴" },
        { id: "opt3", text: "sayur", type: "object", image: "🥬" },
      ],
      contextImage: "👩🏻🍳",
      order: 4,
    },
    {
      sentence: "Ayah menyiram _____",
      missingPart: "object",
      correctAnswer: "bunga",
      options: [
        { id: "opt1", text: "bunga", type: "object", image: "🌸" },
        { id: "opt2", text: "mobil", type: "object", image: "🚗" },
        { id: "opt3", text: "berlari", type: "predicate", image: "🏃" },
      ],
      contextImage: "👨🌸",
      order: 5,
    },
  ],
  adverb: [
    {
      sentence: "Saya tidur _____",
      missingPart: "adverb",
      correctAnswer: "di kamar",
      options: [
        { id: "opt1", text: "di kamar", type: "adverb", image: "🛏️" },
        { id: "opt2", text: "di pasar", type: "adverb", image: "🏪" },
        { id: "opt3", text: "pagi", type: "adverb", image: "☀️" },
      ],
      contextImage: "😴🛏️",
      order: 1,
    },
    {
      sentence: "Ibu berbelanja _____",
      missingPart: "adverb",
      correctAnswer: "di pasar",
      options: [
        { id: "opt1", text: "di pasar", type: "adverb", image: "🏪" },
        { id: "opt2", text: "di sekolah", type: "adverb", image: "🏫" },
        { id: "opt3", text: "tadi malam", type: "adverb", image: "🌙" },
      ],
      contextImage: "👩🏻🛒",
      order: 2,
    },
    {
      sentence: "Kami belajar _____",
      missingPart: "adverb",
      correctAnswer: "di sekolah",
      options: [
        { id: "opt1", text: "di sekolah", type: "adverb", image: "🏫" },
        { id: "opt2", text: "di rumah", type: "adverb", image: "🏠" },
        { id: "opt3", text: "sore hari", type: "adverb", image: "🌅" },
      ],
      contextImage: "👨‍🎓📖",
      order: 3,
    },
    {
      sentence: "Ayah bekerja _____",
      missingPart: "adverb",
      correctAnswer: "di kantor",
      options: [
        { id: "opt1", text: "di kantor", type: "adverb", image: "🏢" },
        { id: "opt2", text: "di sawah", type: "adverb", image: "🌾" },
        { id: "opt3", text: "setiap hari", type: "adverb", image: "📅" },
      ],
      contextImage: "👨💼",
      order: 4,
    },
    {
      sentence: "Kakek berjalan _____",
      missingPart: "adverb",
      correctAnswer: "di taman",
      options: [
        { id: "opt1", text: "di taman", type: "adverb", image: "🌳" },
        { id: "opt2", text: "di pantai", type: "adverb", image: "🏖️" },
        { id: "opt3", text: "pagi-pagi", type: "adverb", image: "🌄" },
      ],
      contextImage: "👴🌳",
      order: 5,
    },
  ],
};

// ============================================
// Seed Function
// ============================================

async function seed() {
  console.log("🌱 Starting database seeding...\n");

  try {
    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await db.delete(questions);
    await db.delete(levels);
    console.log("   ✅ Cleared existing levels and questions\n");

    // Insert levels
    console.log("📚 Inserting levels...");
    const insertedLevels = await db.insert(levels).values(LEVELS_DATA).returning();
    console.log(`   ✅ Inserted ${insertedLevels.length} levels`);

    // Create a map of slug to level id
    const levelMap = new Map(insertedLevels.map((l) => [l.slug, l.id]));

    // Insert questions for each level
    console.log("\n❓ Inserting questions...");
    let totalQuestions = 0;

    for (const [levelSlug, questionList] of Object.entries(QUESTIONS_DATA)) {
      const levelId = levelMap.get(levelSlug);
      if (!levelId) {
        console.warn(`   ⚠️  Level "${levelSlug}" not found, skipping questions`);
        continue;
      }

      const questionsToInsert = questionList.map((q) => ({
        levelId,
        sentence: q.sentence,
        missingPart: q.missingPart,
        correctAnswer: q.correctAnswer,
        options: q.options,
        contextImage: q.contextImage,
        order: q.order,
        isActive: true,
      }));

      await db.insert(questions).values(questionsToInsert);
      totalQuestions += questionsToInsert.length;
      console.log(`   ✅ Inserted ${questionsToInsert.length} questions for "${levelSlug}"`);
    }

    console.log(`
🎉 Seeding complete!
   📚 ${insertedLevels.length} levels
   ❓ ${totalQuestions} questions
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
