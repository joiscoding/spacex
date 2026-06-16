# SpaceX launches data (local copy)

Downloaded: 2026-06-15 21:57 UTC
Source: [juliensimon/spacex-launches](https://huggingface.co/datasets/juliensimon/spacex-launches)

This folder contains three related tables from the Hugging Face dataset. Join on `slug` where applicable.

## Files

| Table | Rows | Parquet | CSV |
|-------|------|---------|-----|
| launches | 688 | `launches.parquet` | `launches.csv` |
| timelines | 3,913 | `timelines.parquet` | `timelines.csv` |
| carousel | 329 | `carousel.parquet` | `carousel.csv` |

## Column overview

### `launches`

`id`, `document_id`, `title`, `slug`, `mission_status`, `mission_type`, `vehicle`, `launch_site`, `launch_date`, `launch_time`, `return_site`, `return_date_time`, `end_date`, `end_time`, `direct_to_cell`, `is_live`, `description`, `astronauts`, `webcast_id`, `webcast_platform`, `follow_dragon_enabled`, `launch_datetime`, `launch_year`, `success`, `has_landing`

### `timelines`

`slug`, `phase`, `event_time`, `description`

### `carousel`

`slug`, `caption`, `image_url`, `image_path`

## Notes

- The Hub dataset exposes a single `default` config (`train` split) built from `data/launches.parquet`.
- `timelines` and `carousel` are sibling Parquet files in the same repository; they were downloaded directly from `data/*.parquet`.
- Image assets under `images/` on the Hub were not copied (carousel rows reference image paths/URLs in the table).
