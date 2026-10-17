/**
 * Lead Priority Classification for CoolCane Franchise Enquiries.
 *
 * Rules:
 * - HOT:  Planned opening within 3 months ("Within 2 months")
 * - WARM: Planned opening more than 3 months and up to 6 months ("Within 6 months")
 * - COLD: Planned opening more than 6 months away, or just exploring
 *         ("Within 1 year", "More than 1 year", "Just exploring opportunities")
 *
 * Priority is strictly calculated based on opening timeline and is independent of
 * investment readiness.
 *
 * @param {string} openingTimeline - Selected timeline answer
 * @returns {'HOT' | 'WARM' | 'COLD'}
 */
export function classifyLeadPriority(openingTimeline) {
  if (!openingTimeline || typeof openingTimeline !== 'string') {
    throw new Error('Invalid or missing opening timeline');
  }

  const normalized = openingTimeline.trim().toLowerCase();

  switch (normalized) {
    case 'within 2 months':
      return 'HOT';
    case 'within 6 months':
      return 'WARM';
    case 'within 1 year':
    case 'more than 1 year':
    case 'just exploring opportunities':
      return 'COLD';
    default:
      // Robust fallback matching for edge cases/variations
      if (normalized.includes('2 month')) return 'HOT';
      if (normalized.includes('6 month')) return 'WARM';
      if (
        normalized.includes('1 year') ||
        normalized.includes('more than') ||
        normalized.includes('exploring')
      ) {
        return 'COLD';
      }
      throw new Error(`Unrecognized opening timeline option: "${openingTimeline}"`);
  }
}

export const LEAD_PRIORITIES = {
  HOT: 'HOT',
  WARM: 'WARM',
  COLD: 'COLD',
};
