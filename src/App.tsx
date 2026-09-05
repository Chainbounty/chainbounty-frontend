import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Toaster } from '@/components/ui/toaster'
import HomePage from '@/pages/HomePage'
import BountyListPage from '@/pages/BountyListPage'
import BountyDetailPage from '@/pages/BountyDetailPage'
import ClaimBountyPage from '@/pages/ClaimBountyPage'
import SubmitWorkPage from '@/pages/SubmitWorkPage'
import PostBountyPage from '@/pages/PostBountyPage'
import DashboardPage from '@/pages/DashboardPage'
import LeaderboardPage from '@/pages/LeaderboardPage'
import ContributorProfilePage from '@/pages/ContributorProfilePage'
import DisputeCenterPage from '@/pages/DisputeCenterPage'
import NotFoundPage from '@/pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/bounties" element={<BountyListPage />} />
          <Route path="/bounties/:id" element={<BountyDetailPage />} />
          <Route path="/bounties/:id/claim" element={<ClaimBountyPage />} />
          <Route path="/bounties/:id/submit" element={<SubmitWorkPage />} />
          <Route path="/post-bounty" element={<PostBountyPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/profile/:address" element={<ContributorProfilePage />} />
          <Route path="/disputes" element={<DisputeCenterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
