import Section from '../components/ui/Section.jsx';
import CatalogSummary from '../components/parts/CatalogSummary.jsx';
import PartList from '../components/parts/PartList.jsx';
import { parts } from '../data/parts.js';

export default function HomePage() {
  return (
    <>
      <Section id="about" title="Про застосунок">
        <p>Каталог автозапчастин для навчального проєкту.</p>
        <p>Переглядайте запчастини та перевіряйте їх наявність.</p>
      </Section>

      <Section id="catalog" title="Каталог запчастин">
        <CatalogSummary total={parts.length} />
        <PartList items={parts} />
      </Section>
    </>
  );
}
