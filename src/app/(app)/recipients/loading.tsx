import Card from "@/components/ui/Card";

export default function RecipientsLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-36 bg-surface-tertiary rounded" />
          <div className="h-4 w-48 bg-surface-tertiary rounded mt-2" />
        </div>
        <div className="h-10 w-36 bg-surface-tertiary rounded-lg" />
      </div>
      <div className="h-10 bg-surface-tertiary rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-40" />
        ))}
      </div>
    </div>
  );
}
