/** Search tuning — aligned with marketplace `listings/search/config`. */

export const SEARCH_Q_MAX = 80;
export const SEARCH_Q_TSVECTOR_MIN = 3;
export const SEARCH_PAGE_MAX = 100;
export const SEARCH_LIMIT_DEFAULT = 20;
/** Raised so browse pages can load ~half of large local seed sets in one query. */
export const SEARCH_LIMIT_MAX = 120;
