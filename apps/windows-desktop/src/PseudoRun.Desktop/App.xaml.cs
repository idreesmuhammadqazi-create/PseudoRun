using Microsoft.Extensions.DependencyInjection;
using PseudoRun.Desktop.Services;
using PseudoRun.Desktop.ViewModels;
using PseudoRun.Desktop.Views;
using PseudoRun.Desktop.Views.Dialogs;
using System;
using System.Windows;

namespace PseudoRun.Desktop
{
    public partial class App : Application
    {
        private ServiceProvider? _serviceProvider;

        /// <summary>
        /// Exposes the DI container so views/dialogs can resolve dependencies
        /// without reaching through a static accessor.
        /// </summary>
        public IServiceProvider Services => _serviceProvider
            ?? throw new InvalidOperationException("Service provider has not been initialized.");

        public App()
        {
            var services = new ServiceCollection();
            ConfigureServices(services);
            _serviceProvider = services.BuildServiceProvider();
        }

        private void ConfigureServices(IServiceCollection services)
        {
            // Services
            services.AddSingleton<IFileService, FileService>();
            services.AddSingleton<ISettingsService, SettingsService>();
            services.AddSingleton<IFileIOService, FileIOService>();
            services.AddSingleton<IExportService, ExportService>();
            services.AddSingleton<IExamplesService, ExamplesService>();
            services.AddSingleton<IInputService, InputService>();
            // InterpreterService holds a reference to the shared DebugViewModel so
            // debug-state updates reach the UI; register as singleton.
            services.AddSingleton<IInterpreterService, InterpreterService>();
            services.AddTransient<IValidationService, ValidationService>();

            // ViewModels that hold observable state shared across the app must be singletons.
            services.AddSingleton<MainViewModel>();
            services.AddSingleton<DebugViewModel>();
            services.AddSingleton<ErrorViewModel>();

            // Per-dialog ViewModels: fresh instance per dialog invocation.
            services.AddTransient<EditorViewModel>();
            services.AddTransient<InterpreterViewModel>();
            services.AddTransient<PracticeProblemsViewModel>();
            services.AddTransient<TutorialViewModel>();
            services.AddTransient<ExamModeViewModel>();
            services.AddTransient<ExamplesViewModel>();
            services.AddTransient<SyntaxReferenceViewModel>();

            // Windows
            services.AddSingleton<MainWindow>();

            // Dialogs (transient so each Show() gets a fresh window).
            services.AddTransient<TutorialDialog>();
            services.AddTransient<PracticeProblemsDialog>();
            services.AddTransient<SyntaxReferenceDialog>();
            services.AddTransient<ExamModeDialog>();
            services.AddTransient<ExamplesDialog>();
            // InputDialog takes runtime parameters (variableName, variableType)
            // so it is constructed directly rather than resolved from DI.
        }

        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);

            // Global unhandled-exception handler: keep the app alive and
            // surface a friendly error dialog instead of crashing silently.
            DispatcherUnhandledException += (s, args) =>
            {
                MessageBox.Show(
                    $"An unexpected error occurred:\n\n{args.Exception.Message}",
                    "PseudoRun",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
                args.Handled = true;
            };

            if (_serviceProvider != null)
            {
                var mainWindow = _serviceProvider.GetRequiredService<MainWindow>();
                mainWindow.Show();
            }
        }

        protected override void OnExit(ExitEventArgs e)
        {
            base.OnExit(e);
            _serviceProvider?.Dispose();
        }

        /// <summary>
        /// Thin wrapper kept for backward compatibility. Prefer injecting
        /// dependencies or resolving via <see cref="Services"/>.
        /// </summary>
        public static T? GetService<T>() where T : class
        {
            return ((App)Current)._serviceProvider?.GetService<T>();
        }
    }
}
