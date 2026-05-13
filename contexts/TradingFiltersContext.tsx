"use client"

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react"

interface TradingFilters {

  period: string

  setup: string

  scenario: string
}

interface TradingFiltersContextType {

  filters: TradingFilters

  setFilters:
    React.Dispatch<
      React.SetStateAction<TradingFilters>
    >
}

const TradingFiltersContext =
  createContext<
    TradingFiltersContextType | undefined
  >(undefined)

export function TradingFiltersProvider({
  children,
}: {
  children: ReactNode
}) {

  const [filters, setFilters] =
    useState<TradingFilters>({
      period: "30d",
      setup: "all",
      scenario: "all",
    })

  return (
    <TradingFiltersContext.Provider
      value={{
        filters,
        setFilters,
      }}
    >
      {children}
    </TradingFiltersContext.Provider>
  )
}

export function useTradingFilters() {

  const context =
    useContext(TradingFiltersContext)

  if (!context) {

    throw new Error(
      "useTradingFilters must be used within TradingFiltersProvider"
    )
  }

  return context
}