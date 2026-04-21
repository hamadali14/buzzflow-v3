import { EntryMergePage } from '@/components/business-os';

export default async function Page({ params }) {
  const { id } = await params;
  return <EntryMergePage id={id} />;
}
