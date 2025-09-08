const { ZOOM_RECORDINGS_URL } = require("../config/constants");
const { currentMonthRange } = require("./constants");
const { log, logError } = require("./logger");

async function fetchZoomRecordings({ zoomToken, range }) {
  const recordings = [];

  for (const [from, to] of [range || currentMonthRange]) {
    const url = new URL(ZOOM_RECORDINGS_URL);
    url.searchParams.set("from", from);
    url.searchParams.set("to", to);
    url.searchParams.set("page_size", "100");

    log(`📆 Fetching from ${from} to ${to}`);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${zoomToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      logError('Zoom API Error:', data);
      throw new Error(data.message || 'Failed to fetch recordings');
    }
    
    if (data?.meetings?.length) {
      recordings.push(...data.meetings);
    }
  }

  return recordings;
}

module.exports = {
  fetchZoomRecordings
}