# Notes Template & Style Guide

This document defines the standard format for all notes in this repository. Follow this template to maintain consistency across topics.

---

## 📁 File Naming Convention

- **Standard notes**: `<topic>-notes.md` (e.g., `spark-core-notes.md`, `linux-notes.md`)
- **Concept guides**: `<topic>.md` or `<topic>-101.md` (e.g., `SOLID.md`, `regex-101.md`)
- **Module-specific**: `<language>-<module>.md` (e.g., `python-re-module.md`)
- Use **lowercase** with **hyphens** for multi-word names
- Place files in appropriate numbered directories (e.g., `01-topic-name/`)

---

## 📄 Document Structure

Every note should follow this section order. Include sections relevant to the topic; skip sections that don't apply.

```markdown
# [Emoji] Title - Category Notes

Brief 1-2 sentence description of what this document covers.

---

## 1. Introduction / Overview

- What is this topic?
- Why does it matter?
- Key use cases

---

## 2. Core Concepts

- Definitions and terminology
- Fundamental principles
- Key components

---

## 3. [Topic-Specific Sections]

Main content organized by logical subtopics.
Use ### for subsections.

---

## 4. Trade-offs and Comparisons

| Option A | Option B | When to Use |
|----------|----------|-------------|
| ... | ... | ... |

---

## 5. Practical Examples

Code snippets with explanations.
Include both good and bad examples where applicable.

---

## 6. Cheat Sheet

Quick reference bullet points or tables.

---

## 7. Hands-on Drills

Numbered exercises for practice.

---

## 8. Real-world Scenarios and Failure Modes

- Common problems and solutions
- Production gotchas
- Debugging tips

---

## 9. Interview Q&A

### Basic (Q1-Q10)
### Intermediate (Q11-Q20)
### Advanced (Q21+)

---

## 🔗 Related Topics

- [Link to related note](path/to/note.md)

---

*Last updated: Month Year*
```

---

## 🎨 Formatting Guidelines

### Headings

```markdown
# Document Title (H1) - Only one per document
## Major Sections (H2) - Numbered: 1. Introduction, 2. Core Concepts
### Subsections (H3) - Topic breakdowns
#### Sub-subsections (H4) - Use sparingly
```

### Emojis for Section Headers

Use emojis consistently for visual scanning:

| Emoji | Usage |
|-------|-------|
| 📌 | Definitions, key points |
| 🔹 | Numbered principles/items |
| ✅ | Good examples, correct approaches |
| ❌ | Bad examples, anti-patterns |
| 🚀 | Practical use cases, real-world applications |
| 💡 | Tips, insights |
| ⚠️ | Warnings, cautions |
| 🎯 | Interview focus, key takeaways |
| 📊 | Tables, comparisons |
| 🔗 | Related links |
| ⚡ | Performance, optimization |
| 🛠️ | Tools, utilities |
| 📋 | Cheat sheets, quick reference |

### Code Blocks

Always specify the language:

```markdown
```python
def example():
    return "Always specify language"
```

```bash
# Shell commands
ls -la
```

```sql
SELECT * FROM users WHERE active = true;
```

```yaml
# Configuration files
key: value
```

```text
# Plain text diagrams or output
Step 1 -> Step 2 -> Step 3
```
```

### Tables

Use tables for comparisons and quick references:

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data | Data | Data |
```

### Lists

```markdown
- **Bold title**: Description follows
- **Another item**: Keep consistent formatting

1. Numbered for sequential steps
2. Use when order matters
```

### Blockquotes

Use for definitions and key statements:

```markdown
> **A class should have only one reason to change.**
```

### Inline Formatting

- Use `backticks` for code, commands, file names, and technical terms
- Use **bold** for emphasis and key terms
- Use *italics* sparingly for introducing terms

---

## 📝 Content Guidelines

### Interview Q&A Format

```markdown
**Q1: Question text here?**
> Answer in blockquote format. Keep concise but complete.

**Q2: Another question?**
> - Can use bullet points for multi-part answers
> - Keep each point focused
```

Or for longer answers:

```markdown
**Q1: Question text here?**  
Answer directly after the question with two trailing spaces for line break.
```

### Good vs Bad Examples

```markdown
### ❌ Bad Example (Violates Principle)

```python
# Code that demonstrates the anti-pattern
```

**Problems:**
- Issue 1
- Issue 2

---

### ✅ Good Example (Follows Principle)

```python
# Code that demonstrates the correct approach
```

**Benefits:**
- Benefit 1
- Benefit 2
```

### Practical Examples

```markdown
### Example: Descriptive Title

```python
# Include comments explaining key parts
code_here()
```

**Explanation:**
- What the code does
- Why this approach
```

---

## 📂 Directory Structure

```
Notes/
├── README.md                    # Repository overview
├── NOTES_TEMPLATE.md            # This file
├── 01-category-name/
│   ├── README.md                # Category overview
│   ├── topic-name/
│   │   ├── topic-notes.md       # Main notes file
│   │   └── subtopic.md          # Additional files if needed
│   └── another-topic/
├── 02-another-category/
│   └── ...
```

### README.md for Categories

Each category directory should have a README with:
- Brief description
- Table of contents with links
- Learning path
- Interview tips specific to category

---

## ✅ Checklist Before Committing

- [ ] File follows naming convention
- [ ] Document has clear H1 title with emoji
- [ ] Sections are numbered and use `---` separators
- [ ] Code blocks specify language
- [ ] Tables are properly formatted
- [ ] Interview Q&A section included (if applicable)
- [ ] Related topics linked
- [ ] Last updated date at bottom
- [ ] Parent README updated to include new file

---

## 📋 Quick Start Template

Copy this minimal template for new notes:

```markdown
# [Emoji] Topic Name - Category Notes

Brief description of the topic and its importance.

---

## 1. Introduction

What is this topic and why does it matter?

---

## 2. Core Concepts

- **Term 1**: Definition
- **Term 2**: Definition

---

## 3. Main Content

### Subsection A

Content here.

### Subsection B

Content here.

---

## 4. Practical Examples

```python
# Example code
```

---

## 5. Cheat Sheet

| Item | Description |
|------|-------------|
| ... | ... |

---

## 6. Interview Q&A

**Q1: Basic question?**
> Answer here.

**Q2: Intermediate question?**
> Answer here.

---

## 🔗 Related Topics

- [Related Note](path/to/note.md)

---

*Last updated: Month Year*
```

---

*Last updated: May 2026*
