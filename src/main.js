import { Actor, log } from 'apify';
import { fetchDownloadStats } from './cratesio.js';

await Actor.init();

const input = (await Actor.getInput()) ?? {};
const { crates, daysBack = 7 } = input;

if (!crates || crates.length === 0) {
    throw new Error('"crates" must contain at least one crate name.');
}

/** Must match the event name configured in this Actor's pay-per-event pricing on Apify. */
const DOWNLOAD_STATS_EVENT = 'download-stats-check';

const stats = await fetchDownloadStats({ crates, daysBack });

for (const stat of stats) {
    await Actor.pushData(stat);
}

await Actor.charge({ eventName: DOWNLOAD_STATS_EVENT });

log.info(`Pushed download stats for ${stats.length} crate(s)`);

await Actor.exit();
