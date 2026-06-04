# Google Search Console monitoring for `/ai-tools/` and `/x/`

This repository ships landing pages under two SEO-relevant paths:

- `/ai-tools/` — Astro-generated AI-tools provider pages.
- `/x/` — static pages copied from `static/` during deployment.

Use `scripts/gsc_ai_tools_seo_report.py` to generate a weekly Google Search Console report for those paths. The script is intentionally read-only and uses OAuth refresh-token credentials from environment variables; it does not commit or print secrets.

## Required environment variables

```bash
GSC_PROPERTY=sc-domain:getalby.com
GSC_OAUTH_CLIENT_ID=...
GSC_OAUTH_CLIENT_SECRET=...
GSC_OAUTH_REFRESH_TOKEN=...
```

The OAuth token only needs the `webmasters.readonly` scope.

## Run locally

From the repository root:

```bash
python3 scripts/gsc_ai_tools_seo_report.py
```

By default the report is written to `reports/gsc/`:

- `reports/gsc/latest.md` — Slack/GitHub-readable summary.
- `reports/gsc/latest.json` — raw structured output for follow-up analysis.
- dated `gsc-ai-tools-YYYY-MM-DD.{md,json}` snapshots.

Use `GSC_REPORT_DIR=/some/path` to write elsewhere.

## Recommended weekly cadence

Google Search Console data usually lags by 2–3 days. The script therefore compares the most recent complete 28-day window ending at `today - 3 days` against the previous 28-day window.

Recommended schedule:

```cron
0 9 * * 1 cd /path/to/402-landing-pages && python3 scripts/gsc_ai_tools_seo_report.py
```

The report highlights:

1. Total clicks, impressions, CTR, and average position for `/ai-tools/` + `/x/`.
2. Weak-CTR pages with enough impressions to justify title/meta/H1 testing.
3. Striking-distance queries with average positions 8–20.
4. AI/API-intent demand currently landing elsewhere on `getalby.com`.
5. Concrete operating-loop recommendations.

## Interpreting `/x/`

`/x/` is new and may have no GSC rows until Google indexes those pages. Treat `0` rows as expected during the initial indexing window; monitor sitemap coverage and internal links separately.

## Security notes

- Do not commit OAuth credentials, access tokens, or raw `.env` files.
- The script mints short-lived access tokens in memory only.
- The script uses the Search Analytics API only; it cannot submit sitemaps or request URL inspection.
