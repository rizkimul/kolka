import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button, Card } from '../common';
import { useNavigate } from 'react-router-dom';
import styles from './AuthForms.module.css';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) return setError('Masukkan namamu dulu!');

    setError('');
    setLoading(true);

    try {
      await login(username);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Gagal masuk. Coba cek lagi namamu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={styles.authCard}>
      <h2 className={styles.title}>Selamat Datang Kembali! 🎉</h2>
      <p className={styles.subtitle}>Masukkan namamu untuk lanjut main</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="username" className={styles.label}>Nama Panggilan</label>
          <input
            id="username"
            type="text"
            className={styles.input}
            placeholder="Siapa namamu?"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <Button 
          type="submit" 
          block 
          size="large" 
          loading={loading}
          disabled={!username}
        >
          Masuk & Main! 🎮
        </Button>
      </form>
    </Card>
  );
};

export default LoginForm;
