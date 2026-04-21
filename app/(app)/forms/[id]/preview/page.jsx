import { FormPreviewPage } from '@/components/business-os';

export default async function Page({ params }) {
  const { id } = await params;
  return <FormPreviewPage id={id} />;
}
