# Project Guidelines

## Release & Tagging

This project builds **only on Git tags**, not on every push.

### When to Tag
- After completing a feature or set of changes
- Before publishing a release
- When ready to distribute binaries

### How to Release

1. Update version in **both** files (must match):
   ```bash
   # src-tauri/tauri.conf.json
   # src-tauri/Cargo.toml
   ```

2. Create and push tag:
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```

3. CI builds all targets automatically:
   - Linux: deb, rpm, appimage
   - Windows: nsis
   - macOS: app, dmg
   - Android: apk

4. Download artifacts from GitHub Actions → Actions tab

### CI Triggers
| Trigger | Builds? |
|---------|---------|
| Push to `main` | No |
| Push tag (`v*`) | Yes |
| PR to `main` | Yes (lint/test only) |
| Manual dispatch | Yes |

## Code Conventions

- Use **Bun** as package manager
- Use **Tailwind CSS v4** (CSS-first config)
- Use **shadcn/ui** components
- Use **Tauri v2** for desktop/mobile
- Follow existing code patterns in the project

## Tauri Development

- Frontend: `bun run dev` (Vite dev server)
- Desktop: `bun run tauri dev`
- Build: `bun run tauri build`

## Project Structure

```
├── src/              # React frontend
├── src-tauri/        # Rust backend
│   ├── src/          # Rust source
│   ├── Cargo.toml    # Rust dependencies
│   └── tauri.conf.json  # Tauri config
├── .github/workflows/ # CI/CD
└── RELEASE_GUIDE.md  # Detailed release docs
```
