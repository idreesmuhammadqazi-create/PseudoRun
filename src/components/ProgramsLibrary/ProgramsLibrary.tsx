/**
 * Programs Library Component
 * Displays all saved programs with load, rename, duplicate, and delete options
 */

import { useState, useEffect } from 'react';
import { Program } from '../../types/program';
import { getUserPrograms, deleteProgram, updateProgram, createProgram } from '../../services/programsService';
import { useAuth } from '../../contexts/AuthContext';
import styles from './ProgramsLibrary.module.css';

interface ProgramsLibraryProps {
  onLoad: (program: Program) => void;
  onClose: () => void;
}

export default function ProgramsLibrary({ onLoad, onClose }: ProgramsLibraryProps) {
  const { currentUser } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Load programs on mount
  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError('');

    try {
      const userPrograms = await getUserPrograms(currentUser.uid);
      setPrograms(userPrograms);
    } catch (err) {
      setError('Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  const handleLoad = (program: Program) => {
    onLoad(program);
    onClose();
  };

  const handleDelete = async (programId: string, programName: string) => {
    if (!confirm(`Delete "${programName}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteProgram(programId);
      setPrograms(programs.filter(p => p.id !== programId));
    } catch (err) {
      alert('Failed to delete program');
    }
  };

  const handleStartRename = (program: Program) => {
    setEditingId(program.id);
    setEditingName(program.name);
  };

  const handleRename = async (programId: string) => {
    if (!editingName.trim()) {
      alert('Program name cannot be empty');
      return;
    }

    try {
      await updateProgram(programId, { name: editingName.trim() });
      setPrograms(programs.map(p =>
        p.id === programId ? { ...p, name: editingName.trim() } : p
      ));
      setEditingId(null);
    } catch (err) {
      alert('Failed to rename program');
    }
  };

  const handleDuplicate = async (program: Program) => {
    if (!currentUser) return;

    try {
      await createProgram(currentUser.uid, {
        name: `${program.name} (Copy)`,
        code: program.code
      });

      // Reload programs to show the new one
      await loadPrograms();
    } catch (err) {
      alert('Failed to duplicate program');
    }
  };

  const filteredPrograms = programs.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2 className={styles.title}>My Programs</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </header>

        <input
          type="text"
          placeholder="Search programs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.list}>
          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : filteredPrograms.length === 0 ? (
            <div className={styles.empty}>
              {searchTerm ? 'No programs match your search' : 'No saved programs yet'}
            </div>
          ) : (
            filteredPrograms.map((program) => (
              <div key={program.id} className={styles.programItem}>
                <div className={styles.programInfo}>
                  {editingId === program.id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => handleRename(program.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename(program.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className={styles.editInput}
                      autoFocus
                    />
                  ) : (
                    <>
                      <div className={styles.programName} onClick={() => handleLoad(program)}>
                        {program.name}
                      </div>
                      <div className={styles.programDate}>
                        Modified: {program.updatedAt.toLocaleDateString()} at{' '}
                        {program.updatedAt.toLocaleTimeString()}
                      </div>
                    </>
                  )}
                </div>
                <div className={styles.actions}>
                  <button
                    className={styles.actionButton}
                    onClick={() => handleLoad(program)}
                    title="Load"
                  >
                    📂
                  </button>
                  <button
                    className={styles.actionButton}
                    onClick={() => handleStartRename(program)}
                    title="Rename"
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.actionButton}
                    onClick={() => handleDuplicate(program)}
                    title="Duplicate"
                  >
                    📋
                  </button>
                  <button
                    className={styles.actionButton}
                    onClick={() => handleDelete(program.id, program.name)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <footer className={styles.footer}>
          <span className={styles.count}>
            {filteredPrograms.length} program{filteredPrograms.length !== 1 ? 's' : ''}
          </span>
        </footer>
      </div>
    </div>
  );
}
