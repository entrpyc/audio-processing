const { ZOOM_RECORDINGS_URL } = require("../config/constants");
const { log, logError } = require("./logger");

async function fetchZoomRecordings({ zoomToken }) {
  const format = (d) => d.toISOString().split("T")[0];

  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(currentMonthStart);
  previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
  const twoMonthsAgoStart = new Date(currentMonthStart);
  twoMonthsAgoStart.setMonth(twoMonthsAgoStart.getMonth() - 2);

  const twoMonthsAgoEnd = new Date(previousMonthStart);
  twoMonthsAgoEnd.setDate(0);
  const previousMonthEnd = new Date(currentMonthStart);
  previousMonthEnd.setDate(0);
  const currentMonthEnd = now;

  const ranges = [
    [format(twoMonthsAgoStart), format(twoMonthsAgoEnd)],
    [format(previousMonthStart), format(previousMonthEnd)],
    [format(currentMonthStart), format(currentMonthEnd)],
  ];

  const allRecordings = [];

  for (const [from, to] of ranges) {
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
      allRecordings.push(...data.meetings);
    }
  }

  return allRecordings;
}

module.exports = {
  fetchZoomRecordings
}