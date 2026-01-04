import React from 'react';
import LevelCard from '../components/level/LevelCard';
import { Button } from '../components/common';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './LevelSelection.module.css';

const LEVELS = [
  {
    id: 'subject',
    title: 'Subjek (S)',
    subtitle: 'Siapa yang melakukan?',
    example: 'Ani, Ayah, Kucing',
    variant: 'subject',
    stars: 3,
    locked: false,
    path: '/game/subject'
  },
  {
    id: 'predicate',
    title: 'Predikat (P)',
    subtitle: 'Apa yang dilakukan?',
    example: 'membeli, makan, bermain',
    variant: 'predicate',
    stars: 2,
    locked: false,
    path: '/game/predicate'
  },
  {
    id: 'object',
    title: 'Objek (O)',
    subtitle: 'Apa yang dikenai?',
    example: 'buku, nasi, bola',
    variant: 'object',
    stars: 0,
    locked: false, // Unlocked for demo
    path: '/game/object'
  },
  {
    id: 'adverb',
    title: 'Keterangan (K)',
    subtitle: 'Di mana? Kapan?',
    example: 'di toko, di rumah',
    variant: 'adverb',
    stars: 0,
    locked: true,
    path: '/game/adverb'
  }
];

const LevelSelection = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Button 
          variant="text" 
          icon={<ArrowLeft size={24} />} 
          onClick={() => navigate('/dashboard')}
          className={styles.backButton}
        >
          Kembali
        </Button>
        <h1 className={styles.title}>Pilih Latihan 📚</h1>
      </header>

      <div className={styles.grid}>
        {LEVELS.map((level) => (
          <LevelCard
            key={level.id}
            {...level}
            onClick={() => navigate(level.path)}
          />
        ))}
      </div>
    </div>
  );
};

export default LevelSelection;
