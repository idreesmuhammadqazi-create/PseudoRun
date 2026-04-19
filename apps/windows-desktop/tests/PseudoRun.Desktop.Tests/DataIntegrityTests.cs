using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using PseudoRun.Desktop.Interpreter;
using PseudoRun.Desktop.Models;
using Xunit;

namespace PseudoRun.Desktop.Tests;

/// <summary>
/// Smoke tests that verify the bundled Data/*.json files are well-formed
/// and (for Examples.json) that every example program is lexically valid.
/// These catch drift between the JSON content and the C# lexer/parser.
/// </summary>
public class DataIntegrityTests
{
    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        PropertyNameCaseInsensitive = true
    };

    private static string DataPath(string fileName)
    {
        // Tests csproj copies Data\*.json into the test output's Data\ folder
        // via the <Content Include> glob; AppDomain.CurrentDomain.BaseDirectory
        // points at the test bin output at runtime.
        return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", fileName);
    }

    [Fact]
    public void ExamplesJson_ParsesSuccessfully()
    {
        var json = File.ReadAllText(DataPath("Examples.json"));
        var examples = JsonSerializer.Deserialize<List<Example>>(json, JsonOpts);

        Assert.NotNull(examples);
        Assert.NotEmpty(examples!);
        foreach (var ex in examples!)
        {
            Assert.False(string.IsNullOrWhiteSpace(ex.Title), "Example must have a non-empty Title");
            Assert.False(string.IsNullOrWhiteSpace(ex.Code), $"Example '{ex.Title}' must have non-empty Code");
        }
    }

    [Fact]
    public void PracticeProblemsJson_ParsesSuccessfully()
    {
        var json = File.ReadAllText(DataPath("PracticeProblems.json"));
        var problems = JsonSerializer.Deserialize<List<PracticeProblem>>(json, JsonOpts);

        Assert.NotNull(problems);
        Assert.NotEmpty(problems!);
        foreach (var p in problems!)
        {
            Assert.False(string.IsNullOrWhiteSpace(p.Title), "Problem must have a non-empty Title");
            Assert.False(string.IsNullOrWhiteSpace(p.Solution), $"Problem '{p.Title}' must have non-empty Solution");
        }
    }

    [Fact]
    public void TutorialStepsJson_ParsesSuccessfully()
    {
        var json = File.ReadAllText(DataPath("TutorialSteps.json"));
        var steps = JsonSerializer.Deserialize<List<TutorialStep>>(json, JsonOpts);

        Assert.NotNull(steps);
        Assert.NotEmpty(steps!);
        foreach (var s in steps!)
        {
            Assert.False(string.IsNullOrWhiteSpace(s.Title), "Tutorial step must have a non-empty Title");
        }
    }

    [Fact]
    public void SyntaxReferenceJson_ParsesSuccessfully()
    {
        var json = File.ReadAllText(DataPath("SyntaxReference.json"));
        var categories = JsonSerializer.Deserialize<List<SyntaxCategory>>(json, JsonOpts);

        Assert.NotNull(categories);
        Assert.NotEmpty(categories!);
        foreach (var cat in categories!)
        {
            Assert.False(string.IsNullOrWhiteSpace(cat.Category), "Syntax category must have a non-empty name");
            Assert.NotEmpty(cat.Items);
        }
    }

    [Fact]
    public void ExamplesJson_AllCodeSnippetsTokenizeWithoutError()
    {
        // Regression guard: a few releases ago the JSON contained the legacy
        // single-dash `<-` assignment operator, which the current lexer rejects
        // (it only accepts `<--` or `←`). This test tokenizes every example
        // so any stray `<-` or other lexer-breaking content surfaces here.
        var json = File.ReadAllText(DataPath("Examples.json"));
        var examples = JsonSerializer.Deserialize<List<Example>>(json, JsonOpts);

        Assert.NotNull(examples);

        var lexer = new Lexer();
        foreach (var ex in examples!)
        {
            var exception = Record.Exception(() => lexer.Tokenize(ex.Code));
            Assert.Null(exception);
        }
    }
}
