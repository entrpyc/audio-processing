const format = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const now = new Date();

const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
const currentMonthEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 0);

const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
const previousMonthEnd   = new Date(now.getFullYear(), now.getMonth(), 0);

const currentMonthRange  = [format(currentMonthStart), format(currentMonthEnd)];
const previousMonthRange = [format(previousMonthStart), format(previousMonthEnd)];

module.exports = {
  currentMonthRange,
  previousMonthRange,
};
