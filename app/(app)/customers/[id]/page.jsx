import { CustomerDetailPage } from '@/components/business-os';

export default async function Page({ params }) {
  const { id } = await params;
  return <CustomerDetailPage id={id} />;
}
