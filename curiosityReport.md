# Curiosity Report: Fuzzing and Concolic Testing

## Introduction

So far in CS 329, we have mostly discussed methods of testing that assert the correctness of a program and its outputs. In researching other forms of testing, I discovered that there are some forms of testing that are intended to locate bugs and security issues with less emphasis on correct output. In this report, I will examine two types of bug-focused testing (fuzzing and concolic testing), explain their methodologies, and show their importance and real-world applicability.

## 1. Fuzzing

### What is fuzzing?

Fuzzing (or fuzz testing) is an automated testing technique that uses inputs generated randomly by a program called a fuzzer to test for exceptions. Generally, a fuzzer will generate inputs that are close to correct, either from scratch or by mutating a seed input. The goal is to have inputs that aren't outright rejected by the parser while also causing issues deeper in the program. Fuzzing is most effective in areas where input is provided directly and with low trust (i.e. a user uploads a file).

Fuzzing can help to expose a variety of issues, including crashes, memory leaks, and buffer overflow.

## Sources

1. [Wikipedia entry for Fuzzing](https://en.wikipedia.org/wiki/Fuzzing#)
2. [Google's OSS-Fuzz](https://github.com/google/oss-fuzz)
