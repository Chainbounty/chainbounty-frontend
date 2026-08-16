import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ClaimBountyModal } from '@/components/bounty/ClaimBountyModal'
import { BountyCard } from '@/components/bounty/BountyCard'
import { useWallet } from '@/contexts/WalletContext'
import { MOCK_BOUNTIES } from '@/lib/mockData'

export default function ClaimBountyPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isConnected, connect } = useWallet()
  const [modalOpen, setModalOpen] = useState(false)

  const bounty = MOCK_BOUNTIES.find(b => b.id === id)

  if (!bounty) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Bounty not found</h2>
        <Button asChild className="mt-4">
          <Link to="/bounties">Browse Bounties</Link>
        </Button>
      </div>
    )
  }

  if (bounty.status !== 'open') {
    return (
      <div className="container py-20 text-center max-w-md">
        <h2 className="text-2xl font-bold mb-2">Not available</h2>
        <p className="text-muted-foreground mb-6">
          This bounty is <span className="font-medium">{bounty.status}</span> and can no longer be claimed.
        </p>
        <Button asChild>
          <Link to={`/bounties/${id}`}>View Bounty</Link>
        </Button>
      </div>
    )
  }

  function handleSuccess(txHash: string) {
    console.log('Claimed! tx:', txHash)
    setTimeout(() => navigate(`/bounties/${id}`), 1500)
  }

  return (
    <div className="container py-8 max-w-2xl">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Claim Bounty</h1>
        <p className="text-sm text-muted-foreground">
          Review the bounty details below, then confirm your claim on-chain.
        </p>
      </div>

      {/* Bounty preview */}
      <BountyCard bounty={bounty} className="mb-6" />

      {/* Wallet gate or claim button */}
      {!isConnected ? (
        <Card className="border-primary/40 bg-primary/5">
          <CardContent className="flex items-center justify-between gap-4 pt-5 pb-5">
            <div>
              <p className="font-medium text-sm">Wallet required</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Connect your Freighter wallet to claim this bounty.
              </p>
            </div>
            <Button size="sm" onClick={connect} className="gap-2 shrink-0">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Button
          size="lg"
          className="w-full gap-2"
          onClick={() => setModalOpen(true)}
        >
          Claim This Bounty
        </Button>
      )}

      <ClaimBountyModal
        bounty={bounty}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
