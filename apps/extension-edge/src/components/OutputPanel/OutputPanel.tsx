import { useEffect, useRef, useState } from 'react';
import styles from './OutputPanel.module.css';

interface OutputPanelProps {
  output: string[];
  isRunning: boolean;
  waitingForInput?: boolean;
  inputPrompt?: string;
  onInputSubmit?: (value: string) => void;
  waitingForFileUpload?: boolean;
  fileUploadPrompt?: string;
  onFileUploadSubmit?: (file: File) => void;
  onFileUploadCancel?: () => void;
  createdFiles?: Array<{ filename: string; mode: string; lineCount: number }>;
  interpreterRef?: React.RefObject<any>;
}

export default function OutputPanel({ 
  output, 
  isRunning, 
  waitingForInput = false, 
  inputPrompt = '',
  onInputSubmit,
  waitingForFileUpload = false,
  fileUploadPrompt = '',
  onFileUploadSubmit,
  onFileUploadCancel,
  createdFiles = [],
  interpreterRef
}: OutputPanelProps) {
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');

  // Auto-scroll to bottom when new output appears
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Focus input field when waiting for input
  useEffect(() => {
    if (waitingForInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [waitingForInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onInputSubmit && inputValue.trim()) {
      onInputSubmit(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>Output</span>
        {isRunning && <span className={styles.statusRunning}>Running...</span>}
        {!isRunning && output.length > 0 && <span className={styles.statusCompleted}>Completed</span>}
      </div>

      <div className={styles.outputArea} ref={outputRef}>
        {output.length === 0 && !isRunning && (
          <div className={styles.emptyMessage}>No output yet</div>
        )}
        {output.length === 0 && isRunning && (
          <div className={styles.emptyMessage}>Running...</div>
        )}
        {output.map((line, index) => (
          <div key={index} className={styles.outputLine}>
            {line}
          </div>
        ))}
        
        {waitingForInput && (
          <div className={styles.inputLine}>
            <span className={styles.inputPromptInline}>{inputPrompt} </span>
            <form onSubmit={handleSubmit} className={styles.inlineInputForm}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className={styles.inlineInputField}
                autoComplete="off"
              />
            </form>
          </div>
        )}

        {waitingForFileUpload && (
          <div className={styles.fileUploadSection}>
            <label>{fileUploadPrompt}</label>
            <input
              type="file"
              accept=".txt,.csv,.dat"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && onFileUploadSubmit) {
                  onFileUploadSubmit(file);
                }
              }}
              className={styles.fileInput}
            />
            <button
              onClick={onFileUploadCancel}
              className={styles.cancelButton}
            >
              Cancel (Use Empty File)
            </button>
          </div>
        )}
      </div>

      {createdFiles && createdFiles.length > 0 && (
        <div className={styles.filesSection}>
          <h3 className={styles.filesHeader}>Files Created/Opened:</h3>
          {createdFiles.map((file, index) => (
            <div key={index} className={styles.fileItem}>
              <span className={styles.fileName}>{file.filename}</span>
              <span className={styles.fileMode}>({file.mode})</span>
              <span className={styles.fileLines}>{file.lineCount} lines</span>
              {(file.mode === 'WRITE' || file.mode === 'APPEND') && interpreterRef?.current && (
                <button
                  onClick={() => {
                    const content = interpreterRef.current.getFileContent(file.filename);
                    if (content !== null) {
                      // Download file
                      const blob = new Blob([content], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = file.filename;
                      a.click();
                      URL.revokeObjectURL(url);
                    }
                  }}
                  className={styles.downloadButton}
                >
                  Download
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
