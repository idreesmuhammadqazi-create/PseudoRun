# PseudoRun Desktop

A Windows WPF application for learning and practicing IGCSE Computer Science
pseudocode. It provides a syntax-highlighting editor, interpreter, debugger,
error panel, tutorials, practice problems, and exam mode — all running natively
on Windows.

## Prerequisites

- **.NET 8 SDK** (`dotnet --version` should report 8.x)
- **Visual Studio 2022 17.8+** (or Rider). WPF targets `net8.0-windows`, so the
  project can only be built and run on **Windows**.

## Build

Open `apps/windows-desktop/PseudoRun.sln` in Visual Studio, or from the repo
root:

```powershell
dotnet build apps/windows-desktop/PseudoRun.sln --configuration Release
```

## Run

```powershell
dotnet run --project apps/windows-desktop/src/PseudoRun.Desktop/PseudoRun.Desktop.csproj
```

## Test

```powershell
dotnet test apps/windows-desktop/PseudoRun.sln
```

The test project lives at `apps/windows-desktop/tests/PseudoRun.Desktop.Tests/`
and uses xUnit. It is currently a smoke-test placeholder — the TypeScript
lexer / parser / interpreter test suite in `packages/core` still needs to be
ported.

## Relationship to `packages/core`

The interpreter and validator logic under
`src/PseudoRun.Desktop/Interpreter/` and `src/PseudoRun.Desktop/Validator/` is
**mirrored by hand** from the TypeScript implementation in `packages/core`.
When the pseudocode grammar changes, both copies must be updated in lockstep
until a shared parser is introduced.

## Further reading

- `docs/GETTING_STARTED.md` — user-facing walkthrough
- `docs/IMPLEMENTATION_STATUS.md` — current feature matrix
- `docs/FILE_ASSOCIATION_GUIDE.md` — `.pseudo` file-association setup
