import { HostedSite } from "@/components/site/HostedSite";

export default async function HostedSitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <HostedSite id={id} />;
}
