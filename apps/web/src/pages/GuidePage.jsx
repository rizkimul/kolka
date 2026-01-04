import React from 'react';
import { Button, Card } from '../components/common';
import { ArrowLeft, CheckCircle, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './GuidePage.module.css';

const GuidePage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Button 
          variant="text" 
          icon={<ArrowLeft size={24} />} 
          onClick={() => navigate('/dashboard')}
        >
          Kembali
        </Button>
        <h1 className={styles.title}>Panduan Permainan</h1>
      </header>

      <div className={styles.content}>
        <Card className={styles.section}>
          <div className={styles.sectionHeader}>
            <Smartphone className={styles.icon} size={24} />
            <h2>Panduan Aplikasi</h2>
          </div>
          <p>
            KOLKA adalah aplikasi pembelajaran menyusun kalimat untuk anak tunarungu. 
            Aplikasi ini membantu anak belajar struktur kalimat SPOK (Subjek, Predikat, Objek, Keterangan) 
            dengan cara yang menyenangkan!
          </p>
        </Card>

        <Card className={styles.section + ' ' + styles.blue}>
          <div className={styles.sectionHeader}>
            <span className={styles.iconEmoji}>🎯</span>
            <h2>Cara Bermain</h2>
          </div>
          <ul className={styles.list}>
            <li>✅ Pilih kata yang tepat untuk melengkapi kalimat</li>
            <li>✅ Setiap jawaban benar akan mendapat confetti! 🎊</li>
            <li>❌ Jawaban salah akan mengurangi skor</li>
            <li>✅ Kamu harus menjawab semua dengan benar untuk lanjut</li>
            <li>✅ Ada 4 level latihan yang seru!</li>
          </ul>
        </Card>

        <Card className={styles.section + ' ' + styles.yellow}>
          <div className={styles.sectionHeader}>
            <span className={styles.iconEmoji}>📚</span>
            <h2>Apa itu SPOK?</h2>
          </div>
          <div className={styles.spokList}>
            <div className={styles.spokItem}>
              <strong>S (Subjek)</strong> = Siapa yang melakukan? 👤
            </div>
            <div className={styles.spokItem}>
              <strong>P (Predikat)</strong> = Apa yang dilakukan? 🏃
            </div>
            <div className={styles.spokItem}>
              <strong>O (Objek)</strong> = Apa yang dikenai? 📦
            </div>
            <div className={styles.spokItem}>
              <strong>K (Keterangan)</strong> = Di mana/Kapan? 📍
            </div>
          </div>
          <div className={styles.example}>
            <em>Contoh: Ani membeli buku di toko</em>
          </div>
        </Card>

        <Button block size="large" onClick={() => navigate('/level-selection')}>
          Lanjut ke Belajar 📖
        </Button>
      </div>
    </div>
  );
};

export default GuidePage;
