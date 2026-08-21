const BASE_URL = 'https://crates.io/api/v1/crates';
const UA = 'CratesDownloadStatsTracker/0.1 (+contact: crates-stats-tracker-admin@example.com)';

function toDateOnly(date) {
    return date.toISOString().slice(0, 10);
}

/** Sums the crate-wide daily download totals within [startDate, endDate] (inclusive). */
async function fetchCrateTotal(crate, startDate, endDate) {
    const res = await fetch(`${BASE_URL}/${encodeURIComponent(crate)}/downloads`, {
        headers: { 'User-Agent': UA, Connection: 'close' },
    });
    if (res.status === 404) return null; // unknown crate
    if (!res.ok) throw new Error(`crates.io request failed for "${crate}": ${res.status} ${res.statusText}`);

    const body = await res.json();
    const start = toDateOnly(startDate);
    const end = toDateOnly(endDate);

    return (body.meta?.extra_downloads ?? [])
        .filter((row) => row.date >= start && row.date <= end)
        .reduce((sum, row) => sum + row.downloads, 0);
}

export async function fetchDownloadStats({ crates, daysBack }) {
    const currentEnd = new Date();
    const currentStart = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
    const previousEnd = new Date(currentStart.getTime() - 24 * 60 * 60 * 1000);
    const previousStart = new Date(previousEnd.getTime() - daysBack * 24 * 60 * 60 * 1000);

    return Promise.all(
        crates.map(async (crate) => {
            const [currentDownloads, previousDownloads] = await Promise.all([
                fetchCrateTotal(crate, currentStart, currentEnd),
                fetchCrateTotal(crate, previousStart, previousEnd),
            ]);
            const percentChange =
                currentDownloads !== null && previousDownloads
                    ? Number((((currentDownloads - previousDownloads) / previousDownloads) * 100).toFixed(2))
                    : null;

            return {
                crate,
                currentPeriodDownloads: currentDownloads,
                currentPeriodStart: toDateOnly(currentStart),
                currentPeriodEnd: toDateOnly(currentEnd),
                previousPeriodDownloads: previousDownloads,
                previousPeriodStart: toDateOnly(previousStart),
                previousPeriodEnd: toDateOnly(previousEnd),
                percentChange,
            };
        }),
    );
}
