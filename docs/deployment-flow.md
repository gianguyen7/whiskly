# Deployment Flow

## Environments

| Environment | Purpose | Deploys From | Auto/Manual |
|-------------|---------|-------------|-------------|
| Local | Development | working branch | N/A |
| Staging | Integration testing, QA | `main` | Auto on merge |
| Production | Live users | `main` (tagged release) | Manual approval |

## Deployment Pipeline

```
PR Opened
  → CI: lint + unit tests + integration tests
  → Code review (1 approval minimum)
  → Merge to main
      → Auto-deploy to Staging
      → Smoke tests run against staging
      → Manual QA sign-off (for significant changes)
      → Tag release (vX.Y.Z)
          → Manual approval to deploy to Production
          → Production deploy
          → Post-deploy health checks
```

## Release Process

1. **Prepare:** Ensure `main` is green. Review what's shipping (compare staging to prod).
2. **Tag:** Create a semver tag: `git tag -a vX.Y.Z -m "Release vX.Y.Z"`
3. **Release notes:** Fill out `docs/templates/RELEASE-NOTES.md` for the version.
4. **Deploy:** Trigger production deploy (manual approval in CI).
5. **Verify:** Run post-deploy checks. Monitor dashboards for 30 min.
6. **Announce:** Post release notes to the team.

## Rollback

- **Staging:** Redeploy the previous `main` commit.
- **Production:** Revert the tagged release and redeploy, or toggle feature flags.
- **Database migrations:** Must be backwards-compatible. Roll forward, never back.

## Feature Flags

For any non-trivial feature:
1. Ship behind a feature flag (off by default)
2. Enable on staging first
3. Gradual rollout in production (10% → 50% → 100%)
4. Remove flag after full rollout is stable for 1 week

## Pre-Deploy Checklist

- [ ] All CI checks green
- [ ] No pending database migrations without a rollback plan
- [ ] Feature flags configured
- [ ] Monitoring dashboards reviewed
- [ ] On-call engineer aware
