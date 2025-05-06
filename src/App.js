// src/App.js
import { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [duration, setDuration] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const nameInputRef = useRef(null);

  const SERVICE_ID = 'service_putiygv';
  const TEMPLATE_ID = 'template_8cgpydn';
  const PUBLIC_KEY = 'THpNdvbfv7JE3mj6S';

  useEffect(() => {
    if (!isLoggedIn && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isLoggedIn]);

  const getESTTimeString = () => {
    return new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const sendEmail = (eventType, time, durationStr = '') => {
    const templateParams = {
      name,
      location,
      email: userEmail, // Their email (included in template)
      event: eventType,
      time,
      duration: durationStr
    };

    console.log('Sending email with params:', templateParams);
    setIsSending(true);

    return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then(() => {
        alert(`${eventType} email sent!`);
        console.log(`${eventType} email sent!`);
      })
      .catch((error) => {
        alert('Failed to send email. Check console.');
        console.error('Email error:', error);
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const handleLogin = async () => {
    if (!name || !location || !userEmail) {
      alert('Please fill out all fields.');
      return;
    }
    if (!validateEmail(userEmail)) {
      alert('Please enter a valid email address.');
      return;
    }

    const loginTime = getESTTimeString();
    console.log('Logging in at (EST):', loginTime);
    await sendEmail('Log In', loginTime);
    setIsLoggedIn(true);
    const id = setInterval(() => setDuration(prev => prev + 1), 1000);
    setIntervalId(id);
  };

  const handleLogout = async () => {
    const logoutTime = getESTTimeString();
    const durationStr = formatDuration(duration);
    console.log('Logging out at (EST):', logoutTime, 'Duration:', durationStr);
    await sendEmail('Log Out', logoutTime, durationStr);
    if (intervalId) clearInterval(intervalId);
    setIsLoggedIn(false);
    setDuration(0);
  };

  const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const allFieldsFilled = name && location && userEmail && validateEmail(userEmail);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'sans-serif',
      backgroundColor: '#f0f4f8'
    }}>
      <div style={{
        background: '#ffffff',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        textAlign: 'center',
        minWidth: '320px'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Myc2creative Time Tracker</h1>

        <input
          ref={nameInputRef}
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={isLoggedIn}
          style={{ padding: '10px', width: '100%', marginBottom: '15px', fontSize: '1rem', borderRadius: '8px', border: '1px solid #ccc' }}
        /><br />

        <input
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          disabled={isLoggedIn}
          style={{ padding: '10px', width: '100%', marginBottom: '15px', fontSize: '1rem', borderRadius: '8px', border: '1px solid #ccc' }}
        /><br />

        <input
          type="email"
          placeholder="Your Email Address"
          value={userEmail}
          onChange={e => setUserEmail(e.target.value)}
          disabled={isLoggedIn}
          style={{ padding: '10px', width: '100%', marginBottom: '15px', fontSize: '1rem', borderRadius: '8px', border: '1px solid #ccc' }}
        /><br />

        {!isLoggedIn ? (
          <button
            onClick={handleLogin}
            disabled={!allFieldsFilled || isSending}
            style={{ padding: '12px 20px', fontSize: '1rem', borderRadius: '8px', backgroundColor: allFieldsFilled ? '#007BFF' : '#aaa', color: '#fff', border: 'none', cursor: allFieldsFilled ? 'pointer' : 'not-allowed', width: '100%', opacity: isSending ? 0.7 : 1 }}
          >{isSending ? 'Sending...' : 'Log In'}</button>
        ) : (
          <button
            onClick={handleLogout}
            disabled={isSending}
            style={{ padding: '12px 20px', fontSize: '1rem', borderRadius: '8px', backgroundColor: '#dc3545', color: '#fff', border: 'none', cursor: 'pointer', width: '100%', opacity: isSending ? 0.7 : 1 }}
          >{isSending ? 'Sending...' : 'Log Out'}</button>
        )}

        <div style={{ marginTop: 20 }}>
          {isLoggedIn && <p style={{ fontSize: '1.2rem', color: '#333' }}>Duration: {formatDuration(duration)}</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
