using PseudoRun.Desktop.ViewModels;
using System.Windows;

namespace PseudoRun.Desktop.Views.Dialogs
{
    public partial class SyntaxReferenceDialog : Window
    {
        public SyntaxReferenceDialog(SyntaxReferenceViewModel viewModel)
        {
            InitializeComponent();

            DataContext = viewModel;
        }
    }
}
