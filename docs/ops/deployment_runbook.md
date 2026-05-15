# Deployment Runbook: ArkaDex MVP

---
**Audience**: Developers, DevOps Engineers  
**Purpose**: Standard Operating Procedures (SOP) for project initialization, secret management, and deployment rollbacks on Vercel.  
**Version**: 1.0.0  
**Status**: Stable  
---

This document provides actionable steps to maintain the ArkaDex production environment. Follow these procedures to ensure deployment consistency and security.

> [!IMPORTANT]
> Access to the **Vercel Dashboard**, **GitHub Repository Settings**, and **Supabase Dashboard** is required before proceeding.

---

## 1. Initial Vercel Project Setup

**Goal**: Initialize the Vercel project and link it to the GitHub repository for automated CI/CD.

### Prerequisites
- Install Vercel CLI (`npm i -g vercel`).
- Authenticate the CLI session (`vercel login`).

### Steps
1. Open the terminal and navigate to the project root directory.
2. Run the initialization command:
   ```bash
   vercel
   ```
3. Enter **Y** to "Set up and deploy?".
4. Select the appropriate team scope.
5. Enter **N** to "Link to existing project?".
6. Accept default build settings by pressing **Enter**.
7. Navigate to the **Vercel Dashboard > Settings > Git**.
8. Connect the repository to GitHub.
9. Set the **Production Branch** to `main`.

### Expected Output
- The project is visible in the Vercel Dashboard.
- Every push to the `main` branch triggers a production build.

### Troubleshooting
- **Build Failure**: Check the *Deployments* tab for error logs.
- **Cache Issues**: Redeploy using the "Clear Cache" option if unexpected build errors occur.

---

## 2. Environment Variables & Secret Management

**Goal**: Configure and rotate production credentials without committing them to version control.

### Prerequisites
- Active Vercel project link.
- Valid Supabase project credentials.

### Steps
1. Open the terminal in the project root.
2. Add the Supabase URL:
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   ```
3. Add the Supabase Anonymous Key:
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
4. Select **Production**, **Preview**, and **Development** environments when prompted.
5. Open the **Vercel Dashboard > Settings > Environment Variables**.
6. Verify that all keys are present and correctly formatted.
7. Trigger a new deployment to apply the changes.

### Expected Output
- The application successfully connects to Supabase in production.

### Troubleshooting
- **Missing Variables**: Ensure the environment scope (Production vs. Preview) matches your deployment type.
- **Connection Error**: Verify that there are no leading or trailing spaces in the environment variable values.

---

## 3. Incident Response: Deployment Rollback

**Goal**: Revert to a previous stable version during critical production failures.

### Prerequisites
- Access to the Vercel Dashboard.
- ID or Timestamp of the last known stable deployment.

### Steps
1. Open the Vercel Dashboard.
2. Select the **ArkaDex** project.
3. Click the **Deployments** tab.
4. Identify the last deployment with a green **Ready** status.
5. Click the **Vertical Ellipsis (...)** button on that deployment.
6. Select **Promote to Production**.
7. Click **Promote** in the confirmation dialog.

### Expected Output
- Production traffic shifts to the stable version in less than 2 minutes.

### Troubleshooting
- **UI Unresponsive**: Use the CLI to force a production rollback:
  ```bash
  vercel deploy --prebuilt --prod
  ```

---

## 4. Security: Secret Leak Response

**Goal**: Invalidate leaked credentials and restore repository integrity.

### Prerequisites
- GitHub repository administrator permissions.

### Steps
1. Review the **Gitleaks** findings in the GitHub Actions logs.
2. Delete the secret from the source code.
3. Commit and push the fix immediately.
4. Generate a new key in the **Supabase Dashboard**.
5. Update the key in **Vercel Settings** (see Section 2).
6. Revoke the leaked key in the **Supabase Dashboard**.
7. Scrub the Git history using `git filter-repo` if the secret was highly sensitive.

### Expected Output
- Leaked keys are invalidated and replaced.
- CI/CD pipeline returns to a "Passing" state.

---

## Revision History

| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2026-05-15 | 1.0.0 | Initial release (English) following Diátaxis framework. | Tech Writer |
