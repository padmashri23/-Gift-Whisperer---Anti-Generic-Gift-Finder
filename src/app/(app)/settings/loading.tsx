import Card from "@/components/ui/Card";

export default function SettingsLoading() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-28 bg-surface-tertiary rounded" />
        <div className="h-4 w-56 bg-surface-tertiary rounded mt-2" />
      </div>
      <Card className="h-48" />
      <Card className="h-32" />
    </div>
  );
}
