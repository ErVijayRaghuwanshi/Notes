# 🎭 Playwright - End-to-End Testing Notes

A comprehensive guide to Playwright, Microsoft's modern end-to-end testing framework for web applications. Covers Python and JavaScript/TypeScript APIs.

---

## 1. Introduction

### What is Playwright?

Playwright is an open-source automation library developed by Microsoft for browser testing and web scraping. It supports Chromium, Firefox, and WebKit with a single API.

### Why Playwright?

- **Cross-browser**: Single API for Chrome, Firefox, Safari (WebKit), and Edge
- **Auto-wait**: Automatically waits for elements to be actionable
- **Reliable**: No flaky tests due to built-in retry and wait mechanisms
- **Fast**: Parallel execution, browser contexts for isolation
- **Modern**: Supports modern web features (Shadow DOM, iframes, file uploads)
- **Multi-language**: Python, JavaScript, TypeScript, Java, .NET

### Use Cases

- End-to-end testing of web applications
- Visual regression testing
- API testing alongside UI tests
- Web scraping and automation
- PDF generation and screenshots
- Performance testing

---

## 2. Core Concepts

### Key Components

| Component | Description |
|-----------|-------------|
| **Browser** | Browser instance (Chromium, Firefox, WebKit) |
| **BrowserContext** | Isolated browser session (like incognito) |
| **Page** | Single tab or popup window |
| **Locator** | Element finder with auto-wait and retry |
| **Frame** | iframe or frame within a page |
| **Request/Response** | Network interception capabilities |

### Architecture

```text
Playwright
    │
    ├── Browser (Chromium/Firefox/WebKit)
    │       │
    │       ├── BrowserContext (isolated session)
    │       │       │
    │       │       ├── Page (tab)
    │       │       │     ├── Locators
    │       │       │     ├── Frames
    │       │       │     └── Network
    │       │       │
    │       │       └── Page (another tab)
    │       │
    │       └── BrowserContext (another session)
    │
    └── Browser (another browser type)
```

### Locator Strategies (Priority Order)

1. **Role-based** (recommended): `get_by_role("button", name="Submit")`
2. **Text-based**: `get_by_text("Welcome")`, `get_by_label("Email")`
3. **Test ID**: `get_by_test_id("submit-btn")`
4. **CSS/XPath** (last resort): `locator("css=.btn")`, `locator("xpath=//button")`

---

## 3. Installation & Setup

### Python

```bash
# Install Playwright
pip install playwright

# Install browsers
playwright install

# Install specific browser
playwright install chromium
playwright install firefox
playwright install webkit

# Install with dependencies (Linux)
playwright install --with-deps
```

### JavaScript/TypeScript

```bash
# npm
npm init playwright@latest

# Or manual install
npm install -D @playwright/test
npx playwright install
```

### Project Structure

```
project/
├── tests/
│   ├── test_login.py
│   ├── test_checkout.py
│   └── conftest.py          # Pytest fixtures
├── pages/                    # Page Object Models
│   ├── login_page.py
│   └── dashboard_page.py
├── playwright.config.ts      # JS/TS config
├── pytest.ini               # Python config
└── requirements.txt
```

---

## 4. Python API

### Basic Test Structure

```python
import pytest
from playwright.sync_api import Page, expect

def test_homepage_title(page: Page):
    page.goto("https://example.com")
    expect(page).to_have_title("Example Domain")

def test_login_flow(page: Page):
    page.goto("https://example.com/login")
    
    # Fill form
    page.get_by_label("Email").fill("user@example.com")
    page.get_by_label("Password").fill("password123")
    page.get_by_role("button", name="Sign In").click()
    
    # Assert
    expect(page.get_by_text("Welcome")).to_be_visible()
```

### Async API

```python
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()
        
        await page.goto("https://example.com")
        print(await page.title())
        
        await browser.close()

asyncio.run(main())
```

### Sync API

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    
    page.goto("https://example.com")
    print(page.title())
    
    browser.close()
```

### Pytest Fixtures (conftest.py)

```python
import pytest
from playwright.sync_api import Page, Browser, BrowserContext

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "viewport": {"width": 1920, "height": 1080},
        "ignore_https_errors": True,
    }

@pytest.fixture
def authenticated_page(page: Page) -> Page:
    """Pre-authenticated page fixture."""
    page.goto("https://example.com/login")
    page.get_by_label("Email").fill("test@example.com")
    page.get_by_label("Password").fill("password")
    page.get_by_role("button", name="Login").click()
    page.wait_for_url("**/dashboard")
    return page
```

---

## 5. Locators & Selectors

### Recommended Locators

```python
# By role (most reliable)
page.get_by_role("button", name="Submit")
page.get_by_role("link", name="Home")
page.get_by_role("textbox", name="Email")
page.get_by_role("checkbox", name="Remember me")
page.get_by_role("heading", name="Welcome", level=1)

# By label (for form fields)
page.get_by_label("Email address")
page.get_by_label("Password")

# By placeholder
page.get_by_placeholder("Enter your email")

# By text
page.get_by_text("Welcome back")
page.get_by_text("Submit", exact=True)  # Exact match

# By alt text (images)
page.get_by_alt_text("Company logo")

# By title attribute
page.get_by_title("Close dialog")

# By test ID (add data-testid to HTML)
page.get_by_test_id("submit-button")
```

### CSS & XPath (When Needed)

```python
# CSS selectors
page.locator("css=button.primary")
page.locator(".login-form input[type='email']")
page.locator("#submit-btn")

# XPath
page.locator("xpath=//button[contains(text(), 'Submit')]")
page.locator("//div[@class='card']//h2")

# Combining locators
page.locator("article").filter(has_text="Playwright").locator("button")
```

### Locator Filtering

```python
# Filter by text
page.get_by_role("listitem").filter(has_text="Product 1")

# Filter by another locator
page.get_by_role("listitem").filter(
    has=page.get_by_role("button", name="Add to cart")
)

# Filter by not having
page.get_by_role("listitem").filter(has_not_text="Out of stock")

# Nth element
page.get_by_role("listitem").nth(0)  # First
page.get_by_role("listitem").first
page.get_by_role("listitem").last
```

---

## 6. Actions & Interactions

### Click Actions

```python
# Basic click
page.get_by_role("button", name="Submit").click()

# Double click
page.locator("#item").dblclick()

# Right click
page.locator("#item").click(button="right")

# Shift + click
page.locator("#item").click(modifiers=["Shift"])

# Click at position
page.locator("#canvas").click(position={"x": 100, "y": 200})

# Force click (bypass actionability checks)
page.locator("#hidden-btn").click(force=True)
```

### Form Interactions

```python
# Text input
page.get_by_label("Email").fill("user@example.com")
page.get_by_label("Email").clear()
page.get_by_label("Search").press_sequentially("playwright", delay=100)

# Checkbox
page.get_by_label("Accept terms").check()
page.get_by_label("Accept terms").uncheck()
page.get_by_label("Accept terms").set_checked(True)

# Radio button
page.get_by_label("Option A").check()

# Select dropdown
page.get_by_label("Country").select_option("US")
page.get_by_label("Country").select_option(label="United States")
page.get_by_label("Country").select_option(index=2)

# Multi-select
page.locator("select#colors").select_option(["red", "blue", "green"])

# File upload
page.get_by_label("Upload").set_input_files("file.pdf")
page.get_by_label("Upload").set_input_files(["file1.pdf", "file2.pdf"])
page.get_by_label("Upload").set_input_files([])  # Clear
```

### Keyboard Actions

```python
# Press key
page.keyboard.press("Enter")
page.keyboard.press("Control+A")
page.keyboard.press("Meta+C")  # Cmd+C on Mac

# Type text
page.keyboard.type("Hello World")

# Key combinations on element
page.get_by_label("Search").press("Enter")
page.locator("body").press("Control+F")
```

### Mouse Actions

```python
# Hover
page.get_by_text("Menu").hover()

# Drag and drop
page.locator("#source").drag_to(page.locator("#target"))

# Manual drag
page.mouse.move(100, 200)
page.mouse.down()
page.mouse.move(300, 400)
page.mouse.up()
```

---

## 7. Assertions & Expectations

### Page Assertions

```python
from playwright.sync_api import expect

# Title
expect(page).to_have_title("Dashboard")
expect(page).to_have_title(re.compile(r".*Dashboard.*"))

# URL
expect(page).to_have_url("https://example.com/dashboard")
expect(page).to_have_url(re.compile(r".*/dashboard.*"))
```

### Locator Assertions

```python
locator = page.get_by_role("button", name="Submit")

# Visibility
expect(locator).to_be_visible()
expect(locator).to_be_hidden()
expect(locator).not_to_be_visible()

# Enabled/Disabled
expect(locator).to_be_enabled()
expect(locator).to_be_disabled()

# Checked (checkbox/radio)
expect(locator).to_be_checked()
expect(locator).not_to_be_checked()

# Text content
expect(locator).to_have_text("Submit Form")
expect(locator).to_have_text(re.compile(r"Submit.*"))
expect(locator).to_contain_text("Submit")

# Attribute
expect(locator).to_have_attribute("type", "submit")
expect(locator).to_have_class("btn-primary")
expect(locator).to_have_id("submit-btn")

# Value (input fields)
expect(page.get_by_label("Email")).to_have_value("user@example.com")
expect(page.get_by_label("Email")).to_be_empty()

# Count
expect(page.get_by_role("listitem")).to_have_count(5)

# CSS
expect(locator).to_have_css("color", "rgb(255, 0, 0)")

# Focus
expect(locator).to_be_focused()
```

### Soft Assertions

```python
# Continue test even if assertion fails
expect(locator).to_be_visible(timeout=1000)  # Soft with short timeout

# In pytest-playwright, use soft assertions
from playwright.sync_api import expect

def test_multiple_checks(page: Page):
    page.goto("https://example.com")
    
    # All assertions run, failures collected at end
    expect(page.get_by_text("Header")).to_be_visible()
    expect(page.get_by_text("Footer")).to_be_visible()
    expect(page.get_by_role("button")).to_have_count(3)
```

---

## 8. Waiting Strategies

### Auto-Wait (Built-in)

Playwright automatically waits for:
- Element to be attached to DOM
- Element to be visible
- Element to be stable (not animating)
- Element to be enabled
- Element to receive events

### Explicit Waits

```python
# Wait for element
page.get_by_role("button").wait_for(state="visible")
page.get_by_role("button").wait_for(state="hidden")
page.get_by_role("button").wait_for(state="attached")
page.get_by_role("button").wait_for(state="detached")

# Wait for URL
page.wait_for_url("**/dashboard")
page.wait_for_url(re.compile(r".*/dashboard.*"))

# Wait for load state
page.wait_for_load_state("domcontentloaded")
page.wait_for_load_state("load")
page.wait_for_load_state("networkidle")

# Wait for function
page.wait_for_function("document.querySelector('#app').innerText.includes('Ready')")

# Wait for response
with page.expect_response("**/api/users") as response_info:
    page.get_by_role("button", name="Load").click()
response = response_info.value

# Wait for navigation
with page.expect_navigation():
    page.get_by_role("link", name="Dashboard").click()

# Wait for download
with page.expect_download() as download_info:
    page.get_by_text("Download").click()
download = download_info.value
download.save_as("./downloads/file.pdf")

# Wait for popup
with page.expect_popup() as popup_info:
    page.get_by_text("Open Window").click()
popup = popup_info.value

# Timeout
page.get_by_role("button").click(timeout=10000)  # 10 seconds
```

---

## 9. Network Interception

### Monitor Requests

```python
# Listen to all requests
page.on("request", lambda req: print(f">> {req.method} {req.url}"))
page.on("response", lambda res: print(f"<< {res.status} {res.url}"))

# Wait for specific request
with page.expect_request("**/api/login") as request_info:
    page.get_by_role("button", name="Login").click()
request = request_info.value
print(request.post_data)

# Wait for response
with page.expect_response("**/api/users") as response_info:
    page.get_by_role("button", name="Load").click()
response = response_info.value
print(response.json())
```

### Mock API Responses

```python
# Mock single route
page.route("**/api/users", lambda route: route.fulfill(
    status=200,
    content_type="application/json",
    body='[{"id": 1, "name": "John"}]'
))

# Mock with JSON file
page.route("**/api/users", lambda route: route.fulfill(
    path="./mocks/users.json"
))

# Modify response
def handle_route(route):
    response = route.fetch()
    body = response.json()
    body["modified"] = True
    route.fulfill(response=response, json=body)

page.route("**/api/data", handle_route)

# Abort requests
page.route("**/*.png", lambda route: route.abort())
page.route("**/analytics/*", lambda route: route.abort())

# Continue with modifications
page.route("**/api/*", lambda route: route.continue_(
    headers={**route.request.headers, "X-Custom": "value"}
))
```

### Block Resources

```python
# Block images, fonts, etc.
page.route("**/*.{png,jpg,jpeg,gif,svg}", lambda route: route.abort())
page.route("**/*", lambda route: 
    route.abort() if route.request.resource_type == "image" else route.continue_()
)
```

---

## 10. Page Object Model

### Base Page

```python
# pages/base_page.py
from playwright.sync_api import Page, expect

class BasePage:
    def __init__(self, page: Page):
        self.page = page
    
    def navigate(self, path: str = ""):
        self.page.goto(f"https://example.com{path}")
    
    def get_title(self) -> str:
        return self.page.title()
    
    def wait_for_page_load(self):
        self.page.wait_for_load_state("networkidle")
```

### Login Page

```python
# pages/login_page.py
from playwright.sync_api import Page, expect
from pages.base_page import BasePage

class LoginPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        self.email_input = page.get_by_label("Email")
        self.password_input = page.get_by_label("Password")
        self.submit_button = page.get_by_role("button", name="Sign In")
        self.error_message = page.get_by_role("alert")
    
    def navigate(self):
        super().navigate("/login")
    
    def login(self, email: str, password: str):
        self.email_input.fill(email)
        self.password_input.fill(password)
        self.submit_button.click()
    
    def expect_error(self, message: str):
        expect(self.error_message).to_have_text(message)
    
    def expect_logged_in(self):
        expect(self.page).to_have_url("**/dashboard")
```

### Dashboard Page

```python
# pages/dashboard_page.py
from playwright.sync_api import Page, expect
from pages.base_page import BasePage

class DashboardPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        self.welcome_message = page.get_by_role("heading", name="Welcome")
        self.logout_button = page.get_by_role("button", name="Logout")
        self.nav_items = page.get_by_role("navigation").get_by_role("link")
    
    def expect_welcome_message(self, username: str):
        expect(self.welcome_message).to_contain_text(username)
    
    def logout(self):
        self.logout_button.click()
    
    def navigate_to(self, section: str):
        self.nav_items.filter(has_text=section).click()
```

### Using Page Objects in Tests

```python
# tests/test_login.py
import pytest
from playwright.sync_api import Page
from pages.login_page import LoginPage
from pages.dashboard_page import DashboardPage

def test_successful_login(page: Page):
    login_page = LoginPage(page)
    login_page.navigate()
    login_page.login("user@example.com", "password123")
    
    dashboard = DashboardPage(page)
    dashboard.expect_welcome_message("user")

def test_invalid_credentials(page: Page):
    login_page = LoginPage(page)
    login_page.navigate()
    login_page.login("user@example.com", "wrongpassword")
    login_page.expect_error("Invalid credentials")

@pytest.fixture
def logged_in_page(page: Page) -> DashboardPage:
    login_page = LoginPage(page)
    login_page.navigate()
    login_page.login("user@example.com", "password123")
    return DashboardPage(page)

def test_logout(logged_in_page: DashboardPage):
    logged_in_page.logout()
    expect(logged_in_page.page).to_have_url("**/login")
```

---

## 11. Configuration

### Python (pytest.ini / pyproject.toml)

```ini
# pytest.ini
[pytest]
addopts = --headed --browser chromium --slowmo 100
testpaths = tests
```

```toml
# pyproject.toml
[tool.pytest.ini_options]
addopts = "--headed --browser chromium"
testpaths = ["tests"]

[tool.playwright]
browser = "chromium"
headless = false
```

### JavaScript/TypeScript (playwright.config.ts)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 2,
  workers: 4,
  
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'results.json' }],
  ],
  
  use: {
    baseURL: 'https://example.com',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
```

### Environment Variables

```bash
# Headless mode
PWHEADLESS=0 pytest  # Run headed

# Browser
PWBROWSER=firefox pytest

# Slow motion
PWSLOWMO=500 pytest  # 500ms delay between actions

# Debug
PWDEBUG=1 pytest  # Opens inspector
```

---

## 12. Running Tests

### Python Commands

```bash
# Run all tests
pytest

# Run specific file
pytest tests/test_login.py

# Run specific test
pytest tests/test_login.py::test_successful_login

# Run with markers
pytest -m "smoke"
pytest -m "not slow"

# Parallel execution
pytest -n 4  # Requires pytest-xdist

# Browser selection
pytest --browser chromium
pytest --browser firefox
pytest --browser webkit
pytest --browser chromium --browser firefox  # Multiple

# Headed mode
pytest --headed

# Slow motion
pytest --slowmo 500

# Debug mode
PWDEBUG=1 pytest

# Generate report
pytest --html=report.html
```

### JavaScript Commands

```bash
# Run all tests
npx playwright test

# Run specific file
npx playwright test tests/login.spec.ts

# Run specific test
npx playwright test -g "successful login"

# Run in headed mode
npx playwright test --headed

# Run specific browser
npx playwright test --project=chromium

# Debug mode
npx playwright test --debug

# UI mode
npx playwright test --ui

# Generate report
npx playwright show-report
```

---

## 13. Screenshots & Videos

### Screenshots

```python
# Full page screenshot
page.screenshot(path="screenshot.png", full_page=True)

# Element screenshot
page.get_by_role("article").screenshot(path="article.png")

# Screenshot on failure (in conftest.py)
@pytest.fixture(autouse=True)
def screenshot_on_failure(page: Page, request):
    yield
    if request.node.rep_call.failed:
        page.screenshot(path=f"screenshots/{request.node.name}.png")
```

### Videos

```python
# Enable video recording
@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "record_video_dir": "videos/",
        "record_video_size": {"width": 1280, "height": 720}
    }

# Save video after test
def test_with_video(page: Page):
    page.goto("https://example.com")
    # ... test actions
    page.close()  # Video saved on close
```

### Tracing

```python
# Start tracing
context.tracing.start(screenshots=True, snapshots=True, sources=True)

# ... run test

# Stop and save trace
context.tracing.stop(path="trace.zip")

# View trace
# playwright show-trace trace.zip
```

---

## 14. Advanced Features

### Multiple Contexts (Parallel Sessions)

```python
def test_multi_user_chat(browser):
    # User 1
    context1 = browser.new_context()
    page1 = context1.new_page()
    page1.goto("https://chat.example.com")
    
    # User 2
    context2 = browser.new_context()
    page2 = context2.new_page()
    page2.goto("https://chat.example.com")
    
    # User 1 sends message
    page1.get_by_label("Message").fill("Hello!")
    page1.get_by_role("button", name="Send").click()
    
    # User 2 receives message
    expect(page2.get_by_text("Hello!")).to_be_visible()
    
    context1.close()
    context2.close()
```

### Authentication State

```python
# Save authentication state
context = browser.new_context()
page = context.new_page()
# ... perform login
context.storage_state(path="auth.json")

# Reuse authentication
context = browser.new_context(storage_state="auth.json")
page = context.new_page()
page.goto("https://example.com/dashboard")  # Already logged in
```

### Handling Dialogs

```python
# Accept alert
page.on("dialog", lambda dialog: dialog.accept())

# Dismiss confirm
page.on("dialog", lambda dialog: dialog.dismiss())

# Handle with custom input
def handle_dialog(dialog):
    if dialog.type == "prompt":
        dialog.accept("My input")
    else:
        dialog.accept()

page.on("dialog", handle_dialog)
```

### iFrames

```python
# Get frame by name or URL
frame = page.frame(name="iframe-name")
frame = page.frame(url=re.compile(r".*iframe.*"))

# Using frame locator (recommended)
frame_locator = page.frame_locator("#my-iframe")
frame_locator.get_by_role("button", name="Submit").click()

# Nested frames
page.frame_locator("#outer").frame_locator("#inner").get_by_text("Hello")
```

### Shadow DOM

```python
# Playwright pierces shadow DOM by default
page.locator("my-component").get_by_text("Shadow content").click()

# Explicit shadow root
page.locator("my-component >> shadow=.inner-element").click()
```

---

## 15. Cheat Sheet

### Locators

| Method | Example |
|--------|---------|
| `get_by_role` | `page.get_by_role("button", name="Submit")` |
| `get_by_text` | `page.get_by_text("Welcome")` |
| `get_by_label` | `page.get_by_label("Email")` |
| `get_by_placeholder` | `page.get_by_placeholder("Search...")` |
| `get_by_test_id` | `page.get_by_test_id("submit-btn")` |
| `locator` | `page.locator("css=.btn")` |

### Actions

| Action | Example |
|--------|---------|
| Click | `locator.click()` |
| Fill | `locator.fill("text")` |
| Check | `locator.check()` |
| Select | `locator.select_option("value")` |
| Upload | `locator.set_input_files("file.pdf")` |
| Hover | `locator.hover()` |
| Press | `locator.press("Enter")` |

### Assertions

| Assertion | Example |
|-----------|---------|
| Visible | `expect(locator).to_be_visible()` |
| Text | `expect(locator).to_have_text("Hello")` |
| Value | `expect(locator).to_have_value("input")` |
| URL | `expect(page).to_have_url("**/path")` |
| Count | `expect(locator).to_have_count(5)` |

### Waits

| Wait | Example |
|------|---------|
| Element | `locator.wait_for(state="visible")` |
| URL | `page.wait_for_url("**/dashboard")` |
| Load | `page.wait_for_load_state("networkidle")` |
| Response | `page.expect_response("**/api")` |

---

## 16. Interview Q&A

### Basic (Q1-Q10)

**Q1: What is Playwright and how does it differ from Selenium?**
> Playwright is a modern automation library by Microsoft. Key differences: auto-wait (no explicit waits needed), single API for all browsers, faster execution, built-in network interception, and better handling of modern web features like Shadow DOM.

**Q2: What browsers does Playwright support?**
> Chromium (Chrome, Edge), Firefox, and WebKit (Safari). All three can be tested with a single API.

**Q3: What is a Locator in Playwright?**
> A Locator is a way to find elements on the page. It includes auto-wait and retry logic, making tests more reliable. Locators are lazy—they don't search for elements until an action is performed.

**Q4: What is the recommended locator strategy?**
> Priority order: 1) Role-based (`get_by_role`), 2) Text-based (`get_by_text`, `get_by_label`), 3) Test ID (`get_by_test_id`), 4) CSS/XPath as last resort.

**Q5: What is auto-wait in Playwright?**
> Playwright automatically waits for elements to be actionable before performing actions. It waits for elements to be visible, stable, enabled, and able to receive events.

**Q6: What is a BrowserContext?**
> An isolated browser session, similar to an incognito window. Each context has its own cookies, storage, and cache. Useful for testing multiple users or parallel sessions.

**Q7: How do you handle authentication in Playwright?**
> Save authentication state with `context.storage_state(path="auth.json")` after login, then reuse it with `browser.new_context(storage_state="auth.json")`.

**Q8: What is the difference between `fill()` and `type()`?**
> `fill()` clears the field and sets the value instantly. `press_sequentially()` (formerly `type()`) simulates typing character by character with optional delay.

**Q9: How do you run tests in parallel?**
> Python: Use `pytest-xdist` with `pytest -n 4`. JavaScript: Playwright Test runs in parallel by default with configurable workers.

**Q10: How do you take screenshots in Playwright?**
> `page.screenshot(path="screenshot.png")` for full page, or `locator.screenshot(path="element.png")` for specific element.

### Intermediate (Q11-Q20)

**Q11: How do you mock API responses?**
> Use `page.route()` to intercept and mock:
> ```python
> page.route("**/api/users", lambda route: route.fulfill(
>     status=200, json={"users": []}
> ))
> ```

**Q12: How do you handle file uploads?**
> Use `set_input_files()`:
> ```python
> page.get_by_label("Upload").set_input_files("file.pdf")
> page.get_by_label("Upload").set_input_files(["file1.pdf", "file2.pdf"])
> ```

**Q13: How do you handle iframes?**
> Use `frame_locator()`:
> ```python
> page.frame_locator("#my-iframe").get_by_role("button").click()
> ```

**Q14: How do you wait for network requests?**
> Use `expect_response()` or `expect_request()`:
> ```python
> with page.expect_response("**/api/data") as response_info:
>     page.get_by_role("button").click()
> response = response_info.value
> ```

**Q15: What is tracing and how do you use it?**
> Tracing records test execution including screenshots, DOM snapshots, and network activity. Enable with `context.tracing.start()`, stop with `context.tracing.stop(path="trace.zip")`, view with `playwright show-trace trace.zip`.

**Q16: How do you handle dialogs (alerts, confirms, prompts)?**
> Register a handler before triggering:
> ```python
> page.on("dialog", lambda dialog: dialog.accept())
> page.get_by_role("button", name="Delete").click()
> ```

**Q17: How do you test multiple browser contexts simultaneously?**
> Create multiple contexts from the same browser:
> ```python
> context1 = browser.new_context()
> context2 = browser.new_context()
> page1 = context1.new_page()
> page2 = context2.new_page()
> ```

**Q18: What is the Page Object Model and why use it?**
> POM is a design pattern that creates a class for each page, encapsulating locators and actions. Benefits: reusability, maintainability, and cleaner test code.

**Q19: How do you handle Shadow DOM?**
> Playwright pierces Shadow DOM by default. Just use normal locators:
> ```python
> page.locator("my-component").get_by_text("Content").click()
> ```

**Q20: How do you configure different environments?**
> Use environment variables or config files:
> ```python
> base_url = os.getenv("BASE_URL", "https://staging.example.com")
> page.goto(f"{base_url}/login")
> ```

### Advanced (Q21-Q30)

**Q21: How do you handle flaky tests in Playwright?**
> 1) Use proper locators (role-based over CSS), 2) Rely on auto-wait instead of explicit waits, 3) Use `expect()` assertions with built-in retry, 4) Configure retries in config, 5) Use `wait_for_load_state("networkidle")` when needed.

**Q22: How do you implement visual regression testing?**
> Use `expect(page).to_have_screenshot()` or `expect(locator).to_have_screenshot()`. Playwright compares against baseline images and reports differences.

**Q23: How do you test responsive designs?**
> Set viewport in context or use device emulation:
> ```python
> context = browser.new_context(viewport={"width": 375, "height": 667})
> # Or use device
> context = browser.new_context(**playwright.devices["iPhone 13"])
> ```

**Q24: How do you handle test data management?**
> 1) Use fixtures for setup/teardown, 2) Mock APIs for consistent data, 3) Use database seeding before tests, 4) Implement factory patterns for test data generation.

**Q25: How do you integrate Playwright with CI/CD?**
> 1) Install browsers in CI (`playwright install --with-deps`), 2) Run headless, 3) Configure artifacts (screenshots, videos, traces), 4) Use parallel workers, 5) Set appropriate timeouts.

**Q26: How do you debug Playwright tests?**
> 1) `PWDEBUG=1` for inspector, 2) `--headed` for visible browser, 3) `--slowmo` for slow execution, 4) `page.pause()` for breakpoints, 5) Trace viewer for post-mortem analysis.

**Q27: How do you handle dynamic content and SPAs?**
> 1) Use `wait_for_load_state("networkidle")`, 2) Wait for specific elements with `locator.wait_for()`, 3) Use `expect()` with auto-retry, 4) Wait for specific network requests.

**Q28: How do you test file downloads?**
> ```python
> with page.expect_download() as download_info:
>     page.get_by_text("Download").click()
> download = download_info.value
> download.save_as("./downloads/file.pdf")
> ```

**Q29: How do you handle geolocation and permissions?**
> ```python
> context = browser.new_context(
>     geolocation={"latitude": 37.7749, "longitude": -122.4194},
>     permissions=["geolocation"]
> )
> ```

**Q30: What are best practices for Playwright test architecture?**
> 1) Use Page Object Model, 2) Prefer role-based locators, 3) Keep tests independent, 4) Use fixtures for setup, 5) Mock external dependencies, 6) Implement proper error handling, 7) Use meaningful test names, 8) Configure retries for CI, 9) Capture artifacts on failure.

---

## 🔗 Related Topics

- [Python re Module](../../01-computer-science-fundamentals/regex/python-re-module.md) - Regex for test assertions
- [CI/CD Notes](../../DevOps/06-ci-cd/ci-cd-notes.md) - Integrating tests in pipelines

---

*Last updated: May 2026*
