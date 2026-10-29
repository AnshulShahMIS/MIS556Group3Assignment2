# GitHub Pages deployment status

Prepared October 29, 2026. Version 0.5.0 separates the Pages interface from a configurable hosted API.

Implemented: static-only GitHub Actions deployment, public backend URL configuration, relative asset paths for project sites, Node hosting support, an exact origin allowlist, preflight handling and a shared in-process daily request limit. All 86 automated tests pass.

Pending: creation of the GitHub repository, uploading/pushing the source, deploying the AI backend, adding its secret privately, setting the repository backend URL variable, enabling Pages and verifying an actual public AI conversation. GitHub is connected, but browser sign-in is needed for repository creation and Pages administration because these operations are not exposed by the available connector.

The Render configuration is preparation, not a running deployment. A separate host is required for the Node backend. No hosted URL, student-study result or new general accuracy result is claimed.

Earlier readiness, scripts and live evaluation files refer to version 0.4 and are retained as development evidence. This file and the root README govern the Pages deployment status.
