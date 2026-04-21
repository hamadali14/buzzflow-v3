import { FileDetailPage } from '@/components/business-os';

export default async function Page({ params }) {
  const { id } = await params;
  return <FileDetailPage id={id} />;
}
