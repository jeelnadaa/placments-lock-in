# How to Run Locked-in Blind 75 Tracker Locally

This guide provides end-to-end instructions for installing all required dependencies and running the **Blind 75 Tracker** web application and its **Local Multi-Language Judge Runtimes (Python, C, C++, Go, Java)** across **Windows**, **macOS**, and **Linux**.

---

## 1. What You Need (Prerequisites)

To run this application locally, your machine needs:
1. **Node.js** (v18.0.0 or higher; **Node.js 20 LTS** or **22 LTS** recommended) + **npm**
2. **Python** (Python 3.8 or higher; **Python 3.10+** recommended) accessible in your command line / terminal `PATH` (`python`, `py`, or `python3`).
3. **C & C++ Compilers** (`gcc` and `g++`, or `clang` and `clang++`) accessible in your command line / terminal `PATH`.
4. **Go** (Go 1.18 or higher; **Go 1.20+** recommended) accessible in your command line / terminal `PATH` (`go`).
5. **Java Development Kit (JDK 17 or JDK 21 LTS)** with both `javac` (compiler) and `java` (JVM runtime) accessible in your command line / terminal `PATH`.
6. **Git** (to clone the repository).

---

## 2. Installation Instructions by Operating System

### A. Windows (Windows 10 / 11)

#### Step 1: Install Node.js
- **Option 1 (Using Windows Package Manager `winget` - Recommended)**:
  Open **PowerShell** and run:
  ```powershell
  winget install OpenJS.NodeJS.LTS
  ```
- **Option 2 (Direct Installer)**:
  Download and run the 64-bit `.msi` installer from [nodejs.org](https://nodejs.org/). Keep all defaults checked.

#### Step 2: Install Python (3.10+)
- **Option 1 (Using `winget` - Recommended)**:
  ```powershell
  winget install Python.Python.3.12
  ```
- **Option 2 (Direct Installer)**:
  Download from [python.org](https://www.python.org/downloads/).
  > [!IMPORTANT]
  > Check the box **"Add python.exe to PATH"** at the bottom of the installer window!

#### Step 3: Install C and C++ Compilers (GCC / MinGW / WinLibs)
- **Option 1 (Using `winget` with WinLibs MinGW GCC - Recommended)**:
  Installs both `gcc` (for C) and `g++` (for C++):
  ```powershell
  winget install BrechtSanders.WinLibs.POSIX.UCRT
  ```
- **Option 2 (Using MSYS2)**:
  ```powershell
  winget install MSYS2.MSYS2
  # Open MSYS2 UCRT64 shell and run:
  pacman -S mingw-w64-ucrt-x86_64-gcc
  ```
  Then add `C:\msys64\ucrt64\bin` to your Windows System `PATH`.

#### Step 4: Install Go
- **Option 1 (Using `winget` - Recommended)**:
  ```powershell
  winget install GoLang.Go
  ```
- **Option 2 (Direct Installer)**:
  Download and run the 64-bit `.msi` installer from [go.dev/dl](https://go.dev/dl/).

#### Step 5: Install Java Development Kit (JDK 17 or 21)
- **Option 1 (Using `winget` - Recommended)**:
  Open **PowerShell** and run:
  ```powershell
  winget install EclipseAdoptium.Temurin.17.JDK
  ```
- **Option 2 (Direct Installer)**:
  Download Eclipse Temurin JDK 17 (LTS) `.msi` installer from [adoptium.net](https://adoptium.net/). In the setup wizard, ensure **"Set JAVA_HOME variable"** and **"Add to PATH"** are both enabled.

#### Step 6: Verify Environment Variables on Windows
Close and reopen **PowerShell**, then run:
```powershell
node -v
npm -v
python --version
gcc --version
g++ --version
go version
javac -version
java -version
```
*If any command is not recognized*:
1. Press `Win + S`, type `Environment Variables`, and select **Edit the system environment variables**.
2. Click **Environment Variables...**
3. Select `Path` under System variables -> **Edit** -> Ensure paths to Node, Python, GCC `bin`, and Java `%JAVA_HOME%\bin` are present.
4. If PowerShell complains about script execution policy (`ps1 cannot be loaded`), run:
   ```powershell
   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
   ```

---

### B. macOS (Apple Silicon M1/M2/M3/M4 & Intel)

#### Step 1: Install Homebrew (if not already installed)
Open **Terminal** and run:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### Step 2: Install Node.js, Python, GCC/Clang, Go, and Java
```bash
# Install Node, Python, GCC, Go, and OpenJDK 17
brew install node python gcc go openjdk@17
```
*(Alternatively, macOS Command Line Tools includes `clang++` via `xcode-select --install`)*

For the system Java wrappers to locate this JDK, create the symlink:
```bash
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
```
*(On Intel Macs, replace `/opt/homebrew` with `/usr/local`)*

Add JDK and tools to your shell path in `~/.zshrc`:
```bash
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zshrc
source ~/.zshrc
```

#### Step 3: Verify Installation
```bash
node -v
npm -v
python3 --version
gcc --version
g++ --version
go version
javac -version
java -version
```

---

### C. Linux (Ubuntu, Debian, Fedora, Arch)

#### Ubuntu / Debian / Linux Mint:
```bash
# 1. Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git

# 2. Install Build Essential (g++ / gcc), Go, Python 3, and OpenJDK 17
sudo apt-get update
sudo apt-get install -y build-essential g++ golang python3 python3-pip openjdk-17-jdk

# 3. Verify
node -v
npm -v
python3 --version
gcc --version
g++ --version
go version
javac -version
java -version
```

#### Fedora / RHEL / CentOS:
```bash
# 1. Install Node.js, C++ compiler, Go, Python, and Java
sudo dnf install -y nodejs npm git gcc-c++ golang python3 java-17-openjdk-devel

# 2. Verify
node -v
npm -v
python3 --version
gcc --version
g++ --version
go version
javac -version
java -version
```

#### Arch Linux / Manjaro:
```bash
sudo pacman -S nodejs npm git base-devel gcc go python jdk17-openjdk
sudo archlinux-java set java-17-openjdk
```

---

## 3. How to Run the Application

> [!TIP]
> **Do you need to run a separate connector/bridge?**
> **No!** The Vite development server has the **Multi-Language Judge Companion built directly into it** (`server/vitePlugin.ts`).
> When you run `npm run dev`, it serves the frontend **and** handles all `/api/judge` compile and test runs for all languages (Python, C, C++, Go, Java) in a single command. You do **NOT** need to run a second terminal or connector.

### Step 1: Clone and Navigate to the Repository
```bash
git clone <your-repository-url>
cd locked-in
```

### Step 2: Install Node Dependencies
```bash
npm install
```

### Step 3: Start the Application (Single Command!)
```bash
npm run dev
```
> The application will start at: **`http://localhost:5173/`**
>
> That's it! Both the web interface and the local judge execution bridge are active immediately.

*(Optional: If you ever build a static production bundle with `npm run build` and preview it without Vite, you can optionally run the standalone companion server via `npm run judge` or `node server/judge/index.cjs` on port 3001).*

---

## 4. Multi-Language Features & Verification

1. Open your browser and navigate to **`http://localhost:5173/`**.
2. Click any problem (e.g. **#1 Two Sum**, **#206 Reverse Linked List**, **#48 Rotate Image**).
3. In the code editor header, toggle between **Python**, **C++**, and **Java**:
   - Switching language instantly loads your saved draft or idiomatic starter template for that specific language.
   - **Zero Code Disappearance**: Every keystroke in each language is automatically persisted to `localStorage` and synced with your local IndexedDB progress. Refreshing the browser or restarting the app preserves your written code.
4. **IDE-Level Autocompletions**:
   - **Python**: typing `d.` shows dict methods (`get`, `items`, `keys`, `values`), `heapq.` shows heap methods (`heappush`, `heappop`, `heapify`), `collections.` shows container classes, and `root.` / `head.` shows `val`, `left`, `right`, `next`.
   - **C++**: typing `v.` shows vector methods (`push_back`, `pop_back`, `size`, `empty`), `map.` shows map methods (`insert`, `find`, `count`, `emplace`), `std::` shows algorithms (`sort`, `reverse`, `max`, `min`), and pointer arrows `head->` / `root->` show `val`, `next`, `left`, `right`.
   - **Java**: typing `map.` shows Map methods (`put`, `getOrDefault`, `containsKey`), `list.` shows List methods.
   - Pressing `Tab` inserts 4 spaces or completes active suggestions.
5. **Live Lint Diagnostics**:
   - **Python**: real-time detection for unclosed strings, mismatched brackets/parentheses, missing colons after headers, tab/space indentation mixing, and cross-language traps (`===`, `&&`, `null`, `true`, `false`, `this.`).
   - **C++**: real-time detection for missing semicolons after statements or class definitions, unclosed strings/chars, bracket balancing, pointer dot operator traps (`head.val` -> `head->val`), and `null` -> `nullptr` suggestions.
   - **Java**: real-time duplicate variable re-declaration errors, unclosed braces, and missing semicolons.
6. Click **`Run`** or **`Submit`**:
   - The code is compiled by your local compiler (`g++`, `python`, `javac`) and executed against all sample and hidden testcases with sub-millisecond precision.
   - Cross-language outputs (`None` / `null` / `[]`) are matched equivalently and accurately.

---

## 5. Running the Test Suite

To run all unit tests, problem verification suites, and local judge integration tests:
```bash
# Run Vitest test suite (includes Python, C++, and Java runner tests)
npm test

# Verify all 75 problem templates and solutions
npm run content:verify -- --all
```

---

## 6. Troubleshooting Common Issues

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| `python: command not found` or `'python' is not recognized` | Python is not installed or not in PATH | Install Python 3.10+ and ensure the checkbox "Add python.exe to PATH" was selected during install. |
| `g++: command not found` or `'g++' is not recognized` | GCC/MinGW is not installed or not in PATH | On Windows install WinLibs/MSYS2 (`winget install BrechtSanders.WinLibs.POSIX.UCRT`). On Linux run `sudo apt install build-essential g++`. On macOS run `brew install gcc`. |
| `javac: command not found` or `'javac' is not recognized` | JDK is not installed or not added to your system `PATH` | Ensure JDK 17+ is installed and `%JAVA_HOME%\bin` (Windows) or `/usr/bin/javac` (macOS/Linux) is in your system `PATH`. Restart your terminal. |
| `Port 5173 is already in use` | Another Vite instance is running | Run `npm run dev -- --port 5174` or kill the process on port 5173. |
| `Port 3001 is already in use` | Another standalone judge instance is running | Terminate any existing `node server/judge/index.cjs` process (only needed for production preview). |
| PowerShell script execution disabled | Windows execution policy blocks scripts | Run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` in PowerShell. |
| Judge run fails or shows network error | Vite dev server was stopped | Ensure `npm run dev` is running in your terminal. All `/api/judge` endpoints are automatically handled by Vite. |
