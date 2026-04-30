# Python `re` Module - Complete Guide

Comprehensive guide to Python's built-in `re` module for regular expression operations.

---

## 📌 Overview

The `re` module provides regular expression matching operations in Python. Import it with:

```python
import re
```

---

## 🔤 Raw Strings

Always use **raw strings** (`r"..."`) for regex patterns in Python to avoid escape sequence conflicts:

```python
# Without raw string - problematic
pattern = "\\d+"      # Need double backslash
pattern = "\bword\b"  # \b is backspace, not word boundary!

# With raw string - correct
pattern = r"\d+"      # Single backslash works
pattern = r"\bword\b" # Word boundary as intended
```

**Why?** Python processes escape sequences (`\n`, `\t`, `\b`) before regex sees them. Raw strings pass backslashes directly to the regex engine.

---

## 🔍 Core Functions

### `re.match()` - Match at Beginning

Matches pattern only at the **start** of the string.

```python
import re

# Match at start
result = re.match(r"\d+", "123abc")
print(result.group())  # "123"

# No match - pattern not at start
result = re.match(r"\d+", "abc123")
print(result)  # None
```

### `re.search()` - Search Anywhere

Searches for pattern **anywhere** in the string. Returns first match.

```python
# Search anywhere
result = re.search(r"\d+", "abc123def456")
print(result.group())  # "123" (first match)

# With groups
result = re.search(r"(\w+)@(\w+)\.(\w+)", "email: user@domain.com")
print(result.group())   # "user@domain.com"
print(result.group(1))  # "user"
print(result.group(2))  # "domain"
print(result.group(3))  # "com"
```

### `re.fullmatch()` - Match Entire String

Matches if the **entire string** matches the pattern.

```python
# Full match
result = re.fullmatch(r"\d+", "12345")
print(result.group())  # "12345"

# No match - extra characters
result = re.fullmatch(r"\d+", "123abc")
print(result)  # None
```

### `re.findall()` - Find All Matches

Returns a **list** of all non-overlapping matches.

```python
# Find all digits
result = re.findall(r"\d+", "abc123def456ghi789")
print(result)  # ['123', '456', '789']

# With groups - returns tuples
result = re.findall(r"(\w+)@(\w+)", "a@b and c@d")
print(result)  # [('a', 'b'), ('c', 'd')]

# Single group - returns list of strings
result = re.findall(r"(\d+)", "123 and 456")
print(result)  # ['123', '456']
```

### `re.finditer()` - Iterator of Matches

Returns an **iterator** of Match objects. More memory-efficient for large texts.

```python
# Iterate over matches
for match in re.finditer(r"\d+", "abc123def456"):
    print(f"Found '{match.group()}' at position {match.start()}-{match.end()}")

# Output:
# Found '123' at position 3-6
# Found '456' at position 9-12
```

---

## ✏️ Substitution Functions

### `re.sub()` - Replace Matches

Replaces all occurrences of pattern with replacement string.

```python
# Simple replacement
result = re.sub(r"\d+", "NUM", "abc123def456")
print(result)  # "abcNUMdefNUM"

# Limit replacements with count
result = re.sub(r"\d+", "NUM", "abc123def456", count=1)
print(result)  # "abcNUMdef456"

# Using backreferences
result = re.sub(r"(\w+)@(\w+)", r"\2@\1", "user@domain")
print(result)  # "domain@user"

# Using named groups
result = re.sub(r"(?P<first>\w+)@(?P<second>\w+)", r"\g<second>@\g<first>", "user@domain")
print(result)  # "domain@user"
```

### Using Functions as Replacement

```python
def double_number(match):
    num = int(match.group())
    return str(num * 2)

result = re.sub(r"\d+", double_number, "abc10def20")
print(result)  # "abc20def40"

# Lambda version
result = re.sub(r"\d+", lambda m: str(int(m.group()) * 2), "abc10def20")
print(result)  # "abc20def40"
```

### `re.subn()` - Replace with Count

Returns tuple of (new_string, number_of_replacements).

```python
result, count = re.subn(r"\d+", "NUM", "abc123def456ghi789")
print(result)  # "abcNUMdefNUMghiNUM"
print(count)   # 3
```

---

## ✂️ Splitting

### `re.split()` - Split by Pattern

Splits string by pattern occurrences.

```python
# Split by whitespace
result = re.split(r"\s+", "hello   world  python")
print(result)  # ['hello', 'world', 'python']

# Split by multiple delimiters
result = re.split(r"[,;:\s]+", "a,b;c:d e")
print(result)  # ['a', 'b', 'c', 'd', 'e']

# Limit splits
result = re.split(r"\s+", "a b c d e", maxsplit=2)
print(result)  # ['a', 'b', 'c d e']

# Keep delimiters with capturing group
result = re.split(r"(\s+)", "a b c")
print(result)  # ['a', ' ', 'b', ' ', 'c']
```

---

## 🔧 Pattern Compilation

### `re.compile()` - Compile Pattern

Pre-compile patterns for better performance when reusing.

```python
# Compile pattern
pattern = re.compile(r"\d+")

# Use compiled pattern
result = pattern.findall("abc123def456")
print(result)  # ['123', '456']

result = pattern.search("abc123")
print(result.group())  # "123"

result = pattern.sub("NUM", "abc123def456")
print(result)  # "abcNUMdefNUM"
```

### When to Compile

```python
# Good: Compile once, use many times
email_pattern = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")

def validate_emails(email_list):
    return [email for email in email_list if email_pattern.match(email)]

# Not necessary: Single use
if re.match(r"\d+", user_input):
    pass  # Python caches recent patterns anyway
```

---

## 📦 Match Objects

When `match()`, `search()`, or `finditer()` succeeds, it returns a Match object.

### Match Object Methods

| Method | Description |
|--------|-------------|
| `.group()` | Return matched string |
| `.group(n)` | Return nth captured group |
| `.group(name)` | Return named group |
| `.groups()` | Return tuple of all groups |
| `.groupdict()` | Return dict of named groups |
| `.start()` | Start index of match |
| `.end()` | End index of match |
| `.span()` | Tuple of (start, end) |

### Examples

```python
text = "John Smith: john.smith@email.com"
pattern = r"(?P<name>\w+ \w+): (?P<email>\S+@\S+)"

match = re.search(pattern, text)

# Full match
print(match.group())      # "John Smith: john.smith@email.com"
print(match.group(0))     # Same as above

# Positional groups
print(match.group(1))     # "John Smith"
print(match.group(2))     # "john.smith@email.com"

# Named groups
print(match.group("name"))   # "John Smith"
print(match.group("email"))  # "john.smith@email.com"

# All groups
print(match.groups())     # ('John Smith', 'john.smith@email.com')
print(match.groupdict())  # {'name': 'John Smith', 'email': 'john.smith@email.com'}

# Positions
print(match.start())      # 0
print(match.end())        # 33
print(match.span())       # (0, 33)

# Group positions
print(match.start(1))     # 0
print(match.end(1))       # 10
print(match.span("email")) # (12, 33)
```

### Accessing Original String

```python
match = re.search(r"\d+", "abc123def")
print(match.string)   # "abc123def" (original string)
print(match.re)       # re.compile('\\d+') (pattern object)
```

---

## 🚩 Flags

Flags modify regex behavior. Use as second argument or inline.

### Available Flags

| Flag | Short | Inline | Effect |
|------|-------|--------|--------|
| `re.IGNORECASE` | `re.I` | `(?i)` | Case-insensitive matching |
| `re.MULTILINE` | `re.M` | `(?m)` | `^`/`$` match line boundaries |
| `re.DOTALL` | `re.S` | `(?s)` | `.` matches newline |
| `re.VERBOSE` | `re.X` | `(?x)` | Allow whitespace/comments |
| `re.ASCII` | `re.A` | `(?a)` | ASCII-only matching |
| `re.UNICODE` | `re.U` | `(?u)` | Unicode matching (default in Python 3) |

### Flag Examples

**Case-insensitive:**
```python
# Using flag argument
result = re.findall(r"hello", "Hello HELLO hello", re.IGNORECASE)
print(result)  # ['Hello', 'HELLO', 'hello']

# Using inline flag
result = re.findall(r"(?i)hello", "Hello HELLO hello")
print(result)  # ['Hello', 'HELLO', 'hello']
```

**Multiline:**
```python
text = """line1
line2
line3"""

# Without MULTILINE - ^ only matches start of string
result = re.findall(r"^line\d", text)
print(result)  # ['line1']

# With MULTILINE - ^ matches start of each line
result = re.findall(r"^line\d", text, re.MULTILINE)
print(result)  # ['line1', 'line2', 'line3']
```

**Dotall:**
```python
text = "start\nmiddle\nend"

# Without DOTALL - . doesn't match newline
result = re.search(r"start.*end", text)
print(result)  # None

# With DOTALL - . matches newline
result = re.search(r"start.*end", text, re.DOTALL)
print(result.group())  # "start\nmiddle\nend"
```

**Verbose (for readable patterns):**
```python
# Complex pattern made readable
email_pattern = re.compile(r"""
    ^                       # Start of string
    [a-zA-Z0-9._%+-]+       # Local part
    @                       # @ symbol
    [a-zA-Z0-9.-]+          # Domain
    \.                      # Dot
    [a-zA-Z]{2,}            # TLD
    $                       # End of string
""", re.VERBOSE)

result = email_pattern.match("user@domain.com")
print(result.group())  # "user@domain.com"
```

**Combining flags:**
```python
# Multiple flags with |
result = re.findall(r"^hello", "Hello\nHELLO", re.IGNORECASE | re.MULTILINE)
print(result)  # ['Hello', 'HELLO']

# Inline multiple flags
result = re.findall(r"(?im)^hello", "Hello\nHELLO")
print(result)  # ['Hello', 'HELLO']
```

---

## 🛠️ Practical Examples

### Email Validation

```python
def validate_email(email):
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return bool(re.match(pattern, email))

print(validate_email("user@domain.com"))    # True
print(validate_email("invalid-email"))       # False
```

### Phone Number Extraction

```python
def extract_phone_numbers(text):
    pattern = r"\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}"
    return re.findall(pattern, text)

text = "Call (123) 456-7890 or 987.654.3210"
print(extract_phone_numbers(text))  # ['(123) 456-7890', '987.654.3210']
```

### Log Parsing

```python
def parse_log_line(line):
    pattern = r"(?P<ip>\d+\.\d+\.\d+\.\d+) - - \[(?P<date>[^\]]+)\] \"(?P<method>\w+) (?P<path>\S+)"
    match = re.search(pattern, line)
    if match:
        return match.groupdict()
    return None

log = '192.168.1.1 - - [01/Jan/2024:10:00:00] "GET /api/users HTTP/1.1" 200'
print(parse_log_line(log))
# {'ip': '192.168.1.1', 'date': '01/Jan/2024:10:00:00', 'method': 'GET', 'path': '/api/users'}
```

### URL Parsing

```python
def parse_url(url):
    pattern = r"(?P<protocol>https?)?(?:://)?(?P<domain>[^/]+)(?P<path>/\S*)?"
    match = re.match(pattern, url)
    if match:
        return match.groupdict()
    return None

print(parse_url("https://example.com/path/to/page"))
# {'protocol': 'https', 'domain': 'example.com', 'path': '/path/to/page'}
```

### Password Validation

```python
def validate_password(password):
    """
    Password must have:
    - At least 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    - At least one special character
    """
    if len(password) < 8:
        return False
    
    checks = [
        r"[A-Z]",      # Uppercase
        r"[a-z]",      # Lowercase
        r"\d",         # Digit
        r"[@$!%*?&]"   # Special char
    ]
    
    return all(re.search(pattern, password) for pattern in checks)

print(validate_password("Passw0rd!"))  # True
print(validate_password("password"))    # False
```

### Data Cleaning

```python
def clean_text(text):
    # Remove extra whitespace
    text = re.sub(r"\s+", " ", text)
    # Remove special characters except basic punctuation
    text = re.sub(r"[^\w\s.,!?-]", "", text)
    # Trim
    text = text.strip()
    return text

dirty = "  Hello,   world!!!   @#$%  How are you?  "
print(clean_text(dirty))  # "Hello, world!!! How are you?"
```

### HTML Tag Stripping

```python
def strip_html_tags(html):
    # Remove HTML tags
    text = re.sub(r"<[^>]+>", "", html)
    # Decode common entities
    text = re.sub(r"&nbsp;", " ", text)
    text = re.sub(r"&amp;", "&", text)
    text = re.sub(r"&lt;", "<", text)
    text = re.sub(r"&gt;", ">", text)
    return text

html = "<p>Hello <b>World</b>&nbsp;&amp;&nbsp;Python</p>"
print(strip_html_tags(html))  # "Hello World & Python"
```

### CSV Field Extraction

```python
def parse_csv_line(line):
    # Handle quoted fields with commas
    pattern = r'(?:^|,)("(?:[^"]*(?:""[^"]*)*)"|[^,]*)'
    matches = re.findall(pattern, line)
    # Clean up quotes
    return [m.strip('"').replace('""', '"') for m in matches]

line = 'John,"Doe, Jr.",30,"New York, NY"'
print(parse_csv_line(line))  # ['John', 'Doe, Jr.', '30', 'New York, NY']
```

---

## ⚡ Performance Tips

### 1. Compile Frequently Used Patterns

```python
# Good - compile once
PHONE_PATTERN = re.compile(r"\d{3}-\d{4}")

def find_phones(texts):
    return [PHONE_PATTERN.findall(text) for text in texts]
```

### 2. Use Non-Capturing Groups

```python
# Slower - creates capture groups
re.findall(r"(https?|ftp)://(\S+)", text)

# Faster - non-capturing groups
re.findall(r"(?:https?|ftp)://\S+", text)
```

### 3. Be Specific with Character Classes

```python
# Slower - . matches everything
re.search(r"<.*>", html)

# Faster - specific negation
re.search(r"<[^>]*>", html)
```

### 4. Avoid Catastrophic Backtracking

```python
# Dangerous - exponential backtracking
pattern = r"(a+)+"  # Don't use nested quantifiers

# Safe alternatives
pattern = r"a+"     # Simple quantifier
```

### 5. Use `re.finditer()` for Large Texts

```python
# Memory-intensive for large files
matches = re.findall(pattern, huge_text)

# Memory-efficient - yields one match at a time
for match in re.finditer(pattern, huge_text):
    process(match)
```

### 6. Anchor Patterns When Possible

```python
# Slower - searches entire string
re.search(r"\d{4}-\d{2}-\d{2}", text)

# Faster - if you know it's at the start
re.match(r"\d{4}-\d{2}-\d{2}", text)
```

---

## 🎯 Interview Questions

### Basic

**Q1: What's the difference between `re.match()` and `re.search()`?**
> `match()` only checks at the beginning of the string, `search()` scans the entire string. `re.match(r"\d", "a1")` returns None, but `re.search(r"\d", "a1")` finds "1".

**Q2: Why use raw strings for regex patterns?**
> Raw strings (`r"..."`) prevent Python from interpreting backslashes as escape sequences. Without raw string, `\b` is backspace; with raw string, it's word boundary.

**Q3: How do you get all matches from a string?**
> Use `re.findall()` for a list of strings, or `re.finditer()` for an iterator of Match objects with position info.

### Intermediate

**Q4: How do you use groups in `re.sub()`?**
> Use backreferences: `\1`, `\2` for positional groups, or `\g<name>` for named groups.
> ```python
> re.sub(r"(\w+) (\w+)", r"\2 \1", "John Doe")  # "Doe John"
> ```

**Q5: What's the difference between `re.findall()` with and without groups?**
> Without groups, returns list of full matches. With groups, returns list of tuples (or strings for single group).
> ```python
> re.findall(r"\d+", "a1b2")        # ['1', '2']
> re.findall(r"(\d)(\d)", "12 34")  # [('1', '2'), ('3', '4')]
> ```

**Q6: How do you make a pattern case-insensitive?**
> Use `re.IGNORECASE` flag or inline `(?i)`:
> ```python
> re.findall(r"hello", "Hello", re.IGNORECASE)
> re.findall(r"(?i)hello", "Hello")
> ```

### Advanced

**Q7: How would you validate a complex password?**
> Use multiple lookaheads:
> ```python
> pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$"
> ```
> Each `(?=...)` asserts a requirement without consuming characters.

**Q8: How do you handle overlapping matches?**
> Use lookahead to match without consuming:
> ```python
> # Find overlapping "aba" in "ababa"
> re.findall(r"(?=(aba))", "ababa")  # ['aba', 'aba']
> ```

**Q9: How do you parse a complex log format efficiently?**
> Use named groups with `re.compile()`:
> ```python
> LOG_PATTERN = re.compile(
>     r"(?P<ip>\d+\.\d+\.\d+\.\d+)\s+"
>     r"\[(?P<time>[^\]]+)\]\s+"
>     r"\"(?P<method>\w+)\s+(?P<path>\S+)"
> )
> for match in LOG_PATTERN.finditer(log_file):
>     record = match.groupdict()
> ```

**Q10: What causes catastrophic backtracking and how to avoid it?**
> Nested quantifiers like `(a+)+` cause exponential backtracking on non-matching input. Avoid by:
> - Using atomic groups (not in Python `re`, use `regex` module)
> - Simplifying patterns
> - Using specific character classes instead of `.`
> - Testing patterns with worst-case inputs

---

## 📚 Module Reference

### Functions

| Function | Description |
|----------|-------------|
| `re.match(pattern, string)` | Match at beginning |
| `re.search(pattern, string)` | Search anywhere |
| `re.fullmatch(pattern, string)` | Match entire string |
| `re.findall(pattern, string)` | List of all matches |
| `re.finditer(pattern, string)` | Iterator of Match objects |
| `re.sub(pattern, repl, string)` | Replace matches |
| `re.subn(pattern, repl, string)` | Replace with count |
| `re.split(pattern, string)` | Split by pattern |
| `re.compile(pattern)` | Compile pattern |
| `re.escape(string)` | Escape special chars |
| `re.purge()` | Clear pattern cache |

### Match Object Attributes

| Attribute/Method | Description |
|------------------|-------------|
| `.group([n])` | Matched string or group |
| `.groups()` | Tuple of all groups |
| `.groupdict()` | Dict of named groups |
| `.start([n])` | Start index |
| `.end([n])` | End index |
| `.span([n])` | (start, end) tuple |
| `.string` | Original string |
| `.re` | Pattern object |
| `.lastindex` | Last matched group index |
| `.lastgroup` | Last matched group name |

### Flags

| Flag | Short | Description |
|------|-------|-------------|
| `re.IGNORECASE` | `re.I` | Case-insensitive |
| `re.MULTILINE` | `re.M` | `^`/`$` match lines |
| `re.DOTALL` | `re.S` | `.` matches newline |
| `re.VERBOSE` | `re.X` | Allow comments |
| `re.ASCII` | `re.A` | ASCII-only |
| `re.UNICODE` | `re.U` | Unicode (default) |

---

## 🔗 Related Topics

- [Regex 101](regex-101.md) - Regex theory and syntax fundamentals
- [SOLID Principles](../design-patterns/SOLID.md) - Design patterns for clean code

---

**Last Updated**: April 2026 | **Status**: Complete
