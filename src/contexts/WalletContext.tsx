import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import {
  isConnected,
  isAllowed,
  requestAccess,
  getAddress,
  getNetwork,
  getNetworkDetails,
} from '@stellar/freighter-api'
import { toast } from '@/hooks/useToast'

export type WalletNetwork = 'TESTNET' | 'PUBLIC' | 'FUTURENET' | 'STANDALONE'

export interface WalletState {
  isConnected: boolean
  isLoading: boolean
  address: string | null
  network: WalletNetwork | null
  networkPassphrase: string | null
  error: string | null
}

export interface WalletContextValue extends WalletState {
  connect: () => Promise<void>
  disconnect: () => void
  shortAddress: string | null
}

const WalletContext = createContext<WalletContextValue | null>(null)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    isLoading: false,
    address: null,
    network: null,
    networkPassphrase: null,
    error: null,
  })

  // On mount, check if already connected and allowed
  useEffect(() => {
    async function checkExistingConnection() {
      try {
        const connected = await isConnected()
        if (!connected.isConnected) return

        const allowed = await isAllowed()
        if (!allowed.isAllowed) return

        const addressResult = await getAddress()
        const networkResult = await getNetwork()
        const networkDetailsResult = await getNetworkDetails()

        if (addressResult.address) {
          setState({
            isConnected: true,
            isLoading: false,
            address: addressResult.address,
            network: (networkResult.network as WalletNetwork) ?? null,
            networkPassphrase: networkDetailsResult.networkPassphrase ?? null,
            error: null,
          })
        }
      } catch {
        // Freighter not installed or not available — silent fail
      }
    }

    checkExistingConnection()
  }, [])

  const connect = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Check Freighter is installed
      const connected = await isConnected()
      if (!connected.isConnected) {
        throw new Error(
          'Freighter wallet not found. Please install the Freighter browser extension.'
        )
      }

      // Request access (prompts user in extension)
      const accessResult = await requestAccess()
      if (accessResult.error) {
        throw new Error(accessResult.error)
      }

      const addressResult = await getAddress()
      const networkResult = await getNetwork()
      const networkDetailsResult = await getNetworkDetails()

      if (!addressResult.address) {
        throw new Error('Could not retrieve wallet address.')
      }

      setState({
        isConnected: true,
        isLoading: false,
        address: addressResult.address,
        network: (networkResult.network as WalletNetwork) ?? null,
        networkPassphrase: networkDetailsResult.networkPassphrase ?? null,
        error: null,
      })

      toast({
        variant: 'success',
        title: 'Wallet connected',
        description: `Connected to ${addressResult.address.slice(0, 8)}...${addressResult.address.slice(-4)}`,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect wallet.'
      setState(prev => ({
        ...prev,
        isLoading: false,
        isConnected: false,
        error: message,
      }))

      toast({
        variant: 'destructive',
        title: 'Connection failed',
        description: message,
      })
    }
  }, [])

  const disconnect = useCallback(() => {
    setState({
      isConnected: false,
      isLoading: false,
      address: null,
      network: null,
      networkPassphrase: null,
      error: null,
    })

    toast({
      title: 'Wallet disconnected',
      description: 'Your wallet has been disconnected.',
    })
  }, [])

  const shortAddress = state.address
    ? `${state.address.slice(0, 4)}...${state.address.slice(-4)}`
    : null

  return (
    <WalletContext.Provider value={{ ...state, connect, disconnect, shortAddress }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used inside <WalletProvider>')
  return ctx
}
