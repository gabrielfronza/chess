import { AppScreen } from '../../components/app-screen';
import { EmptyState } from '../../components/screen-states';

export default function WalletScreen() {
  return (
    <AppScreen
      description="Wallet balances and ledger entries will be introduced by the wallet story."
      eyebrow="Wallet"
      title="Your balance"
    >
      <EmptyState
        message="Wallet data is not part of the navigation shell."
        title="Wallet placeholder"
      />
    </AppScreen>
  );
}
