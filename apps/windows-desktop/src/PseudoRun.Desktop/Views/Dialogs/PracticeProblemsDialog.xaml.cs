using PseudoRun.Desktop.ViewModels;
using System.Windows;

namespace PseudoRun.Desktop.Views.Dialogs
{
    public partial class PracticeProblemsDialog : Window
    {
        public PracticeProblemsViewModel ViewModel { get; }

        public string? SelectedSolution { get; private set; }

        public PracticeProblemsDialog(PracticeProblemsViewModel viewModel)
        {
            InitializeComponent();

            ViewModel = viewModel;
            DataContext = ViewModel;

            // Subscribe to LoadToEditor event
            ViewModel.LoadToEditorRequested += (sender, solution) =>
            {
                SelectedSolution = solution;
                DialogResult = true;
                Close();
            };
        }
    }
}
