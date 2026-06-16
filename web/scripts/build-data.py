#!/usr/bin/env python3
"""Merge SpaceX launches/carousel/timelines CSVs into one JSON for the frontend."""
import csv, json, os, collections

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.normpath(os.path.join(HERE, "..", "..", "data", "spacex-launches"))
OUT = os.path.normpath(os.path.join(HERE, "..", "public", "launches.json"))


def read(name):
    with open(os.path.join(SRC, name), newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def truthy(v):
    return str(v).strip().lower() in ("true", "1", "yes")


def main():
    launches = read("launches.csv")
    carousel = read("carousel.csv")
    timelines = read("timelines.csv")

    images = collections.defaultdict(list)
    for r in carousel:
        url = (r.get("image_url") or "").strip()
        if url:
            images[r["slug"]].append({"url": url, "caption": (r.get("caption") or "").strip()})

    events = collections.defaultdict(list)
    for r in timelines:
        events[r["slug"]].append(
            {
                "phase": (r.get("phase") or "").strip(),
                "time": (r.get("event_time") or "").strip(),
                "description": (r.get("description") or "").strip(),
            }
        )

    out = []
    for r in launches:
        slug = r["slug"]
        astronauts = (r.get("astronauts") or "").strip()
        out.append(
            {
                "id": r.get("id"),
                "title": r.get("title"),
                "slug": slug,
                "status": (r.get("mission_status") or "").strip(),
                "missionType": (r.get("mission_type") or "").strip(),
                "vehicle": (r.get("vehicle") or "").strip(),
                "site": (r.get("launch_site") or "").strip().rstrip(),
                "launchDate": (r.get("launch_date") or "").strip(),
                "launchTime": (r.get("launch_time") or "").strip(),
                "year": (r.get("launch_year") or "").strip(),
                "description": (r.get("description") or "").strip(),
                "astronauts": astronauts,
                "webcastPlatform": (r.get("webcast_platform") or "").strip(),
                "webcastId": (r.get("webcast_id") or "").strip(),
                "success": truthy(r.get("success")),
                "hasLanding": truthy(r.get("has_landing")),
                "images": images.get(slug, []),
                "timeline": events.get(slug, []),
            }
        )

    # newest first
    out.sort(key=lambda x: (x["launchDate"] or "", x["launchTime"] or ""), reverse=True)

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False)
    print(f"wrote {len(out)} launches -> {OUT}")
    print(f"  with images: {sum(1 for x in out if x['images'])}")
    print(f"  with timeline: {sum(1 for x in out if x['timeline'])}")


if __name__ == "__main__":
    main()
