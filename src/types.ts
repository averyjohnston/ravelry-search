// --- endpoint results ---

export interface QueueListEndpointResult {
  queued_projects: QueuedProjectSmall[],
  paginator: Paginator,
}

export interface PatternSearchEndpointResult {
  patterns: PatternList[],
  paginator: Paginator,
}


// --- first-level result structures ---

export interface PatternList {
  designer: PatternAuthor,
  first_photo: Photo | null,
  free: boolean,
  id: number,
  name: string,
  pattern_author: PatternAuthor,
  pattern_sources: PatternSourceList[],
  permalink: string,
  personal_attributes: PersonalAttributes | null,
}

interface QueuedProjectSmall {
  best_photo: Photo,
  created_at: string,
  id: number,
  name: string,
  notes: string,
  pattern_author_id: number,
  pattern_author_name: string,
  pattern_id: number | null,
  pattern_name: string,
  position_in_queue: number,
  short_pattern_name: string,
  skeins: number | null,
  sort_order: number | null,
  user_id: number,
  yarn_id: number | null,
  yarn_name: string,
}


// --- second-level structures ---

interface Paginator {
  last_page: number,
  page: number,
  page_count: number,
  page_size: number,
  results: number,
}

interface PatternAuthor {
  crochet_pattern_count: number,
  favorites_count: number,
  id: number,
  knitting_pattern_count: number,
  name: string,
  patterns_count: number,
  permalink: string,
  users: UserSmall[],
}

/**
 * Note: The API docs are woefully out of date here and missing a ton of info.
 * Types listed here are taken from the docs to avoid guessing, but if you
 * need more data, check one of the actual returned objects.
 */
interface PatternSourceList {
  amazon_rating: number | null,
  amazon_url: string | null,
  author: string | null,
  id: number,
  list_price: number | null,
  name: string,
  out_of_print: boolean,
  pattern_source_type_id: number,
  patterns_count: number,
  permalink: string,
  price: number | null,
  shelf_image_path: string | null,
  url: string,
}

interface PersonalAttributes {
  bookmark_id: number | null,
  favorited: boolean,
  in_library: boolean,
  queued: boolean,
}

interface Photo {
  caption: string | null,
  captin_html: string | null,
  copyright_holder: string,
  id: number,
  medium2_url: string,
  medium_url: string,
  small2_url: string,
  small_url: string,
  sort_order: number,
  square_url: string,
  thumbnail_url: string,
  user_id: number,
  x_offset: number | null,
  y_offset: number | null,
}

interface UserSmall {
  id: number,
  large_photo_url?: string,
  photo_url: string,
  small_photo_url: string,
  tiny_photo_url: string,
  username: string,
}
