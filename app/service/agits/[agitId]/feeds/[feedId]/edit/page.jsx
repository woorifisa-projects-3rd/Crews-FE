import FeedEditForm from '@/components/agits/Feed/FeedEditForm';
import { Header } from '@/components/common';

export default function Page({ params }) {
  return (
    <div className="page">
      <Header side="center">활동 기록</Header>
      <FeedEditForm agitId={params.agitId} feedId={params.feedId} />
    </div>
  );
}
