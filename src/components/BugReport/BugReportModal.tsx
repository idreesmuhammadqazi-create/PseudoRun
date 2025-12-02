/**
 * Bug Report Modal
 * Form for submitting bug reports via email using Web3Forms
 */

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './BugReportModal.module.css';

// Web3Forms API endpoint
const WEB3FORMS_API = 'https://api.web3forms.com/submit';

// TODO: Replace with your actual Web3Forms access key from https://web3forms.com
// This is safe to be public - it's designed for frontend use
const WEB3FORMS_ACCESS_KEY = '53394e13-ac9b-4ade-a602-954f123a8c53';

interface BugReportModalProps {
  onClose: () => void;
}

export default function BugReportModal({ onClose }: BugReportModalProps) {
  const { currentUser, isGuestMode } = useAuth();
  const [userEmail, setUserEmail] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [reproductionSteps, setReproductionSteps] = useState('');
  const [expectedBehavior, setExpectedBehavior] = useState('');
  const [actualBehavior, setActualBehavior] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-populate email from current user
  useEffect(() => {
    if (currentUser?.email) {
      setUserEmail(currentUser.email);
    }
  }, [currentUser]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [loading]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Bug description
    const trimmedDesc = bugDescription.trim();
    if (!trimmedDesc) {
      newErrors.bugDescription = 'Please describe the bug';
    } else if (trimmedDesc.length < 10) {
      newErrors.bugDescription = 'Bug description must be at least 10 characters';
    } else if (trimmedDesc.length > 1000) {
      newErrors.bugDescription = 'Bug description must be less than 1000 characters';
    }

    // Reproduction steps
    const trimmedSteps = reproductionSteps.trim();
    if (!trimmedSteps) {
      newErrors.reproductionSteps = 'Please provide reproduction steps';
    } else if (trimmedSteps.length < 10) {
      newErrors.reproductionSteps = 'Please provide at least 10 characters of reproduction steps';
    } else if (trimmedSteps.length > 1000) {
      newErrors.reproductionSteps = 'Reproduction steps must be less than 1000 characters';
    }

    // Email (if provided)
    const trimmedEmail = userEmail.trim();
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.userEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      // Determine user identifier
      let userIdentifier = 'Anonymous';
      if (currentUser?.email) {
        userIdentifier = currentUser.email;
      } else if (isGuestMode) {
        userIdentifier = 'Guest';
      } else if (userEmail.trim()) {
        userIdentifier = userEmail.trim();
      }

      const timestamp = new Date().toISOString();

      // Format the bug report message
      const message = `
=================================
BUG REPORT - PseudoRun
=================================

SUBMITTED: ${timestamp}
USER: ${userIdentifier}
USER ID: ${currentUser?.uid || 'Guest'}

---------------------------------
DESCRIPTION
---------------------------------
${bugDescription.trim()}

---------------------------------
REPRODUCTION STEPS
---------------------------------
${reproductionSteps.trim()}

---------------------------------
EXPECTED BEHAVIOR
---------------------------------
${expectedBehavior.trim() || 'Not provided'}

---------------------------------
ACTUAL BEHAVIOR
---------------------------------
${actualBehavior.trim() || 'Not provided'}

---------------------------------
TECHNICAL DETAILS
---------------------------------
Browser: ${navigator.userAgent}
Page URL: ${window.location.href}
Guest Mode: ${isGuestMode ? 'Yes' : 'No'}

---------------------------------
CONTACT
---------------------------------
Contact Email: ${userEmail.trim() || currentUser?.email || 'Not provided'}

=================================
      `.trim();

      // Prepare form data for Web3Forms
      const formData = new FormData();
      formData.append('access_key', WEB3FORMS_ACCESS_KEY);
      formData.append('subject', 'Bug Report - PseudoRun');
      formData.append('from_name', 'PseudoRun Bug Reporter');
      formData.append('to_email', 'support@pseudorun.tech');

      // Add reply-to email if provided
      if (userEmail.trim() || currentUser?.email) {
        formData.append('email', userEmail.trim() || currentUser?.email || '');
      }

      formData.append('message', message);

      // Send to Web3Forms API
      const response = await fetch(WEB3FORMS_API, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Auto-close after 3 seconds
        autoCloseTimerRef.current = setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        setSubmitError(data.message || 'Failed to submit bug report. Please try again.');
      }
    } catch (error: any) {
      console.error('Bug report submission error:', error);
      setSubmitError('Failed to submit bug report. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Prevent closing during submission
    if (loading) return;

    // Clear timer if exists
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }

    // Reset form state
    setUserEmail('');
    setBugDescription('');
    setReproductionSteps('');
    setExpectedBehavior('');
    setActualBehavior('');
    setErrors({});
    setSubmitError('');
    setSuccess(false);

    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !loading) {
      handleClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={handleClose}
          disabled={loading}
          aria-label="Close"
        >
          ×
        </button>

        <h2 className={styles.title}>Report a Bug</h2>

        {success && (
          <div className={styles.success}>
            <strong>Thank you! Your bug report has been submitted successfully.</strong>
            <p>We'll review it as soon as possible.</p>
            <button
              onClick={handleClose}
              className={styles.submitButton}
              style={{ marginTop: '16px' }}
            >
              Close
            </button>
          </div>
        )}

        {submitError && <div className={styles.submitError}>{submitError}</div>}

        {!success && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div>
              <label className={styles.fieldLabel}>
                Your email <span className={styles.optional}>(optional, for follow-up)</span>
              </label>
              <input
                type="email"
                placeholder="Your email (optional, for follow-up)"
                value={userEmail}
                onChange={(e) => {
                  setUserEmail(e.target.value);
                  if (errors.userEmail) {
                    setErrors({ ...errors, userEmail: '' });
                  }
                }}
                className={styles.input}
                disabled={loading}
              />
              {errors.userEmail && <span className={styles.fieldError}>{errors.userEmail}</span>}
            </div>

            <div>
              <label className={styles.fieldLabel}>
                What happened? <span style={{ color: '#c62828' }}>*</span>
              </label>
              <textarea
                placeholder="Describe the bug you encountered..."
                value={bugDescription}
                onChange={(e) => {
                  setBugDescription(e.target.value);
                  if (errors.bugDescription) {
                    setErrors({ ...errors, bugDescription: '' });
                  }
                }}
                className={styles.textarea}
                disabled={loading}
                maxLength={1000}
              />
              {errors.bugDescription && <span className={styles.fieldError}>{errors.bugDescription}</span>}
            </div>

            <div>
              <label className={styles.fieldLabel}>
                How can we reproduce this? <span style={{ color: '#c62828' }}>*</span>
              </label>
              <textarea
                placeholder="1. Go to...&#10;2. Click on...&#10;3. See error..."
                value={reproductionSteps}
                onChange={(e) => {
                  setReproductionSteps(e.target.value);
                  if (errors.reproductionSteps) {
                    setErrors({ ...errors, reproductionSteps: '' });
                  }
                }}
                className={styles.textarea}
                disabled={loading}
                maxLength={1000}
              />
              {errors.reproductionSteps && <span className={styles.fieldError}>{errors.reproductionSteps}</span>}
            </div>

            <div>
              <label className={styles.fieldLabel}>
                What should have happened? <span className={styles.optional}>(optional)</span>
              </label>
              <textarea
                placeholder="Describe the expected behavior..."
                value={expectedBehavior}
                onChange={(e) => setExpectedBehavior(e.target.value)}
                className={styles.textareaSmall}
                disabled={loading}
                maxLength={500}
              />
            </div>

            <div>
              <label className={styles.fieldLabel}>
                What actually happened? <span className={styles.optional}>(optional)</span>
              </label>
              <textarea
                placeholder="Describe what actually happened..."
                value={actualBehavior}
                onChange={(e) => setActualBehavior(e.target.value)}
                className={styles.textareaSmall}
                disabled={loading}
                maxLength={500}
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Submit Bug Report'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
