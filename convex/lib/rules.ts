export interface TelemetryReading {
  service: string;
  metric: "error_rate" | "latency_ms" | "status_code" | "cpu_percent" | "memory_percent";
  value: number;
}

export interface ThresholdRule {
  metric: TelemetryReading["metric"];
  operator: ">" | ">=" | "<" | "<=";
  threshold: number;
  severity: "warning" | "critical";
}

// Tune these numbers freely — this is your single source of truth for detection logic
export const RULES: ThresholdRule[] = [
  { metric: "error_rate",     operator: ">",  threshold: 0.05, severity: "warning" },
  { metric: "error_rate",     operator: ">",  threshold: 0.15, severity: "critical" },
  { metric: "latency_ms",     operator: ">",  threshold: 2000, severity: "warning" },
  { metric: "latency_ms",     operator: ">",  threshold: 5000, severity: "critical" },
  { metric: "status_code",    operator: ">=", threshold: 500,  severity: "critical" },
  { metric: "cpu_percent",    operator: ">",  threshold: 80,   severity: "warning" },
  { metric: "memory_percent", operator: ">",  threshold: 85,   severity: "warning" },
];

function compare(value: number, operator: ThresholdRule["operator"], threshold: number): boolean {
  switch (operator) {
    case ">": return value > threshold;
    case ">=": return value >= threshold;
    case "<": return value < threshold;
    case "<=": return value <= threshold;
  }
}

// Returns the matching rule (critical wins over warning if both match), or null if no breach
export function evaluateReading(reading: TelemetryReading): ThresholdRule | null {
  const matches = RULES.filter(
    (rule) => rule.metric === reading.metric && compare(reading.value, rule.operator, rule.threshold)
  );
  if (matches.length === 0) return null;
  return matches.find((r) => r.severity === "critical") ?? matches[0];
}