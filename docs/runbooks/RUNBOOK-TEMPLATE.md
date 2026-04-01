# Runbook: [Incident / Procedure Name]

**Owner:** [Team / Person]
**Last Verified:** YYYY-MM-DD
**Severity:** P0 / P1 / P2 / P3

---

## Overview

What is this runbook for? When should it be used?

## Symptoms / Alerts

How do you know this issue is happening?

- [ ] Alert: [Alert name and source]
- [ ] Symptom: [Observable behavior]

## Prerequisites

- [ ] Access to [system/tool]
- [ ] Permissions: [required role]

## Steps

### 1. Assess

- [ ] Check [dashboard/logs/metrics URL]
- [ ] Determine scope: how many users affected?
- [ ] Is this a known issue? Check [runbook index / incident channel]

### 2. Mitigate

- [ ] [Immediate action to reduce impact]
- [ ] [e.g., Scale up, toggle feature flag, redirect traffic]

### 3. Diagnose

- [ ] Check application logs: `[command or log location]`
- [ ] Check database: `[query or dashboard]`
- [ ] Check dependencies: `[health check URLs]`

### 4. Resolve

- [ ] [Fix steps]
- [ ] [Deploy fix or rollback: `[command]`]

### 5. Verify

- [ ] Confirm metrics return to normal
- [ ] Confirm alerts clear
- [ ] Spot-check user-facing behavior

## Rollback Procedure

If the fix doesn't work:

1.
2.

## Escalation

| Condition | Escalate To | Contact |
|-----------|-------------|---------|
| > 15 min unresolved | [Team lead] | [contact] |
| Data loss suspected | [Eng manager] | [contact] |

## Post-Incident

- [ ] Write incident report (use incident template)
- [ ] Schedule post-mortem within 48 hours
- [ ] File follow-up tickets for prevention

## Revision History

| Date | Author | Change |
|------|--------|--------|
|      |        |        |
