# SMS - School Management System

A Tauri + React + TypeScript desktop application for school management.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Tauri 2 (Rust)
- **Database**: SQLite
- **Auth**: Argon2 password hashing, session-based auth

## Prerequisites

- [Bun](https://bun.sh) (latest)
- [Rust](https://rustup.rs) (latest)
- [Node.js](https://nodejs.org) (v18+)

## Clone & Setup

```bash
git clone https://github.com/kodezebra/xplatform-starter.git
cd xplatform-starter
bun install
```

## Development

```bash
bun run tauri dev
```

## Build

```bash
bun run tauri build
```

## Downloads

Pre-built installers are automatically generated on every push via GitHub Actions.

**To download:**
1. Go to [Actions](https://github.com/kodezebra/xplatform-starter/actions)
2. Click a completed workflow run
3. Under "Artifacts", download the bundle for your platform:
   - **Ubuntu/Linux**: `bundles-ubuntu-22.04` → `.deb`, `.rpm`, `.AppImage`
   - **Windows**: `bundles-windows-latest` → `.exe` installer
   - **macOS**: `bundles-macos-latest` → `.dmg`

**Linux installation:**
```bash
# .deb (Debian/Ubuntu)
sudo dpkg -i "SMS App_0.1.0_amd64.deb"

# .rpm (Fedora/RHEL)
sudo dnf install "SMS App-0.1.0-1.x86_64.rpm"

# .AppImage (portable)
chmod +x "SMS App_0.1.0_amd64.AppImage"
./"SMS App_0.1.0_amd64.AppImage"
```

## Default Credentials

On first run, an admin account is auto-created:
- **Username**: admin
- **Password**: admin123

Change the password after first login.

## Project Structure

```
src/                  # React frontend
  components/         # UI components
  lib/               # Utilities, hooks, context
  routes/            # Page routes
src-tauri/           # Tauri/Rust backend
  src/               # Rust source
  Cargo.toml         # Rust dependencies
```
