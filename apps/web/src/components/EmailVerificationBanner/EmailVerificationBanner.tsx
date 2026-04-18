/**
 * Email Verification Banner
 * Displays a banner prompting unverified users to verify their email
 */

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './EmailVerificationBanner.module.css';

export default function EmailVerificationBanner() {
  const { currentUser, resendVerificationEmail } = useAuth();
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');

  if (!currentUser || currentUser.emailVerified) {
    return null;
  }

  const handleResend = async () => {
    setResending(true);
    setMessage('');

    try {
      await resendVerificationEmail();
      setMessage('✓ Verification email sent! Please check your inbox.');
    } catch (error: any) {
      console.error('Resend error:', error);
      setMessage(`✗ ${error.message || 'Failed to send email. Please try again later.'}`);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <span className={styles.icon}>⚠️</span>
        <div className={styles.text}>
          <strong>Email verification required</strong>
          <p>Please verify your email address ({currentUser.email}) to access all features.</p>
        </div>
        <button
          onClick={handleResend}
          disabled={resending}
          className={styles.button}
        >
          {resending ? 'Sending...' : 'Resend Email'}
        </button>
      </div>
      {message && (
        <div className={styles.message}>
          {message}
        </div>
      )}
    </div>
  );
}
