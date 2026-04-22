import { ThankYouPage } from '@/components/business-os';

export default async function Page({ params }) {
  const { slug } = await params;
  return <ThankYouPage slug={slug} />;
}
