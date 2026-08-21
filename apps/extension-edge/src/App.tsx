import { useState, useEffect, useCallback, useRef } from 'react';
import Editor from './components/Editor/Editor';
import OutputPanel from './components/OutputPanel/OutputPanel';
import ErrorDisplay, { ErrorMessage } from './components/ErrorDisplay/ErrorDisplay';
import Toolbar from './components/Toolbar/Toolbar';
import SaveAsModal from './components/SaveAsModal/SaveAsModal';
import ProgramsLibrary from './components/ProgramsLibrary/ProgramsLibrary';
import DebugControls from './components/DebugControls/DebugControls';
import VariablesPanel from './components/VariablesPanel/VariablesPanel';
import { ExportModal } from './components/ExportModal/ExportModal';
import Tutorial from './components/Tutorial/Tutorial';
import SyntaxReference from './components/SyntaxReference/SyntaxReference';
import PracticeProblems from './components/PracticeProblems/PracticeProblems';
import ExamMode, { ExamModeStartModal } from './components/ExamMode/ExamMode';
import LearningTools from './components/LearningTools/LearningTools';
import { tokenize, parse, Interpreter, validate, debounce, RuntimeError, DebugState } from '@pseudorun/core';
import { saveCode, loadCode, clearSavedCode } from './utils/storage';
import { downloadCode, readFile } from './utils/fileHandler';
import { Program } from './types/program';
import styles from './App.module.css';

function App() {
  // Always in guest mode for offline extension
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [errors, setErrors] = useState<ErrorMessage[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const inputResolveRef = useRef<((value: string) => void) | null>(null);
  
  // File upload state
  const [waitingForFileUpload, setWaitingForFileUpload] = useState(false);
  const [fileUploadPrompt, setFileUploadPrompt] = useState('');
  const fileUploadResolveRef = useRef<((content: string) => void) | null>(null);
  const [createdFiles, setCreatedFiles] = useState<Array<{ filename: string; mode: string; lineCount: number }>>([]);
  
  // Program management state
  const [currentProgram, setCurrentProgram] = useState<{ id: string; name: string } | null>(null);
  const [showSaveAsModal, setShowSaveAsModal] = useState(false);
  const [showProgramsLibrary, setShowProgramsLibrary] = useState(false);
  const [lastSavedCode, setLastSavedCode] = useState('');

  
  // Export state
  const [showExportModal, setShowExportModal] = useState(false);

  // Debug state
  const [isDebugging, setIsDebugging] = useState(false);
  const [debugState, setDebugState] = useState<DebugState | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const stepResolveRef = useRef<(() => void) | null>(null);
  const interpreterRef = useRef<Interpreter | null>(null);

  
  // Learning features state
  const [showTutorial, setShowTutorial] = useState(false);
  const [showSyntaxReference, setShowSyntaxReference] = useState(false);
  const [showPracticeProblems, setShowPracticeProblems] = useState(false);
  const [showLearningTools, setShowLearningTools] = useState(false);
  const [showExamModeStart, setShowExamModeStart] = useState(false);
  const [examMode, setExamMode] = useState<{ active: boolean; duration: number }>({ active: false, duration: 45 });

  const [leftWidth, setLeftWidth] = useState(50);
  const splitRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const [problemsHeight, setProblemsHeight] = useState(28);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const isDraggingVerticalRef = useRef(false);
  const [isDraggingVertical, setIsDraggingVertical] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (isDraggingRef.current && splitRef.current) {
        const rect = splitRef.current.getBoundingClientRect();
        const pct = ((e.clientX - rect.left) / rect.width) * 100;
        if (pct > 20 && pct < 80) setLeftWidth(pct);
      }
      if (isDraggingVerticalRef.current && rightPanelRef.current) {
        const rect = rightPanelRef.current.getBoundingClientRect();
        const pctFromTop = ((e.clientY - rect.top) / rect.height) * 100;
        const newProblems = 100 - pctFromTop;
        if (newProblems > 10 && newProblems < 70) setProblemsHeight(newProblems);
      }
    };
    const onUp = () => {
      isDraggingRef.current = false;
      isDraggingVerticalRef.current = false;
      setIsDragging(false);
      setIsDraggingVertical(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  
  // Load code from LocalStorage on mount
  useEffect(() => {
    const savedCode = loadCode();
    if (savedCode) {
      setCode(savedCode);
    }
  }, []);

  // Debounced validation
  const debouncedValidate = useCallback(
    debounce((codeToValidate: string) => {
      if (!codeToValidate.trim()) {
        setErrors([]);
        setIsValidating(false);
        return;
      }

      setIsValidating(true);
      const validationErrors = validate(codeToValidate);
      setErrors(validationErrors);
      setIsValidating(false);
    }, 500),
    []
  );

  // Debounced auto-save
  const debouncedSave = useCallback(
    debounce((codeToSave: string) => {
      saveCode(codeToSave);
    }, 1000),
    []
  );

  // Handle code changes
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    debouncedValidate(newCode);
    debouncedSave(newCode);
  };

  // Handle run execution
  const handleRun = async () => {

    // Check for syntax errors first
    if (errors.length > 0 && errors.some(e => e.type === 'syntax')) {
      alert('Fix syntax errors before running');
      return;
    }

    // Clear output and errors
    setOutput([]);
    setErrors([]);
    setIsRunning(true);
    setWaitingForInput(false);
    setCreatedFiles([]);

    try {
      // Tokenize and parse
      const tokens = tokenize(code);
      const ast = parse(tokens);

      // Create interpreter with custom input handler and file upload handler
      const interpreter = new Interpreter(
        // Input handler
        async (variableName: string, variableType: string) => {
          return new Promise<string>((resolve) => {
            setInputPrompt(`Enter value for ${variableName} (${variableType}):`);
            setWaitingForInput(true);
            inputResolveRef.current = resolve;
          });
        },
        // Debug mode
        false,
        // Step callback
        undefined,
        // File write output
        true,
        // File upload handler
        async (filename: string) => {
          return new Promise<string>((resolve) => {
            setFileUploadPrompt(`Upload file: ${filename}`);
            setWaitingForFileUpload(true);
            fileUploadResolveRef.current = resolve;
          });
        }
      );

      interpreterRef.current = interpreter;

      // Execute with animation
      const generator = interpreter.executeProgram(ast);

      for await (const line of generator) {
        setOutput(prev => [...prev, line]);
        // Wait 300ms between outputs
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Get list of created/opened files
      const files = interpreter.getAllFiles();
      setCreatedFiles(files);

      setIsRunning(false);
      setWaitingForInput(false);
    } catch (error) {
      setIsRunning(false);
      setWaitingForInput(false);

      if (error instanceof RuntimeError) {
        setErrors([{
          line: (error as RuntimeError).line,
          message: (error as RuntimeError).message,
          type: 'runtime'
        }]);
      } else {
        setErrors([{
          line: 1,
          message: (error as Error).message,
          type: 'runtime'
        }]);
      }
    }
  };

  // Handle clear
  const handleClear = () => {
    if (confirm('Are you sure? This will delete all code.')) {
      setCode('');
      setOutput([]);
      setErrors([]);
      clearSavedCode();
    }
  };

  // Handle download
  const handleDownload = () => {
    downloadCode(code);
  };

  // Handle upload
  const handleUpload = async (file: File) => {
    if (confirm('Load file? This will replace your current code.')) {
      try {
        const content = await readFile(file);
        setCode(content);
      } catch (error) {
        alert((error as Error).message);
      }
    }
  };

  // Handle load example
  const handleLoadExample = (exampleCode: string) => {
    if (confirm('Load example? This will replace your current code.')) {
      setCode(exampleCode);
    }
  };

  // Handle input submission
  const handleInputSubmit = (value: string) => {
    if (inputResolveRef.current) {
      inputResolveRef.current(value);
      inputResolveRef.current = null;
      setWaitingForInput(false);
      setInputPrompt('');
      if (isDebugging) setIsPaused(true);
    }
  };

  // Handle file upload submission
  const handleFileUploadSubmit = async (file: File) => {
    if (fileUploadResolveRef.current) {
      try {
        const content = await readFile(file);
        fileUploadResolveRef.current(content);
        fileUploadResolveRef.current = null;
        setWaitingForFileUpload(false);
        setFileUploadPrompt('');
        if (isDebugging) setIsPaused(true);
      } catch (error) {
        alert((error as Error).message);
      }
    }
  };

  // Handle file upload cancel
  const handleFileUploadCancel = () => {
    if (fileUploadResolveRef.current) {
      fileUploadResolveRef.current(''); // Empty content = empty file
      fileUploadResolveRef.current = null;
      setWaitingForFileUpload(false);
      setFileUploadPrompt('');
      if (isDebugging) setIsPaused(true);
    }
  };

  // Debug handlers
  const handleDebug = async () => {
    // Check for syntax errors first
    if (errors.length > 0 && errors.some(e => e.type === 'syntax')) {
      alert('Fix syntax errors before debugging');
      return;
    }

    // Clear output and errors
    setOutput([]);
    setErrors([]);
    setIsRunning(true);
    setIsDebugging(true);
    setIsPaused(false);
    setWaitingForInput(false);
    setCreatedFiles([]);

    try {
      // Tokenize and parse
      const tokens = tokenize(code);
      const ast = parse(tokens);

      // Create interpreter in debug mode first
      const interpreter = new Interpreter(
        async (variableName: string, variableType: string) => {
          setIsPaused(false);
          return new Promise<string>((resolve) => {
            setInputPrompt(`Enter value for ${variableName} (${variableType}):`);
            setWaitingForInput(true);
            inputResolveRef.current = resolve;
          });
        },
        true, // debug mode
        async () => {
          // Update debug state when pausing
          const currentDebugState = interpreter.getDebugState();
          setDebugState(currentDebugState);
          setIsPaused(true);
          
          // Wait for user to step
          return new Promise<void>((resolve) => {
            stepResolveRef.current = resolve;
          });
        },
        true, // file write output
        async (filename: string) => {
          setIsPaused(false);
          return new Promise<string>((resolve) => {
            setFileUploadPrompt(`Upload file: ${filename}`);
            setWaitingForFileUpload(true);
            fileUploadResolveRef.current = resolve;
          });
        }
      );

      interpreterRef.current = interpreter;

      // Execute with animation
      const generator = interpreter.executeProgram(ast);

      for await (const line of generator) {
        setOutput(prev => [...prev, line]);
        // Wait 300ms between outputs
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Get list of created/opened files
      const files = interpreter.getAllFiles();
      setCreatedFiles(files);

      setIsRunning(false);
      setIsDebugging(false);
      setIsPaused(false);
      setDebugState(null);
      setWaitingForInput(false);
    } catch (error) {
      setIsRunning(false);
      setIsDebugging(false);
      setIsPaused(false);
      setDebugState(null);
      setWaitingForInput(false);
      setWaitingForFileUpload(false);

      if (error instanceof RuntimeError) {
        setErrors([{
          line: (error as RuntimeError).line,
          message: (error as RuntimeError).message,
          type: 'runtime'
        }]);
      } else {
        setErrors([{
          line: 1,
          message: (error as Error).message,
          type: 'runtime'
        }]);
      }
    }
  };

  const handleDebugStep = () => {
    if (stepResolveRef.current) {
      setIsPaused(false);
      stepResolveRef.current();
      stepResolveRef.current = null;
    }
  };

  const handleDebugContinue = () => {
    // Disable debug mode to stop pausing
    if (interpreterRef.current) {
      interpreterRef.current.disableDebugMode();
    }
    
    setIsDebugging(false);
    setIsPaused(false);
    setDebugState(null);
    
    // Resume execution
    if (stepResolveRef.current) {
      stepResolveRef.current();
      stepResolveRef.current = null;
    }
  };

  const handleDebugStop = () => {
    setIsDebugging(false);
    setIsPaused(false);
    setIsRunning(false);
    setDebugState(null);
    
    // This will cause the execution to complete
    if (stepResolveRef.current) {
      stepResolveRef.current();
      stepResolveRef.current = null;
    }
    if (inputResolveRef.current) {
      inputResolveRef.current('');
      inputResolveRef.current = null;
    }
    if (fileUploadResolveRef.current) {
      fileUploadResolveRef.current('');
      fileUploadResolveRef.current = null;
    }
  };

  // Handle save as (create new program) - Local storage only
  const handleSaveAs = async (name: string) => {
    // Save to localStorage for offline extension
    const savedPrograms = JSON.parse(localStorage.getItem('savedPrograms') || '[]');
    const newProgram = {
      id: Date.now().toString(),
      name,
      code,
      createdAt: new Date().toISOString()
    };
    savedPrograms.push(newProgram);
    localStorage.setItem('savedPrograms', JSON.stringify(savedPrograms));

    setCurrentProgram({ id: newProgram.id, name });
    setLastSavedCode(code);
  };

  // Handle load program
  const handleLoadProgram = (program: Program) => {
    if (code !== lastSavedCode && code.trim()) {
      if (!confirm('You have unsaved changes. Load this program anyway?')) {
        return;
      }
    }

    setCode(program.code);
    setCurrentProgram({ id: program.id, name: program.name });
    setLastSavedCode(program.code);
  };

  // Handle open programs library
  const handleOpenLibrary = () => {
    setShowProgramsLibrary(true);
  };

  
  // Handle export code
  const handleExport = () => {
    if (!code.trim()) {
      alert('Cannot export empty code');
      return;
    }
    setShowExportModal(true);
  };

  
  // Learning features handlers
  const handleStartExam = (duration: number) => {
    setExamMode({ active: true, duration });
    setShowExamModeStart(false);
  };

  const handleExamTimeout = () => {
    alert('Time is up! Exam mode has ended.');
    setExamMode({ active: false, duration: 45 });
  };

  const handleExitExam = () => {
    setExamMode({ active: false, duration: 45 });
  };

  const handleLoadCodeFromFeature = (newCode: string) => {
    setCode(newCode);
  };

  
  return (
    <div className={styles.container}>
      <Toolbar
        onRun={handleRun}
        onDebug={handleDebug}
        onClear={handleClear}
        onDownload={handleDownload}
        onUpload={handleUpload}
        onLoadExample={handleLoadExample}
        onSaveAs={() => setShowSaveAsModal(true)}
        onOpenLibrary={handleOpenLibrary}
        onShare={() => {}} // Disabled for offline mode
        onExport={handleExport}
        onOpenAuth={() => {}} // Disabled for offline mode
        onOpenTutorial={() => setShowTutorial(true)}
        onOpenSyntaxReference={() => setShowSyntaxReference(true)}
        onOpenPracticeProblems={() => setShowPracticeProblems(true)}
        onOpenExamMode={() => setShowExamModeStart(true)}
        onOpenLearningTools={() => setShowLearningTools(true)}
        isRunning={isRunning}
        examModeActive={examMode.active}
      />

      <ExamMode
        isActive={examMode.active}
        duration={examMode.duration}
        onTimeout={handleExamTimeout}
        onExit={handleExitExam}
      />

      {isDebugging && (
        <DebugControls
          onStep={handleDebugStep}
          onContinue={handleDebugContinue}
          onStop={handleDebugStop}
          isDebugging={isDebugging}
          isPaused={isPaused}
          waitingForInput={waitingForInput}
          waitingForFileUpload={waitingForFileUpload}
        />
      )}

      
      <div className={styles.splitView} ref={splitRef}>
        <div className={styles.leftPanel} style={{ width: `${leftWidth}%` }}>
          <Editor value={code} onChange={handleCodeChange} />
        </div>

        <div
          className={`${styles.resizer} ${isDragging ? styles.resizerDragging : ''}`}
          onMouseDown={(e) => {
            isDraggingRef.current = true;
            setIsDragging(true);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
            e.preventDefault();
          }}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panels"
        />

        <div className={styles.rightPanel} ref={rightPanelRef}>
          {isDebugging && debugState && (
            <VariablesPanel
              variables={debugState.variables}
              currentLine={debugState.currentLine}
            />
          )}
          
          <div className={styles.outputWrapper} style={{ height: `${100 - problemsHeight}%` }}>
            <OutputPanel 
              output={output} 
              isRunning={isRunning}
              isDebugging={isDebugging}
              waitingForInput={waitingForInput}
              inputPrompt={inputPrompt}
              onInputSubmit={handleInputSubmit}
              waitingForFileUpload={waitingForFileUpload}
              fileUploadPrompt={fileUploadPrompt}
              onFileUploadSubmit={handleFileUploadSubmit}
              onFileUploadCancel={handleFileUploadCancel}
              createdFiles={createdFiles}
              interpreterRef={interpreterRef}
            />
          </div>
          <div
            className={`${styles.verticalResizer} ${isDraggingVertical ? styles.verticalResizerDragging : ''}`}
            onMouseDown={(e) => {
              isDraggingVerticalRef.current = true;
              setIsDraggingVertical(true);
              document.body.style.cursor = 'row-resize';
              document.body.style.userSelect = 'none';
              e.preventDefault();
            }}
            role="separator"
            aria-orientation="horizontal"
            aria-label="Resize output and problems"
          />
          <div className={styles.problemsWrapper} style={{ height: `${problemsHeight}%` }}>
            <ErrorDisplay errors={errors} isValidating={isValidating} />
          </div>
        </div>
      </div>

      {showSaveAsModal && (
        <SaveAsModal
          onSave={handleSaveAs}
          onClose={() => setShowSaveAsModal(false)}
          defaultName={currentProgram?.name || ''}
        />
      )}

      {showProgramsLibrary && (
        <ProgramsLibrary
          onLoad={handleLoadProgram}
          onClose={() => setShowProgramsLibrary(false)}
        />
      )}

      
      {showExportModal && (
        <ExportModal
          code={code}
          programName={currentProgram?.name}
          onClose={() => setShowExportModal(false)}
        />
      )}

      
      {showTutorial && (
        <Tutorial
          onClose={() => setShowTutorial(false)}
          onLoadCode={handleLoadCodeFromFeature}
        />
      )}

      {showSyntaxReference && (
        <SyntaxReference onClose={() => setShowSyntaxReference(false)} />
      )}

      {showPracticeProblems && (
        <PracticeProblems
          onClose={() => setShowPracticeProblems(false)}
          onLoadCode={handleLoadCodeFromFeature}
        />
      )}

      {showLearningTools && (
        <LearningTools
          code={code}
          onClose={() => setShowLearningTools(false)}
        />
      )}

      {showExamModeStart && (
        <ExamModeStartModal
          onStart={handleStartExam}
          onCancel={() => setShowExamModeStart(false)}
        />
      )}

        </div>
  );
}

export default App;
