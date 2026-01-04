import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import AuthLayout from '../components/auth/AuthLayout';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <AuthLayout>
      <LoginForm />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>Belum punya akun?</p>
        <Link 
          to="/register" 
          style={{ 
            color: 'var(--color-primary)', 
            fontWeight: 'bold',
            textDecoration: 'underline'
          }}
        >
          Daftar Dulu Yuk!
        </Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
