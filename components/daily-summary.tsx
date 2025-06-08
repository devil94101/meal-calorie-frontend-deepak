import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DailySummaryProps {
  totalCalories: number;
}

export function DailySummary({ totalCalories }: DailySummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Summary</CardTitle>
        <CardDescription>Total: {totalCalories} calories</CardDescription>
      </CardHeader>
    </Card>
  );
} 