import { Link } from 'react-router';
import PageHeading from '../components/ui/PageHeading.jsx';

export default function HomePage() {
  return (
    <>
      <PageHeading title="Підбір автозапчастин" />
      <p>Каталог автозапчастин для навчального проєкту.</p>
      <p>Знайдіть запчастину та підготуйте чернетку підбору для вашого авто.</p>
      <p>
        <Link to="/parts">Перейти до запчастин</Link>
      </p>
      <p>
        <Link to="/searches">Переглянути підбори</Link>
      </p>
    </>
  );
}
