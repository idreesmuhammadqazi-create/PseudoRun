/**
 * Save As Modal Component
 * Allows users to save their current code with a custom name
 */

import { useState, FormEvent } from 'react';
import styles from './SaveAsModal.module.css';

interface SaveAsModalProps {
  onSave: (name: string) => Promise<void>;
  onClose: () => void;
  defaultName?: string;
}

export default function SaveAsModal({ onSave, onClose, defaultName = '' }: SaveAsModalProps) {
  const [name, setName] = useState(defaultName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Program name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSave(name.trim());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save program');
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Save Program As</h2>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter program name"
            className={styles.input}
            autoFocus
            disabled={loading}
            maxLength={100}
          />

          <div className={styles.buttons}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={loading || !name.trim()}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
