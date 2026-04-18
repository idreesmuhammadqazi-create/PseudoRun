using PseudoRun.Desktop.Interpreter;
using PseudoRun.Desktop.ViewModels;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;

namespace PseudoRun.Desktop.Services
{
    public class InterpreterService : IInterpreterService
    {
        private CancellationTokenSource? _cancellationTokenSource;
        private readonly IInputService _inputService;
        private readonly DebugViewModel _debugViewModel;

        public InterpreterService(IInputService inputService, DebugViewModel debugViewModel)
        {
            _inputService = inputService;
            _debugViewModel = debugViewModel;
        }

        public async IAsyncEnumerable<string> ExecuteAsync(
            string code,
            [EnumeratorCancellation] CancellationToken cancellationToken = default)
        {
            _cancellationTokenSource = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);

            try
            {
                // Tokenize
                var lexer = new Lexer();
                var tokens = lexer.Tokenize(code);

                // Parse
                var parser = new Parser(tokens);
                var ast = parser.Parse();

                // Execute with input handler
                var interpreter = new PseudocodeInterpreter(
                    inputHandler: async (varName, varType) => await _inputService.GetInputAsync(varName, varType));

                await foreach (var output in interpreter.Execute(ast, _cancellationTokenSource.Token))
                {
                    yield return output;
                }
            }
            finally
            {
                _cancellationTokenSource?.Dispose();
                _cancellationTokenSource = null;
            }
        }

        public async IAsyncEnumerable<string> ExecuteDebugAsync(
            string code,
            [EnumeratorCancellation] CancellationToken cancellationToken = default)
        {
            _cancellationTokenSource = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);

            try
            {
                // Tokenize
                var lexer = new Lexer();
                var tokens = lexer.Tokenize(code);

                // Parse
                var parser = new Parser(tokens);
                var ast = parser.Parse();

                // Declared here so the step callback can capture it.
                PseudocodeInterpreter? interpreter = null;

                // Step callback fires before each statement in debug mode;
                // forward the current debug state to the UI ViewModel so the
                // watch panel / call stack panel / current-line marker update.
                StepCallback stepCallback = async () =>
                {
                    if (interpreter == null) return;
                    var state = interpreter.GetDebugState();
                    // Marshal to UI thread since ObservableCollection updates
                    // must happen on the dispatcher.
                    await Application.Current.Dispatcher.InvokeAsync(
                        () => _debugViewModel.UpdateDebugState(state));
                };

                interpreter = new PseudocodeInterpreter(
                    inputHandler: async (varName, varType) => await _inputService.GetInputAsync(varName, varType),
                    debugMode: true,
                    stepCallback: stepCallback);

                await foreach (var output in interpreter.Execute(ast, _cancellationTokenSource.Token))
                {
                    yield return output;
                }
            }
            finally
            {
                _cancellationTokenSource?.Dispose();
                _cancellationTokenSource = null;
            }
        }

        public void Stop()
        {
            _cancellationTokenSource?.Cancel();
        }
    }
}
