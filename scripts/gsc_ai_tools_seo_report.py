#!/usr/bin/env python3
"""Generate a Google Search Console SEO report for getalby.com AI-tools landing pages.

Requires env vars:
  GSC_PROPERTY, GSC_OAUTH_CLIENT_ID, GSC_OAUTH_CLIENT_SECRET, GSC_OAUTH_REFRESH_TOKEN

Writes markdown + JSON under ~/.hermes/alby-seo/.
"""
from __future__ import annotations

import datetime as dt
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from collections import defaultdict
from pathlib import Path
from typing import Any

OUT_DIR = Path(os.getenv("GSC_REPORT_DIR", "reports/gsc"))
BASE_URL = "https://searchconsole.googleapis.com/webmasters/v3"
LANDING_PREFIXES = ("/ai-tools/", "/x/")
AI_INTENT_RE = re.compile(
    r"\b(ai|agent|llm|mcp|api|search api|data api|enrich|extract|crawl|scrap|bitcoin|lightning|nwc|402|x402|l402|pay per call|payment|web search|serp|linkedin|coingecko|deepl|flights)\b",
    re.I,
)


def env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise SystemExit(f"Missing required env var: {name}")
    return value


def request_json(url: str, *, access_token: str | None = None, data: dict[str, Any] | None = None) -> dict[str, Any]:
    headers = {}
    body = None
    if access_token:
        headers["Authorization"] = f"Bearer {access_token}"
    if data is not None:
        headers["Content-Type"] = "application/json"
        body = json.dumps(data).encode()
    req = urllib.request.Request(url, data=body, headers=headers, method="POST" if data is not None else "GET")
    with urllib.request.urlopen(req, timeout=60) as response:
        return json.load(response)


def mint_token() -> str:
    body = urllib.parse.urlencode(
        {
            "client_id": env("GSC_OAUTH_CLIENT_ID"),
            "client_secret": env("GSC_OAUTH_CLIENT_SECRET"),
            "refresh_token": env("GSC_OAUTH_REFRESH_TOKEN"),
            "grant_type": "refresh_token",
        }
    ).encode()
    req = urllib.request.Request("https://oauth2.googleapis.com/token", data=body, method="POST")
    with urllib.request.urlopen(req, timeout=60) as response:
        payload = json.load(response)
    token = payload.get("access_token")
    if not token:
        raise SystemExit("OAuth token response did not include access_token")
    return token


def query_search_analytics(access_token: str, prop: str, body: dict[str, Any]) -> list[dict[str, Any]]:
    url = f"{BASE_URL}/sites/{urllib.parse.quote(prop, safe='')}/searchAnalytics/query"
    payload = request_json(url, access_token=access_token, data=body)
    return payload.get("rows", [])


def page_path(url: str) -> str:
    parsed = urllib.parse.urlparse(url)
    return parsed.path or "/"


def fmt_pct(x: float) -> str:
    return f"{x * 100:.1f}%"


def md_table(headers: list[str], rows: list[list[Any]], max_rows: int = 25) -> str:
    if not rows:
        return "_No rows._\n"
    out = ["| " + " | ".join(headers) + " |", "| " + " | ".join(["---"] * len(headers)) + " |"]
    for row in rows[:max_rows]:
        escaped = [str(cell).replace("|", "\\|").replace("\n", " ") for cell in row]
        out.append("| " + " | ".join(escaped) + " |")
    if len(rows) > max_rows:
        out.append(f"\n_Showing {max_rows} of {len(rows)} rows._")
    return "\n".join(out) + "\n"


def main() -> int:
    prop = env("GSC_PROPERTY")
    today = dt.date.today()
    end = today - dt.timedelta(days=3)  # GSC lag guard
    start = end - dt.timedelta(days=27)
    previous_end = start - dt.timedelta(days=1)
    previous_start = previous_end - dt.timedelta(days=27)

    access_token = mint_token()
    sites = request_json(f"{BASE_URL}/sites", access_token=access_token)
    site_match = next((s for s in sites.get("siteEntry", []) if s.get("siteUrl") == prop), None)
    if not site_match:
        raise SystemExit(f"Property {prop!r} not found in accessible GSC sites")

    def body_for(start_date: dt.date, end_date: dt.date, dimensions: list[str], page_contains: str | None = None, row_limit: int = 25000) -> dict[str, Any]:
        body: dict[str, Any] = {
            "startDate": start_date.isoformat(),
            "endDate": end_date.isoformat(),
            "dimensions": dimensions,
            "rowLimit": row_limit,
            "dataState": "final",
        }
        if page_contains:
            body["dimensionFilterGroups"] = [
                {"filters": [{"dimension": "page", "operator": "contains", "expression": page_contains}]}
            ]
        return body

    landing_rows: list[dict[str, Any]] = []
    landing_previous: list[dict[str, Any]] = []
    by_prefix: dict[str, list[dict[str, Any]]] = {}
    for prefix in LANDING_PREFIXES:
        rows = query_search_analytics(access_token, prop, body_for(start, end, ["query", "page"], prefix))
        prev = query_search_analytics(access_token, prop, body_for(previous_start, previous_end, ["query", "page"], prefix))
        by_prefix[prefix] = rows
        landing_rows.extend(rows)
        landing_previous.extend(prev)

    # Whole-domain query/page rows to find AI-intent demand landing elsewhere or not on the focused pages.
    site_rows = query_search_analytics(access_token, prop, body_for(start, end, ["query", "page"], None))

    def row_query_page(row: dict[str, Any]) -> tuple[str, str]:
        keys = row.get("keys", ["", ""])
        return (keys[0] if len(keys) > 0 else "", keys[1] if len(keys) > 1 else "")

    total = {
        "clicks": sum(r.get("clicks", 0) for r in landing_rows),
        "impressions": sum(r.get("impressions", 0) for r in landing_rows),
    }
    total["ctr"] = total["clicks"] / total["impressions"] if total["impressions"] else 0
    # Position aggregated weighted by impressions.
    total["position"] = (
        sum(r.get("position", 0) * r.get("impressions", 0) for r in landing_rows) / total["impressions"]
        if total["impressions"]
        else 0
    )
    prev_total = {
        "clicks": sum(r.get("clicks", 0) for r in landing_previous),
        "impressions": sum(r.get("impressions", 0) for r in landing_previous),
    }

    page_stats: dict[str, dict[str, Any]] = defaultdict(lambda: {"clicks": 0, "impressions": 0, "weighted_position": 0.0, "queries": set()})
    query_stats: dict[str, dict[str, Any]] = defaultdict(lambda: {"clicks": 0, "impressions": 0, "weighted_position": 0.0, "pages": set()})
    for row in landing_rows:
        q, p = row_query_page(row)
        imps = row.get("impressions", 0)
        page_stats[p]["clicks"] += row.get("clicks", 0)
        page_stats[p]["impressions"] += imps
        page_stats[p]["weighted_position"] += row.get("position", 0) * imps
        page_stats[p]["queries"].add(q)
        query_stats[q]["clicks"] += row.get("clicks", 0)
        query_stats[q]["impressions"] += imps
        query_stats[q]["weighted_position"] += row.get("position", 0) * imps
        query_stats[q]["pages"].add(p)

    page_summary = []
    for p, s in page_stats.items():
        imps = s["impressions"]
        page_summary.append(
            {
                "page": p,
                "path": page_path(p),
                "clicks": s["clicks"],
                "impressions": imps,
                "ctr": s["clicks"] / imps if imps else 0,
                "position": s["weighted_position"] / imps if imps else 0,
                "query_count": len(s["queries"]),
            }
        )
    page_summary.sort(key=lambda x: (x["impressions"], x["clicks"]), reverse=True)

    weak_ctr = [p for p in page_summary if p["impressions"] >= 5 and p["ctr"] < 0.03 and p["position"] <= 20]
    striking = []
    for q, s in query_stats.items():
        imps = s["impressions"]
        pos = s["weighted_position"] / imps if imps else 0
        ctr = s["clicks"] / imps if imps else 0
        if imps >= 2 and 8 <= pos <= 20:
            striking.append({"query": q, "clicks": s["clicks"], "impressions": imps, "ctr": ctr, "position": pos, "pages": sorted(s["pages"])})
    striking.sort(key=lambda x: (x["impressions"], -x["position"]), reverse=True)

    unmet = []
    for row in site_rows:
        q, p = row_query_page(row)
        if not q or not AI_INTENT_RE.search(q):
            continue
        path = page_path(p)
        if any(prefix in path for prefix in LANDING_PREFIXES):
            continue
        unmet.append(
            {
                "query": q,
                "page": p,
                "clicks": row.get("clicks", 0),
                "impressions": row.get("impressions", 0),
                "ctr": row.get("ctr", 0),
                "position": row.get("position", 0),
            }
        )
    unmet.sort(key=lambda x: (x["impressions"], -x["position"]), reverse=True)

    output = {
        "generated_at": dt.datetime.utcnow().replace(microsecond=0).isoformat() + "Z",
        "property": prop,
        "permission_level": site_match.get("permissionLevel"),
        "range": {"start": start.isoformat(), "end": end.isoformat()},
        "previous_range": {"start": previous_start.isoformat(), "end": previous_end.isoformat()},
        "landing_prefixes": LANDING_PREFIXES,
        "totals": total,
        "previous_totals": prev_total,
        "rows_by_prefix": {k: len(v) for k, v in by_prefix.items()},
        "page_summary": page_summary,
        "weak_ctr_pages": weak_ctr,
        "striking_distance_queries": striking,
        "unmet_ai_intent_queries_elsewhere": unmet[:100],
        "raw_landing_rows": landing_rows,
    }

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    json_path = OUT_DIR / f"gsc-ai-tools-{end.isoformat()}.json"
    md_path = OUT_DIR / f"gsc-ai-tools-{end.isoformat()}.md"
    latest_json = OUT_DIR / "latest.json"
    latest_md = OUT_DIR / "latest.md"
    json_text = json.dumps(output, indent=2, ensure_ascii=False)
    json_path.write_text(json_text)
    latest_json.write_text(json_text)

    delta_clicks = total["clicks"] - prev_total["clicks"]
    delta_imps = total["impressions"] - prev_total["impressions"]
    md = []
    md.append(f"# GSC SEO report — AI-tools landing pages ({start} to {end})\n")
    md.append(f"Generated: {output['generated_at']}  ")
    md.append(f"Property: `{prop}` (`{site_match.get('permissionLevel')}`)\n")
    md.append("## Executive summary\n")
    md.append(
        f"- Focus pages: `/ai-tools/` and `/x/`\n"
        f"- Current 28d: **{total['clicks']} clicks**, **{total['impressions']} impressions**, **{fmt_pct(total['ctr'])} CTR**, avg position **{total['position']:.1f}**\n"
        f"- Previous 28d delta: **{delta_clicks:+} clicks**, **{delta_imps:+} impressions**\n"
        f"- GSC rows: `/ai-tools/` **{len(by_prefix['/ai-tools/'])}**, `/x/` **{len(by_prefix['/x/'])}**\n"
    )
    md.append("## Top pages by impressions\n")
    md.append(
        md_table(
            ["Page", "Clicks", "Impr", "CTR", "Pos", "Queries"],
            [[p["path"], p["clicks"], p["impressions"], fmt_pct(p["ctr"]), f"{p['position']:.1f}", p["query_count"]] for p in page_summary],
            20,
        )
    )
    md.append("## Weak-CTR pages (impr ≥5, CTR <3%, avg pos ≤20)\n")
    md.append(
        md_table(
            ["Page", "Clicks", "Impr", "CTR", "Pos"],
            [[p["path"], p["clicks"], p["impressions"], fmt_pct(p["ctr"]), f"{p['position']:.1f}"] for p in weak_ctr],
            25,
        )
    )
    md.append("## Striking-distance queries (avg pos 8–20)\n")
    md.append(
        md_table(
            ["Query", "Clicks", "Impr", "CTR", "Pos", "Primary page"],
            [[q["query"], q["clicks"], q["impressions"], fmt_pct(q["ctr"]), f"{q['position']:.1f}", page_path(q["pages"][0]) if q["pages"] else ""] for q in striking],
            30,
        )
    )
    md.append("## AI/API-intent demand currently landing outside `/ai-tools/` + `/x/`\n")
    md.append(
        md_table(
            ["Query", "Landing page", "Clicks", "Impr", "CTR", "Pos"],
            [[u["query"], page_path(u["page"]), u["clicks"], u["impressions"], fmt_pct(u["ctr"]), f"{u['position']:.1f}"] for u in unmet],
            30,
        )
    )
    md.append("## Recommended operating loop\n")
    md.append(
        "1. Re-run weekly after GSC finalizes data (end date = today - 3 days).\n"
        "2. Prioritize pages with impressions but CTR <3%: rewrite title/meta/H1 around the visible query intent.\n"
        "3. For striking-distance queries, add exact-match sections, FAQs, and internal links from the directory/index page.\n"
        "4. For unmet demand landing elsewhere, create or adjust `/ai-tools/` pages only when intent matches an agent-usable paid API/use case.\n"
        "5. Track each shipped page change with an annotation and compare 28d vs previous 28d in this report.\n"
    )
    md_text = "\n".join(md)
    md_path.write_text(md_text)
    latest_md.write_text(md_text)
    print(f"Wrote {md_path}")
    print(f"Wrote {json_path}")
    print(f"Current: clicks={total['clicks']} impressions={total['impressions']} ctr={total['ctr']:.4f} pos={total['position']:.2f}")
    print(f"Rows: ai_tools={len(by_prefix['/ai-tools/'])} x={len(by_prefix['/x/'])} weak_ctr={len(weak_ctr)} striking={len(striking)} unmet={len(unmet)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
