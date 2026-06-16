#!/usr/bin/env python3
"""Merge Tesla quarterly, model, and factory data into one JSON for the canvas frontend."""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.normpath(os.path.join(HERE, "..", "..", "tesla_data.json"))
OUT = os.path.normpath(os.path.join(HERE, "..", "public", "tesla.json"))

MODEL_ORDER = ["Model S/X", "Model 3", "Model Y", "Cybertruck"]
FACTORY_ORDER = ["Fremont", "Shanghai", "Berlin", "Texas"]


def main():
    with open(SRC, encoding="utf-8") as f:
        raw = json.load(f)

    models_by_q = {r["Quarter.1"]: r for r in raw["models"]}
    factories_by_q = {r["Quarter.1"]: r for r in raw["factories"]}

    quarters = []
    for q in raw["quarterly"]:
        label = q["Quarter"]
        models = models_by_q.get(label, {})
        factories = factories_by_q.get(label, {})

        model_deliveries = {
            m: int(models.get(m, 0) or 0) for m in MODEL_ORDER
        }
        factory_production = {
            f: int(factories.get(f, 0) or 0) for f in FACTORY_ORDER
        }

        production = int(q["Production"])
        deliveries = int(q["Deliveries"])
        inventory_delta = production - deliveries

        quarters.append(
            {
                "quarter": label,
                "year": int(q["Year"]),
                "production": production,
                "deliveries": deliveries,
                "inventoryDelta": inventory_delta,
                "models": model_deliveries,
                "factories": factory_production,
            }
        )

    total_production = sum(q["production"] for q in quarters)
    total_deliveries = sum(q["deliveries"] for q in quarters)
    latest = quarters[-1]

    # Annual rollups
    annual = {}
    for q in quarters:
        y = str(q["year"])
        if y not in annual:
            annual[y] = {"year": q["year"], "production": 0, "deliveries": 0}
        annual[y]["production"] += q["production"]
        annual[y]["deliveries"] += q["deliveries"]

    out = {
        "quarters": quarters,
        "annual": sorted(annual.values(), key=lambda x: x["year"]),
        "meta": {
            "modelOrder": MODEL_ORDER,
            "factoryOrder": FACTORY_ORDER,
            "totalProduction": total_production,
            "totalDeliveries": total_deliveries,
            "quarterCount": len(quarters),
            "firstQuarter": quarters[0]["quarter"],
            "lastQuarter": latest["quarter"],
            "latestProduction": latest["production"],
            "latestDeliveries": latest["deliveries"],
        },
    }

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False)
    print(f"wrote {len(quarters)} quarters -> {OUT}")


if __name__ == "__main__":
    main()
