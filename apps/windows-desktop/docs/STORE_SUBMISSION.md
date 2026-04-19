# Microsoft Store Submission Guide

This guide walks through everything needed to publish PseudoRun to the Microsoft Store. It's split into **one-time setup** (do once) and **per-release** (done by GitHub Actions after setup).

## One-time setup

### 1. Partner Center developer account

1. Go to <https://partner.microsoft.com/en-us/dashboard/registration>
2. Choose **Individual** ($19 one-time) or **Company** ($99, requires business verification).
   - For a solo developer / student project, **Individual** is fine.
3. Complete identity verification (email, phone, payout info if you plan to charge — PseudoRun is free so just fill the minimum).

Expect 1–3 days for approval.

### 2. Reserve the app name

1. Partner Center dashboard → **Apps and games** → **New product** → **MSIX or PWA app**.
2. Enter app name: `PseudoRun`
   - If taken, try `PseudoRun Editor` or `PseudoRun - IGCSE Pseudocode`.
3. After reservation, go to **Product identity** (left sidebar, under the app).

Copy down these three values — you'll paste them into GitHub Secrets in step 4:

| Partner Center field | Looks like | GitHub secret name |
|---|---|---|
| **Package/Identity/Name** | `12345AppPublisher.PseudoRun` | `STORE_PACKAGE_IDENTITY_NAME` |
| **Package/Identity/Publisher** | `CN=12345...abc, O=Publisher Name, L=City, S=State, C=Country` — copy ONLY the part after `CN=` | `STORE_PUBLISHER_CN` |
| **Package/Properties/PublisherDisplayName** | Your display name (e.g. `Idrees Qazi`) | `STORE_PUBLISHER_DISPLAY_NAME` |

### 3. Create Azure AD app for Store API (for auto-submission)

This is optional but recommended — without it, every release has to be manually uploaded to Partner Center.

1. Go to <https://portal.azure.com> → **Microsoft Entra ID** → **App registrations** → **New registration**.
2. Name: `PseudoRun Store Submission`. Supported account types: **Single tenant**. Redirect URI: leave blank.
3. After creation, note the **Application (client) ID** and **Directory (tenant) ID**.
4. Under **Certificates & secrets** → **New client secret**. Copy the value immediately (won't be shown again).
5. Back in Partner Center: **Account settings** → **User management** → **Azure AD applications** → **Add Azure AD applications** → select the one you just made → assign **Manager** role.

Copy down:

| Value | GitHub secret name |
|---|---|
| Directory (tenant) ID | `STORE_AZURE_TENANT_ID` |
| Application (client) ID | `STORE_AZURE_CLIENT_ID` |
| Client secret value | `STORE_AZURE_CLIENT_SECRET` |
| App ID from Partner Center (the Store App ID, not the Azure client ID) — Partner Center → your app → Product identity → **Store ID** | `STORE_APP_ID` |
| Seller ID from Partner Center → Account settings → Legal info → Developer → **Seller ID** | `STORE_SELLER_ID` |

### 4. Add the secrets to GitHub

Repo → **Settings** → **Secrets and variables** → **Actions** → **Repository secrets** → **New repository secret**. Add all eight:

- `STORE_PACKAGE_IDENTITY_NAME`
- `STORE_PUBLISHER_CN`
- `STORE_PUBLISHER_DISPLAY_NAME`
- `STORE_AZURE_TENANT_ID`
- `STORE_AZURE_CLIENT_ID`
- `STORE_AZURE_CLIENT_SECRET`
- `STORE_APP_ID`
- `STORE_SELLER_ID`

If you skip the Azure AD setup, omit the last five — the workflow still builds the MSIX and uploads it as an Actions artifact that you can manually drag into Partner Center.

### 5. Replace the placeholder icons

The `Images/` folder under `src/PseudoRun.Desktop.Package/` contains 1x1 transparent PNGs so the build doesn't fail. Before your first Store submission, you MUST replace them with real assets. Microsoft's required sizes:

| File | Size (px) |
|---|---|
| `StoreLogo.png` | 50 × 50 |
| `Square44x44Logo.scale-200.png` | 88 × 88 |
| `Square44x44Logo.targetsize-24_altform-unplated.png` | 24 × 24 |
| `Square150x150Logo.scale-200.png` | 300 × 300 |
| `Wide310x150Logo.scale-200.png` | 620 × 300 |
| `SplashScreen.scale-200.png` | 1240 × 600 |
| `LockScreenLogo.scale-200.png` | 48 × 48 |

Easiest path: start with a 400x400 master PNG and use Visual Studio's **Manifest Designer → Visual Assets** to auto-generate all sizes. Or use <https://appicon.co/> / <https://www.appiconmaker.co/> / ImageMagick.

### 6. First submission (manual)

The very first Store submission must be done through the Partner Center UI — the API can only update existing submissions, not create the initial listing.

1. Locally tag a release: `git tag desktop-v1.0.0 && git push --tags`
2. Wait for GitHub Actions → **Windows Desktop** → `build-msix` job to finish. Download the `pseudorun-desktop-msix-1.0.0.0` artifact.
3. Partner Center → your app → **Submissions** → **Start your submission**.
4. Fill in the form using the reference below, then upload the `.msixupload` file in the **Packages** section.
5. Submit for certification. Microsoft reviews in 1–7 days (usually 2–3).

After the first submission is live, all future submissions auto-happen on `desktop-v*` tag pushes (the workflow builds MSIX and uses the API to create a new submission).

---

## Partner Center submission form — suggested answers

Copy-paste these. Edit only the email/name where flagged.

### Pricing and availability

| Field | Answer |
|---|---|
| Markets | **All markets (all possible)** |
| Visibility | **Public - Available to everyone** |
| Schedule | **As soon as possible** |
| Pricing | **Free** |
| Free trial | **No free trial** |
| Sale pricing | leave blank |
| Organizational licensing | **Allow organizational licensing** (checkbox on) |
| Store Managed consumer | leave default |

### Properties

| Field | Answer |
|---|---|
| Category | **Education** |
| Subcategory | **Reference** (best fit for syntax reference + examples) |
| Secondary category | leave blank (or **Developer Tools** if you want dual listing) |
| Supports Xbox Live | **No** |
| Product declarations | tick "This product is accessible" if you've done accessibility testing; otherwise leave blank |
| System requirements — minimum hardware | leave blank (MSIX capabilities are self-describing) |
| System requirements — recommended hardware | leave blank |
| Contact info — Support contact info | `support@pseudorun.tech` *(replace with a real monitored email; Microsoft requires a responsive support address)* |
| Privacy policy URL | `https://www.pseudorun.tech/privacy` *(if this page doesn't exist, create one — see template at the end of this doc)* |
| Website | `https://www.pseudorun.tech` |
| Copyright and trademark info | `© 2026 PseudoRun. All rights reserved.` |
| Additional license terms | leave blank (MSIX uses Standard Application License by default, which is fine) |

### Age ratings

Fill out the IARC questionnaire. Honest answers for PseudoRun:

- Contains violence: **No**
- Contains sexual content: **No**
- Contains profanity: **No**
- Contains gambling simulation: **No**
- Contains simulated gambling/casino: **No**
- Collects personal info: **No** (extension is offline-only; Windows app is offline-only)
- Shares user data with third parties: **No**
- Allows user-generated content: **No**
- Enables users to communicate: **No**
- Contains location info: **No**
- Contains digital purchases: **No**
- Contains advertising: **No**

Expected result: **3+** across all IARC regions.

### Packages

Upload the `.msixupload` file from the GitHub Actions artifact. Partner Center will auto-detect:
- Architecture: **x64**
- Device family: **Windows 10 Desktop, version 10.0.17763.0 and later**

Leave **Mandatory update** unchecked on v1.0.0. For future critical security fixes, tick it.

### Store listings — English (United States)

| Field | Answer |
|---|---|
| Product name (auto-filled from reservation) | `PseudoRun` |
| Short description (200 chars) | `The #1 offline IGCSE/A-Level pseudocode editor and simulator. Run and debug CAIE-style pseudocode with a built-in interpreter, examples, tutorial, and exam mode.` |
| Description (10,000 chars) | See template block below |
| What's new in this version | `Initial release.` |
| Product features (up to 20, 200 chars each) | See list below |
| Search terms (up to 7) | `pseudocode`, `IGCSE`, `A-Level`, `CAIE`, `computer science`, `pseudocode editor`, `pseudocode simulator` |
| Copyright/trademark | `© 2026 PseudoRun` |
| Additional license terms | leave blank |
| Developed by | `PseudoRun` |
| Published by | (your Publisher Display Name from step 2) |

**Description template (paste verbatim):**

```
PseudoRun is the most complete offline pseudocode editor and simulator built for IGCSE and A-Level Computer Science students studying the Cambridge (CAIE) 0478/9618 syllabus.

Write pseudocode the way it appears on the exam, run it in a real interpreter, step through execution line-by-line, and catch syntax and semantic errors before the examiner does.

FEATURES
* Built-in pseudocode interpreter — run your code without converting to another language
* Step-by-step debugger — pause, step, continue, inspect variables
* Syntax and semantic validation — errors surface with file/line/column
* 25+ worked examples covering the full syllabus
* 100 practice problems graded by topic and difficulty
* Guided multi-step tutorial for beginners
* Full CAIE syntax reference
* Exam mode — timed practice with auto-submission
* Export your work as PDF or DOCX
* Works 100% offline — your code never leaves your computer
* Dark and light themes
* No account needed, no ads, no tracking

DESIGNED FOR STUDENTS
Every feature was built with the IGCSE/A-Level candidate in mind. The editor, interpreter, and error messages use the same vocabulary and conventions as the official CAIE specimen papers.

PRIVACY
PseudoRun stores all your programs locally on your device. We do not collect, transmit, or share any personal information. See our privacy policy for details.

---

PseudoRun is developed by an independent author and is not affiliated with Cambridge Assessment International Education.
```

**Product features list (paste one per line, max 200 chars each):**

```
Built-in CAIE pseudocode interpreter — runs your code directly
Step-by-step debugger with variable inspection and call-stack view
Syntax and semantic validation with precise error locations
25+ worked examples across every syllabus topic
100 practice problems graded by topic and difficulty
Guided multi-step tutorial for beginners
Complete IGCSE/A-Level pseudocode syntax reference
Exam mode with timer and auto-submission
Export programs as PDF or DOCX
Works fully offline — zero data collection
Dark and light themes
Recent files menu and multi-program library
Automatic trace table generation for debugging
Common-mistake detector with suggested fixes
Plain-English code explainer for every example
Free, no ads, no account required
```

**Screenshots (required: 1, max: 10, 1366×768 or larger):**

Take screenshots of:
1. Main editor with example program loaded and output panel showing result
2. Step debugger in action (variables panel + highlighted line)
3. Error display catching a syntax error
4. Tutorial dialog with step 3 or 4 visible
5. Practice problems dialog
6. Syntax reference
7. Exam mode timer overlay

Crop to 1920×1080 (or native resolution) and upload as PNG.

**Store logos (required):**

Use the 300×300 `Square150x150Logo.scale-200.png`. If you have a cleaner master, upload a 300×300 crop of it.

### Submission options

| Field | Answer |
|---|---|
| Notes for certification | `Offline educational tool — no network calls, no data collection. All code runs in a local interpreter. If reviewer needs a test walkthrough: launch app → Help menu → Tutorial → follow prompts.` |
| Restricted capabilities justification | N/A (we only request `runFullTrust`, which is standard for Win32 desktop apps packaged via MSIX) |
| Publishing hold options | **Publish manually / at a specified date** if you want to coordinate marketing; otherwise **Publish as soon as it passes certification** |

### Trailers (optional, skip)

Leave blank for v1.0.0. Add a 15–30 second screen recording for a later release if you want better discoverability.

---

## Per-release workflow (after setup)

```bash
# 1. Bump version in manifest (update this manually for now; a version-bump script can be added later)
# Edit apps/windows-desktop/src/PseudoRun.Desktop.Package/Package.appxmanifest — change Version="1.0.0.0" to next
# (Or skip — the CI extracts the version from the tag name)

# 2. Commit and tag
git add -A
git commit -m "release: desktop v1.1.0"
git tag desktop-v1.1.0
git push origin main --tags
```

GitHub Actions will:
1. Build and test the WPF app.
2. Build the MSIX with the version from the tag.
3. Upload the `.msixupload` as an Actions artifact.
4. If Azure AD secrets are set, call the Store Submission API to create a new submission, upload the MSIX, and commit it for certification.

Watch **Actions** → `Windows Desktop` → `build-msix` for the status.

---

## Appendix A: Privacy policy template

If <https://www.pseudorun.tech/privacy> doesn't exist yet, deploy this at `apps/web/public/privacy.html` or as a route in the web app. Partner Center and Store customers will follow this link.

```markdown
# PseudoRun Privacy Policy

Last updated: 2026-04-19

## Summary

PseudoRun is an offline pseudocode editor. We do not collect any personal information through the desktop application or the browser extensions.

## Desktop and browser extension

All code you write is stored locally on your device (in `%AppData%` on Windows, in extension local storage in Firefox/Edge). Nothing is transmitted to us or any third party.

## Web application (pseudorun.tech)

The web application optionally supports account-based features (saving programs to the cloud, sharing via link). If you create an account, we store:

- your email address (for authentication and password recovery),
- programs you explicitly save to your account.

We use Firebase Authentication and Firestore (operated by Google Cloud) to provide these services. We do not share your data with any other third party and we do not sell it.

You can delete your account and all associated data at any time from the account settings page.

## Analytics

The web application uses privacy-respecting usage analytics (Vercel Analytics) that collects aggregated, anonymized visit statistics. No personally identifying information is recorded.

## Contact

Questions? Email support@pseudorun.tech.
```

## Appendix B: Things that go wrong

- **"Package failed validation: publisher does not match"** — your `STORE_PUBLISHER_CN` secret is wrong. Copy it exactly from Partner Center → Product identity. The `CN=` prefix is added by the template; don't include it in the secret value.
- **"Version must be greater than X.X.X.X"** — tag a higher version. Stores require strictly increasing versions.
- **"Package already exists"** — you tagged the same version twice. Bump and retag.
- **Certification failure on first run: "App crashes on launch"** — usually means `runFullTrust` wasn't granted or the exe path in the manifest is wrong. The workflow sets `Executable="PseudoRun.Desktop\PseudoRun.exe"` which expects the WPF publish output layout. If this breaks, test locally first with `msbuild wapproj /p:Configuration=Release` and double-click the resulting `.msix` in `AppPackages/`.
- **"Manifest icon is 1x1 pixel"** — you forgot to replace the placeholder images (step 5 above). Certification will reject this.
- **Azure AD submission "403 Forbidden"** — the Azure AD app wasn't assigned the **Manager** role in Partner Center (step 3.5).
