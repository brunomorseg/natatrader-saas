import AppCard from "./AppCard"

interface TradeCardProps {
  trade: any
  onEdit?: () => void
  onDelete?: () => void
}

export default function TradeCard({
  trade,
  onEdit,
  onDelete
}: TradeCardProps) {

  const positive = Number(trade.resultado) >= 0

  return (
    <AppCard title={trade.ativo}>

      <div className="space-y-3">

        {/* TOP */}
        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm text-muted-foreground">
              {trade.setup || "Sem setup"}
            </p>

            <p className="text-xs text-muted-foreground">
              {trade.cenario || "Sem cenário"}
            </p>
          </div>

          <div
            className={`text-lg font-bold ${
              positive
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            R$ {trade.resultado}
          </div>

        </div>

        {/* INFO */}
        <div className="grid grid-cols-2 gap-3 text-sm">

          <div>
            <p className="text-muted-foreground">
              Entrada
            </p>

            <p className="font-medium">
              {trade.entrada}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">
              Saída
            </p>

            <p className="font-medium">
              {trade.saida}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">
              Lote
            </p>

            <p className="font-medium">
              {trade.lote}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">
              Resultado
            </p>

            <p
              className={`font-medium ${
                positive
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {trade.resultado}
            </p>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 pt-2">

          <button
            onClick={onEdit}
            className="px-3 py-2 rounded bg-blue-500 text-white text-sm"
          >
            Editar
          </button>

          <button
            onClick={onDelete}
            className="px-3 py-2 rounded bg-red-500 text-white text-sm"
          >
            Deletar
          </button>

        </div>

      </div>

    </AppCard>
  )
}