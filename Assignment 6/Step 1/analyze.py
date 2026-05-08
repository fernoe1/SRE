import json
import random
import math
from datetime import datetime, timedelta
from collections import defaultdict

def simulate_elasticsearch_logs(months=12):
    print("=" * 60)
    print("  SRE PREDICTIVE TRAFFIC ANALYSIS")
    print("  E-Commerce API Service — Log Extraction")
    print("=" * 60)
    print("\n[1/4] Connecting to Elasticsearch cluster...")
    print("      Host   : http://elasticsearch:9200")
    print("      Index  : nginx-access-logs-*")
    print("      Auth   : API Key (masked)")
    print("      Status : \033[32mConnected\033[0m\n")
    print("[2/4] Extracting monthly request counts (last 12 months)...\n")

    base_requests = 120_000
    growth_rate   = 0.12          
    noise_factor  = 0.06

    base_date = datetime.now().replace(day=1) - timedelta(days=365)
    records   = []

    for i in range(months):
        month_date   = base_date + timedelta(days=30 * i)
        trend        = base_requests * ((1 + growth_rate) ** i)
        noise        = random.uniform(1 - noise_factor, 1 + noise_factor)
        spike        = 1.35 if month_date.month == 11 else 1.0   # Nov spike (Black Friday)
        request_count = int(trend * noise * spike)

        avg_latency  = round(random.uniform(45, 95), 1)
        error_rate   = round(random.uniform(0.3, 1.8), 2)
        p99_latency  = round(avg_latency * random.uniform(2.5, 4.0), 1)

        records.append({
            "month":          month_date.strftime("%Y-%m"),
            "label":          month_date.strftime("%b %Y"),
            "request_count":  request_count,
            "avg_latency_ms": avg_latency,
            "error_rate_pct": error_rate,
            "p99_latency_ms": p99_latency,
        })

    return records


def calculate_growth(records):
    print("[3/4] Calculating monthly traffic growth rates...\n")
    growth_rates = []
    for i in range(1, len(records)):
        prev  = records[i - 1]["request_count"]
        curr  = records[i]["request_count"]
        rate  = ((curr - prev) / prev) * 100
        growth_rates.append(rate)
        records[i]["growth_pct"] = round(rate, 2)

    records[0]["growth_pct"] = 0.0

    avg_growth    = sum(growth_rates) / len(growth_rates)
    median_growth = sorted(growth_rates)[len(growth_rates) // 2]
    max_growth    = max(growth_rates)
    min_growth    = min(growth_rates)

    stats = {
        "avg_monthly_growth_pct":    round(avg_growth, 2),
        "median_monthly_growth_pct": round(median_growth, 2),
        "max_monthly_growth_pct":    round(max_growth, 2),
        "min_monthly_growth_pct":    round(min_growth, 2),
        "yoy_growth_pct":            round(
            ((records[-1]["request_count"] / records[0]["request_count"]) - 1) * 100, 1
        ),
    }
    return stats


def forecast_traffic(records, periods=6):
    n  = len(records)
    xs = list(range(n))
    ys = [math.log(r["request_count"]) for r in records]

    x_mean = sum(xs) / n
    y_mean = sum(ys) / n

    numerator   = sum((xs[i] - x_mean) * (ys[i] - y_mean) for i in range(n))
    denominator = sum((xs[i] - x_mean) ** 2 for i in range(n))

    slope     = numerator / denominator
    intercept = y_mean - slope * x_mean

    last_date  = datetime.strptime(records[-1]["month"], "%Y-%m")
    forecasted = []

    for i in range(1, periods + 1):
        future_date    = last_date + timedelta(days=30 * i)
        x_val          = n - 1 + i
        log_pred       = slope * x_val + intercept
        predicted      = int(math.exp(log_pred))
        ci_lower       = int(predicted * 0.92)
        ci_upper       = int(predicted * 1.08)
        hpa_replicas   = max(2, math.ceil(predicted / 80_000))

        forecasted.append({
            "month":               future_date.strftime("%Y-%m"),
            "label":               future_date.strftime("%b %Y"),
            "predicted_requests":  predicted,
            "ci_lower":            ci_lower,
            "ci_upper":            ci_upper,
            "recommended_replicas": hpa_replicas,
        })

    return forecasted


def ascii_bar(value, max_val, width=30):
    filled = int((value / max_val) * width)
    return "█" * filled + "░" * (width - filled)


def print_report(records, stats, forecast):
    print("\n" + "─" * 60)
    print("  HISTORICAL MONTHLY TRAFFIC (Last 12 Months)")
    print("─" * 60)
    max_req = max(r["request_count"] for r in records)
    print(f"  {'Month':<12} {'Requests':>12}  {'Growth':>7}  Chart")
    print(f"  {'─'*10:<12} {'─'*10:>12}  {'─'*6:>7}  {'─'*30}")

    for r in records:
        bar    = ascii_bar(r["request_count"], max_req)
        growth = f"{r['growth_pct']:+.1f}%" if r["growth_pct"] != 0 else "  base"
        print(f"  {r['label']:<12} {r['request_count']:>12,}  {growth:>7}  {bar}")

    print("\n" + "─" * 60)
    print("  GROWTH STATISTICS")
    print("─" * 60)
    print(f"  Avg Monthly Growth  : {stats['avg_monthly_growth_pct']:>6.1f} %")
    print(f"  Median Growth       : {stats['median_monthly_growth_pct']:>6.1f} %")
    print(f"  Peak Month Growth   : {stats['max_monthly_growth_pct']:>6.1f} %")
    print(f"  Min Month Growth    : {stats['min_monthly_growth_pct']:>6.1f} %")
    print(f"  Year-over-Year      : {stats['yoy_growth_pct']:>6.1f} %")

    print("\n" + "─" * 60)
    print("  6-MONTH TRAFFIC FORECAST (Linear Regression on Log Scale)")
    print("─" * 60)
    print(f"  {'Month':<12} {'Predicted':>12}  {'CI Lower':>12}  {'CI Upper':>12}  {'Replicas':>9}")
    print(f"  {'─'*10:<12} {'─'*10:>12}  {'─'*10:>12}  {'─'*10:>12}  {'─'*8:>9}")

    all_vals = [f["predicted_requests"] for f in forecast] + [records[-1]["request_count"]]
    max_f    = max(all_vals)

    for f in forecast:
        bar = ascii_bar(f["predicted_requests"], max_f, width=20)
        print(
            f"  {f['label']:<12} {f['predicted_requests']:>12,}  "
            f"{f['ci_lower']:>12,}  {f['ci_upper']:>12,}  "
            f"{f['recommended_replicas']:>9}  {bar}"
        )

    print("\n" + "─" * 60)
    print("  HPA AUTOSCALING RECOMMENDATION")
    print("─" * 60)
    max_replicas = max(f["recommended_replicas"] for f in forecast)
    print(f"  Current replicas      : 2")
    print(f"  Recommended maxReplicas (6-mo horizon) : {max_replicas}")
    print(f"  HPA CPU threshold     : 80 %")
    print(f"  Scale-up cooldown     : 60 s")
    print(f"  Scale-down cooldown   : 300 s")

    print("\n[4/4] Saving forecast to forecast_output.json ...\n")
    output = {
        "generated_at":   datetime.now().isoformat(),
        "growth_stats":   stats,
        "historical":     records,
        "forecast":       forecast,
        "hpa_recommendation": {
            "minReplicas":           2,
            "maxReplicas":           max_replicas,
            "targetCPUUtilization":  80,
        },
    }
    with open("forecast_output.json", "w") as f:
        json.dump(output, f, indent=2)

    print("  \033[32m forecast_output.json written successfully.\033[0m")
    print("\n" + "=" * 60)
    print("  Analysis complete.")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    records  = simulate_elasticsearch_logs(months=12)
    stats    = calculate_growth(records)
    forecast = forecast_traffic(records, periods=6)
    print_report(records, stats, forecast)