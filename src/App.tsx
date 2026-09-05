import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from '@/components/error/ErrorBoundary'
import { Layout } from '@/components/layout/Layout'
import { Toaster } from '@/components/ui/toaster'
import { BountyDetailSkeleton } from '@/components/bounty/BountyDetailSkeleton'

// Eager load critical pages
import HomePage from '@/pages/HomePage'
import BountyListPage from '@/pages/BountyListPage'

// Lazy load non-critical pages for code splitting
const BountyDetailPage = lazy(() => import('@/pages/BountyDetailPage'))
const ClaimBountyPage = lazy(() => import('@/pages/ClaimBountyPage'))
const SubmitWorkPage = lazy(() => import('@/pages/SubmitWorkPage'))
const PostBountyPage = lazy(() => import('@/pages/PostBountyPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const LeaderboardPage = lazy(() => import('@/pages/LeaderboardPage'))
const ContributorProfilePage = lazy(() => import('@/pages/ContributorProfilePage'))
const DisputeCenterPage = lazy(() => import('@/pages/DisputeCenterPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* Critical routes - no lazy loading */}
            <Route path="/" element={<HomePage />} />
            <Route path="/bounties" element={<BountyListPage />} />
            
            {/* Lazy loaded routes with suspense fallback */}
            <Route 
              path="/bounties/:id" 
              element={
                <Suspense fallback={<BountyDetailSkeleton />}>
                  <BountyDetailPage />
                </Suspense>
              } 
            />
            <Route 
              path="/bounties/:id/claim" 
              element={
                <Suspense fallback={<div className="container py-20 text-center">Loading...</div>}>
                  <ClaimBountyPage />
                </Suspense>
              } 
            />
            <Route 
              path="/bounties/:id/submit" 
              element={
                <Suspense fallback={<div className="container py-20 text-center">Loading...</div>}>
                  <SubmitWorkPage />
                </Suspense>
              } 
            />
            <Route 
              path="/post-bounty" 
              element={
                <Suspense fallback={<div className="container py-20 text-center">Loading...</div>}>
                  <PostBountyPage />
                </Suspense>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <Suspense fallback={<div className="container py-20 text-center">Loading...</div>}>
                  <DashboardPage />
                </Suspense>
              } 
            />
            <Route 
              path="/leaderboard" 
              element={
                <Suspense fallback={<div className="container py-20 text-center">Loading...</div>}>
                  <LeaderboardPage />
                </Suspense>
              } 
            />
            <Route 
              path="/profile/:address" 
              element={
                <Suspense fallback={<div className="container py-20 text-center">Loading...</div>}>
                  <ContributorProfilePage />
                </Suspense>
              } 
            />
            <Route 
              path="/disputes" 
              element={
                <Suspense fallback={<div className="container py-20 text-center">Loading...</div>}>
                  <DisputeCenterPage />
                </Suspense>
              } 
            />
            <Route 
              path="*" 
              element={
                <Suspense fallback={<div className="container py-20 text-center">Loading...</div>}>
                  <NotFoundPage />
                </Suspense>
              } 
            />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
