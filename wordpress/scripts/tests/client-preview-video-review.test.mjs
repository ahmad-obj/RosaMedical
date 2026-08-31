import assert from 'node:assert/strict';

import { buildReviewTimes } from '../client-preview-video-review.mjs';

const times = buildReviewTimes(6.2);

assert.deepEqual(
  times,
  [0, 1, 2, 3, 4, 5, 6],
  'review timeline must sample every second so short page visits remain inspectable',
);
assert.ok(times.at(-1) <= 6.15, 'review timeline must not seek beyond the playable video range');

process.stdout.write('PASS: client preview video review timeline\n');
