import AgitHeader from '@/components/agits/AgitHeader';
import FeedList from '@/components/agits/Feed/FeedList';
export default async function Page({ params }) {
  return (
    <div className="page">
      <AgitHeader currentId={params.agitId} />
      <FeedList agitId={params.agitId} s />
    </div>
  );
}
