import Card from "@/components/ui/Card";

export default function TrendingLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-40 bg-surface-tertiary rounded" />
        <div className="h-4 w-64 bg-surface-tertiary rounded mt-2" />
      </div>
      <Card className="h-48" />
    </div>
  );
}
