# 🔀 Git – DevOps Notes

---

## 1. Introduction

Git is a distributed version control system (DVCS) for tracking changes in source code. Every developer has a full copy of the repository, enabling offline work, fast operations, and robust branching.

### Key Concepts
- **Repository (repo)** – A project directory tracked by Git
- **Commit** – A snapshot of changes with metadata (author, timestamp, message)
- **Branch** – An independent line of development (pointer to a commit)
- **Remote** – A hosted repository (GitHub, GitLab, Bitbucket, Azure Repos)
- **HEAD** – A pointer to the current branch/commit
- **Working Directory** → **Staging Area (Index)** → **Local Repo** → **Remote Repo**

---

## 2. Git Configuration

```bash
# Identity (required)
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# Default branch name
git config --global init.defaultBranch main

# Editor
git config --global core.editor "code --wait"

# Useful aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.lg "log --oneline --graph --all --decorate"

# View config
git config --list
git config --global --list
```

---

## 3. Basic Git Workflow

```bash
# Initialize a new repo
git init

# Clone an existing repo
git clone https://github.com/user/repo.git
git clone git@github.com:user/repo.git     # SSH

# Check status
git status
git status -s       # Short format

# Stage changes
git add file.txt           # Single file
git add src/               # Directory
git add .                  # All changes
git add -p                 # Interactive staging (hunk-by-hunk)

# Commit
git commit -m "feat: add user authentication"
git commit -am "fix: resolve null pointer"   # Stage tracked + commit

# Push to remote
git push origin main
git push -u origin main    # Set upstream (first push)

# Pull latest changes
git pull origin main       # fetch + merge
git pull --rebase origin main  # fetch + rebase (linear history)
```

---

## 4. Branching & Merging

```bash
# Create and switch to new branch
git checkout -b feature/login
git switch -c feature/login        # Modern syntax

# List branches
git branch          # Local
git branch -r       # Remote
git branch -a       # All

# Switch branch
git checkout main
git switch main

# Rename branch
git branch -m old-name new-name

# Merge branch into main
git checkout main
git merge feature/login

# Delete branch
git branch -d feature/login              # Local (safe – merged only)
git branch -D feature/login              # Local (force)
git push origin --delete feature/login   # Remote
```

### Merge vs Rebase

```
MERGE (preserves history, creates merge commit):
  main:    A---B---C-------M
  feature:      \-D---E--/

REBASE (linear history, rewrites commits):
  Before:  main: A---B---C     feature: A---B---D---E
  After:   main: A---B---C---D'---E'

# Rebase workflow
git checkout feature/login
git rebase main              # Replay feature commits on top of main
git checkout main
git merge feature/login      # Fast-forward merge
```

### Merge Conflict Resolution
```bash
# 1. Attempt merge
git merge feature/login
# CONFLICT in file.txt

# 2. Open the file – conflict markers:
<<<<<<< HEAD
current branch code
=======
incoming branch code
>>>>>>> feature/login

# 3. Manually resolve – keep the correct code, remove markers

# 4. Stage and commit
git add file.txt
git commit -m "merge: resolve conflict in file.txt"
```

---

## 5. Git Stash

```bash
# Save uncommitted changes temporarily
git stash
git stash save "WIP: login form validation"

# Include untracked files
git stash -u

# List stashes
git stash list

# Apply latest stash
git stash pop           # Apply + remove from stash
git stash apply         # Apply + keep in stash

# Apply specific stash
git stash apply stash@{2}

# View stash contents
git stash show -p stash@{0}

# Drop / clear
git stash drop stash@{0}
git stash clear         # Remove all stashes
```

---

## 6. Git Log & History

```bash
# Basic log
git log
git log --oneline
git log --oneline --graph --all --decorate

# Filter by author, date, file
git log --author="John"
git log --since="2026-01-01" --until="2026-04-01"
git log -- src/app.js

# Show specific commit
git show abc1234

# File history
git log --follow -p file.txt

# Compare
git diff                        # Working dir vs staging
git diff --staged               # Staging vs last commit
git diff main..feature/login    # Between branches
git diff HEAD~3..HEAD           # Last 3 commits

# Blame – who changed each line
git blame file.txt
git blame -L 10,20 file.txt    # Lines 10-20 only
```

---

## 7. Undoing Changes

```bash
# Discard changes in working directory
git restore file.txt
git checkout -- file.txt        # Legacy

# Unstage a file
git restore --staged file.txt
git reset HEAD file.txt         # Legacy

# Amend last commit (message or add files)
git add forgotten-file.txt
git commit --amend -m "updated commit message"

# Reset (move HEAD backward)
git reset --soft HEAD~1         # Undo commit, keep changes staged
git reset --mixed HEAD~1        # Undo commit, keep changes unstaged (default)
git reset --hard HEAD~1         # Undo commit, discard all changes

# Revert (safe – creates a new "undo" commit)
git revert <commit-hash>
git revert HEAD                 # Revert last commit

# Recover lost commits
git reflog                      # View history of HEAD movements
git reset --hard <reflog-hash>  # Restore to that point
```

---

## 8. Git Tags

```bash
# Lightweight tag
git tag v1.0.0

# Annotated tag (recommended – includes metadata)
git tag -a v1.0.0 -m "Release version 1.0.0"

# Tag a specific commit
git tag -a v0.9.0 abc1234 -m "Beta release"

# Push tags
git push origin v1.0.0
git push origin --tags          # All tags

# List tags
git tag
git tag -l "v1.*"

# View tag details
git show v1.0.0

# Delete tag
git tag -d v1.0.0               # Local
git push origin --delete v1.0.0 # Remote
```

---

## 9. Git Workflows

### Git Flow
```
main       ─────────────────────────────── (stable releases)
              \             /
develop    ────●──────●────● ────────── (integration branch)
                \    /
feature    ──────●──●                   (new features)

Branches: main, develop, feature/*, release/*, hotfix/*
Best for: Projects with scheduled releases
```

### GitHub Flow (Simplified)
```
1. Create branch from main
2. Make changes, commit
3. Open Pull Request
4. Code review + CI checks
5. Merge to main
6. Deploy from main

Best for: Continuous deployment, web applications
```

### Trunk-Based Development
```
main ──●──●──●──●──●──●──  (all commits here)
         \  /
short-lived branches (< 1 day)

Best for: Teams practicing CI/CD, feature flags
```

### GitOps Workflow
```
1. Developer pushes code → app repo
2. CI builds image, pushes to registry
3. Developer/CI updates manifest in config repo
4. ArgoCD/Flux detects change → deploys to cluster
```

---

## 10. Advanced Git

### Cherry-pick
```bash
# Apply a specific commit to current branch
git cherry-pick <commit-hash>
git cherry-pick abc1234 def5678  # Multiple commits
git cherry-pick --no-commit <hash>  # Stage without committing
```

### Interactive Rebase
```bash
# Rewrite last 5 commits
git rebase -i HEAD~5

# Options in editor:
# pick   – keep commit
# reword – change commit message
# edit   – pause to amend
# squash – merge into previous commit
# fixup  – merge silently (discard message)
# drop   – remove commit
```

### Submodules
```bash
# Add a submodule
git submodule add https://github.com/lib/util.git libs/util

# Clone repo with submodules
git clone --recurse-submodules https://github.com/user/repo.git

# Update submodules
git submodule update --init --recursive
```

### .gitignore
```bash
# Common patterns
*.log
*.tmp
*.env
node_modules/
dist/
build/
__pycache__/
*.pyc
.terraform/
*.tfstate
*.tfstate.backup
.idea/
.vscode/
*.class
target/
```

### Hooks
```bash
# Client-side hooks (in .git/hooks/)
pre-commit      # Run linters, tests before commit
commit-msg      # Validate commit message format
pre-push        # Run tests before push

# Example pre-commit hook (.git/hooks/pre-commit)
#!/bin/bash
npm run lint
if [ $? -ne 0 ]; then
    echo "Lint failed. Fix errors before committing."
    exit 1
fi
```

---

## 11. Cheat Sheet

| Command | Purpose |
|---------|---------|
| `git init` | Initialize new repository |
| `git clone <url>` | Clone remote repo |
| `git status` | Show working tree status |
| `git add .` | Stage all changes |
| `git commit -m "msg"` | Commit with message |
| `git push origin main` | Push to remote |
| `git pull origin main` | Pull from remote |
| `git branch -a` | List all branches |
| `git checkout -b <name>` | Create + switch branch |
| `git merge <branch>` | Merge branch into current |
| `git rebase main` | Rebase onto main |
| `git stash` | Stash uncommitted changes |
| `git stash pop` | Apply + remove stash |
| `git log --oneline --graph` | Visual log |
| `git diff` | Show unstaged changes |
| `git reset --hard HEAD~1` | Undo last commit (destructive) |
| `git revert <hash>` | Undo commit (safe) |
| `git cherry-pick <hash>` | Apply specific commit |
| `git tag -a v1.0 -m "msg"` | Create annotated tag |
| `git reflog` | Recovery – view HEAD history |
| `git blame file.txt` | Show line-by-line authorship |
| `git bisect start` | Binary search for bug |

---

## 12. Hands-on Labs

### Lab 1: Simulate and Resolve a Merge Conflict
```bash
# Step 1: Initialize repo with a file
mkdir git-lab && cd git-lab
git init
echo "Hello World" > greeting.txt
git add . && git commit -m "initial commit"

# Step 2: Create two branches modifying the same line
git checkout -b branch-a
echo "Hello from Branch A" > greeting.txt
git add . && git commit -m "branch-a change"

git checkout main
git checkout -b branch-b
echo "Hello from Branch B" > greeting.txt
git add . && git commit -m "branch-b change"

# Step 3: Merge branch-a into main
git checkout main
git merge branch-a   # Fast-forward, no conflict

# Step 4: Merge branch-b into main (CONFLICT!)
git merge branch-b
# Auto-merging greeting.txt → CONFLICT

# Step 5: Resolve
# Edit greeting.txt – choose the correct content
echo "Hello from both branches" > greeting.txt
git add greeting.txt
git commit -m "merge: resolved conflict in greeting.txt"
```

### Lab 2: Interactive Rebase – Squash Commits
```bash
# Step 1: Make several small commits
echo "line 1" >> notes.txt && git add . && git commit -m "add line 1"
echo "line 2" >> notes.txt && git add . && git commit -m "add line 2"
echo "line 3" >> notes.txt && git add . && git commit -m "add line 3"
echo "line 4" >> notes.txt && git add . && git commit -m "add line 4"

# Step 2: Squash last 4 commits into 1
git rebase -i HEAD~4
# In editor: change "pick" to "squash" for commits 2-4
# Save → edit combined commit message

# Step 3: Verify
git log --oneline
# Should show single commit instead of 4
```

### Lab 3: Production Hotfix Workflow (Git Flow)
```bash
# Step 1: You're on main (production). Bug reported!
git checkout main

# Step 2: Create hotfix branch
git checkout -b hotfix/fix-login-bug

# Step 3: Fix the bug
echo "fixed login validation" > login.py
git add . && git commit -m "hotfix: fix login validation bug"

# Step 4: Merge to main and tag
git checkout main
git merge hotfix/fix-login-bug
git tag -a v1.0.1 -m "Hotfix: login bug"
git push origin main --tags

# Step 5: Merge to develop (if using Git Flow)
git checkout develop
git merge hotfix/fix-login-bug

# Step 6: Cleanup
git branch -d hotfix/fix-login-bug
```

### Lab 4: Git Bisect – Find the Bug-introducing Commit
```bash
# Step 1: Start bisect
git bisect start
git bisect bad                 # Current commit is broken
git bisect good <known-good-hash>  # Last known working commit

# Step 2: Git checks out a middle commit
# Test the code, then:
git bisect good   # If this commit works
git bisect bad    # If this commit is broken

# Step 3: Repeat until Git identifies the first bad commit

# Step 4: Reset
git bisect reset
```

---

## 13. Real-world Scenarios

### Scenario 1: Accidental Commit to Main (Protected Branch)

**Situation:** A developer committed directly to `main` instead of a feature branch.

**Solution:**
```bash
# Option 1: Move the commit to a new branch
git branch feature/accidental-work   # Create branch at current HEAD
git reset --hard HEAD~1              # Move main back one commit
git push origin main --force-with-lease  # Update remote main
git checkout feature/accidental-work
git push -u origin feature/accidental-work
# Open a PR

# Option 2: Revert on main (safer for shared branches)
git revert HEAD
git push origin main
```

### Scenario 2: Recover Deleted Branch

**Situation:** A branch was accidentally deleted before merging.

**Solution:**
```bash
# Step 1: Find the last commit of the deleted branch
git reflog | grep "feature/important"
# or
git log --walk-reflogs --all | grep "feature/important"

# Step 2: Recreate the branch
git checkout -b feature/important <commit-hash>

# Step 3: Push if needed
git push -u origin feature/important
```

### Scenario 3: Large File Committed by Mistake

**Situation:** A 500MB file was committed and pushed, now pushes are slow.

**Solution:**
```bash
# Option 1: Remove from history with git filter-repo (recommended)
pip install git-filter-repo
git filter-repo --path large-file.zip --invert-paths

# Option 2: BFG Repo Cleaner
java -jar bfg.jar --strip-blobs-bigger-than 50M
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Prevention: Add to .gitignore and use Git LFS
git lfs track "*.zip"
git lfs track "*.tar.gz"
```

---

## 14. Interview Q&A (50 Questions)

### Basic (1–15)

**Q1: What is Git?**
> A distributed version control system that tracks changes in source code, enabling multiple developers to collaborate. Each developer has a full copy of the repository.

**Q2: What is the difference between Git and GitHub?**
> **Git** is a version control tool (CLI/local). **GitHub** is a cloud platform for hosting Git repositories with collaboration features (PRs, issues, Actions, wikis).

**Q3: What is `git clone` vs `git fork`?**
> `git clone` copies a repo to your local machine. Fork (GitHub feature) creates a copy of a repo under your GitHub account for independent development, typically used in open-source.

**Q4: What is the staging area (index)?**
> An intermediate area between the working directory and the repository where changes are collected before committing. Files move: working dir → `git add` → staging → `git commit` → repo.

**Q5: How do you check the current branch?**
> `git branch` (lists all, current marked with `*`) or `git branch --show-current`.

**Q6: What is `git pull` vs `git fetch`?**
> `git fetch` downloads remote changes without merging them. `git pull` = `git fetch` + `git merge` (or `git rebase` with `--rebase` flag).

**Q7: What is a merge conflict?**
> Occurs when two branches modify the same lines in a file, and Git cannot automatically determine which change to keep. Must be resolved manually.

**Q8: How do you resolve a merge conflict?**
> 1) Open conflicted files 2) Find `<<<<<<<`, `=======`, `>>>>>>>` markers 3) Choose correct code, remove markers 4) `git add` resolved files 5) `git commit`.

**Q9: What is `HEAD` in Git?**
> A pointer to the current commit on the active branch. `HEAD~1` = one commit before, `HEAD~3` = three commits before. Detached HEAD means pointing to a commit, not a branch.

**Q10: What is `.gitignore`?**
> A file that specifies patterns of files/directories Git should ignore (not track). Example: `node_modules/`, `*.log`, `.env`.

**Q11: What is `git stash`?**
> Temporarily saves uncommitted changes (working dir + staging) so you can switch branches. Restore with `git stash pop`.

**Q12: What is the difference between `git merge` and `git rebase`?**
> **Merge** creates a merge commit and preserves branch history. **Rebase** replays commits on top of another branch, creating linear history. Never rebase public/shared branches.

**Q13: What is a bare repository?**
> A repository without a working directory—only the `.git` folder contents. Used as a central/shared repository (what GitHub hosts). Create with `git init --bare`.

**Q14: What is `git remote`?**
> A reference to a hosted repository. `origin` is the default name for the remote you cloned from. `git remote -v` lists all remotes.

**Q15: What are Git tags and when do you use them?**
> Tags mark specific commits as important milestones (releases). **Lightweight:** Just a pointer. **Annotated:** Includes metadata (tagger, date, message). Use for versioning: `v1.0.0`.

### Intermediate (16–35)

**Q16: What is `git cherry-pick`?**
> Applies a specific commit from one branch to another without merging the entire branch. `git cherry-pick <hash>`. Useful for applying a hotfix to multiple branches.

**Q17: Explain `git reset --soft`, `--mixed`, `--hard`.**
> **`--soft`:** Moves HEAD, keeps changes staged. **`--mixed`** (default): Moves HEAD, keeps changes unstaged. **`--hard`:** Moves HEAD, discards all changes. Use `--hard` with caution.

**Q18: What is `git revert` vs `git reset`?**
> **Revert** creates a new commit that undoes changes (safe for shared branches). **Reset** moves HEAD backward (rewrites history—dangerous for shared branches).

**Q19: What is `git reflog`?**
> A log of all HEAD movements (commits, resets, checkouts, rebases). Useful for recovering lost commits after a bad reset or deleted branch. Entries expire after 90 days.

**Q20: What is a detached HEAD?**
> When HEAD points directly to a commit instead of a branch. Happens when you `checkout` a specific commit or tag. Any new commits won't belong to a branch unless you create one.

**Q21: What is `git bisect`?**
> A binary search tool to find the commit that introduced a bug. `git bisect start` → mark `good`/`bad` → Git narrows down to the offending commit in O(log n) steps.

**Q22: What is `git rebase -i` (interactive rebase)?**
> Allows rewriting commit history: reorder, squash, edit messages, drop commits. `git rebase -i HEAD~5` opens an editor for the last 5 commits.

**Q23: What is a Git hook?**
> Scripts that run automatically at certain Git events: `pre-commit`, `commit-msg`, `pre-push`, `post-merge`. Located in `.git/hooks/`. Used for linting, testing, formatting.

**Q24: What is `git submodule`?**
> A way to include one Git repository inside another as a subdirectory. Useful for shared libraries. Each has its own history. Update with `git submodule update --init --recursive`.

**Q25: What is squash merge?**
> Combining all commits from a feature branch into a single commit when merging. `git merge --squash feature`. Creates a cleaner main branch history.

**Q26: What is `git blame`?**
> Shows who last modified each line of a file and when. `git blame file.txt`. Useful for understanding code history and finding who introduced a change.

**Q27: What is fast-forward merge?**
> When the target branch has no new commits since the source branch was created, Git simply moves the pointer forward. No merge commit is created. Disable with `git merge --no-ff`.

**Q28: How do you undo a pushed commit?**
> **Safe:** `git revert <hash>` then `git push`. **Destructive (if needed):** `git reset --hard HEAD~1` then `git push --force-with-lease` (never on shared branches without coordination).

**Q29: What is `git stash pop` vs `git stash apply`?**
> **`pop`:** Applies the stash and removes it from the stash list. **`apply`:** Applies the stash but keeps it in the list (can be applied again).

**Q30: What is Git LFS?**
> Git Large File Storage—replaces large files (videos, datasets, binaries) with text pointers while storing actual files on a remote server. Keeps repo size small.

**Q31: What is `--force-with-lease` vs `--force`?**
> Both force push. `--force` overwrites blindly. `--force-with-lease` only overwrites if the remote hasn't changed since your last fetch (safer—prevents overwriting others' work).

**Q32: What is a monorepo vs polyrepo?**
> **Monorepo:** All projects in a single repository (Google, Meta). **Polyrepo:** Each project in its own repository. Monorepo: easier sharing; Polyrepo: simpler isolation.

**Q33: What is the difference between `git pull --rebase` and `git pull`?**
> `git pull` = fetch + merge (creates merge commit). `git pull --rebase` = fetch + rebase (linear history, replays your commits on top). Rebase is preferred for a clean history.

**Q34: What is a signed commit?**
> A commit verified with a GPG/SSH key to prove the author's identity. `git commit -S`. GitHub shows "Verified" badge. Configure: `git config --global commit.gpgsign true`.

**Q35: How do you configure branch protection rules?**
> In GitHub/GitLab settings: require PR reviews, require status checks (CI) to pass, prevent force pushes, require signed commits, require linear history. Protects important branches.

### Advanced (36–50)

**Q36: How do you migrate a large SVN repository to Git?**
> Use `git svn clone` with authors mapping: `git svn clone --stdlayout --authors-file=authors.txt svn://server/repo`. Then clean up: remove SVN metadata, set up Git remotes, push.

**Q37: How do you handle a repository with sensitive data in history?**
> 1) Use `git filter-repo` or BFG Repo Cleaner to remove sensitive files from all history. 2) Force push all branches. 3) Rotate exposed credentials immediately. 4) All collaborators must re-clone.

**Q38: What is the Git object model?**
> Git stores 4 types of objects: **Blob** (file contents), **Tree** (directory listing), **Commit** (snapshot + metadata + parent), **Tag** (annotated tag object). All identified by SHA-1 hash.

**Q39: What is `git worktree`?**
> Allows multiple working directories from a single repository. `git worktree add ../hotfix hotfix-branch`. You can work on multiple branches simultaneously without stashing.

**Q40: What is `git rerere`?**
> "Reuse Recorded Resolution"—records how you resolved conflicts and automatically applies the same resolution if the same conflict occurs again. Enable: `git config --global rerere.enabled true`.

**Q41: How do you reduce Git repository size?**
> 1) `git gc --aggressive --prune=now` 2) Remove large/unnecessary files with `git filter-repo` 3) Use Git LFS for binary files 4) Remove old branches 5) Use shallow clones for CI

**Q42: What is a shallow clone?**
> `git clone --depth=1` clones only the latest commit(s), not full history. Faster for CI/CD. Convert to full: `git fetch --unshallow`.

**Q43: What is `git sparse-checkout`?**
> Allows checking out only specific directories from a large repo. `git sparse-checkout set src/ docs/`. Useful for monorepos where you only need part of the code.

**Q44: How does Git handle binary files?**
> Git stores full copies of binary files (not diffs), which bloats the repo. Solution: Use Git LFS to store binaries externally. Use `.gitattributes` to configure LFS tracking.

**Q45: What is the difference between `origin/main` and `main`?**
> `main` = local branch. `origin/main` = remote tracking branch (read-only snapshot of the remote's main). Updated by `git fetch`. You work on `main` and push/pull to sync with `origin/main`.

**Q46: What is commit signing with SSH keys?**
> Git 2.34+ supports SSH-based commit signing (alternative to GPG). Configure: `git config gpg.format ssh` + `git config user.signingkey ~/.ssh/id_ed25519.pub`. Simpler than GPG setup.

**Q47: How do you manage multiple Git identities?**
> Use conditional config: In `~/.gitconfig`: `[includeIf "gitdir:~/work/"]` → `path = ~/.gitconfig-work`. This loads different name/email based on the repo's directory.

**Q48: What is `git notes`?**
> Allows adding metadata to commits without changing the commit hash. `git notes add -m "Reviewed by QA" HEAD`. Useful for attaching review notes, test results, etc.

**Q49: How do you enforce commit message conventions?**
> 1) Git hooks (`commit-msg` hook with regex validation) 2) Tools like `commitlint` with `husky` 3) CI checks on PR. Convention: `type(scope): message` (Conventional Commits).

**Q50: What is `git replace` and `git grafts`?**
> `git replace` creates a replacement object that Git transparently uses instead of the original. `grafts` (deprecated, use `replace`) modify parent relationships. Use case: joining two repositories' histories.

---

*Last updated: April 2026*
