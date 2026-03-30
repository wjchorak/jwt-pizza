# Curiosity Report: Fuzzing and Concolic Testing

## Introduction

So far in CS 329, we have mostly discussed methods of testing that assert the correctness of a program and its outputs. In researching other forms of testing, I discovered that there are some forms of testing that are intended to locate bugs and security issues with less emphasis on correct output. In this report, I will examine two types of bug-focused testing (fuzzing and concolic testing), explain their methodologies, and show their importance and real-world applicability.

## 1. Fuzzing

### What is fuzzing?

Fuzzing (or fuzz testing) is an automated testing technique that uses inputs generated randomly by a program called a fuzzer to test for exceptions. Generally, a fuzzer will generate inputs that are close to correct, either from scratch or by mutating a seed input. The goal is to have inputs that aren't outright rejected by the parser while also causing issues deeper in the program. Fuzzing is most effective in areas where input is provided directly and with low trust (i.e. a user uploads a file).

Fuzzing can help to expose a variety of issues, including crashes, memory leaks, and buffer overflow.

### How does fuzzing work?

Per Wikipedia:

> A fuzzer can be categorized in several ways:
>
> 1. A fuzzer can be generation-based or mutation-based depending on whether inputs are generated from scratch or by modifying existing inputs.
> 2. A fuzzer can be dumb (unstructured) or smart (structured) depending on whether it is aware of input structure.
> 3. A fuzzer can be white-, grey-, or black-box, depending on whether it is aware of program structure.

Generally, a fuzzer will generate inputs for the program (whether from scratch or mutation) and then observe whether the inputs provoke an appropriate output. Typically, the fuzzer itself does not have the capability to identify complex issues (anything other than crashes). If a further degree of sensitivity is needed for testing (it often is), a sanitizer program can be used to cause the program to crash when issues are detected (memory issues, undefined behavior, race conditions, etc.).

### Why is fuzzing useful?

The primary value of fuzzing is that it provides a form of non-deterministic testing (where the intended output of the test is not known) in contrast to most traditional testing being deterministic (correct output is known). This is vital for exposing issues that may not be obvious or expected to a human observer of the code. Fuzzing can be applied at any stage of the development process, even if the inteded functionality is still incomplete (if your code can run at all, it can be fuzzed).

## 2. Concolic Testing

### What is concolic testing?

Concolic testing is a testing technique that utilizes some interesting theoretical CS ideas to find bugs in software. Similar to fuzzing, concolic testing is non-deterministic and is focused on finding bugs and security vulnerabilites rather than verifying correct input.

### How does concolic testing work?

The name "concolic testing" comes from a portmanteau of "concrete" execution and "symbolic" execution. A concolic testing algorithm executes a program symbolically, following the variables without focusing on their specific values. The algorithm identifies path conditions and adjusts inputs before running again. In theory, this allows the algorithm to check all branching execution paths and find the ones that have bugs.

### Why is concolic testing useful?

As with fuzzing, the sorts of bugs that concolic testing can locate are very difficult for a human to identify. Most of the time, the sorts of inputs that a human will think of using to test a program are informed by our human experience of the world. By focusing less on the input/output and more on verifying all branching logic paths, we can find sneaky vulnerabilities and make the program more secure.

## Sources

1. [Wikipedia entry for Fuzzing](https://en.wikipedia.org/wiki/Fuzzing#)
2. [Google's OSS-Fuzz](https://github.com/google/oss-fuzz)
3. [Microsoft Fuzzing](https://www.microsoft.com/en-us/research/blog/a-brief-introduction-to-fuzzing-and-why-its-an-important-tool-for-developers/)
4. [This Code Intelligence blog post lists industry standards for fuzzing](https://www.code-intelligence.com/blog/top-5-reasons-to-fuzz-embedded-systems)
5. [Wikipedia entry for Concolic Testing](https://en.wikipedia.org/wiki/Concolic_testing)
6. [ACM Proceedings on Concolic Testing](https://dl.acm.org/doi/10.1145/1321631.1321746)
7. [An implementation of Concolic Fuzzing in Python](https://www.fuzzingbook.org/html/ConcolicFuzzer.html)
