import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button, Card } from '../common';
import AvatarPicker from './AvatarPicker';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import styles from './AuthForms.module.css';

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { showError } = useToast();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '',
    password: '',
    confirmPassword: '',
    avatar: '' 
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      showError('Nama harus diisi ya!');
      return;
    }
    if (!formData.email) {
      showError('Email harus diisi ya!');
      return;
    }
    if (!formData.password) {
      showError('Password harus diisi ya!');
      return;
    }
    if (formData.password.length < 6) {
      showError('Password minimal 6 karakter!');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showError('Password tidak sama!');
      return;
    }
    if (!formData.avatar) {
      showError('Pilih avatar kamu dulu!');
      return;
    }

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
      // Error is already shown via toast in api.js
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
