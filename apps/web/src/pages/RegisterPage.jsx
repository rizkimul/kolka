import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import AuthLayout from '../components/auth/AuthLayout';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <AuthLayout>
      <RegisterForm />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>Sudah punya akun?</p>
        <Link 
          to="/login" 
          style={{ 
            color: 'var(--color-primary)', 
            fontWeight: 'bold',
            textDecoration: 'underline'
          }}
        >
          Masuk di sini
        </Link>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
