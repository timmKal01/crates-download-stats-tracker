# Crates.io Download Stats Tracker — Trend by Crate

Get download counts for one or more Rust crates over a chosen period,
plus percent change versus the immediately prior period of the same
length.

Built for tracking Rust ecosystem adoption trends — is a crate gaining
or losing ground — the Rust-ecosystem counterpart to [NPM Download
Stats Tracker](https://github.com/timmKal01/npm-download-stats-tracker)
and [PyPI Download Stats
Tracker](https://github.com/timmKal01/pypi-download-stats-tracker).

## Input

```json
{
  "crates": ["serde", "tokio", "clap"],
  "daysBack": 7
}
```

| Field | Type | Description |
|---|---|---|
| `crates` | array of strings | Rust crate names to check, e.g. `"serde"`, `"tokio"`. At least one required. |
| `daysBack` | number | Length of the period to measure, and also the length of the prior period it's compared against. Default `7`, max `45`. |

## Output

One record per crate:

```json
{
  "crate": "serde",
  "currentPeriodDownloads": 3690672,
  "currentPeriodStart": "2026-08-09",
  "currentPeriodEnd": "2026-08-16",
  "previousPeriodDownloads": 3702415,
  "previousPeriodStart": "2026-08-01",
  "previousPeriodEnd": "2026-08-08",
  "percentChange": -0.32
}
```

`currentPeriodDownloads` is `null` for a crate name that doesn't exist
(typo or unpublished). crates.io's public stats retain roughly the last
90 days of history.

A request is billed once regardless of how many crates are checked.

## How it works

Direct calls to the official [crates.io
API](https://crates.io/data-access#api) (`crates.io/api/v1`) — no
proxy, no key, no scraping.

## Pricing note

Billed per **request**, not per crate returned — one charge whether you
check 1 crate or several.

## Related products

- [NPM Download Stats Tracker](https://github.com/timmKal01/npm-download-stats-tracker) — the same trend tracking for npm/JavaScript packages
- [PyPI Download Stats Tracker](https://github.com/timmKal01/pypi-download-stats-tracker) — the same trend tracking for PyPI/Python packages
