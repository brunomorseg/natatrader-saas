import { ReactNode } from "react"

import { Card } from "@/components/ui/card"

interface AppCardProps {
  title?: string
  children: ReactNode
  className?: string
}

export default function AppCard({
  title,
  children,
  className = ""
}: AppCardProps) {

  return (
    <Card className={`p-6 rounded-2xl shadow-sm ${className}`}>

      {title && (
        <h2 className="text-lg font-semibold mb-4">
          {title}
        </h2>
      )}

      {children}

    </Card>
  )
}