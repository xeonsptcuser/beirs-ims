# BEIRS_IMS_APP

Barangay E-Information & Reporting System (BEIRS) is a role-based platform for handling community reports, certificate requests, and notifications between residents, barangay staff, and administrators.

## Core capabilities
- **Role-based authentication and authorization** to secure resident, staff, and admin experiences.
- **Status notifications** delivered through SMS/app channels so users stay informed about case progress and approvals.
- **Audit trails** that log key interactions for monitoring and accountability.

## Resident features
- Register, log in/out, and maintain a personal profile.
- Submit blotter/case reports (with media uploads) and track their status.
- Request barangay certifications (clearance, indigency, residency, etc.).

## Barangay staff features
- Review and triage submitted blotter reports with evidence review.
- Access resident details tied to a report.
- Approve or reject blotter cases and certificate requests.

## Admin features
- Manage user accounts (create/update residents and staff, view all users and individual records).
- Approve or reject blotter reports and certificate requests.
- Generate heatmap-style summaries that surface hotspots based on reported incident locations.

---

## Contributing workflow
To keep the `develop` branch stable, follow this workflow when pushing changes:

1. `git checkout develop` to start from the main branch.
2. `git pull` to ensure your local branch is up to date.
3. Create a feature branch: `git checkout -b feat/<role>/<figma_screen>-001` (e.g., `git checkout -b feat/admin/login-001`).
4. Stage only the intended changes: `git add .` (verify the diff before committing).
5. Commit with a clear message: `git commit -m "<your_commit_message>"`.
6. Push and follow the suggested command if Git shows a remote tip.

### Creating a Pull Request
1. Open the repository in GitHub.
2. Use the **Pull Request** button to start a PR from your feature branch.
3. Request a review and double-check the diff before merging to keep `develop` healthy.
