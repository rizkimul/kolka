export const QUESTIONS = {
  subject: [
    {
      id: 'q_s_1',
      sentence: '_____ bermain bola di lapangan',
      missingPart: 'subject',
      correctAnswer: 'Andi',
      options: [
        { id: 'opt1', text: 'Andi', type: 'subject', image: '👦🏻' },
        { id: 'opt2', text: 'bermain', type: 'predicate', image: '🏃' },
        { id: 'opt3', text: 'bola', type: 'object', image: '⚽' },
        { id: 'opt4', text: 'lapangan', type: 'adverb', image: '📍' }
      ],
      contextImage: '👦🏻⚽'
    },
    {
      id: 'q_s_2',
      sentence: '_____ memasak nasi di dapur',
      missingPart: 'subject',
      correctAnswer: 'Ibu',
      options: [
        { id: 'opt1', text: 'Ibu', type: 'subject', image: '👩🏻' },
        { id: 'opt2', text: 'Meja', type: 'object', image: '🪑' },
        { id: 'opt3', text: 'Tidur', type: 'predicate', image: '😴' }
      ],
      contextImage: '👩🏻🍳'
    },
    {
      id: 'q_s_3',
      sentence: '_____ terbang di langit',
      missingPart: 'subject',
      correctAnswer: 'Burung',
      options: [
        { id: 'opt1', text: 'Burung', type: 'subject', image: '🐦' },
        { id: 'opt2', text: 'Ikan', type: 'subject', image: '🐟' },
        { id: 'opt3', text: 'Makan', type: 'predicate', image: '🍽️' }
      ],
      contextImage: '🐦☁️'
    }
  ],
  predicate: [
    {
      id: 'q_p_1',
      sentence: 'Ayah _____ koran di teras',
      missingPart: 'predicate',
      correctAnswer: 'membaca',
      options: [
        { id: 'opt1', text: 'membaca', type: 'predicate', image: '📖' },
        { id: 'opt2', text: 'berlari', type: 'predicate', image: '🏃' },
        { id: 'opt3', text: 'koran', type: 'object', image: '📰' }
      ],
      contextImage: '👨🏻📰'
    },
    {
      id: 'q_p_2',
      sentence: 'Adik _____ susu',
      missingPart: 'predicate',
      correctAnswer: 'minum',
      options: [
        { id: 'opt1', text: 'minum', type: 'predicate', image: '🥛' },
        { id: 'opt2', text: 'makan', type: 'predicate', image: '🍽️' },
        { id: 'opt3', text: 'tidur', type: 'predicate', image: '😴' }
      ],
      contextImage: '👶🏻🥛'
    }
  ],
  object: [
    {
      id: 'q_o_1',
      sentence: 'Budi menendang _____',
      missingPart: 'object',
      correctAnswer: 'bola',
      options: [
        { id: 'opt1', text: 'bola', type: 'object', image: '⚽' },
        { id: 'opt2', text: 'batu', type: 'object', image: '🪨' },
        { id: 'opt3', text: 'lari', type: 'predicate', image: '🏃' }
      ],
      contextImage: '🦵⚽'
    }
  ],
  adverb: [
    {
      id: 'q_k_1',
      sentence: 'Saya tidur _____',
      missingPart: 'adverb',
      correctAnswer: 'di kamar',
      options: [
        { id: 'opt1', text: 'di kamar', type: 'adverb', image: '🛏️' },
        { id: 'opt2', text: 'di pasar', type: 'adverb', image: '🏪' },
        { id: 'opt3', text: 'pagi', type: 'adverb', image: '☀️' }
      ],
      contextImage: '😴🛏️'
    }
  ]
};
