---
description: Security rules for all code changes
globs: "**/*"
---

# Security Rules

- Never hardcode secrets, tokens, passwords, or API keys.
- Never log sensitive data (passwords, tokens, PII).
- Sanitize all user inputs before use in queries, commands, or templates.
- Use parameterized queries — never string-concatenate SQL.
- Validate and sanitize file paths to prevent path traversal.
- Set appropriate CORS, CSP, and security headers.
- Use HTTPS for all external communications.
- Apply principle of least privilege for all access controls.
