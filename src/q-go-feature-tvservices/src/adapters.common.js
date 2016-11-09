export const certificateAdapter = (r) => {
  if (r === '--') {
    return null;
  }
  return r;
};

export const synopsisAdapter = (sy) => sy || '';

export const fiveStarRating = (reviewrating) => {
  if (!reviewrating) {
    return null;
  }
  return Math.round((reviewrating / 100) * 5);
};

export const durationAdapter = (durationInSeconds) => Number(durationInSeconds) / 60.0;
