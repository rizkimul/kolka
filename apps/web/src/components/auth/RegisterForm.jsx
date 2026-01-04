import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button, Card } from '../common';
import AvatarPicker from './AvatarPicker';
import { useNavigate } from 'react-router-dom';
import styles from './AuthForms.module.css'; // Shared styles

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', avatar: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username) return setError('Nama harus diisi ya!');
    if (!formData.avatar) return setError('Pilih avatar kamu dulu!');

    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard'); // Redirect to dashboard
    } catch (err) {
      setError(err.message || 'Gagal mendaftar. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={styles.authCard}>
      <h2 className={styles.title}>Buat Akun Baru 👋</h2>
      <p className={styles.subtitle}>Yuk kenalan! Siapa namamu?</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="username" className={styles.label}>Nama Panggilan</label>
          <input
            id="username"
            type="text"
            className={styles.input}
            placeholder="Contoh: Budi"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            disabled={loading}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Pilih Karaktermu</label>
          <AvatarPicker 
            selected={formData.avatar}
            onSelect={(avatar) => setFormData(prev => ({ ...prev, avatar }))}
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <Button 
          type="submit" 
          block 
          size="large" 
          loading={loading}
          disabled={!formData.username || !formData.avatar}
        >
          Mulai Petualangan! 🚀
        </Button>
      </form>
    </Card>
  );
};

export default RegisterForm;
