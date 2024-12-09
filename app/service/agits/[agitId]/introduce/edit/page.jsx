import AgitHeader from '@/components/agits/AgitHeader';
import IntroduceEditForm from '@/components/agits/IntroduceEditForm';

export default async function Page({ params }) {
  return (
    <div className="page">
      <AgitHeader currentId={params.agitId} />
      <IntroduceEditForm agitId={params.agitId} />
    </div>
  );
}
