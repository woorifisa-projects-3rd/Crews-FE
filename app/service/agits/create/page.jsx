import { getInterest } from '@/apis/agitsAPI';
import AgitCreateForm from '@/components/agits/create/AgitCreateForm';

export default async function Page() {
  const subjects = await getInterest();
  if (subjects.errorCode) {
    throw new Error(subjects?.message);
  }
  return (
    <div className="page">
      <AgitCreateForm subjects={subjects.subjects} />
    </div>
  );
}
