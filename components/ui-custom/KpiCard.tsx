import AppCard from "./AppCard"

interface KpiCardProps {
  title: string
  value: string
  trend?: string
  positive?: boolean
}

export default function KpiCard({
  title,
  value,
  trend,
  positive = true
}: KpiCardProps) {
  return (
    <AppCard title={title}>

      <div className="space-y-2">

        <h2 className="text-3xl font-bold tracking-tight">
          {value}
        </h2>

        {trend && (
          <p
            className={`text-sm font-medium ${
              positive
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {trend}
          </p>
        )}

      </div>

    </AppCard>
  )
}