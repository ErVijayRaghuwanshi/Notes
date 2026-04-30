# Regular Expressions 101 - Complete Guide

A comprehensive guide to regular expressions (regex) covering syntax, patterns, and techniques for text matching and manipulation.

---

## 📌 What is Regex?

**Regular Expression (Regex)** is a sequence of characters that defines a search pattern. It's used for:

- **Pattern Matching**: Find text that matches a specific pattern
- **Validation**: Validate input formats (email, phone, URL)
- **Search & Replace**: Find and replace text in documents
- **Text Extraction**: Extract specific data from strings
- **Parsing**: Parse logs, configs, and structured text

---

## 🔤 Basic Syntax

### Literal Characters

Most characters match themselves literally:

| Pattern | Matches |
|---------|---------|
| `hello` | "hello" exactly |
| `123` | "123" exactly |
| `abc` | "abc" exactly |

### Special Characters (Metacharacters)

These characters have special meaning and need escaping with `\` to match literally:

| Metacharacter | Meaning |
|---------------|---------|
| `.` | Any single character (except newline) |
| `^` | Start of string/line |
| `$` | End of string/line |
| `*` | Zero or more of previous |
| `+` | One or more of previous |
| `?` | Zero or one of previous |
| `\|` | Alternation (OR) |
| `\` | Escape character |
| `()` | Grouping |
| `[]` | Character class |
| `{}` | Quantifier |

---

## 📦 Character Classes

Character classes match any single character from a set.

### Basic Character Classes

| Pattern | Matches | Example |
|---------|---------|---------|
| `[abc]` | Any of a, b, or c | `[abc]` matches "a" in "apple" |
| `[^abc]` | Any character NOT a, b, or c | `[^abc]` matches "p" in "apple" |
| `[a-z]` | Any lowercase letter | `[a-z]` matches "h" in "hello" |
| `[A-Z]` | Any uppercase letter | `[A-Z]` matches "H" in "Hello" |
| `[0-9]` | Any digit | `[0-9]` matches "5" in "abc5" |
| `[a-zA-Z]` | Any letter | `[a-zA-Z]` matches "H" in "Hello123" |
| `[a-zA-Z0-9]` | Any alphanumeric | Matches letters and digits |

### Predefined Character Classes (Shorthand)

| Shorthand | Equivalent | Meaning |
|-----------|------------|---------|
| `\d` | `[0-9]` | Any digit |
| `\D` | `[^0-9]` | Any non-digit |
| `\w` | `[a-zA-Z0-9_]` | Word character (alphanumeric + underscore) |
| `\W` | `[^a-zA-Z0-9_]` | Non-word character |
| `\s` | `[ \t\n\r\f\v]` | Whitespace character |
| `\S` | `[^ \t\n\r\f\v]` | Non-whitespace character |
| `.` | `[^\n]` | Any character except newline |

### Examples

```
Pattern: \d{3}-\d{4}
Matches: "123-4567", "999-0000"
Doesn't match: "12-4567", "abc-defg"

Pattern: \w+@\w+\.\w+
Matches: "user@domain.com"
Doesn't match: "user@domain" (missing TLD)
```

---

## 🔢 Quantifiers

Quantifiers specify how many times a pattern should match.

### Basic Quantifiers

| Quantifier | Meaning | Example |
|------------|---------|---------|
| `*` | 0 or more | `a*` matches "", "a", "aa", "aaa" |
| `+` | 1 or more | `a+` matches "a", "aa", "aaa" (not "") |
| `?` | 0 or 1 | `a?` matches "" or "a" |
| `{n}` | Exactly n times | `a{3}` matches "aaa" only |
| `{n,}` | n or more times | `a{2,}` matches "aa", "aaa", "aaaa"... |
| `{n,m}` | Between n and m times | `a{2,4}` matches "aa", "aaa", "aaaa" |

### Greedy vs Lazy (Non-Greedy)

By default, quantifiers are **greedy** (match as much as possible). Add `?` to make them **lazy** (match as little as possible).

| Greedy | Lazy | Behavior |
|--------|------|----------|
| `*` | `*?` | Match minimum possible |
| `+` | `+?` | Match minimum possible |
| `?` | `??` | Match minimum possible |
| `{n,m}` | `{n,m}?` | Match minimum possible |

**Example:**

```
Text: "<div>content</div>"

Greedy: <.*>
Matches: "<div>content</div>" (entire string)

Lazy: <.*?>
Matches: "<div>" (first tag only)
```

---

## ⚓ Anchors

Anchors match positions, not characters.

| Anchor | Meaning |
|--------|---------|
| `^` | Start of string (or line in multiline mode) |
| `$` | End of string (or line in multiline mode) |
| `\b` | Word boundary |
| `\B` | Non-word boundary |
| `\A` | Start of string (absolute, ignores multiline) |
| `\Z` | End of string (absolute, ignores multiline) |

### Word Boundary Examples

```
Pattern: \bcat\b
Matches: "cat" in "the cat sat"
Doesn't match: "cat" in "category" or "concatenate"

Pattern: \Bcat\B
Matches: "cat" in "concatenate"
Doesn't match: "cat" in "the cat sat"
```

### Start/End Examples

```
Pattern: ^Hello
Matches: "Hello" only at start of string
Text "Hello World" ✓
Text "Say Hello" ✗

Pattern: world$
Matches: "world" only at end of string
Text "Hello world" ✓
Text "world peace" ✗
```

---

## 🔗 Groups and Capturing

### Basic Groups

Parentheses `()` create groups for:
1. **Capturing**: Extract matched text
2. **Backreferences**: Refer to captured text
3. **Quantification**: Apply quantifiers to groups

| Syntax | Meaning |
|--------|---------|
| `(abc)` | Capturing group |
| `(?:abc)` | Non-capturing group |
| `(?P<name>abc)` | Named capturing group |
| `\1`, `\2` | Backreference to group 1, 2 |
| `(?P=name)` | Backreference to named group |

### Capturing Group Examples

```
Pattern: (\d{3})-(\d{4})
Text: "123-4567"
Group 0 (full match): "123-4567"
Group 1: "123"
Group 2: "4567"
```

### Named Groups

```
Pattern: (?P<area>\d{3})-(?P<number>\d{4})
Text: "123-4567"
Group 'area': "123"
Group 'number': "4567"
```

### Backreferences

```
Pattern: (\w+)\s+\1
Matches: "hello hello" (repeated word)
Doesn't match: "hello world"

Pattern: <(\w+)>.*?</\1>
Matches: "<div>content</div>", "<span>text</span>"
Doesn't match: "<div>content</span>"
```

### Non-Capturing Groups

Use `(?:...)` when you need grouping but don't need to capture:

```
Pattern: (?:https?|ftp)://\w+
Matches: "http://example", "https://example", "ftp://example"
No capture group created (more efficient)
```

---

## 👀 Lookahead and Lookbehind

Lookarounds assert that a pattern exists (or doesn't) without including it in the match.

### Lookahead

| Syntax | Name | Meaning |
|--------|------|---------|
| `(?=...)` | Positive lookahead | Asserts pattern follows |
| `(?!...)` | Negative lookahead | Asserts pattern doesn't follow |

**Examples:**

```
Pattern: \d+(?=\s*USD)
Text: "100 USD and 200 EUR"
Matches: "100" (followed by USD)
Doesn't match: "200" (followed by EUR)

Pattern: \d+(?!\s*USD)
Text: "100 USD and 200 EUR"
Matches: "200" (not followed by USD)
```

### Lookbehind

| Syntax | Name | Meaning |
|--------|------|---------|
| `(?<=...)` | Positive lookbehind | Asserts pattern precedes |
| `(?<!...)` | Negative lookbehind | Asserts pattern doesn't precede |

**Examples:**

```
Pattern: (?<=\$)\d+
Text: "$100 and €200"
Matches: "100" (preceded by $)
Doesn't match: "200" (preceded by €)

Pattern: (?<!\$)\d+
Text: "$100 and 200 items"
Matches: "200" (not preceded by $)
```

### Combined Lookarounds

```
Pattern: (?<=\$)\d+(?=\s*USD)
Text: "$100 USD"
Matches: "100" (preceded by $ AND followed by USD)
```

---

## 🚩 Flags (Modifiers)

Flags modify how the regex engine interprets the pattern.

| Flag | Name | Effect |
|------|------|--------|
| `i` | Case-insensitive | `a` matches "a" and "A" |
| `m` | Multiline | `^` and `$` match line boundaries |
| `s` | Dotall (Single-line) | `.` matches newline too |
| `x` | Verbose (Extended) | Allows whitespace and comments |
| `g` | Global | Match all occurrences (not in Python) |

### Flag Examples

**Case-insensitive:**
```
Pattern: /hello/i
Matches: "hello", "Hello", "HELLO", "HeLLo"
```

**Multiline:**
```
Pattern: /^start/m
Text: "line1\nstart here"
Matches: "start" at beginning of second line
```

**Dotall:**
```
Pattern: /a.*b/s
Text: "a\nb"
Matches: "a\nb" (dot matches newline)
```

**Verbose (for readable complex patterns):**
```python
pattern = r"""
    ^                   # Start of string
    (?P<protocol>https?)  # Protocol (http or https)
    ://                 # Separator
    (?P<domain>[\w.-]+) # Domain name
    (?P<path>/\S*)?     # Optional path
    $                   # End of string
"""
```

---

## 🔀 Alternation

The pipe `|` acts as OR operator.

```
Pattern: cat|dog
Matches: "cat" or "dog"

Pattern: (cat|dog)s?
Matches: "cat", "cats", "dog", "dogs"

Pattern: gr(a|e)y
Matches: "gray" or "grey"
```

**Precedence:**
Alternation has low precedence. Use groups to control scope:

```
Pattern: ^cat|dog$
Means: (^cat) OR (dog$)

Pattern: ^(cat|dog)$
Means: ^cat$ OR ^dog$ (entire string is "cat" or "dog")
```

---

## 📋 Common Patterns

### Email Validation

```
Basic: \w+@\w+\.\w+
Better: [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}
```

### URL Matching

```
Basic: https?://\S+
Better: https?://(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_+.~#?&/=]*
```

### Phone Numbers

```
US Format: \(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}
Matches: "(123) 456-7890", "123-456-7890", "123.456.7890", "1234567890"

International: \+?[\d\s-]{10,}
```

### IP Address (IPv4)

```
Basic: \d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}
Strict: (?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)
```

### Date Formats

```
YYYY-MM-DD: \d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])
MM/DD/YYYY: (?:0[1-9]|1[0-2])/(?:0[1-9]|[12]\d|3[01])/\d{4}
```

### Password Validation

```
At least 8 chars, 1 upper, 1 lower, 1 digit:
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$

Add special character requirement:
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$
```

### HTML Tags

```
Opening tag: <([a-z]+)(?:\s+[^>]*)?>
Closing tag: </([a-z]+)>
Self-closing: <([a-z]+)(?:\s+[^>]*)?/>
Any tag: </?[a-z]+(?:\s+[^>]*)?>
```

### Log Parsing

```
Apache Log: ^(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) (\S+) \S+" (\d+) (\d+)
Captures: IP, timestamp, method, path, status, size
```

### Whitespace Handling

```
Trim whitespace: ^\s+|\s+$
Multiple spaces to single: \s+
Remove all whitespace: \s
```

---

## 📊 Quick Reference Cheat Sheet

### Metacharacters

| Char | Meaning |
|------|---------|
| `.` | Any character (except newline) |
| `^` | Start of string |
| `$` | End of string |
| `*` | 0 or more |
| `+` | 1 or more |
| `?` | 0 or 1 |
| `\|` | OR |
| `\` | Escape |
| `()` | Group |
| `[]` | Character class |
| `{}` | Quantifier |

### Character Classes

| Class | Meaning |
|-------|---------|
| `\d` | Digit [0-9] |
| `\D` | Non-digit |
| `\w` | Word char [a-zA-Z0-9_] |
| `\W` | Non-word char |
| `\s` | Whitespace |
| `\S` | Non-whitespace |
| `\b` | Word boundary |
| `\B` | Non-word boundary |

### Quantifiers

| Quantifier | Meaning |
|------------|---------|
| `*` | 0+ (greedy) |
| `+` | 1+ (greedy) |
| `?` | 0 or 1 |
| `{n}` | Exactly n |
| `{n,}` | n or more |
| `{n,m}` | n to m |
| `*?` | 0+ (lazy) |
| `+?` | 1+ (lazy) |

### Groups

| Syntax | Meaning |
|--------|---------|
| `(...)` | Capturing group |
| `(?:...)` | Non-capturing group |
| `(?P<n>...)` | Named group |
| `\1` | Backreference |
| `(?=...)` | Positive lookahead |
| `(?!...)` | Negative lookahead |
| `(?<=...)` | Positive lookbehind |
| `(?<!...)` | Negative lookbehind |

---

## 🎯 Interview Questions

### Basic

**Q1: What is the difference between `*` and `+`?**
> `*` matches zero or more occurrences, `+` matches one or more. Pattern `a*` matches empty string, `a+` requires at least one "a".

**Q2: What does `\b` match?**
> `\b` matches a word boundary - the position between a word character and a non-word character. It doesn't consume any characters.

**Q3: What's the difference between `[^abc]` and `^[abc]`?**
> `[^abc]` is a negated character class (any char except a, b, c). `^[abc]` matches a, b, or c at the start of string.

### Intermediate

**Q4: Explain greedy vs lazy matching.**
> Greedy (`*`, `+`) matches as much as possible, then backtracks. Lazy (`*?`, `+?`) matches as little as possible, then expands. For `<.*>` on `<a>b</a>`, greedy matches entire string, lazy matches `<a>`.

**Q5: What is a lookahead? Give an example.**
> Lookahead asserts a pattern exists ahead without including it in match. `\d+(?=%)` matches digits followed by % but doesn't include %. In "50%", it matches "50".

**Q6: How do you match a literal dot?**
> Escape it with backslash: `\.` matches a literal period. Without escape, `.` matches any character.

### Advanced

**Q7: Write a regex for valid email addresses.**
> `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
> - Local part: alphanumeric and special chars
> - @ symbol
> - Domain: alphanumeric with dots
> - TLD: at least 2 letters

**Q8: How would you match repeated words?**
> `\b(\w+)\s+\1\b` - captures a word, matches whitespace, then backreferences the same word.

**Q9: Explain catastrophic backtracking.**
> Occurs with nested quantifiers like `(a+)+` on input that almost matches. Engine tries exponentially many combinations before failing. Avoid by using atomic groups or possessive quantifiers.

**Q10: Match a string that contains "foo" but not "bar".**
> `^(?!.*bar).*foo.*$` - negative lookahead ensures "bar" doesn't exist anywhere, then matches "foo".

---

## 🔗 Related Topics

- [Python re Module](python-re-module.md) - Python-specific regex implementation
- [SOLID Principles](../design-patterns/SOLID.md) - Design patterns for clean code

---

**Last Updated**: April 2026 | **Status**: Complete
