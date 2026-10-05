# How to Run Locked-in Blind 75 Tracker Locally

This guide provides end-to-end instructions for installing all required dependencies and running the **Blind 75 Tracker** web application and its **Local Java Judge Runtime** across **Windows**, **macOS**, and **Linux**.

---

## 1. What You Need (Prerequisites)

To run this application locally, your machine needs:
1. **Node.js** (v18.0.0 or higher; **Node.js 20 LTS** or **22 LTS** recommended) + **npm**
2. **Java Development Kit (JDK 17 or JDK 21 LTS)** with both `javac` (compiler) and `java` (JVM runtime) accessible in your command line / terminal `PATH`.
3. **Git** (to clone the repository).

---

## 2. Installation Instructions by Operating System

### A. Windows (Windows 10 / 11)

#### Step 1: Install Node.js
- **Option 1 (Using Windows Package Manager `winget` - Recommended)**:
  Open **PowerShell** as Administrator or standard user and run:
  ```powershell
  winget install OpenJS.NodeJS.LTS
  ```
- **Option 2 (Direct Installer)**:
  Download and run the 64-bit `.msi` installer from [nodejs.org](https://nodejs.org/). Keep all defaults checked.

#### Step 2: Install Java Development Kit (JDK 17 or 21)
- **Option 1 (Using `winget` - Recommended)**:
  Open **PowerShell** and run:
  ```powershell
  winget install EclipseAdoptium.Temurin.17.JDK
  ```
- **Option 2 (Direct Installer)**:
  Download Eclipse Temurin JDK 17 (LTS) `.msi` installer from [adoptium.net](https://adoptium.net/). In the setup wizard, ensure **"Set JAVA_HOME variable"** and **"Add to PATH"** are both enabled.

#### Step 3: Verify Environment Variables on Windows
Close and reopen **PowerShell**, then run:
```powershell
node -v
npm -v
javac -version
java -version
```
*If `javac` is not recognized*:
1. Press `Win + S`, type `Environment Variables`, and select **Edit the system environment variables**.
2. Click **Environment Variables...**
3. Under System Variables, verify `JAVA_HOME` points to your JDK directory (e.g. `C:\Program Files\Eclipse Adoptium\jdk-17...`).
4. Select `Path` under System variables -> **Edit** -> Ensure `%JAVA_HOME%\bin` or `C:\Program Files\Eclipse Adoptium\jdk-17...\bin` is present.
5. If PowerShell complains about script execution policy (`ps1 cannot be loaded`), run:
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

#### Step 2: Install Node.js
```bash
brew install node
```

#### Step 3: Install Java Development Kit (JDK 17)
```bash
brew install openjdk@17
```

For the system Java wrappers to locate this JDK, create the symlink:
```bash
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
```
*(On Intel Macs, replace `/opt/homebrew` with `/usr/local`)*

Add JDK to your shell path in `~/.zshrc`:
```bash
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zshrc
source ~/.zshrc
```

#### Step 4: Verify Installation
```bash
node -v
npm -v
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

# 2. Install OpenJDK 17
sudo apt-get update
sudo apt-get install -y openjdk-17-jdk

# 3. Verify
node -v
npm -v
javac -version
java -version
```

#### Fedora / RHEL / CentOS:
```bash
# 1. Install Node.js and Java
sudo dnf install -y nodejs npm git java-17-openjdk-devel

# 2. Verify
node -v
npm -v
javac -version
java -version
```

#### Arch Linux / Manjaro:
```bash
sudo pacman -S nodejs npm git jdk17-openjdk
sudo archlinux-java set java-17-openjdk
```

---

## 3. How to Run the Application

> [!TIP]
> **Do you need to run a separate connector/bridge?**
> **No!** The Vite development server has the **Java Judge Companion built directly into it** (`server/vitePlugin.ts`).
> When you run `npm run dev`, it serves the frontend **and** handles all `/api/judge` compile and test runs in a single command. You do **NOT** need to run a second terminal or connector.

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
> That's it! Both the web interface and the local Java judge bridge are active immediately.

*(Optional: If you ever build a static production bundle with `npm run build` and preview it without Vite, you can optionally run the standalone companion server via `npm run judge` or `node server/judge/index.cjs` on port 3001).*

---

## 4. How to Test and Verify Everything Works

1. Open your browser and navigate to **`http://localhost:5173/`**.
2. In the top navigation bar, click the **`🧪 Judge Sandbox`** button (Problem #0).
3. In the code editor, notice:
   - **Smart Tab**: Pressing `Tab` anywhere inside code inserts 4 spaces. If autocomplete suggestions are visible, pressing `Tab` completes the suggestion.
   - **Assist Mode**: Toggle `Assist Mode: ON / OFF` in the editor toolbar to enable or disable live autocompletions.
   - **Live Syntax & Scope Errors**:
     - Type a duplicate variable declaration (e.g. `int x = 1; int x = 2;`) to see instant red squiggles and hover diagnostics (`Variable 'x' is already defined in scope`) without running code.
     - Type unclosed strings, missing semicolons, or unbalanced braces to see real-time error hints.
4. Click **`Run`** or **`Submit`**:
   - The code is compiled by your local `javac` and executed against the test cases.
   - Check the **Test Result** tab at the bottom to inspect runtime, test pass counts, outputs, and any compiler/runtime errors.
   - The testcase area and results panel scroll cleanly when viewing large outputs or stack traces.

---

## 5. Running the Test Suite

To run all unit tests, problem verification suites, and local judge integration tests:
```bash
# Run Vitest test suite
npm test

# Verify all 75 problem templates and solutions
npm run content:verify -- --all
```

---

## 6. Troubleshooting Common Issues

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| `javac: command not found` or `'javac' is not recognized` | JDK is not installed or not added to your system `PATH` | Ensure JDK 17+ is installed and `%JAVA_HOME%\bin` (Windows) or `/usr/bin/javac` (macOS/Linux) is in your system `PATH`. Restart your terminal. |
| `Port 5173 is already in use` | Another Vite instance is running | Run `npm run dev -- --port 5174` or kill the process on port 5173. |
| `Port 3001 is already in use` | Another standalone judge instance is running | Terminate any existing `node server/judge/index.cjs` process (only needed for production preview). |
| PowerShell script execution disabled | Windows execution policy blocks scripts | Run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` in PowerShell. |
| Judge run fails or shows network error | Vite dev server was stopped | Ensure `npm run dev` is running in your terminal. All `/api/judge` endpoints are automatically handled by Vite. |
