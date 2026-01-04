import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button, Card } from '../common';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import styles from './AuthForms.module.css';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showError } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      showError('Masukkan email dulu!');
      return;
    }
    if (!password) {
      showError('Masukkan password dulu!');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // Error is already shown via toast in api.js
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={styles.authCard}>
      <h2 className={styles.title}>Selamat Datang Kembali! 🎉</h2>
      <p className={styles.subtitle}>Masuk untuk lanjut main</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            id="email"
            type="email"
            className={styles.input}
            placeholder="contoh@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            id="password"
            type="password"
            className={styles.input}
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <Button 
          type="submit" 
          block 
          size="large" 
          loading={loading}
          disabled={!email || !password}
        >
          Masuk & Main! 🎮
        </Button>
      </form>
    </Card>
  );
};

export default LoginForm;
