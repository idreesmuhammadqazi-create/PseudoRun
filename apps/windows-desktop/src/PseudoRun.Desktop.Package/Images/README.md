# PseudoRun MSIX Visual Assets

The PNG files in this directory are **1x1 transparent placeholders**. They allow the MSIX
package to build on CI today, but they are **not acceptable for a real Microsoft Store
submission** and must be replaced with real artwork before the first Store upload.

## Required files and sizes

Per the Microsoft Store and MSIX manifest, the following assets are referenced from
`Package.appxmanifest`:

| File                                                | Logical size | Scale | Actual px |
| --------------------------------------------------- | ------------ | ----- | --------- |
| `StoreLogo.png`                                     | 50x50        | 100%  | 50x50     |
| `Square150x150Logo.scale-200.png`                   | 150x150      | 200%  | 300x300   |
| `Square44x44Logo.scale-200.png`                     | 44x44        | 200%  | 88x88     |
| `Square44x44Logo.targetsize-24_altform-unplated.png`| 24x24        | 100%  | 24x24     |
| `Wide310x150Logo.scale-200.png`                     | 310x150      | 200%  | 620x300   |
| `SplashScreen.scale-200.png`                        | 620x300      | 200%  | 1240x600  |
| `LockScreenLogo.scale-200.png`                      | 24x24        | 200%  | 48x48     |

It is strongly recommended to also ship additional scales (`scale-100`, `scale-125`,
`scale-150`, `scale-400`) and `targetsize` variants. See:

- App icon construction guide: https://learn.microsoft.com/en-us/windows/apps/design/style/iconography/app-icon-construction
- Tile and icon assets: https://learn.microsoft.com/en-us/windows/apps/design/style/app-icons-and-logos
- MSIX tile & logo reference: https://learn.microsoft.com/en-us/windows/uwp/design/shell/tiles-and-notifications/app-assets

## How to regenerate

### Option 1: Visual Studio Manifest Designer (recommended)

1. Open `PseudoRun.sln` in Visual Studio 2022.
2. Double-click `Package.appxmanifest` in the `PseudoRun.Desktop.Package` project.
3. Go to the **Visual Assets** tab.
4. Click **...** next to "Source" and pick a master 400x400 (or larger) PNG of the app
   icon. Visual Studio will auto-generate every scale/altform into this `Images/`
   directory, overwriting these placeholders.

### Option 2: ImageMagick from a master PNG

```powershell
# From repo root, requires a master 1024x1024 logo.png on disk:
dotnet tool install -g Magick.NET.Tool  # or install ImageMagick separately
$src = "logo.png"
$dst = "apps/windows-desktop/src/PseudoRun.Desktop.Package/Images"

magick $src -resize 50x50     "$dst/StoreLogo.png"
magick $src -resize 300x300   "$dst/Square150x150Logo.scale-200.png"
magick $src -resize 88x88     "$dst/Square44x44Logo.scale-200.png"
magick $src -resize 24x24     "$dst/Square44x44Logo.targetsize-24_altform-unplated.png"
magick $src -resize 620x300   "$dst/Wide310x150Logo.scale-200.png"
magick $src -resize 1240x600  "$dst/SplashScreen.scale-200.png"
magick $src -resize 48x48     "$dst/LockScreenLogo.scale-200.png"
```

## Checklist before first Store submission

- [ ] Replace every PNG in this directory with real artwork at the sizes above.
- [ ] Fill in the manifest placeholders (`PSEUDORUN_PACKAGE_IDENTITY_NAME_PLACEHOLDER`,
      `PSEUDORUN_PUBLISHER_CN_PLACEHOLDER`, `PSEUDORUN_PUBLISHER_DISPLAY_NAME_PLACEHOLDER`)
      via GitHub Actions secrets (`STORE_PACKAGE_IDENTITY_NAME`, `STORE_PUBLISHER_CN`,
      `STORE_PUBLISHER_DISPLAY_NAME`) — the workflow performs this substitution at build
      time.
- [ ] Verify assets render correctly in Partner Center's **Submission → Packages** preview.
