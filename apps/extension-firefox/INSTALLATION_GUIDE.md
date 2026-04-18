# PseudoRun Firefox Extension - Complete Installation & Usage Guide

## 🎯 Quick Start

### 📦 Installation

**Method 1: Install from Source (Recommended)**
1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on"
4. Navigate to the `firefox/` directory and select `manifest.json`
5. Extension installs immediately with all features available

**Method 2: Install from Package**
1. Extract `pseudorun-extension.zip` to any folder
2. Follow steps 1-4 above, selecting `manifest.json` from the extracted folder

### 🚀 First Use

1. **Click the PseudoRun icon** in your Firefox toolbar
2. **New tab opens** with the complete pseudocode editor
3. **Start coding immediately** - no internet or login required

---

## 📚 Complete Feature Guide

### 🎓 Educational Features

#### Built-in Examples (22 Programs)
- **Basic Input/Output**: `OUTPUT "Hello World"`, `INPUT name, OUTPUT name`
- **Variables**: `DECLARE score : INTEGER`, `score ← 85`
- **Conditional Logic**: `IF score >= 50 THEN OUTPUT "Pass"`
- **Loops**: `FOR count ← 1 TO 10`, `WHILE score < 100`
- **Arrays**: `DECLARE numbers : ARRAY[1..5] OF INTEGER`
- **Procedures**: `PROCEDURE CalculateAverage`
- **Functions**: `FUNCTION MaxValue(a, b) RETURNS INTEGER`

#### Interactive Tutorial
1. **Step-by-step lessons** covering IGCSE syllabus
2. **Try it yourself** exercises with instant feedback
3. **Progress tracking** as you complete each module
4. **Accessible from toolbar** → Tutorial button

#### Syntax Reference
- Complete Cambridge IGCSE pseudocode specifications
- Code examples for each construct
- Explanation of built-in functions
- Quick lookup while coding

#### Practice Problems
- **Beginner Level**: Basic variable operations
- **Intermediate**: Array manipulation and procedures
- **Advanced**: File I/O and recursive algorithms
- **Exam Preparation**: Timed challenges with scoring

### 🔧 Editor Features

#### Professional Code Editing
- **Syntax Highlighting**: Color-coded pseudocode elements
- **Auto-completion**: Suggestions for keywords and functions
- **Line Numbers**: Easy navigation and debugging
- **Bracket Matching**: Visual pairing of opening/closing brackets
- **Error Detection**: Real-time syntax validation with red underlines

#### Code Execution
- **Run Button**: Execute complete programs with animated output
- **Debug Mode**: Step through code line by line
- **Variable Watching**: Monitor variable values during execution
- **Input Handling**: Interactive prompts for user input
- **Output Display**: Formatted program output with timing

#### File Operations
```
-- Example file operations supported
DECLARE myFile : TEXTFILE
CREATE myFile, "data.txt"
WRITE myFile, "Sample data"
CLOSE myFile
```

### 💾 Program Management

#### Saving and Loading
- **Auto-save**: Code automatically saves every 1 second
- **Manual Save**: Save programs with custom names
- **Program Library**: Access all saved programs
- **Search & Filter**: Find specific programs quickly

#### Export Options
- **PDF Export**: Professional formatting for assignments
- **DOCX Export**: Word document compatibility
- **Text Export**: Plain text for sharing
- **Print**: Paper-friendly formatting options

### 🐛 Debug Mode

#### Step-by-Step Execution
1. **Click Debug** instead of Run
2. **Step** moves to the next line of code
3. **Variables Panel** shows current variable values
4. **Call Stack** tracks procedure/function calls
5. **Continue** resumes normal execution

#### Breakpoints
- Set breakpoints by clicking line numbers
- Pause execution at specific points
- Inspect program state at any moment

### ⏱️ Exam Mode

#### Timed Practice
- **Customizable Duration**: 30, 45, 60, or 90 minutes
- **Timer Display**: Visible countdown in toolbar
- **Auto-submit**: When time expires
- **Distraction-free**: Blocks tutorial and reference access

---

## 🎯 Learning Workflow

### For Students

1. **Start with Tutorial**: Learn basic syntax and concepts
2. **Try Examples**: Modify and run built-in programs
3. **Practice Problems**: Complete exercises by difficulty
4. **Debug Mode**: Understand how code executes step by step
5. **Create Programs**: Build your own solutions to assignments
6. **Export Work**: Save formatted versions for submission

### For Teachers

1. **Demonstrate Concepts**: Use examples to teach syntax
2. **Live Coding**: Write code together with real-time validation
3. **Debug Exercises**: Show step-by-step execution
4. **Assign Problems**: Use built-in exercises or create custom ones
5. **Monitor Progress**: Review student work through program exports
6. **Exam Preparation**: Use exam mode for timed assessments

---

## 💡 Tips & Tricks

### Keyboard Shortcuts
- **Ctrl/Cmd + S**: Manual save
- **Ctrl/Cmd + Enter**: Run program
- **Ctrl/Cmd + Shift + Enter**: Debug mode
- **Ctrl/Cmd + Z**: Undo
- **Ctrl/Cmd + Y**: Redo

### Best Practices
- **Start Simple**: Begin with basic input/output programs
- **Use Variables**: Always declare variables before use
- **Test Often**: Run code frequently to catch errors early
- **Use Comments**: Add explanations for complex logic
- **Save Regularly**: Use meaningful names for saved programs

### Common Mistakes to Avoid
- **Missing Variable Declarations**: Always DECLARE variables
- **Type Mismatches**: Ensure variable types match assignments
- **Infinite Loops**: Always include termination conditions
- **Uninitialized Variables**: Assign values before using
- **File Handle Issues**: Always CLOSE files after using

---

## 🔧 Technical Details

### Supported IGCSE Features

**Data Types**: `INTEGER`, `REAL`, `BOOLEAN`, `STRING`, `CHAR`
**Arrays**: `DECLARE arr : ARRAY[1..10] OF INTEGER`
**Control Flow**: `IF/THEN/ELSE`, `FOR/WHILE/REPEAT` loops
**Procedures**: `PROCEDURE name(parameter : type)`
**Functions**: `FUNCTION name(parameter : type) RETURNS type`
**File I/O**: `CREATE`, `OPEN`, `WRITE`, `READ`, `CLOSE`
**Built-in Functions**: `LENGTH()`, `SUBSTRING()`, `ROUND()`, `RANDOM()`

### Performance
- **Execution Speed**: Instant for small programs
- **Memory Usage**: Less than 50MB for large programs
- **Storage Limit**: Up to 10MB in browser localStorage
- **Offline Capability**: 100% functional without internet

### Privacy & Security
- ✅ **No Data Collection**: Extension never sends data anywhere
- ✅ **Local Storage Only**: All work saved on your device
- ✅ **No Authentication**: No account creation or login required
- ✅ **No Analytics**: No usage tracking or telemetry
- ✅ **Open Source**: Code is transparent and auditable

---

## 🆘 Troubleshooting

### Extension Not Loading
1. **Check Firefox Version**: Requires Firefox 142 or later
2. **Enable Extensions**: Make sure extensions are enabled in Firefox settings
3. **Restart Firefox**: Sometimes a browser restart helps
4. **Clear Cache**: Clear browser cache if issues persist

### Code Not Executing
1. **Check Syntax**: Look for red underlines indicating errors
2. **Check Variables**: Ensure all variables are declared
3. **Check Loops**: Make sure loops have termination conditions
4. **Use Debug Mode**: Step through code to find the issue

### Programs Not Saving
1. **Check Storage**: Ensure browser localStorage is enabled
2. **Clear Old Programs**: Remove old saved programs if storage is full
3. **Check Names**: Use valid characters in program names

### Performance Issues
1. **Large Programs**: Break down large programs into smaller parts
2. **Clear Output**: Clear output panel regularly
3. **Restart Extension**: Disable and re-enable if needed

---

## 📞 Support

For additional help:
- **Tutorial Section**: Built-in help within the extension
- **Example Programs**: Learn from working code examples
- **Syntax Reference**: Complete IGCSE specification included
- **Practice Mode**: Start with beginner problems

---

**Start learning IGCSE pseudocode today with PseudoRun - Your complete offline programming education partner!**