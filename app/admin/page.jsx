import { getAllReports } from '@/apis/adminAPI';
import ComplaintList from '@/components/admin/ComplaintList';

export default async function Admin() {
  const initReports = await getAllReports(0);
  if (initReports.errorCode) {
    throw new Error(initReports.message);
  }
  return <ComplaintList initReports={initReports} />;
}
