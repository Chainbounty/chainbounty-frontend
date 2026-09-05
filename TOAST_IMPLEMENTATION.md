# Toast Notifications Implementation

## Overview
Added comprehensive toast notification system throughout the ChainBounty frontend using shadcn/ui toast components and custom `useToast` hook.

## Files Created
- `src/hooks/useToast.ts` - Toast state management hook with subscribe/dispatch pattern

## Files Modified
1. **src/App.tsx**
   - Added `<Toaster />` component at root level

2. **src/contexts/WalletContext.tsx**
   - Success toast on wallet connect (shows shortened address)
   - Error toast on connection failure
   - Info toast on wallet disconnect

3. **src/components/bounty/ClaimBountyModal.tsx**
   - Success toast when bounty claimed
   - Error toast on claim failure

4. **src/components/bounty/ApproveRejectModal.tsx**
   - Success toast on approve (green) or request changes (default)
   - Error toast on transaction failure

5. **src/pages/PostBountyPage.tsx**
   - Success toast when bounty posted (includes title)
   - Error toast on posting failure

6. **src/pages/SubmitWorkPage.tsx**
   - Success toast when work submitted
   - Error toast on submission failure

7. **src/components/dispute/RaiseDisputeModal.tsx**
   - Success toast when dispute submitted
   - Error toast on dispute submission failure

## Toast Variants
The implementation uses three variants:
- **success** (green): Successful operations
- **default**: Neutral notifications (wallet disconnect, request changes)
- **destructive** (red): Errors and failures

## Usage Examples

### Basic Toast
```typescript
import { toast } from '@/hooks/useToast'

toast({
  title: 'Success',
  description: 'Operation completed successfully.',
})
```

### Success Toast
```typescript
toast({
  variant: 'success',
  title: 'Bounty claimed!',
  description: 'You can now start working on it.',
})
```

### Error Toast
```typescript
toast({
  variant: 'destructive',
  title: 'Transaction failed',
  description: error.message,
})
```

## Features
- **Auto-dismiss**: Toasts automatically disappear after 5 seconds
- **Manual dismiss**: Users can close toasts by clicking the X button
- **Limit**: Maximum 5 toasts shown simultaneously
- **Position**: Fixed at bottom-right on desktop, top on mobile
- **Animations**: Smooth slide-in/out transitions
- **Swipe-to-dismiss**: Mobile gesture support

## Integration Points

### User Actions with Toasts
1. ✅ Connect wallet → success/error toast
2. ✅ Disconnect wallet → info toast
3. ✅ Claim bounty → success/error toast
4. ✅ Submit work → success/error toast
5. ✅ Approve work → success toast
6. ✅ Request changes → default toast
7. ✅ Post bounty → success/error toast
8. ✅ Raise dispute → success/error toast

### Future Enhancement Ideas
- Add toast action buttons (e.g., "View Transaction")
- Add progress toasts for long-running operations
- Add toast persistence across page navigation
- Add toast history/notification center

## Testing
To test toasts:
1. Connect/disconnect wallet
2. Claim a bounty (success and error flows)
3. Submit work for a bounty
4. Approve/reject work (as poster)
5. Post a new bounty
6. Raise a dispute

Each action should show appropriate toast notification with relevant message.
