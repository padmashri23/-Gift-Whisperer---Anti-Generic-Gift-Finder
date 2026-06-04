import Card from "@/components/ui/Card";

export default function HistoryLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-36 bg-surface-tertiary rounded" />
        <div className="h-4 w-56 bg-surface-tertiary rounded mt-2" />
      </div>
      <div className="h-10 bg-surface-tertiary rounded" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-24" />
        ))}
      </div>
    </div>
  );
}
