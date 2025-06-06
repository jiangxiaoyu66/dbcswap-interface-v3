import { create } from 'zustand'

interface WDBCState {
    pairPriceRatio: { [key: string]: number | undefined } | undefined
    ratioLoadingPairs: { [key: string]: boolean }
    wdbcPrice: number | undefined
    isLoadingWdbcPrice: boolean
    setRatio: (pairPriceRatio: { [key: string]: number | undefined }) => void
    setRatioLoadingPair: (pair: { [key: string]: boolean }) => void
    setWdbcPrice: (price: number | undefined) => void
    setIsLoadingWdbcPrice: (loading: boolean) => void
}

export const useWDBCStore = create<WDBCState>((set) => ({
    pairPriceRatio: {},
    ratioLoadingPairs: {},
    setRatio: (pairPriceRatio: { [key: string]: number | undefined }) => 
        set((state) => ({ 
            pairPriceRatio: { ...state.pairPriceRatio, ...pairPriceRatio } 
        })),
    setRatioLoadingPair: (pair: { [key: string]: boolean }) =>
        set((state) => ({
            ratioLoadingPairs: { ...state.ratioLoadingPairs, ...pair }
        })),

    wdbcPrice: undefined,
    setWdbcPrice: (wdbcPrice) => set({ wdbcPrice }),
    isLoadingWdbcPrice: false,
    setIsLoadingWdbcPrice: (isLoading) => set({ isLoadingWdbcPrice: isLoading }),
}))
