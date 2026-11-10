import { PlanReview } from "@/components/plan/PlanReview";

export default async function PlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PlanReview id={id} />;
}
