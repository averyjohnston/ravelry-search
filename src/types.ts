/**
 * Note: Ravelry's API docs are woefully lacking on many of these interfaces.
 * Type information is a combination of the docs, actual observed data, and
 * educated guessing. Some fields may be missing or wrong.
 */

// --- endpoint results ---

export interface QueueCreateEndpointResult {
  queued_project: QueuedProjectFull,
}

export interface QueueListEndpointResult {
  queued_projects: QueuedProjectSmall[],
  paginator: Paginator,
}

export interface QueueShowEndPointResult {
  queued_project: QueuedProjectFull,
}

export interface PatternSearchEndpointResult {
  patterns: PatternList[],
  paginator: Paginator,
}

export interface ProjectListEndpointResult {
  projects: ProjectSmall[],
  paginator: Paginator,
}

export interface ProjectSearchEndpointResult {
  projects: ProjectList[],
  paginator: Paginator,
}

export interface ProjectShowEndpointResult {
  project: ProjectFull,
}

export interface StashSearchEndpointResult {
  stashes: StashList[],
  paginator: Paginator,
}

// --- first-level result structures ---

interface PackFull {
  color_family_id: number | null,
  colorway: string | null,
  dye_lot: string | null,
  grams_per_skein: number | null,
  id: number | null,
  meters_per_skein: number | null,
  ounces_per_skein: number | null,
  personal_name: string | null,
  prefer_metric_length: boolean | null,
  prefer_metric_weight: boolean | null,
  primary_pack_id: number | null,
  project_id: number | null,
  quantity_description: string | null,
  shop_id: number | null,
  shop_name: string | null,
  skeins: number | null,
  stash_id: number | null,
  thread_size: number | null,
  total_grams: number | null,
  total_meters: number | null,
  total_ounces: number | null,
  total_yards: number | null,
  yards_per_skein: number | null,
  yarn: YarnSmall | null,
  yarn_id: number | null,
  yarn_name: string | null,
  yarn_weight: YarnWeight,
}

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

interface PatternFull {
  comments_count: number,
  craft: CraftList,
  created_at: string,
  currency: string,
  currency_symbol: string,
  difficulty_average: number,
  difficulty_count: number | null,
  download_location: DownloadLocation,
  downloadable: boolean,
  favorites_count: number,
  free: boolean,
  gauge: string,
  gauge_description: string,
  gauge_divisor: number,
  gauge_pattern: string,
  generally_available: string,
  has_uk_terminology: boolean | null,
  has_us_terminology: boolean | null,
  id: number,
  languages: Language[],
  name: string,
  notes_html: string,
  packs: PackFull[],
  pattern_attributes: PatternAttribute[],
  pattern_author: PatternAuthor[],
  pattern_categories: PatternCategory[],
  pattern_needle_sizes: NeedleSize[],
  pattern_type: PatternType,
  pdf_in_library: boolean,
  pdf_url: string,
  permalink: string,
  personal_attributes: PersonalAttributes,
  photos: Photo[],
  price: string,
  printings: Printing[],
  product_id: number,
  projects_count: number,
  published: string,
  queued_projects_count: number,
  rating_average: number,
  rating_count: number | null,
  ravelry_download: boolean,
  row_gauge: number,
  sizes_available: string,
  unlisted_product_ids: number[] | null,
  updated_at: string,
  url: string,
  volumes_in_library: number[] | null,
  yardage: number,
  yardage_description: string,
  yardage_max: number,
  yarn_list_type: number,
  yarn_weight: YarnWeight,
  yarn_weight_description: string,
}

export interface ProjectSmall {
  comments_count: number,
  completed: string | null,
  completed_day_set: boolean,
  craft_id: number | null,
  craft_name: string | null,
  created_at: string,
  ends_per_inch: number | null,
  favorites_count: number,
  first_photo: Photo | null,
  gauge: number | null,
  gauge_divisor: number | null,
  gauge_pattern: string,
  gauge_repeats: number | null,
  id: number,
  links: object,
  made_for: string,
  made_for_user_id: number | null,
  name: string,
  pattern_id: number | null,
  pattern_name: string | null,
  permalink: string,
  photos_count: number,
  picks_per_inch: number | null,
  progress: number | null,
  project_status_changed: string,
  project_status_id: number,
  rating: number | null,
  row_gauge: number | null,
  size: string,
  started: string | null,
  started_day_set: boolean,
  status_name: string,
  tag_names: string[],
  updated_at: string,
  user_id: number,
}

export interface ProjectList extends ProjectSmall {
  user: UserSmall,
}

export interface ProjectFull extends ProjectList {
  notes: string,
  notes_html: string,
  packs: PackFull[],
  private_notes: string | null,
  private_notes_html: string | null,
}

interface QueuedProjectSmall {
  best_photo: Photo | null,
  created_at: string,
  id: number,
  name: string,
  notes: string,
  pattern_author_id: number,
  pattern_author_name: string,
  pattern_id: number | null,
  pattern_name: string,
  position_in_queue: number | null,
  short_pattern_name: string,
  skeins: number | null,
  sort_order: number | null,
  user_id: number,
  yarn_id: number | null,
  yarn_name: string,
}

export interface QueuedProjectFull {
  best_photo: Photo | null,
  created_at: string,
  id: number,
  name: string,
  notes: string,
  notes_html: string,
  pattern: PatternFull,
  pattern_id: number | null,
  pattern_name: string,
  position_in_queue: number | null,
  queued_stashes: QueuedStashFull[],
  skeins: number | null,
  sort_order: number | null,
  user_id: number,
  yarn_id: number | null,
  yarn_name: string | null,
}

interface StashFull {
  color_family_name: string | null,
  colorway_name: string,
  comments_count: number,
  created_at: string,
  dye_lot: string,
  favorites_count: number,
  handspun: boolean,
  has_photo: boolean,
  id: number,
  location: string,
  long_yarn_weight_name: string,
  name: string,
  notes: string,
  notes_html: string,
  packs: PackStash[],
  permalink: string,
  personal_yarn_weight: YarnWeight | null,
  photos: Photo[],
  stash_status: StashStatus,
  tag_names: string[],
  updated_at: string,
  user: UserSmall,
  user_id: number,
  yarn: YarnFull,
  yarn_weight_name: string,
}

export interface StashList {
  color_family_name: string | null,
  colorway_name: string,
  comments_count: number,
  created_at: string,
  dye_lot: string | null,
  favorites_count: number,
  first_photo: Photo,
  handspun: boolean,
  has_photo: boolean,
  id: number,
  location: string,
  long_yarn_weight_name: string,
  name: string,
  permalink: string,
  personal_yarn_weight: YarnWeight | null,
  stash_status: StashStatus,
  tag_names: string[],
  updated_at: string,
  user: UserSmall,
  yarn: YarnStashList,
  yarn_weight_name: string,
}

interface YarnSmall {
  id: number,
  name: string,
  permalink: string,
  yarn_company_id: number,
  yarn_company_name: string,
}

interface YarnStashList {
  discontinued: boolean,
  gauge_divisor: number,
  grams: number,
  id: number,
  machine_washable: boolean,
  max_gauge: number,
  min_gauge: number,
  name: string,
  notes_html: string | null,
  permalink: string,
  photos: Photo[],
  rating_average: number,
  rating_count: number,
  rating_total: number,
  texture: string,
  thread_size: number | null,
  wpi: number | null,
  yardage: number,
  yarn_company: YarnCompany,
  yarn_company_name: string,
  yarn_weight: YarnWeight,
}

interface YarnFull {
  discontinued: boolean,
  gauge_divisor: number,
  grams: number,
  id: number,
  machine_washable: boolean,
  max_gauge: number | null,
  max_hook_size: NeedleSize | null,
  max_needle_size: NeedleSize | null,
  min_gauge: number | null,
  min_hook_size: NeedleSize | null,
  name: string,
  notes_html: string,
  permalink: string,
  photos: Photo[],
  rating_average: number,
  rating_count: number,
  rating_total: number,
  texture: string,
  thread_size: number | null,
  wpi: number | null,
  yardage: number,
  yarn_attributes: YarnAttribute[],
  yarn_company: YarnCompany,
  yarn_fibers: YarnFiber[],
  yarn_weight: YarnWeight[],
  yarn_weight_name: string,
}


// --- second-level structures ---

interface CraftList {
  id: number,
  name: string,
  permalink: string,
}

interface DownloadLocation {
  free: boolean,
  type: string,
  url: string,
}

interface FiberCategory {
  id: number,
  name: string,
  parent?: FiberCategory,
  permalink: string,
}

interface FiberType {
  animal_fiber: boolean,
  id: number,
  name: string,
  synthetic: boolean,
  vegetable_fiber: boolean,
}

interface Language {
  code: string,
  id: number,
  name: string,
  permalink: string,
  short_name: string,
  universal: boolean,
}

interface NeedleSize {
  crochet: boolean,
  hook: string | null,
  id: number,
  metric: number,
  name: string,
  pretty_metric: string,
  us: string | null,
  us_steel: string | null,
}

interface PackStash {
  color_attributes: string[],
  color_family_id: number | null,
  colorway: string,
  dye_lot: string,
  grams_per_skein: number,
  id: number,
  meters_per_skein: number,
  ounces_per_skein: number,
  personal_name: string | null,
  prefer_metric_length: boolean,
  prefer_metric_weight: boolean,
  primary_pack_id: number | null,
  project_id: number | null,
  quantity_description: string | null,
  shop_id: number | null,
  shop_name: string | null,
  skeins: number,
  stash_id: number,
  thread_size: string | null,
  total_grams: number,
  total_meters: number,
  total_ounces: number,
  total_yards: number,
  yards_per_skein: number,
  yarn_id: number,
}

interface Paginator {
  last_page: number,
  page: number,
  page_count: number,
  page_size: number,
  results: number,
}

interface PatternAttribute {
  id: number,
  permalink: string,
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

interface PatternCategory {
  id: number,
  name: string,
  parent: PatternCategory,
  permalink: string,
}

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

interface PatternType {
  clothing: boolean,
  id: number,
  name: string,
  permalink: string,
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

interface Printing {
  created_at: string,
  id: number,
  pattern_id: number,
  primary_source: boolean | null,
}

interface QueuedStashFull {
  created_at: string,
  id: number,
  queued_project_id: number,
  stash: StashFull,
  stash_id: number,
  updated_at: string,
}

interface StashStatus {
  id: number,
  name: string,
}

interface UserSmall {
  id: number,
  large_photo_url?: string,
  photo_url: string,
  small_photo_url: string,
  tiny_photo_url: string,
  username: string,
}

interface YarnAttribute {
  description: string,
  id: number,
  name: string,
  permalink: string,
  yarn_attribute_group: YarnAttributeGroup,
}

interface YarnAttributeGroup {
  id: number,
  name: string,
  permalink: string,
}

interface YarnCompany {
  id: number,
  name: string,
  permalink: string,
  url: string,
  yarns_count: number,
}

interface YarnFiber {
  fiber_category: FiberCategory,
  fiber_type: FiberType,
  id: number,
  percentage: number,
}

interface YarnWeight {
  crochet_gauge: string | null,
  id: number,
  knit_gauge: string | null,
  max_gauge: string | null,
  min_gauge: string | null,
  name: string,
  ply: string,
  wpi: number | null,
}


// --- custom types ---

export interface ExtendedQueuedProjectSmall extends QueuedProjectSmall {
  craft: 'crochet' | 'knitting',
  isReadyToMake: boolean,
}

export type CardLinkType = 'queue' | 'pattern';
export function isCardLinkType(str: string): str is CardLinkType {
  return ['queue', 'pattern'].includes(str);
}
