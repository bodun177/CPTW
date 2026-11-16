import useSearches from '../../hooks/useSearches.js';
import AppButton from '../ui/AppButton.jsx';

export default function SearchNotice() {
  const { notice, dismissNotice } = useSearches();

  return (
    <div className="operation-notice">
      <p role="status">{notice}</p>
      {notice && (
        <AppButton variant="secondary" onClick={dismissNotice}>
          Закрити повідомлення
        </AppButton>
      )}
    </div>
  );
}
