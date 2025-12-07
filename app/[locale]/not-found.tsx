import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Sayfa Bulunamadı [LOCALE]</h2>
      <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <Link 
        href="/tr"
        style={{
          padding: '0.75rem 2rem',
          background: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '500'
        }}
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
