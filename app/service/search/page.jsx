import SearchForm from '@/components/search/SearchForm';
import SearchResult from '@/components/search/SearchResult';

export default function SearchPage({ searchParams }) {
  return (
    <div className="page">
      {searchParams.q == undefined ? <SearchForm /> : <SearchResult params={searchParams.q} />}
    </div>
  );
}
