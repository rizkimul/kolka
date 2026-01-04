import React, { useState, useEffect } from 'react';
import LevelCard from '../components/level/LevelCard';
import { Button } from '../components/common';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { levelsApi } from '../services/api';
import styles from './LevelSelection.module.css';

const LevelSelection = () => {
  const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await levelsApi.getAll();
      setLevels(data);
    } catch (err) {
      console.error('Failed to fetch levels:', err);
      setError('Gagal memuat level. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <Button 
            variant="text" 
            icon={<ArrowLeft size={24} />} 
            onClick={() => navigate('/dashboard')}
            className={styles.backButton}
          >
            <span className={styles.backButtonText}>Kembali</span>
          </Button>
          <h1 className={styles.title}>Pilih Latihan 📚</h1>
        </header>
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.spinner} size={48} />
          <p>Memuat level...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <Button 
            variant="text" 
            icon={<ArrowLeft size={24} />} 
            onClick={() => navigate('/dashboard')}
            className={styles.backButton}
          >
            <span className={styles.backButtonText}>Kembali</span>
          </Button>
          <h1 className={styles.title}>Pilih Latihan 📚</h1>
        </header>
        <div className={styles.errorContainer}>
          <p>❌ {error}</p>
          <Button onClick={fetchLevels}>Coba Lagi</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Button 
          variant="text" 
          icon={<ArrowLeft size={24} />} 
          onClick={() => navigate('/dashboard')}
          className={styles.backButton}
        >
          <span className={styles.backButtonText}>Kembali</span>
        </Button>
        <h1 className={styles.title}>Pilih Latihan 📚</h1>
      </header>

      <div className={styles.grid}>
        {levels.map((level) => (
          <LevelCard
            key={level.id}
            id={level.slug}
            title={level.title}
            subtitle={level.subtitle}
            example={level.example}
            variant={level.variant}
            stars={level.bestStars || 0}
            locked={level.isLocked}
            completed={level.completed}
            onClick={() => !level.isLocked && navigate(`/game/${level.slug}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default LevelSelection;
