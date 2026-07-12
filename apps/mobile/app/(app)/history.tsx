import { AppScreen } from '../../components/app-screen';
import { EmptyState } from '../../components/screen-states';

export default function HistoryScreen() {
  return (
    <AppScreen
      description="Tournament history and payment history arrive after those domain stories exist."
      eyebrow="History"
      title="Activity history"
    >
      <EmptyState
        message="Completed tournaments and financial events will appear here later."
        title="History placeholder"
      />
    </AppScreen>
  );
}
