import Card from "@/components/ui/Card";

export default function DashboardLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-40 bg-surface-tertiary rounded" />
        <div className="h-4 w-64 bg-surface-tertiary rounded mt-2" />
      </div>
      <Card className="h-24" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="h-20" />
        <Card className="h-20" />
        <Card className="h-20" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-24" />
        ))}
      </div>
    </div>
  );
}
