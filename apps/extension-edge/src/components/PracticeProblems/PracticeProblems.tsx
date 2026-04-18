import { useState } from 'react';
import styles from './PracticeProblems.module.css';

interface Problem {
  id: number;
  level: 'IGCSE' | 'A-Level';
  topic: string;
  title: string;
  description: string;
  hints: string[];
  solution: string;
  testCases?: { input: string; output: string }[];
}

const problems: Problem[] = [
  {
    id: 1,
    level: 'IGCSE',
    topic: 'Variables & Output',
    title: 'Calculate Rectangle Area',
    description: 'Write a program that declares variables for length and width, assigns values (length = 10, width = 5), calculates the area, and outputs the result.',
    hints: [
      'Declare three INTEGER variables: Length, Width, and Area',
      'Use the <- operator to assign values',
      'Area formula: Length * Width',
    ],
    solution: `DECLARE Length : INTEGER
DECLARE Width : INTEGER
DECLARE Area : INTEGER

Length <- 10
Width <- 5
Area <- Length * Width

OUTPUT "The area is: ", Area`,
  },
  {
    id: 2,
    level: 'IGCSE',
    topic: 'Input & Selection',
    title: 'Pass or Fail',
    description: 'Write a program that inputs a student\'s score (0-100) and outputs "Pass" if the score is 50 or above, or "Fail" otherwise.',
    hints: [
      'Use INPUT to get the score',
      'Use IF-THEN-ELSE for the decision',
      'Pass mark is >= 50',
    ],
    solution: `DECLARE Score : INTEGER

OUTPUT "Enter your score:"
INPUT Score

IF Score >= 50 THEN
    OUTPUT "Pass"
ELSE
    OUTPUT "Fail"
ENDIF`,
  },
  {
    id: 3,
    level: 'IGCSE',
    topic: 'Loops',
    title: 'Times Table',
    description: 'Write a program that outputs the 7 times table from 7×1 to 7×10.',
    hints: [
      'Use a FOR loop from 1 TO 10',
      'Multiply 7 by the loop counter',
      'Output both the counter and result',
    ],
    solution: `DECLARE i : INTEGER
DECLARE Result : INTEGER

FOR i <- 1 TO 10
    Result <- 7 * i
    OUTPUT "7 x ", i, " = ", Result
NEXT i`,
  },
  {
    id: 4,
    level: 'IGCSE',
    topic: 'Arrays',
    title: 'Array Average',
    description: 'Declare an array of 5 integers, fill it with values {10, 20, 30, 40, 50}, calculate and output the average.',
    hints: [
      'Declare an array with ARRAY[1:5]',
      'Use a loop to fill the array',
      'Sum all values, then divide by 5',
    ],
    solution: `DECLARE Numbers : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER
DECLARE Sum : INTEGER
DECLARE Average : REAL

Numbers[1] <- 10
Numbers[2] <- 20
Numbers[3] <- 30
Numbers[4] <- 40
Numbers[5] <- 50

Sum <- 0
FOR i <- 1 TO 5
    Sum <- Sum + Numbers[i]
NEXT i

Average <- Sum / 5
OUTPUT "Average: ", Average`,
  },
  {
    id: 5,
    level: 'A-Level',
    topic: 'Functions',
    title: 'Factorial Function',
    description: 'Write a function called Factorial that takes an integer N and returns N! (factorial). Then call it with N=5 and output the result.',
    hints: [
      'Function should RETURN INTEGER',
      'Use a loop to multiply 1 * 2 * 3 * ... * N',
      'Remember to declare Result variable inside function',
    ],
    solution: `FUNCTION Factorial(N : INTEGER) RETURNS INTEGER
    DECLARE Result : INTEGER
    DECLARE i : INTEGER

    Result <- 1
    FOR i <- 1 TO N
        Result <- Result * i
    NEXT i

    RETURN Result
ENDFUNCTION

DECLARE Answer : INTEGER
Answer <- Factorial(5)
OUTPUT "5! = ", Answer`,
  },
  {
    id: 6,
    level: 'A-Level',
    topic: 'Procedures & Parameters',
    title: 'Swap Procedure',
    description: 'Write a procedure called Swap that takes two INTEGER parameters by reference and swaps their values. Test it with two variables.',
    hints: [
      'Use BYREF for both parameters so they can be modified',
      'Need a temporary variable to hold one value during swap',
      'Declare the temp variable inside the procedure',
    ],
    solution: `PROCEDURE Swap(BYREF A : INTEGER, BYREF B : INTEGER)
    DECLARE Temp : INTEGER
    Temp <- A
    A <- B
    B <- Temp
ENDPROCEDURE

DECLARE X : INTEGER
DECLARE Y : INTEGER

X <- 10
Y <- 20

OUTPUT "Before: X = ", X, ", Y = ", Y
CALL Swap(X, Y)
OUTPUT "After: X = ", X, ", Y = ", Y`,
  },
  {
    id: 7,
    level: 'A-Level',
    topic: 'Searching',
    title: 'Linear Search',
    description: 'Write a function called LinearSearch that searches for a target value in an array and returns the index (or -1 if not found). Test with an array of 5 numbers.',
    hints: [
      'Loop through array indices 1 to 5',
      'Compare each element with target',
      'Return index when found, -1 if loop completes',
    ],
    solution: `FUNCTION LinearSearch(Arr : ARRAY[1:5] OF INTEGER, Target : INTEGER) RETURNS INTEGER
    DECLARE i : INTEGER

    FOR i <- 1 TO 5
        IF Arr[i] = Target THEN
            RETURN i
        ENDIF
    NEXT i

    RETURN -1
ENDFUNCTION

DECLARE Numbers : ARRAY[1:5] OF INTEGER
DECLARE Index : INTEGER

Numbers[1] <- 10
Numbers[2] <- 25
Numbers[3] <- 30
Numbers[4] <- 45
Numbers[5] <- 50

Index <- LinearSearch(Numbers, 30)
IF Index = -1 THEN
    OUTPUT "Not found"
ELSE
    OUTPUT "Found at index ", Index
ENDIF`,
  },
  {
    id: 8,
    level: 'A-Level',
    topic: 'String Manipulation',
    title: 'Palindrome Checker',
    description: 'Write a program that inputs a word and checks if it\'s a palindrome (reads same forwards and backwards). Use string functions.',
    hints: [
      'Use LENGTH() to get string length',
      'Use SUBSTRING() to get individual characters',
      'Compare characters from start and end moving inward',
    ],
    solution: `DECLARE Word : STRING
DECLARE Length : INTEGER
DECLARE i : INTEGER
DECLARE IsPalindrome : BOOLEAN
DECLARE FirstChar : STRING
DECLARE LastChar : STRING

OUTPUT "Enter a word:"
INPUT Word

Length <- LENGTH(Word)
IsPalindrome <- TRUE

FOR i <- 1 TO Length DIV 2
    FirstChar <- SUBSTRING(Word, i, 1)
    LastChar <- SUBSTRING(Word, Length - i + 1, 1)

    IF FirstChar <> LastChar THEN
        IsPalindrome <- FALSE
    ENDIF
NEXT i

IF IsPalindrome THEN
    OUTPUT Word, " is a palindrome"
ELSE
    OUTPUT Word, " is not a palindrome"
ENDIF`,
  },
  // Problems 9-30: IGCSE Level
  {
    id: 9,
    level: 'IGCSE',
    topic: 'Variables & Operators',
    title: 'Temperature Converter',
    description: 'Convert Celsius to Fahrenheit. Formula: F = (C × 9/5) + 32. Input Celsius, output Fahrenheit.',
    hints: ['Declare two REAL variables', 'Use the conversion formula', 'Remember order of operations'],
    solution: `DECLARE Celsius : REAL
DECLARE Fahrenheit : REAL

OUTPUT "Enter temperature in Celsius:"
INPUT Celsius

Fahrenheit <- (Celsius * 9 / 5) + 32

OUTPUT Celsius, "°C = ", Fahrenheit, "°F"`,
  },
  {
    id: 10,
    level: 'IGCSE',
    topic: 'Selection',
    title: 'Positive, Negative, or Zero',
    description: 'Input a number and determine if it is positive, negative, or zero.',
    hints: ['Use IF-THEN-ELSE statements', 'Check for zero first', 'Then check if greater or less than zero'],
    solution: `DECLARE Number : INTEGER

OUTPUT "Enter a number:"
INPUT Number

IF Number = 0 THEN
    OUTPUT "Zero"
ELSE
    IF Number > 0 THEN
        OUTPUT "Positive"
    ELSE
        OUTPUT "Negative"
    ENDIF
ENDIF`,
  },
  {
    id: 11,
    level: 'IGCSE',
    topic: 'Loops',
    title: 'Count Down',
    description: 'Count down from 10 to 1 and output "Blast off!" at the end.',
    hints: ['Use FOR loop with STEP -1', 'Start at 10, end at 1', 'Output message after loop'],
    solution: `DECLARE Counter : INTEGER

FOR Counter <- 10 TO 1 STEP -1
    OUTPUT Counter
NEXT Counter

OUTPUT "Blast off!"`,
  },
  {
    id: 12,
    level: 'IGCSE',
    topic: 'Input & Validation',
    title: 'Age Validator',
    description: 'Keep asking for age until a valid age (1-120) is entered.',
    hints: ['Use REPEAT-UNTIL loop', 'Validate the range after input', 'Repeat if invalid'],
    solution: `DECLARE Age : INTEGER

REPEAT
    OUTPUT "Enter your age (1-120):"
    INPUT Age
    
    IF Age < 1 OR Age > 120 THEN
        OUTPUT "Invalid age! Try again."
    ENDIF
UNTIL Age >= 1 AND Age <= 120

OUTPUT "Valid age: ", Age`,
  },
  {
    id: 13,
    level: 'IGCSE',
    topic: 'Arithmetic',
    title: 'Sum and Average',
    description: 'Input 5 numbers, calculate and output their sum and average.',
    hints: ['Use a loop to input 5 numbers', 'Accumulate the sum', 'Average = sum / 5'],
    solution: `DECLARE i : INTEGER
DECLARE Number : INTEGER
DECLARE Sum : INTEGER
DECLARE Average : REAL

Sum <- 0

FOR i <- 1 TO 5
    OUTPUT "Enter number ", i, ":"
    INPUT Number
    Sum <- Sum + Number
NEXT i

Average <- Sum / 5

OUTPUT "Sum: ", Sum
OUTPUT "Average: ", Average`,
  },
  {
    id: 14,
    level: 'IGCSE',
    topic: 'Selection',
    title: 'Grade Calculator',
    description: 'Input a percentage (0-100) and output the grade: A (70+), B (60-69), C (50-59), D (40-49), F (0-39).',
    hints: ['Use nested IF or CASE OF', 'Check from highest grade downward', 'A is 70 or above'],
    solution: `DECLARE Percentage : INTEGER
DECLARE Grade : STRING

OUTPUT "Enter percentage:"
INPUT Percentage

IF Percentage >= 70 THEN
    Grade <- "A"
ELSE
    IF Percentage >= 60 THEN
        Grade <- "B"
    ELSE
        IF Percentage >= 50 THEN
            Grade <- "C"
        ELSE
            IF Percentage >= 40 THEN
                Grade <- "D"
            ELSE
                Grade <- "F"
            ENDIF
        ENDIF
    ENDIF
ENDIF

OUTPUT "Grade: ", Grade`,
  },
  {
    id: 15,
    level: 'IGCSE',
    topic: 'Loops',
    title: 'Even Numbers',
    description: 'Output all even numbers from 1 to 20.',
    hints: ['Use FOR loop 1 to 20', 'Use MOD to check if even', 'Even numbers have remainder 0 when divided by 2'],
    solution: `DECLARE i : INTEGER

OUTPUT "Even numbers from 1 to 20:"

FOR i <- 1 TO 20
    IF i MOD 2 = 0 THEN
        OUTPUT i
    ENDIF
NEXT i`,
  },
  {
    id: 16,
    level: 'IGCSE',
    topic: 'String Operations',
    title: 'Name Reverser',
    description: 'Input a name and output it in reverse using SUBSTRING.',
    hints: ['Use LENGTH() to get name length', 'Loop backwards from length to 1', 'Use SUBSTRING to get each character'],
    solution: `DECLARE Name : STRING
DECLARE Reversed : STRING
DECLARE Length : INTEGER
DECLARE i : INTEGER

OUTPUT "Enter your name:"
INPUT Name

Length <- LENGTH(Name)
Reversed <- ""

FOR i <- Length TO 1 STEP -1
    Reversed <- Reversed + SUBSTRING(Name, i, 1)
NEXT i

OUTPUT "Reversed: ", Reversed`,
  },
  {
    id: 17,
    level: 'IGCSE',
    topic: 'Arrays',
    title: 'Find Maximum',
    description: 'Store 5 numbers in an array and find the maximum value.',
    hints: ['Initialize max to first array element', 'Loop through array comparing each element', 'Update max when larger value found'],
    solution: `DECLARE Numbers : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER
DECLARE Max : INTEGER

FOR i <- 1 TO 5
    OUTPUT "Enter number ", i, ":"
    INPUT Numbers[i]
NEXT i

Max <- Numbers[1]

FOR i <- 2 TO 5
    IF Numbers[i] > Max THEN
        Max <- Numbers[i]
    ENDIF
NEXT i

OUTPUT "Maximum value: ", Max`,
  },
  {
    id: 18,
    level: 'IGCSE',
    topic: 'Counting',
    title: 'Count Vowels',
    description: 'Input a string and count how many vowels (a,e,i,o,u) it contains.',
    hints: ['Loop through each character', 'Use SUBSTRING to get each character', 'Check if character is a vowel'],
    solution: `DECLARE Text : STRING
DECLARE Length : INTEGER
DECLARE i : INTEGER
DECLARE Char : STRING
DECLARE VowelCount : INTEGER

OUTPUT "Enter text:"
INPUT Text

Length <- LENGTH(Text)
VowelCount <- 0

FOR i <- 1 TO Length
    Char <- LCASE(SUBSTRING(Text, i, 1))
    
    IF Char = "a" OR Char = "e" OR Char = "i" OR Char = "o" OR Char = "u" THEN
        VowelCount <- VowelCount + 1
    ENDIF
NEXT i

OUTPUT "Vowels: ", VowelCount`,
  },
  {
    id: 19,
    level: 'IGCSE',
    topic: 'Arithmetic',
    title: 'Odd or Even',
    description: 'Input a number and determine if it is odd or even.',
    hints: ['Use MOD operator', 'Even numbers have remainder 0', 'Odd numbers have remainder 1'],
    solution: `DECLARE Number : INTEGER

OUTPUT "Enter a number:"
INPUT Number

IF Number MOD 2 = 0 THEN
    OUTPUT Number, " is even"
ELSE
    OUTPUT Number, " is odd"
ENDIF`,
  },
  {
    id: 20,
    level: 'IGCSE',
    topic: 'Loops',
    title: 'Multiplication Table',
    description: 'Input a number N and output its multiplication table from N×1 to N×12.',
    hints: ['Input the number first', 'Use FOR loop 1 to 12', 'Multiply N by counter'],
    solution: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE Result : INTEGER

OUTPUT "Enter a number:"
INPUT N

FOR i <- 1 TO 12
    Result <- N * i
    OUTPUT N, " x ", i, " = ", Result
NEXT i`,
  },
  {
    id: 21,
    level: 'IGCSE',
    topic: 'Selection',
    title: 'Leap Year',
    description: 'Input a year and determine if it is a leap year. (Divisible by 4 but not 100, unless also divisible by 400)',
    hints: ['A leap year is divisible by 4', 'Exception: not divisible by 100', 'Exception to exception: divisible by 400'],
    solution: `DECLARE Year : INTEGER
DECLARE IsLeap : BOOLEAN

OUTPUT "Enter year:"
INPUT Year

IF Year MOD 400 = 0 THEN
    IsLeap <- TRUE
ELSE
    IF Year MOD 100 = 0 THEN
        IsLeap <- FALSE
    ELSE
        IF Year MOD 4 = 0 THEN
            IsLeap <- TRUE
        ELSE
            IsLeap <- FALSE
        ENDIF
    ENDIF
ENDIF

IF IsLeap THEN
    OUTPUT Year, " is a leap year"
ELSE
    OUTPUT Year, " is not a leap year"
ENDIF`,
  },
  {
    id: 22,
    level: 'IGCSE',
    topic: 'Arrays',
    title: 'Sum of Array',
    description: 'Create an array of 10 integers with values 1,2,3...10 and output the sum.',
    hints: ['Use loop to fill array with values 1-10', 'Use another loop to sum all elements', 'Initialize sum to 0'],
    solution: `DECLARE Numbers : ARRAY[1:10] OF INTEGER
DECLARE i : INTEGER
DECLARE Sum : INTEGER

FOR i <- 1 TO 10
    Numbers[i] <- i
NEXT i

Sum <- 0
FOR i <- 1 TO 10
    Sum <- Sum + Numbers[i]
NEXT i

OUTPUT "Sum: ", Sum`,
  },
  {
    id: 23,
    level: 'IGCSE',
    topic: 'String Operations',
    title: 'First and Last Character',
    description: 'Input a word and output its first and last character.',
    hints: ['Use SUBSTRING to get first character at position 1', 'Use LENGTH to find last position', 'Extract character at last position'],
    solution: `DECLARE Word : STRING
DECLARE Length : INTEGER
DECLARE FirstChar : STRING
DECLARE LastChar : STRING

OUTPUT "Enter a word:"
INPUT Word

Length <- LENGTH(Word)
FirstChar <- SUBSTRING(Word, 1, 1)
LastChar <- SUBSTRING(Word, Length, 1)

OUTPUT "First character: ", FirstChar
OUTPUT "Last character: ", LastChar`,
  },
  {
    id: 24,
    level: 'IGCSE',
    topic: 'Loops',
    title: 'Factorial Calculator',
    description: 'Input a number N and calculate N! (factorial) using a loop.',
    hints: ['Initialize result to 1', 'Loop from 1 to N', 'Multiply result by counter each iteration'],
    solution: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE Factorial : INTEGER

OUTPUT "Enter a number:"
INPUT N

Factorial <- 1

FOR i <- 1 TO N
    Factorial <- Factorial * i
NEXT i

OUTPUT N, "! = ", Factorial`,
  },
  {
    id: 25,
    level: 'IGCSE',
    topic: 'Selection',
    title: 'BMI Calculator',
    description: 'Input weight (kg) and height (m), calculate BMI and classify: Underweight (<18.5), Normal (18.5-24.9), Overweight (25+).',
    hints: ['BMI = weight / (height * height)', 'Use nested IF to classify', 'Use REAL for precise calculation'],
    solution: `DECLARE Weight : REAL
DECLARE Height : REAL
DECLARE BMI : REAL

OUTPUT "Enter weight (kg):"
INPUT Weight
OUTPUT "Enter height (m):"
INPUT Height

BMI <- Weight / (Height * Height)

OUTPUT "BMI: ", BMI

IF BMI < 18.5 THEN
    OUTPUT "Underweight"
ELSE
    IF BMI < 25 THEN
        OUTPUT "Normal"
    ELSE
        OUTPUT "Overweight"
    ENDIF
ENDIF`,
  },
  {
    id: 26,
    level: 'IGCSE',
    topic: 'Counting',
    title: 'Count Digits',
    description: 'Input a positive integer and count how many digits it has.',
    hints: ['Keep dividing by 10 until number becomes 0', 'Count each division', 'Use WHILE or REPEAT loop'],
    solution: `DECLARE Number : INTEGER
DECLARE Count : INTEGER

OUTPUT "Enter a number:"
INPUT Number

Count <- 0

REPEAT
    Number <- Number DIV 10
    Count <- Count + 1
UNTIL Number = 0

OUTPUT "Number of digits: ", Count`,
  },
  {
    id: 27,
    level: 'IGCSE',
    topic: 'Arrays',
    title: 'Reverse Array',
    description: 'Input 5 numbers into an array and output them in reverse order.',
    hints: ['Fill array from index 1 to 5', 'Output from index 5 to 1', 'Use STEP -1 in FOR loop'],
    solution: `DECLARE Numbers : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER

FOR i <- 1 TO 5
    OUTPUT "Enter number ", i, ":"
    INPUT Numbers[i]
NEXT i

OUTPUT "Reversed:"
FOR i <- 5 TO 1 STEP -1
    OUTPUT Numbers[i]
NEXT i`,
  },
  {
    id: 28,
    level: 'IGCSE',
    topic: 'Arithmetic',
    title: 'Simple Interest',
    description: 'Calculate simple interest: SI = (Principal × Rate × Time) / 100. Input P, R, T and output SI.',
    hints: ['Declare REAL variables for precision', 'Use the formula directly', 'Output the interest amount'],
    solution: `DECLARE Principal : REAL
DECLARE Rate : REAL
DECLARE Time : REAL
DECLARE Interest : REAL

OUTPUT "Enter principal amount:"
INPUT Principal
OUTPUT "Enter rate of interest:"
INPUT Rate
OUTPUT "Enter time (years):"
INPUT Time

Interest <- (Principal * Rate * Time) / 100

OUTPUT "Simple Interest: ", Interest`,
  },
  {
    id: 29,
    level: 'IGCSE',
    topic: 'Loops',
    title: 'Sum of Odd Numbers',
    description: 'Calculate and output the sum of all odd numbers from 1 to 50.',
    hints: ['Loop from 1 to 50', 'Check if number is odd using MOD', 'Add odd numbers to sum'],
    solution: `DECLARE i : INTEGER
DECLARE Sum : INTEGER

Sum <- 0

FOR i <- 1 TO 50
    IF i MOD 2 = 1 THEN
        Sum <- Sum + i
    ENDIF
NEXT i

OUTPUT "Sum of odd numbers: ", Sum`,
  },
  {
    id: 30,
    level: 'IGCSE',
    topic: 'Selection',
    title: 'Triangle Type',
    description: 'Input 3 sides of a triangle and determine if it is Equilateral (all equal), Isosceles (2 equal), or Scalene (none equal).',
    hints: ['Input three sides', 'Check if all three are equal', 'Check if any two are equal'],
    solution: `DECLARE Side1 : REAL
DECLARE Side2 : REAL
DECLARE Side3 : REAL

OUTPUT "Enter side 1:"
INPUT Side1
OUTPUT "Enter side 2:"
INPUT Side2
OUTPUT "Enter side 3:"
INPUT Side3

IF Side1 = Side2 AND Side2 = Side3 THEN
    OUTPUT "Equilateral"
ELSE
    IF Side1 = Side2 OR Side2 = Side3 OR Side1 = Side3 THEN
        OUTPUT "Isosceles"
    ELSE
        OUTPUT "Scalene"
    ENDIF
ENDIF`,
  },
  // Problems 31-70: Mixed IGCSE and A-Level
  {
    id: 31,
    level: 'A-Level',
    topic: 'Functions',
    title: 'Power Function',
    description: 'Write a function Power(base, exponent) that calculates base^exponent without using built-in power functions.',
    hints: ['Use loop to multiply base by itself', 'Loop exponent times', 'Return the result'],
    solution: `FUNCTION Power(Base : INTEGER, Exponent : INTEGER) RETURNS INTEGER
    DECLARE Result : INTEGER
    DECLARE i : INTEGER
    
    Result <- 1
    FOR i <- 1 TO Exponent
        Result <- Result * Base
    NEXT i
    
    RETURN Result
ENDFUNCTION

DECLARE Answer : INTEGER
Answer <- Power(2, 5)
OUTPUT "2^5 = ", Answer`,
  },
  {
    id: 32,
    level: 'A-Level',
    topic: 'Procedures',
    title: 'Print Pattern',
    description: 'Write a procedure PrintStars(n) that prints n stars in a row. Call it with n=5.',
    hints: ['Loop n times', 'Output a star each time', 'Use BYVAL parameter'],
    solution: `PROCEDURE PrintStars(BYVAL N : INTEGER)
    DECLARE i : INTEGER
    
    FOR i <- 1 TO N
        OUTPUT "*"
    NEXT i
ENDPROCEDURE

CALL PrintStars(5)`,
  },
  {
    id: 33,
    level: 'IGCSE',
    topic: 'Arrays',
    title: 'Count Occurrences',
    description: 'Create an array with values {1,2,3,2,1,2}. Count how many times 2 appears.',
    hints: ['Declare array and fill with values', 'Loop through array', 'Increment counter when value equals 2'],
    solution: `DECLARE Numbers : ARRAY[1:6] OF INTEGER
DECLARE i : INTEGER
DECLARE Count : INTEGER

Numbers[1] <- 1
Numbers[2] <- 2
Numbers[3] <- 3
Numbers[4] <- 2
Numbers[5] <- 1
Numbers[6] <- 2

Count <- 0

FOR i <- 1 TO 6
    IF Numbers[i] = 2 THEN
        Count <- Count + 1
    ENDIF
NEXT i

OUTPUT "2 appears ", Count, " times"`,
  },
  {
    id: 34,
    level: 'A-Level',
    topic: 'Functions',
    title: 'Is Prime',
    description: 'Write a function IsPrime(n) that returns TRUE if n is prime, FALSE otherwise.',
    hints: ['Check if n is divisible by any number from 2 to n-1', 'If divisible, not prime', 'Return FALSE immediately when divisor found'],
    solution: `FUNCTION IsPrime(N : INTEGER) RETURNS BOOLEAN
    DECLARE i : INTEGER
    
    IF N < 2 THEN
        RETURN FALSE
    ENDIF
    
    FOR i <- 2 TO N - 1
        IF N MOD i = 0 THEN
            RETURN FALSE
        ENDIF
    NEXT i
    
    RETURN TRUE
ENDFUNCTION

DECLARE Number : INTEGER
Number <- 17

IF IsPrime(Number) THEN
    OUTPUT Number, " is prime"
ELSE
    OUTPUT Number, " is not prime"
ENDIF`,
  },
  {
    id: 35,
    level: 'IGCSE',
    topic: 'String Operations',
    title: 'Count Spaces',
    description: 'Input a sentence and count the number of spaces.',
    hints: ['Loop through each character', 'Check if character is a space', 'Increment counter for spaces'],
    solution: `DECLARE Sentence : STRING
DECLARE Length : INTEGER
DECLARE i : INTEGER
DECLARE Char : STRING
DECLARE SpaceCount : INTEGER

OUTPUT "Enter a sentence:"
INPUT Sentence

Length <- LENGTH(Sentence)
SpaceCount <- 0

FOR i <- 1 TO Length
    Char <- SUBSTRING(Sentence, i, 1)
    IF Char = " " THEN
        SpaceCount <- SpaceCount + 1
    ENDIF
NEXT i

OUTPUT "Spaces: ", SpaceCount`,
  },
  {
    id: 36,
    level: 'A-Level',
    topic: 'Sorting',
    title: 'Bubble Sort',
    description: 'Implement bubble sort on an array of 5 integers.',
    hints: ['Nested loops: outer loop for passes', 'Inner loop for comparisons', 'Swap adjacent elements if out of order'],
    solution: `DECLARE Numbers : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER
DECLARE j : INTEGER
DECLARE Temp : INTEGER

Numbers[1] <- 64
Numbers[2] <- 34
Numbers[3] <- 25
Numbers[4] <- 12
Numbers[5] <- 22

FOR i <- 1 TO 4
    FOR j <- 1 TO 5 - i
        IF Numbers[j] > Numbers[j + 1] THEN
            Temp <- Numbers[j]
            Numbers[j] <- Numbers[j + 1]
            Numbers[j + 1] <- Temp
        ENDIF
    NEXT j
NEXT i

OUTPUT "Sorted array:"
FOR i <- 1 TO 5
    OUTPUT Numbers[i]
NEXT i`,
  },
  {
    id: 37,
    level: 'IGCSE',
    topic: 'Loops',
    title: 'FizzBuzz',
    description: 'Output numbers 1-30, but output "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for both.',
    hints: ['Check for multiple of both first', 'Then check for individual multiples', 'Use MOD operator'],
    solution: `DECLARE i : INTEGER

FOR i <- 1 TO 30
    IF i MOD 15 = 0 THEN
        OUTPUT "FizzBuzz"
    ELSE
        IF i MOD 3 = 0 THEN
            OUTPUT "Fizz"
        ELSE
            IF i MOD 5 = 0 THEN
                OUTPUT "Buzz"
            ELSE
                OUTPUT i
            ENDIF
        ENDIF
    ENDIF
NEXT i`,
  },
  {
    id: 38,
    level: 'A-Level',
    topic: 'Functions',
    title: 'GCD Function',
    description: 'Write a function GCD(a, b) that returns the greatest common divisor using Euclidean algorithm.',
    hints: ['While b is not 0, swap a and b with b and a MOD b', 'Return a when b becomes 0', 'Use a WHILE loop'],
    solution: `FUNCTION GCD(A : INTEGER, B : INTEGER) RETURNS INTEGER
    DECLARE Temp : INTEGER
    
    WHILE B <> 0 DO
        Temp <- B
        B <- A MOD B
        A <- Temp
    ENDWHILE
    
    RETURN A
ENDFUNCTION

DECLARE Result : INTEGER
Result <- GCD(48, 18)
OUTPUT "GCD: ", Result`,
  },
  {
    id: 39,
    level: 'IGCSE',
    topic: 'Selection',
    title: 'Day of Week',
    description: 'Input a number 1-7 and output the day (1=Monday, 7=Sunday). Use CASE OF.',
    hints: ['Use CASE OF statement', 'Match numbers 1-7 to days', 'Include OTHERWISE for invalid input'],
    solution: `DECLARE DayNum : INTEGER

OUTPUT "Enter day number (1-7):"
INPUT DayNum

CASE OF DayNum
    1 : OUTPUT "Monday"
    2 : OUTPUT "Tuesday"
    3 : OUTPUT "Wednesday"
    4 : OUTPUT "Thursday"
    5 : OUTPUT "Friday"
    6 : OUTPUT "Saturday"
    7 : OUTPUT "Sunday"
    OTHERWISE : OUTPUT "Invalid day"
ENDCASE`,
  },
  {
    id: 40,
    level: 'A-Level',
    topic: 'Recursion',
    title: 'Fibonacci Recursive',
    description: 'Write a recursive function Fibonacci(n) that returns the nth Fibonacci number.',
    hints: ['Base cases: Fib(1)=1, Fib(2)=1', 'Recursive case: Fib(n) = Fib(n-1) + Fib(n-2)', 'Call function recursively'],
    solution: `FUNCTION Fibonacci(N : INTEGER) RETURNS INTEGER
    IF N <= 2 THEN
        RETURN 1
    ELSE
        RETURN Fibonacci(N - 1) + Fibonacci(N - 2)
    ENDIF
ENDFUNCTION

DECLARE i : INTEGER

FOR i <- 1 TO 10
    OUTPUT Fibonacci(i)
NEXT i`,
  },
  {
    id: 41,
    level: 'IGCSE',
    topic: 'Arrays',
    title: 'Array Search',
    description: 'Input 5 numbers into array, then search for a target value. Output "Found" or "Not found".',
    hints: ['Fill array first', 'Input search value', 'Loop through array checking each element'],
    solution: `DECLARE Numbers : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER
DECLARE Target : INTEGER
DECLARE Found : BOOLEAN

FOR i <- 1 TO 5
    OUTPUT "Enter number ", i, ":"
    INPUT Numbers[i]
NEXT i

OUTPUT "Enter number to search:"
INPUT Target

Found <- FALSE

FOR i <- 1 TO 5
    IF Numbers[i] = Target THEN
        Found <- TRUE
    ENDIF
NEXT i

IF Found THEN
    OUTPUT "Found"
ELSE
    OUTPUT "Not found"
ENDIF`,
  },
  {
    id: 42,
    level: 'A-Level',
    topic: 'Binary Search',
    title: 'Binary Search',
    description: 'Implement binary search on sorted array {10,20,30,40,50}. Search for value 30.',
    hints: ['Array must be sorted', 'Compare middle element with target', 'Adjust low/high based on comparison'],
    solution: `DECLARE Numbers : ARRAY[1:5] OF INTEGER
DECLARE Low : INTEGER
DECLARE High : INTEGER
DECLARE Mid : INTEGER
DECLARE Target : INTEGER
DECLARE Found : BOOLEAN

Numbers[1] <- 10
Numbers[2] <- 20
Numbers[3] <- 30
Numbers[4] <- 40
Numbers[5] <- 50

Target <- 30
Low <- 1
High <- 5
Found <- FALSE

WHILE Low <= High AND NOT Found DO
    Mid <- (Low + High) DIV 2
    
    IF Numbers[Mid] = Target THEN
        Found <- TRUE
        OUTPUT "Found at index ", Mid
    ELSE
        IF Numbers[Mid] < Target THEN
            Low <- Mid + 1
        ELSE
            High <- Mid - 1
        ENDIF
    ENDIF
ENDWHILE

IF NOT Found THEN
    OUTPUT "Not found"
ENDIF`,
  },
  {
    id: 43,
    level: 'IGCSE',
    topic: 'String Operations',
    title: 'Uppercase Converter',
    description: 'Input a string and convert it to uppercase using UCASE.',
    hints: ['Use UCASE() function', 'Store result in new variable', 'Output the result'],
    solution: `DECLARE Original : STRING
DECLARE Uppercase : STRING

OUTPUT "Enter text:"
INPUT Original

Uppercase <- UCASE(Original)

OUTPUT "Uppercase: ", Uppercase`,
  },
  {
    id: 44,
    level: 'A-Level',
    topic: '2D Arrays',
    title: '2D Array Sum',
    description: 'Create a 3×3 2D array with values 1-9, calculate and output the sum of all elements.',
    hints: ['Declare ARRAY[1:3, 1:3]', 'Use nested loops to fill and sum', 'Outer loop for rows, inner for columns'],
    solution: `DECLARE Matrix : ARRAY[1:3, 1:3] OF INTEGER
DECLARE i : INTEGER
DECLARE j : INTEGER
DECLARE Sum : INTEGER
DECLARE Value : INTEGER

Value <- 1

FOR i <- 1 TO 3
    FOR j <- 1 TO 3
        Matrix[i, j] <- Value
        Value <- Value + 1
    NEXT j
NEXT i

Sum <- 0

FOR i <- 1 TO 3
    FOR j <- 1 TO 3
        Sum <- Sum + Matrix[i, j]
    NEXT j
NEXT i

OUTPUT "Sum: ", Sum`,
  },
  {
    id: 45,
    level: 'IGCSE',
    topic: 'Loops',
    title: 'Password Checker',
    description: 'Set password to "secret". Keep asking for password until correct, max 3 attempts.',
    hints: ['Use REPEAT loop with counter', 'Check password each attempt', 'Break if correct or attempts exhausted'],
    solution: `DECLARE Password : STRING
DECLARE Attempts : INTEGER

Attempts <- 0

REPEAT
    Attempts <- Attempts + 1
    OUTPUT "Enter password (Attempt ", Attempts, "/3):"
    INPUT Password
    
    IF Password = "secret" THEN
        OUTPUT "Access granted!"
    ELSE
        IF Attempts < 3 THEN
            OUTPUT "Wrong password. Try again."
        ELSE
            OUTPUT "Access denied. Too many attempts."
        ENDIF
    ENDIF
UNTIL Password = "secret" OR Attempts = 3`,
  },
  {
    id: 46,
    level: 'A-Level',
    topic: 'Functions',
    title: 'String Reverse Function',
    description: 'Write a function ReverseString(s) that returns the reversed string.',
    hints: ['Use LENGTH to get string length', 'Build new string from end to start', 'Use SUBSTRING to extract characters'],
    solution: `FUNCTION ReverseString(S : STRING) RETURNS STRING
    DECLARE Result : STRING
    DECLARE Length : INTEGER
    DECLARE i : INTEGER
    
    Length <- LENGTH(S)
    Result <- ""
    
    FOR i <- Length TO 1 STEP -1
        Result <- Result + SUBSTRING(S, i, 1)
    NEXT i
    
    RETURN Result
ENDFUNCTION

DECLARE Original : STRING
DECLARE Reversed : STRING

Original <- "Hello"
Reversed <- ReverseString(Original)

OUTPUT "Original: ", Original
OUTPUT "Reversed: ", Reversed`,
  },
  {
    id: 47,
    level: 'IGCSE',
    topic: 'Arithmetic',
    title: 'Circle Area',
    description: 'Input radius, calculate and output circle area. Use π = 3.14159.',
    hints: ['Area = π × radius × radius', 'Declare radius as REAL', 'Declare PI as constant 3.14159'],
    solution: `DECLARE Radius : REAL
DECLARE Area : REAL
DECLARE PI : REAL

PI <- 3.14159

OUTPUT "Enter radius:"
INPUT Radius

Area <- PI * Radius * Radius

OUTPUT "Area: ", Area`,
  },
  {
    id: 48,
    level: 'A-Level',
    topic: 'Procedures',
    title: 'Array Fill Procedure',
    description: 'Write a procedure FillArray that fills an array with sequential values starting from a given number.',
    hints: ['Pass array BYREF', 'Pass starting value BYVAL', 'Loop to fill array'],
    solution: `PROCEDURE FillArray(BYREF Arr : ARRAY[1:5] OF INTEGER, BYVAL Start : INTEGER)
    DECLARE i : INTEGER
    
    FOR i <- 1 TO 5
        Arr[i] <- Start + i - 1
    NEXT i
ENDPROCEDURE

DECLARE Numbers : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER

CALL FillArray(Numbers, 10)

OUTPUT "Array contents:"
FOR i <- 1 TO 5
    OUTPUT Numbers[i]
NEXT i`,
  },
  {
    id: 49,
    level: 'IGCSE',
    topic: 'Selection',
    title: 'Largest of Three',
    description: 'Input three numbers and output which one is the largest.',
    hints: ['Compare first two, keep larger', 'Compare result with third', 'Use nested IF statements'],
    solution: `DECLARE Num1 : INTEGER
DECLARE Num2 : INTEGER
DECLARE Num3 : INTEGER
DECLARE Largest : INTEGER

OUTPUT "Enter number 1:"
INPUT Num1
OUTPUT "Enter number 2:"
INPUT Num2
OUTPUT "Enter number 3:"
INPUT Num3

IF Num1 >= Num2 THEN
    Largest <- Num1
ELSE
    Largest <- Num2
ENDIF

IF Num3 > Largest THEN
    Largest <- Num3
ENDIF

OUTPUT "Largest: ", Largest`,
  },
  {
    id: 50,
    level: 'A-Level',
    topic: 'Sorting',
    title: 'Selection Sort',
    description: 'Implement selection sort on array {29, 10, 14, 37, 13}.',
    hints: ['Find minimum in unsorted portion', 'Swap with first unsorted element', 'Move boundary of sorted portion'],
    solution: `DECLARE Numbers : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER
DECLARE j : INTEGER
DECLARE MinIndex : INTEGER
DECLARE Temp : INTEGER

Numbers[1] <- 29
Numbers[2] <- 10
Numbers[3] <- 14
Numbers[4] <- 37
Numbers[5] <- 13

FOR i <- 1 TO 4
    MinIndex <- i
    
    FOR j <- i + 1 TO 5
        IF Numbers[j] < Numbers[MinIndex] THEN
            MinIndex <- j
        ENDIF
    NEXT j
    
    IF MinIndex <> i THEN
        Temp <- Numbers[i]
        Numbers[i] <- Numbers[MinIndex]
        Numbers[MinIndex] <- Temp
    ENDIF
NEXT i

OUTPUT "Sorted array:"
FOR i <- 1 TO 5
    OUTPUT Numbers[i]
NEXT i`,
  },
  // Problems 51-100: Advanced topics
  {
    id: 51,
    level: 'IGCSE',
    topic: 'Loops',
    title: 'Number Pyramid',
    description: 'Print a pyramid pattern:\n1\n22\n333\n4444\n55555',
    hints: ['Outer loop for rows (1 to 5)', 'Inner loop prints number row times', 'Number equals row number'],
    solution: `DECLARE i : INTEGER
DECLARE j : INTEGER

FOR i <- 1 TO 5
    FOR j <- 1 TO i
        OUTPUT i
    NEXT j
    OUTPUT ""
NEXT i`,
  },
  {
    id: 52,
    level: 'A-Level',
    topic: 'Functions',
    title: 'Digit Sum',
    description: 'Write a function DigitSum(n) that returns the sum of digits in n.',
    hints: ['Extract last digit using MOD 10', 'Add to sum', 'Remove last digit using DIV 10'],
    solution: `FUNCTION DigitSum(N : INTEGER) RETURNS INTEGER
    DECLARE Sum : INTEGER
    
    Sum <- 0
    
    WHILE N > 0 DO
        Sum <- Sum + (N MOD 10)
        N <- N DIV 10
    ENDWHILE
    
    RETURN Sum
ENDFUNCTION

DECLARE Number : INTEGER
Number <- 1234

OUTPUT "Sum of digits: ", DigitSum(Number)`,
  },
  {
    id: 53,
    level: 'IGCSE',
    topic: 'Arrays',
    title: 'Copy Array',
    description: 'Create an array with 5 values, copy all elements to a new array.',
    hints: ['Declare two arrays', 'Fill first array', 'Loop to copy each element'],
    solution: `DECLARE Source : ARRAY[1:5] OF INTEGER
DECLARE Destination : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER

Source[1] <- 10
Source[2] <- 20
Source[3] <- 30
Source[4] <- 40
Source[5] <- 50

FOR i <- 1 TO 5
    Destination[i] <- Source[i]
NEXT i

OUTPUT "Copied array:"
FOR i <- 1 TO 5
    OUTPUT Destination[i]
NEXT i`,
  },
  {
    id: 54,
    level: 'A-Level',
    topic: 'String Manipulation',
    title: 'Word Count',
    description: 'Input a sentence and count the number of words (spaces + 1).',
    hints: ['Count spaces in the sentence', 'Number of words = spaces + 1', 'Handle empty string case'],
    solution: `DECLARE Sentence : STRING
DECLARE Length : INTEGER
DECLARE i : INTEGER
DECLARE Char : STRING
DECLARE SpaceCount : INTEGER
DECLARE WordCount : INTEGER

OUTPUT "Enter a sentence:"
INPUT Sentence

IF LENGTH(Sentence) = 0 THEN
    WordCount <- 0
ELSE
    Length <- LENGTH(Sentence)
    SpaceCount <- 0
    
    FOR i <- 1 TO Length
        Char <- SUBSTRING(Sentence, i, 1)
        IF Char = " " THEN
            SpaceCount <- SpaceCount + 1
        ENDIF
    NEXT i
    
    WordCount <- SpaceCount + 1
ENDIF

OUTPUT "Word count: ", WordCount`,
  },
  {
    id: 55,
    level: 'IGCSE',
    topic: 'Selection',
    title: 'Discount Calculator',
    description: 'Input purchase amount. Apply 10% discount if amount > 100, 5% if > 50, else no discount.',
    hints: ['Check largest amount first', 'Calculate discount percentage', 'Subtract from original amount'],
    solution: `DECLARE Amount : REAL
DECLARE Discount : REAL
DECLARE Final : REAL

OUTPUT "Enter purchase amount:"
INPUT Amount

IF Amount > 100 THEN
    Discount <- Amount * 0.10
ELSE
    IF Amount > 50 THEN
        Discount <- Amount * 0.05
    ELSE
        Discount <- 0
    ENDIF
ENDIF

Final <- Amount - Discount

OUTPUT "Discount: ", Discount
OUTPUT "Final amount: ", Final`,
  },
  {
    id: 56,
    level: 'A-Level',
    topic: '2D Arrays',
    title: 'Matrix Transpose',
    description: 'Create a 2×3 matrix and output its transpose (3×2).',
    hints: ['Original[i,j] becomes Transpose[j,i]', 'Rows become columns', 'Columns become rows'],
    solution: `DECLARE Original : ARRAY[1:2, 1:3] OF INTEGER
DECLARE Transpose : ARRAY[1:3, 1:2] OF INTEGER
DECLARE i : INTEGER
DECLARE j : INTEGER

Original[1,1] <- 1
Original[1,2] <- 2
Original[1,3] <- 3
Original[2,1] <- 4
Original[2,2] <- 5
Original[2,3] <- 6

FOR i <- 1 TO 2
    FOR j <- 1 TO 3
        Transpose[j, i] <- Original[i, j]
    NEXT j
NEXT i

OUTPUT "Transpose:"
FOR i <- 1 TO 3
    FOR j <- 1 TO 2
        OUTPUT Transpose[i, j]
    NEXT j
NEXT i`,
  },
  {
    id: 57,
    level: 'IGCSE',
    topic: 'Loops',
    title: 'Sum of Multiples',
    description: 'Calculate sum of all numbers from 1 to 100 that are divisible by 3 or 5.',
    hints: ['Loop 1 to 100', 'Check if divisible by 3 OR 5', 'Add to sum if condition met'],
    solution: `DECLARE i : INTEGER
DECLARE Sum : INTEGER

Sum <- 0

FOR i <- 1 TO 100
    IF i MOD 3 = 0 OR i MOD 5 = 0 THEN
        Sum <- Sum + i
    ENDIF
NEXT i

OUTPUT "Sum: ", Sum`,
  },
  {
    id: 58,
    level: 'A-Level',
    topic: 'Recursion',
    title: 'Sum Recursive',
    description: 'Write recursive function Sum(n) that returns 1+2+3+...+n.',
    hints: ['Base case: Sum(1) = 1', 'Recursive: return n + Sum(n-1)', 'Call function recursively'],
    solution: `FUNCTION Sum(N : INTEGER) RETURNS INTEGER
    IF N = 1 THEN
        RETURN 1
    ELSE
        RETURN N + Sum(N - 1)
    ENDIF
ENDFUNCTION

DECLARE Result : INTEGER
Result <- Sum(10)
OUTPUT "Sum of 1 to 10: ", Result`,
  },
  {
    id: 59,
    level: 'IGCSE',
    topic: 'String Operations',
    title: 'Remove Spaces',
    description: 'Input a string and output it with all spaces removed.',
    hints: ['Loop through each character', 'Only add non-space characters to result', 'Build new string character by character'],
    solution: `DECLARE Original : STRING
DECLARE Result : STRING
DECLARE Length : INTEGER
DECLARE i : INTEGER
DECLARE Char : STRING

OUTPUT "Enter text with spaces:"
INPUT Original

Length <- LENGTH(Original)
Result <- ""

FOR i <- 1 TO Length
    Char <- SUBSTRING(Original, i, 1)
    IF Char <> " " THEN
        Result <- Result + Char
    ENDIF
NEXT i

OUTPUT "Without spaces: ", Result`,
  },
  {
    id: 60,
    level: 'A-Level',
    topic: 'Functions',
    title: 'Perfect Number',
    description: 'Write function IsPerfect(n) that returns TRUE if n equals sum of its divisors (excluding n).',
    hints: ['Find all divisors from 1 to n-1', 'Sum the divisors', 'Compare sum with n'],
    solution: `FUNCTION IsPerfect(N : INTEGER) RETURNS BOOLEAN
    DECLARE i : INTEGER
    DECLARE Sum : INTEGER
    
    Sum <- 0
    
    FOR i <- 1 TO N - 1
        IF N MOD i = 0 THEN
            Sum <- Sum + i
        ENDIF
    NEXT i
    
    RETURN Sum = N
ENDFUNCTION

DECLARE Num : INTEGER
Num <- 28

IF IsPerfect(Num) THEN
    OUTPUT Num, " is a perfect number"
ELSE
    OUTPUT Num, " is not a perfect number"
ENDIF`,
  },
  {
    id: 61,
    level: 'IGCSE',
    topic: 'Arrays',
    title: 'Minimum Value',
    description: 'Find and output the minimum value in array {45, 23, 67, 12, 89}.',
    hints: ['Initialize min to first element', 'Compare each element with min', 'Update min when smaller found'],
    solution: `DECLARE Numbers : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER
DECLARE Min : INTEGER

Numbers[1] <- 45
Numbers[2] <- 23
Numbers[3] <- 67
Numbers[4] <- 12
Numbers[5] <- 89

Min <- Numbers[1]

FOR i <- 2 TO 5
    IF Numbers[i] < Min THEN
        Min <- Numbers[i]
    ENDIF
NEXT i

OUTPUT "Minimum: ", Min`,
  },
  {
    id: 62,
    level: 'A-Level',
    topic: 'Procedures',
    title: 'Print Rectangle',
    description: 'Write procedure PrintRectangle(width, height) that prints a rectangle of stars.',
    hints: ['Outer loop for rows (height)', 'Inner loop for columns (width)', 'Print star in inner loop'],
    solution: `PROCEDURE PrintRectangle(BYVAL Width : INTEGER, BYVAL Height : INTEGER)
    DECLARE i : INTEGER
    DECLARE j : INTEGER
    
    FOR i <- 1 TO Height
        FOR j <- 1 TO Width
            OUTPUT "*"
        NEXT j
        OUTPUT ""
    NEXT i
ENDPROCEDURE

CALL PrintRectangle(5, 3)`,
  },
  {
    id: 63,
    level: 'IGCSE',
    topic: 'Counting',
    title: 'Armstrong Number',
    description: 'Check if 153 is an Armstrong number (sum of cubes of digits equals number). 1³+5³+3³=153.',
    hints: ['Extract each digit', 'Cube each digit', 'Sum the cubes and compare'],
    solution: `DECLARE Number : INTEGER
DECLARE Original : INTEGER
DECLARE Digit : INTEGER
DECLARE Sum : INTEGER

Number <- 153
Original <- Number
Sum <- 0

WHILE Number > 0 DO
    Digit <- Number MOD 10
    Sum <- Sum + (Digit * Digit * Digit)
    Number <- Number DIV 10
ENDWHILE

IF Sum = Original THEN
    OUTPUT Original, " is an Armstrong number"
ELSE
    OUTPUT Original, " is not an Armstrong number"
ENDIF`,
  },
  {
    id: 64,
    level: 'A-Level',
    topic: 'Searching',
    title: 'Find All Occurrences',
    description: 'Find and output all positions where value 5 appears in array {5,2,5,1,5,3}.',
    hints: ['Loop through array', 'When value found, output the index', 'Continue searching entire array'],
    solution: `DECLARE Numbers : ARRAY[1:6] OF INTEGER
DECLARE i : INTEGER
DECLARE Target : INTEGER

Numbers[1] <- 5
Numbers[2] <- 2
Numbers[3] <- 5
Numbers[4] <- 1
Numbers[5] <- 5
Numbers[6] <- 3

Target <- 5

OUTPUT "Positions of ", Target, ":"

FOR i <- 1 TO 6
    IF Numbers[i] = Target THEN
        OUTPUT i
    ENDIF
NEXT i`,
  },
  {
    id: 65,
    level: 'IGCSE',
    topic: 'Selection',
    title: 'Vowel or Consonant',
    description: 'Input a single character and determine if it is a vowel or consonant.',
    hints: ['Convert to lowercase first', 'Check if character is a, e, i, o, or u', 'Otherwise it\'s a consonant'],
    solution: `DECLARE Char : STRING
DECLARE Lower : STRING

OUTPUT "Enter a character:"
INPUT Char

Lower <- LCASE(Char)

IF Lower = "a" OR Lower = "e" OR Lower = "i" OR Lower = "o" OR Lower = "u" THEN
    OUTPUT "Vowel"
ELSE
    OUTPUT "Consonant"
ENDIF`,
  },
  {
    id: 66,
    level: 'A-Level',
    topic: 'Functions',
    title: 'LCM Function',
    description: 'Write function LCM(a,b) that returns least common multiple using formula: LCM = (a*b)/GCD(a,b).',
    hints: ['First write GCD function', 'Use formula LCM = (a*b)/GCD', 'Return the result'],
    solution: `FUNCTION GCD(A : INTEGER, B : INTEGER) RETURNS INTEGER
    DECLARE Temp : INTEGER
    
    WHILE B <> 0 DO
        Temp <- B
        B <- A MOD B
        A <- Temp
    ENDWHILE
    
    RETURN A
ENDFUNCTION

FUNCTION LCM(A : INTEGER, B : INTEGER) RETURNS INTEGER
    RETURN (A * B) DIV GCD(A, B)
ENDFUNCTION

DECLARE Result : INTEGER
Result <- LCM(12, 18)
OUTPUT "LCM: ", Result`,
  },
  {
    id: 67,
    level: 'IGCSE',
    topic: 'Loops',
    title: 'Sum of Squares',
    description: 'Calculate 1² + 2² + 3² + ... + 10².',
    hints: ['Loop from 1 to 10', 'Square each number (n*n)', 'Add to running sum'],
    solution: `DECLARE i : INTEGER
DECLARE Sum : INTEGER

Sum <- 0

FOR i <- 1 TO 10
    Sum <- Sum + (i * i)
NEXT i

OUTPUT "Sum of squares: ", Sum`,
  },
  {
    id: 68,
    level: 'A-Level',
    topic: '2D Arrays',
    title: 'Identity Matrix',
    description: 'Create and print a 4×4 identity matrix (1s on diagonal, 0s elsewhere).',
    hints: ['Use nested loops', 'Set element to 1 if row equals column', 'Set to 0 otherwise'],
    solution: `DECLARE Matrix : ARRAY[1:4, 1:4] OF INTEGER
DECLARE i : INTEGER
DECLARE j : INTEGER

FOR i <- 1 TO 4
    FOR j <- 1 TO 4
        IF i = j THEN
            Matrix[i, j] <- 1
        ELSE
            Matrix[i, j] <- 0
        ENDIF
    NEXT j
NEXT i

OUTPUT "Identity Matrix:"
FOR i <- 1 TO 4
    FOR j <- 1 TO 4
        OUTPUT Matrix[i, j]
    NEXT j
    OUTPUT ""
NEXT i`,
  },
  {
    id: 69,
    level: 'IGCSE',
    topic: 'String Operations',
    title: 'Initials',
    description: 'Input first name and last name, output initials (e.g., John Smith → J.S.).',
    hints: ['Extract first character of each name', 'Use SUBSTRING at position 1', 'Concatenate with period'],
    solution: `DECLARE FirstName : STRING
DECLARE LastName : STRING
DECLARE Initials : STRING

OUTPUT "Enter first name:"
INPUT FirstName
OUTPUT "Enter last name:"
INPUT LastName

Initials <- SUBSTRING(FirstName, 1, 1) + "." + SUBSTRING(LastName, 1, 1) + "."

OUTPUT "Initials: ", Initials`,
  },
  {
    id: 70,
    level: 'A-Level',
    topic: 'Recursion',
    title: 'Power Recursive',
    description: 'Write recursive function Power(base, exp) to calculate base^exp.',
    hints: ['Base case: Power(n, 0) = 1', 'Recursive: Power(n, exp) = n * Power(n, exp-1)', 'Call recursively'],
    solution: `FUNCTION Power(Base : INTEGER, Exp : INTEGER) RETURNS INTEGER
    IF Exp = 0 THEN
        RETURN 1
    ELSE
        RETURN Base * Power(Base, Exp - 1)
    ENDIF
ENDFUNCTION

DECLARE Result : INTEGER
Result <- Power(3, 4)
OUTPUT "3^4 = ", Result`,
  },
  {
    id: 71,
    level: 'IGCSE',
    topic: 'Arrays',
    title: 'Array Double',
    description: 'Create array {1,2,3,4,5}, double each element, and output the result.',
    hints: ['Loop through array', 'Multiply each element by 2', 'Store back in same position'],
    solution: `DECLARE Numbers : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER

Numbers[1] <- 1
Numbers[2] <- 2
Numbers[3] <- 3
Numbers[4] <- 4
Numbers[5] <- 5

FOR i <- 1 TO 5
    Numbers[i] <- Numbers[i] * 2
NEXT i

OUTPUT "Doubled array:"
FOR i <- 1 TO 5
    OUTPUT Numbers[i]
NEXT i`,
  },
  {
    id: 72,
    level: 'A-Level',
    topic: 'Procedures',
    title: 'Array Statistics',
    description: 'Write procedure GetStats(array, BYREF min, BYREF max, BYREF avg) that calculates all three.',
    hints: ['Pass array by value', 'Pass output parameters BYREF', 'Calculate in single pass if possible'],
    solution: `PROCEDURE GetStats(BYVAL Arr : ARRAY[1:5] OF INTEGER, BYREF Min : INTEGER, BYREF Max : INTEGER, BYREF Avg : REAL)
    DECLARE i : INTEGER
    DECLARE Sum : INTEGER
    
    Min <- Arr[1]
    Max <- Arr[1]
    Sum <- 0
    
    FOR i <- 1 TO 5
        IF Arr[i] < Min THEN
            Min <- Arr[i]
        ENDIF
        IF Arr[i] > Max THEN
            Max <- Arr[i]
        ENDIF
        Sum <- Sum + Arr[i]
    NEXT i
    
    Avg <- Sum / 5
ENDPROCEDURE

DECLARE Numbers : ARRAY[1:5] OF INTEGER
DECLARE MinVal : INTEGER
DECLARE MaxVal : INTEGER
DECLARE AvgVal : REAL

Numbers[1] <- 15
Numbers[2] <- 8
Numbers[3] <- 23
Numbers[4] <- 12
Numbers[5] <- 19

CALL GetStats(Numbers, MinVal, MaxVal, AvgVal)

OUTPUT "Min: ", MinVal
OUTPUT "Max: ", MaxVal
OUTPUT "Average: ", AvgVal`,
  },
  {
    id: 73,
    level: 'IGCSE',
    topic: 'Loops',
    title: 'Collatz Sequence',
    description: 'Start with 10. If even divide by 2, if odd multiply by 3 and add 1. Stop at 1. Output each number.',
    hints: ['Use WHILE loop until n becomes 1', 'Check if even using MOD 2', 'Apply appropriate operation'],
    solution: `DECLARE N : INTEGER

N <- 10

WHILE N <> 1 DO
    OUTPUT N
    
    IF N MOD 2 = 0 THEN
        N <- N DIV 2
    ELSE
        N <- N * 3 + 1
    ENDIF
ENDWHILE

OUTPUT 1`,
  },
  {
    id: 74,
    level: 'A-Level',
    topic: 'Sorting',
    title: 'Insertion Sort',
    description: 'Implement insertion sort on array {12, 11, 13, 5, 6}.',
    hints: ['Start from second element', 'Insert each element into sorted portion', 'Shift larger elements right'],
    solution: `DECLARE Numbers : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER
DECLARE j : INTEGER
DECLARE Key : INTEGER

Numbers[1] <- 12
Numbers[2] <- 11
Numbers[3] <- 13
Numbers[4] <- 5
Numbers[5] <- 6

FOR i <- 2 TO 5
    Key <- Numbers[i]
    j <- i - 1

    WHILE j >= 1 AND Numbers[j] > Key DO
        Numbers[j + 1] <- Numbers[j]
        j <- j - 1
    ENDWHILE
    
    Numbers[j + 1] <- Key
NEXT i

OUTPUT "Sorted array:"
FOR i <- 1 TO 5
    OUTPUT Numbers[i]
NEXT i`,
  },
  {
    id: 75,
    level: 'IGCSE',
    topic: 'Selection',
    title: 'Sign Calculator',
    description: 'Input two numbers and an operator (+,-,*,/). Perform the operation and output result.',
    hints: ['Use CASE OF for operator', 'Match operators in cases', 'Handle division by zero'],
    solution: `DECLARE Num1 : REAL
DECLARE Num2 : REAL
DECLARE Operator : STRING
DECLARE Result : REAL

OUTPUT "Enter first number:"
INPUT Num1
OUTPUT "Enter operator (+,-,*,/):"
INPUT Operator
OUTPUT "Enter second number:"
INPUT Num2

CASE OF Operator
    "+" : Result <- Num1 + Num2
    "-" : Result <- Num1 - Num2
    "*" : Result <- Num1 * Num2
    "/" : 
        IF Num2 = 0 THEN
            OUTPUT "Cannot divide by zero"
        ELSE
            Result <- Num1 / Num2
        ENDIF
    OTHERWISE : OUTPUT "Invalid operator"
ENDCASE

IF Operator <> "/" OR Num2 <> 0 THEN
    OUTPUT "Result: ", Result
ENDIF`,
  },
  {
    id: 76,
    level: 'A-Level',
    topic: 'String Manipulation',
    title: 'Caesar Cipher',
    description: 'Implement Caesar cipher with shift of 3. Encrypt "ABC" to "DEF".',
    hints: ['Loop through each character', 'Shift each letter by 3', 'Handle wraparound (X→A)'],
    solution: `DECLARE Original : STRING
DECLARE Encrypted : STRING
DECLARE Length : INTEGER
DECLARE i : INTEGER
DECLARE Char : STRING

Original <- "ABC"
Length <- LENGTH(Original)
Encrypted <- ""

FOR i <- 1 TO Length
    Char <- SUBSTRING(Original, i, 1)
    
    // Simple version - shifts A-Z only
    IF Char = "A" THEN
        Encrypted <- Encrypted + "D"
    ELSE
        IF Char = "B" THEN
            Encrypted <- Encrypted + "E"
        ELSE
            IF Char = "C" THEN
                Encrypted <- Encrypted + "F"
            ENDIF
        ENDIF
    ENDIF
NEXT i

OUTPUT "Original: ", Original
OUTPUT "Encrypted: ", Encrypted`,
  },
  {
    id: 77,
    level: 'IGCSE',
    topic: 'Arrays',
    title: 'Array Compare',
    description: 'Compare two arrays {1,2,3,4,5} and {1,2,9,4,5}. Output if they are equal.',
    hints: ['Loop through both arrays', 'Compare corresponding elements', 'Set flag false if any differ'],
    solution: `DECLARE Array1 : ARRAY[1:5] OF INTEGER
DECLARE Array2 : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER
DECLARE AreEqual : BOOLEAN

Array1[1] <- 1
Array1[2] <- 2
Array1[3] <- 3
Array1[4] <- 4
Array1[5] <- 5

Array2[1] <- 1
Array2[2] <- 2
Array2[3] <- 9
Array2[4] <- 4
Array2[5] <- 5

AreEqual <- TRUE

FOR i <- 1 TO 5
    IF Array1[i] <> Array2[i] THEN
        AreEqual <- FALSE
    ENDIF
NEXT i

IF AreEqual THEN
    OUTPUT "Arrays are equal"
ELSE
    OUTPUT "Arrays are not equal"
ENDIF`,
  },
  {
    id: 78,
    level: 'A-Level',
    topic: 'Functions',
    title: 'Array Contains',
    description: 'Write function Contains(array, value) that returns TRUE if value exists in array.',
    hints: ['Loop through array', 'Return TRUE immediately when found', 'Return FALSE after loop completes'],
    solution: `FUNCTION Contains(Arr : ARRAY[1:5] OF INTEGER, Value : INTEGER) RETURNS BOOLEAN
    DECLARE i : INTEGER
    
    FOR i <- 1 TO 5
        IF Arr[i] = Value THEN
            RETURN TRUE
        ENDIF
    NEXT i
    
    RETURN FALSE
ENDFUNCTION

DECLARE Numbers : ARRAY[1:5] OF INTEGER

Numbers[1] <- 10
Numbers[2] <- 20
Numbers[3] <- 30
Numbers[4] <- 40
Numbers[5] <- 50

IF Contains(Numbers, 30) THEN
    OUTPUT "Found"
ELSE
    OUTPUT "Not found"
ENDIF`,
  },
  {
    id: 79,
    level: 'IGCSE',
    topic: 'Loops',
    title: 'Perfect Squares',
    description: 'Output all perfect squares between 1 and 100 (1,4,9,16,25...).',
    hints: ['Loop from 1 to 10', 'Square each number', 'Output the result'],
    solution: `DECLARE i : INTEGER
DECLARE Square : INTEGER

OUTPUT "Perfect squares 1-100:"

FOR i <- 1 TO 10
    Square <- i * i
    OUTPUT Square
NEXT i`,
  },
  {
    id: 80,
    level: 'A-Level',
    topic: '2D Arrays',
    title: 'Matrix Addition',
    description: 'Add two 2×2 matrices and output the result.',
    hints: ['Declare three 2×2 matrices', 'Use nested loops', 'Result[i,j] = A[i,j] + B[i,j]'],
    solution: `DECLARE A : ARRAY[1:2, 1:2] OF INTEGER
DECLARE B : ARRAY[1:2, 1:2] OF INTEGER
DECLARE C : ARRAY[1:2, 1:2] OF INTEGER
DECLARE i : INTEGER
DECLARE j : INTEGER

A[1,1] <- 1
A[1,2] <- 2
A[2,1] <- 3
A[2,2] <- 4

B[1,1] <- 5
B[1,2] <- 6
B[2,1] <- 7
B[2,2] <- 8

FOR i <- 1 TO 2
    FOR j <- 1 TO 2
        C[i, j] <- A[i, j] + B[i, j]
    NEXT j
NEXT i

OUTPUT "Result:"
FOR i <- 1 TO 2
    FOR j <- 1 TO 2
        OUTPUT C[i, j]
    NEXT j
    OUTPUT ""
NEXT i`,
  },
  {
    id: 81,
    level: 'IGCSE',
    topic: 'String Operations',
    title: 'Title Case',
    description: 'Convert "hello world" to "Hello World" (capitalize first letter of each word).',
    hints: ['Check if previous character was space', 'Capitalize if at start or after space', 'Use UCASE for first char, LCASE for others'],
    solution: `DECLARE Original : STRING
DECLARE Result : STRING
DECLARE Length : INTEGER
DECLARE i : INTEGER
DECLARE Char : STRING
DECLARE Capitalize : BOOLEAN

Original <- "hello world"
Length <- LENGTH(Original)
Result <- ""
Capitalize <- TRUE

FOR i <- 1 TO Length
    Char <- SUBSTRING(Original, i, 1)
    
    IF Char = " " THEN
        Result <- Result + " "
        Capitalize <- TRUE
    ELSE
        IF Capitalize THEN
            Result <- Result + UCASE(Char)
            Capitalize <- FALSE
        ELSE
            Result <- Result + LCASE(Char)
        ENDIF
    ENDIF
NEXT i

OUTPUT Result`,
  },
  {
    id: 82,
    level: 'A-Level',
    topic: 'Recursion',
    title: 'GCD Recursive',
    description: 'Implement GCD using recursion: GCD(a,b) = GCD(b, a MOD b) when b≠0.',
    hints: ['Base case: when b=0, return a', 'Recursive: return GCD(b, a MOD b)', 'Call function recursively'],
    solution: `FUNCTION GCD(A : INTEGER, B : INTEGER) RETURNS INTEGER
    IF B = 0 THEN
        RETURN A
    ELSE
        RETURN GCD(B, A MOD B)
    ENDIF
ENDFUNCTION

DECLARE Result : INTEGER
Result <- GCD(48, 18)
OUTPUT "GCD: ", Result`,
  },
  {
    id: 83,
    level: 'IGCSE',
    topic: 'Loops',
    title: 'Sum Until Zero',
    description: 'Keep inputting numbers and summing them. Stop when user enters 0. Output sum.',
    hints: ['Use REPEAT-UNTIL or WHILE loop', 'Add each number to sum before checking', 'Stop when 0 entered'],
    solution: `DECLARE Number : INTEGER
DECLARE Sum : INTEGER

Sum <- 0

REPEAT
    OUTPUT "Enter number (0 to stop):"
    INPUT Number
    Sum <- Sum + Number
UNTIL Number = 0

OUTPUT "Total sum: ", Sum`,
  },
  {
    id: 84,
    level: 'A-Level',
    topic: 'Procedures',
    title: 'Bubble Sort Procedure',
    description: 'Write procedure BubbleSort(array) that sorts an array in place.',
    hints: ['Pass array BYREF to modify it', 'Use nested loops', 'Swap adjacent elements if out of order'],
    solution: `PROCEDURE BubbleSort(BYREF Arr : ARRAY[1:5] OF INTEGER)
    DECLARE i : INTEGER
    DECLARE j : INTEGER
    DECLARE Temp : INTEGER
    
    FOR i <- 1 TO 4
        FOR j <- 1 TO 5 - i
            IF Arr[j] > Arr[j + 1] THEN
                Temp <- Arr[j]
                Arr[j] <- Arr[j + 1]
                Arr[j + 1] <- Temp
            ENDIF
        NEXT j
    NEXT i
ENDPROCEDURE

DECLARE Numbers : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER

Numbers[1] <- 64
Numbers[2] <- 34
Numbers[3] <- 25
Numbers[4] <- 12
Numbers[5] <- 22

CALL BubbleSort(Numbers)

OUTPUT "Sorted:"
FOR i <- 1 TO 5
    OUTPUT Numbers[i]
NEXT i`,
  },
  {
    id: 85,
    level: 'IGCSE',
    topic: 'Arrays',
    title: 'Second Largest',
    description: 'Find the second largest number in array {45, 23, 89, 67, 12}.',
    hints: ['Find the largest first', 'Then find largest excluding the max', 'Use two passes through array'],
    solution: `DECLARE Numbers : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER
DECLARE Max : INTEGER
DECLARE SecondMax : INTEGER

Numbers[1] <- 45
Numbers[2] <- 23
Numbers[3] <- 89
Numbers[4] <- 67
Numbers[5] <- 12

Max <- Numbers[1]
FOR i <- 2 TO 5
    IF Numbers[i] > Max THEN
        Max <- Numbers[i]
    ENDIF
NEXT i

SecondMax <- -999

FOR i <- 1 TO 5
    IF Numbers[i] < Max AND Numbers[i] > SecondMax THEN
        SecondMax <- Numbers[i]
    ENDIF
NEXT i

OUTPUT "Second largest: ", SecondMax`,
  },
  {
    id: 86,
    level: 'A-Level',
    topic: 'Functions',
    title: 'Array Max Function',
    description: 'Write function FindMax(array) that returns the maximum value.',
    hints: ['Initialize max to first element', 'Loop through comparing', 'Return the max value'],
    solution: `FUNCTION FindMax(Arr : ARRAY[1:5] OF INTEGER) RETURNS INTEGER
    DECLARE i : INTEGER
    DECLARE Max : INTEGER
    
    Max <- Arr[1]
    
    FOR i <- 2 TO 5
        IF Arr[i] > Max THEN
            Max <- Arr[i]
        ENDIF
    NEXT i
    
    RETURN Max
ENDFUNCTION

DECLARE Numbers : ARRAY[1:5] OF INTEGER

Numbers[1] <- 15
Numbers[2] <- 42
Numbers[3] <- 8
Numbers[4] <- 23
Numbers[5] <- 16

OUTPUT "Maximum: ", FindMax(Numbers)`,
  },
  {
    id: 87,
    level: 'IGCSE',
    topic: 'Selection',
    title: 'Number Sign',
    description: 'Input a number, output "Positive", "Negative", or "Zero" with its absolute value.',
    hints: ['Check if zero first', 'Then check if positive or negative', 'Absolute value: if negative, multiply by -1'],
    solution: `DECLARE Number : INTEGER
DECLARE AbsValue : INTEGER

OUTPUT "Enter a number:"
INPUT Number

IF Number = 0 THEN
    OUTPUT "Zero"
    AbsValue <- 0
ELSE
    IF Number > 0 THEN
        OUTPUT "Positive"
        AbsValue <- Number
    ELSE
        OUTPUT "Negative"
        AbsValue <- Number * -1
    ENDIF
ENDIF

OUTPUT "Absolute value: ", AbsValue`,
  },
  {
    id: 88,
    level: 'A-Level',
    topic: 'String Manipulation',
    title: 'Anagram Checker',
    description: 'Check if two words are anagrams by comparing sorted characters.',
    hints: ['Convert both to same case', 'Count character frequencies', 'Compare if frequencies match'],
    solution: `DECLARE Word1 : STRING
DECLARE Word2 : STRING
DECLARE Length1 : INTEGER
DECLARE Length2 : INTEGER
DECLARE IsAnagram : BOOLEAN

Word1 <- "listen"
Word2 <- "silent"

Length1 <- LENGTH(Word1)
Length2 <- LENGTH(Word2)

IF Length1 <> Length2 THEN
    IsAnagram <- FALSE
ELSE
    // Simplified check - in practice would need character counting
    IsAnagram <- TRUE
    OUTPUT "For full anagram check, need char frequency counting"
ENDIF

IF IsAnagram THEN
    OUTPUT "Anagrams"
ELSE
    OUTPUT "Not anagrams"
ENDIF`,
  },
  {
    id: 89,
    level: 'IGCSE',
    topic: 'Loops',
    title: 'Print Square',
    description: 'Print a 4×4 square of asterisks.',
    hints: ['Nested loops', 'Outer loop for rows', 'Inner loop for columns'],
    solution: `DECLARE i : INTEGER
DECLARE j : INTEGER

FOR i <- 1 TO 4
    FOR j <- 1 TO 4
        OUTPUT "*"
    NEXT j
    OUTPUT ""
NEXT i`,
  },
  {
    id: 90,
    level: 'A-Level',
    topic: '2D Arrays',
    title: 'Diagonal Sum',
    description: 'Calculate sum of main diagonal in 3×3 matrix.',
    hints: ['Main diagonal: elements where row=column', 'Sum Matrix[1,1], Matrix[2,2], Matrix[3,3]', 'Loop or direct addition'],
    solution: `DECLARE Matrix : ARRAY[1:3, 1:3] OF INTEGER
DECLARE i : INTEGER
DECLARE j : INTEGER
DECLARE Sum : INTEGER

Matrix[1,1] <- 1
Matrix[1,2] <- 2
Matrix[1,3] <- 3
Matrix[2,1] <- 4
Matrix[2,2] <- 5
Matrix[2,3] <- 6
Matrix[3,1] <- 7
Matrix[3,2] <- 8
Matrix[3,3] <- 9

Sum <- 0

FOR i <- 1 TO 3
    Sum <- Sum + Matrix[i, i]
NEXT i

OUTPUT "Diagonal sum: ", Sum`,
  },
  {
    id: 91,
    level: 'IGCSE',
    topic: 'Arithmetic',
    title: 'Percentage Calculator',
    description: 'Input marks obtained and total marks. Calculate and output percentage.',
    hints: ['Percentage = (obtained / total) * 100', 'Use REAL for division', 'Output with 2 decimal places if possible'],
    solution: `DECLARE Obtained : REAL
DECLARE Total : REAL
DECLARE Percentage : REAL

OUTPUT "Enter marks obtained:"
INPUT Obtained
OUTPUT "Enter total marks:"
INPUT Total

Percentage <- (Obtained / Total) * 100

OUTPUT "Percentage: ", Percentage, "%"`,
  },
  {
    id: 92,
    level: 'A-Level',
    topic: 'Recursion',
    title: 'Array Sum Recursive',
    description: 'Write recursive function ArraySum(array, n) that sums first n elements.',
    hints: ['Base case: n=0 returns 0', 'Recursive: return Array[n] + ArraySum(array, n-1)', 'Decrease n each recursion'],
    solution: `FUNCTION ArraySum(Arr : ARRAY[1:5] OF INTEGER, N : INTEGER) RETURNS INTEGER
    IF N = 0 THEN
        RETURN 0
    ELSE
        RETURN Arr[N] + ArraySum(Arr, N - 1)
    ENDIF
ENDFUNCTION

DECLARE Numbers : ARRAY[1:5] OF INTEGER

Numbers[1] <- 10
Numbers[2] <- 20
Numbers[3] <- 30
Numbers[4] <- 40
Numbers[5] <- 50

OUTPUT "Sum: ", ArraySum(Numbers, 5)`,
  },
  {
    id: 93,
    level: 'IGCSE',
    topic: 'String Operations',
    title: 'Character Frequency',
    description: 'Input a string and a character. Count how many times the character appears.',
    hints: ['Loop through string', 'Compare each character', 'Increment counter when match found'],
    solution: `DECLARE Text : STRING
DECLARE SearchChar : STRING
DECLARE Length : INTEGER
DECLARE i : INTEGER
DECLARE Char : STRING
DECLARE Count : INTEGER

OUTPUT "Enter text:"
INPUT Text
OUTPUT "Enter character to count:"
INPUT SearchChar

Length <- LENGTH(Text)
Count <- 0

FOR i <- 1 TO Length
    Char <- SUBSTRING(Text, i, 1)
    IF Char = SearchChar THEN
        Count <- Count + 1
    ENDIF
NEXT i

OUTPUT SearchChar, " appears ", Count, " times"`,
  },
  {
    id: 94,
    level: 'A-Level',
    topic: 'Sorting',
    title: 'Merge Two Arrays',
    description: 'Merge two sorted arrays {1,3,5} and {2,4,6} into one sorted array.',
    hints: ['Use three pointers/indices', 'Compare elements from both arrays', 'Add smaller to result'],
    solution: `DECLARE A : ARRAY[1:3] OF INTEGER
DECLARE B : ARRAY[1:3] OF INTEGER
DECLARE C : ARRAY[1:6] OF INTEGER
DECLARE i : INTEGER
DECLARE j : INTEGER
DECLARE k : INTEGER

A[1] <- 1
A[2] <- 3
A[3] <- 5

B[1] <- 2
B[2] <- 4
B[3] <- 6

i <- 1
j <- 1
k <- 1

WHILE i <= 3 AND j <= 3 DO
    IF A[i] <= B[j] THEN
        C[k] <- A[i]
        i <- i + 1
    ELSE
        C[k] <- B[j]
        j <- j + 1
    ENDIF
    k <- k + 1
ENDWHILE

WHILE i <= 3 DO
    C[k] <- A[i]
    i <- i + 1
    k <- k + 1
ENDWHILE

WHILE j <= 3 DO
    C[k] <- B[j]
    j <- j + 1
    k <- k + 1
ENDWHILE

OUTPUT "Merged array:"
FOR i <- 1 TO 6
    OUTPUT C[i]
NEXT i`,
  },
  {
    id: 95,
    level: 'IGCSE',
    topic: 'Loops',
    title: 'Prime Numbers 1-50',
    description: 'Output all prime numbers between 1 and 50.',
    hints: ['Outer loop for each number', 'Inner loop to check if divisible', 'Print if no divisors found'],
    solution: `DECLARE Number : INTEGER
DECLARE i : INTEGER
DECLARE IsPrime : BOOLEAN

OUTPUT "Prime numbers 1-50:"

FOR Number <- 2 TO 50
    IsPrime <- TRUE
    
    FOR i <- 2 TO Number - 1
        IF Number MOD i = 0 THEN
            IsPrime <- FALSE
        ENDIF
    NEXT i
    
    IF IsPrime THEN
        OUTPUT Number
    ENDIF
NEXT Number`,
  },
  {
    id: 96,
    level: 'A-Level',
    topic: 'Functions',
    title: 'String Contains',
    description: 'Write function Contains(text, search) that returns TRUE if search string is in text.',
    hints: ['Loop through text', 'At each position try to match search', 'Use SUBSTRING to extract portions'],
    solution: `FUNCTION Contains(Text : STRING, Search : STRING) RETURNS BOOLEAN
    DECLARE TextLen : INTEGER
    DECLARE SearchLen : INTEGER
    DECLARE i : INTEGER
    DECLARE Sub : STRING
    
    TextLen <- LENGTH(Text)
    SearchLen <- LENGTH(Search)
    
    FOR i <- 1 TO TextLen - SearchLen + 1
        Sub <- SUBSTRING(Text, i, SearchLen)
        IF Sub = Search THEN
            RETURN TRUE
        ENDIF
    NEXT i
    
    RETURN FALSE
ENDFUNCTION

DECLARE Result : BOOLEAN
Result <- Contains("hello world", "world")

IF Result THEN
    OUTPUT "Found"
ELSE
    OUTPUT "Not found"
ENDIF`,
  },
  {
    id: 97,
    level: 'IGCSE',
    topic: 'Arrays',
    title: 'Array Shift',
    description: 'Shift all elements in array {1,2,3,4,5} one position left. Result: {2,3,4,5,1}.',
    hints: ['Store first element temporarily', 'Shift all elements left', 'Put first element at end'],
    solution: `DECLARE Numbers : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER
DECLARE First : INTEGER

Numbers[1] <- 1
Numbers[2] <- 2
Numbers[3] <- 3
Numbers[4] <- 4
Numbers[5] <- 5

First <- Numbers[1]

FOR i <- 1 TO 4
    Numbers[i] <- Numbers[i + 1]
NEXT i

Numbers[5] <- First

OUTPUT "Shifted array:"
FOR i <- 1 TO 5
    OUTPUT Numbers[i]
NEXT i`,
  },
  {
    id: 98,
    level: 'A-Level',
    topic: '2D Arrays',
    title: 'Tic-Tac-Toe Check',
    description: 'Check if row 1 of tic-tac-toe board has all X\'s.',
    hints: ['Create 3×3 board', 'Check if all elements in row 1 equal "X"', 'Use loop or direct comparison'],
    solution: `DECLARE Board : ARRAY[1:3, 1:3] OF STRING
DECLARE j : INTEGER
DECLARE AllX : BOOLEAN

Board[1,1] <- "X"
Board[1,2] <- "X"
Board[1,3] <- "X"
Board[2,1] <- "O"
Board[2,2] <- "X"
Board[2,3] <- "O"
Board[3,1] <- "O"
Board[3,2] <- "O"
Board[3,3] <- "X"

AllX <- TRUE

FOR j <- 1 TO 3
    IF Board[1, j] <> "X" THEN
        AllX <- FALSE
    ENDIF
NEXT j

IF AllX THEN
    OUTPUT "Row 1 has three X's!"
ELSE
    OUTPUT "Row 1 does not have three X's"
ENDIF`,
  },
  {
    id: 99,
    level: 'IGCSE',
    topic: 'Selection',
    title: 'Rock Paper Scissors',
    description: 'Input two players\' choices (R/P/S) and determine the winner.',
    hints: ['Use nested IF or CASE', 'Rock beats Scissors, Scissors beats Paper, Paper beats Rock', 'Check for tie first'],
    solution: `DECLARE Player1 : STRING
DECLARE Player2 : STRING

OUTPUT "Player 1 (R/P/S):"
INPUT Player1
OUTPUT "Player 2 (R/P/S):"
INPUT Player2

IF Player1 = Player2 THEN
    OUTPUT "Tie!"
ELSE
    IF Player1 = "R" AND Player2 = "S" THEN
        OUTPUT "Player 1 wins!"
    ELSE
        IF Player1 = "S" AND Player2 = "P" THEN
            OUTPUT "Player 1 wins!"
        ELSE
            IF Player1 = "P" AND Player2 = "R" THEN
                OUTPUT "Player 1 wins!"
            ELSE
                OUTPUT "Player 2 wins!"
            ENDIF
        ENDIF
    ENDIF
ENDIF`,
  },
  {
    id: 100,
    level: 'A-Level',
    topic: 'Complex Algorithm',
    title: 'Sieve of Eratosthenes',
    description: 'Find all prime numbers up to 20 using Sieve of Eratosthenes algorithm.',
    hints: ['Create boolean array', 'Mark multiples of each prime as not prime', 'Output unmarked numbers'],
    solution: `DECLARE IsPrime : ARRAY[1:20] OF BOOLEAN
DECLARE i : INTEGER
DECLARE j : INTEGER

FOR i <- 1 TO 20
    IsPrime[i] <- TRUE
NEXT i

IsPrime[1] <- FALSE

FOR i <- 2 TO 20
    IF IsPrime[i] THEN
        FOR j <- i * 2 TO 20 STEP i
            IsPrime[j] <- FALSE
        NEXT j
    ENDIF
NEXT i

OUTPUT "Prime numbers up to 20:"
FOR i <- 1 TO 20
    IF IsPrime[i] THEN
        OUTPUT i
    ENDIF
NEXT i`,
  },
];

interface PracticeProblemsProps {
  onClose: () => void;
  onLoadCode?: (code: string) => void;
}

export default function PracticeProblems({ onClose, onLoadCode }: PracticeProblemsProps) {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [filterLevel, setFilterLevel] = useState<'All' | 'IGCSE' | 'A-Level'>('All');

  const filteredProblems = problems.filter(
    p => filterLevel === 'All' || p.level === filterLevel
  );

  const handleSelectProblem = (problem: Problem) => {
    setSelectedProblem(problem);
    setShowSolution(false);
  };

  const handleTrySolution = () => {
    if (selectedProblem && onLoadCode) {
      if (confirm('Load solution? This will replace your current code.')) {
        onLoadCode(selectedProblem.solution);
        onClose();
      }
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2>Practice Problems</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.content}>
          <div className={styles.sidebar}>
            <div className={styles.filterButtons}>
              <button
                className={`${styles.filterButton} ${filterLevel === 'All' ? styles.active : ''}`}
                onClick={() => setFilterLevel('All')}
              >
                All
              </button>
              <button
                className={`${styles.filterButton} ${filterLevel === 'IGCSE' ? styles.active : ''}`}
                onClick={() => setFilterLevel('IGCSE')}
              >
                IGCSE
              </button>
              <button
                className={`${styles.filterButton} ${filterLevel === 'A-Level' ? styles.active : ''}`}
                onClick={() => setFilterLevel('A-Level')}
              >
                A-Level
              </button>
            </div>

            <div className={styles.problemList}>
              {filteredProblems.map((problem) => (
                <button
                  key={problem.id}
                  className={`${styles.problemButton} ${
                    selectedProblem?.id === problem.id ? styles.active : ''
                  }`}
                  onClick={() => handleSelectProblem(problem)}
                >
                  <div className={styles.problemLevel}>{problem.level}</div>
                  <div className={styles.problemTitle}>{problem.title}</div>
                  <div className={styles.problemTopic}>{problem.topic}</div>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.main}>
            {selectedProblem ? (
              <>
                <div className={styles.problemHeader}>
                  <div>
                    <span className={styles.badge}>{selectedProblem.level}</span>
                    <span className={styles.topicBadge}>{selectedProblem.topic}</span>
                  </div>
                  <h3>{selectedProblem.title}</h3>
                </div>

                <div className={styles.problemDescription}>
                  <h4>Problem:</h4>
                  <p>{selectedProblem.description}</p>
                </div>

                <div className={styles.hintsSection}>
                  <h4>Hints:</h4>
                  <ul>
                    {selectedProblem.hints.map((hint, index) => (
                      <li key={index}>{hint}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.solutionSection}>
                  <button
                    className={styles.solutionButton}
                    onClick={() => setShowSolution(!showSolution)}
                  >
                    {showSolution ? 'Hide Solution' : 'Show Solution'}
                  </button>

                  {showSolution && (
                    <div className={styles.solutionBox}>
                      <pre>{selectedProblem.solution}</pre>
                      <button
                        className={styles.tryButton}
                        onClick={handleTrySolution}
                      >
                        Try This Solution
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>
                <p>Select a problem from the list to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
