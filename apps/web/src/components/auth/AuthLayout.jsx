import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #E8F4FC 0%, #FFFFFF 100%)'
    }}>
      <div style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🎓 KOLKA</h1>
          <p style={{ color: '#7F8C8D' }}>Belajar menyusun kalimat jadi seru!</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
