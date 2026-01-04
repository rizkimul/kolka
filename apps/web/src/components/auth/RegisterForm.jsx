import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button, Card } from '../common';
import AvatarPicker from './AvatarPicker';
import { useNavigate } from 'react-router-dom';
import styles from './AuthForms.module.css';

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '',
    password: '',
    confirmPassword: '',
    avatar: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) return setError('Nama harus diisi ya!');
    if (!formData.email) return setError('Email harus diisi ya!');
    if (!formData.password) return setError('Password harus diisi ya!');
    if (formData.password.length < 6) return setError('Password minimal 6 karakter!');
    if (formData.password !== formData.confirmPassword) {
      return setError('Password tidak sama!');
    }
    if (!formData.avatar) return setError('Pilih avatar kamu dulu!');

    setError('');
    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        avatar: formData.avatar,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Gagal mendaftar. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className={styles.authCard}>
      <h2 className={styles.title}>Buat Akun Baru 👋</h2>
      <p className={styles.subtitle}>Yuk kenalan! Siapa namamu?</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>Nama Panggilan</label>
          <input
            id="name"
            type="text"
            className={styles.input}
            placeholder="Contoh: Budi"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            disabled={loading}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            id="email"
            type="email"
            className={styles.input}
            placeholder="contoh@email.com"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            disabled={loading}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            id="password"
            type="password"
            className={styles.input}
            placeholder="Minimal 6 karakter"
            value={formData.password}
            onChange={(e) => updateField('password', e.target.value)}
            disabled={loading}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="confirmPassword" className={styles.label}>Ulangi Password</label>
          <input
            id="confirmPassword"
            type="password"
            className={styles.input}
            placeholder="Ketik ulang password"
            value={formData.confirmPassword}
            onChange={(e) => updateField('confirmPassword', e.target.value)}
            disabled={loading}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Pilih Karaktermu</label>
          <AvatarPicker 
            selected={formData.avatar}
            onSelect={(avatar) => updateField('avatar', avatar)}
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <Button 
          type="submit" 
          block 
          size="large" 
          loading={loading}
          disabled={!formData.name || !formData.email || !formData.password || !formData.avatar}
        >
          Mulai Petualangan! 🚀
        </Button>
      </form>
    </Card>
  );
};

export default RegisterForm;
