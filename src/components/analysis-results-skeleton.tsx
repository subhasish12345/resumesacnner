import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function AnalysisResultsSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="items-center">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent className="space-y-8 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-muted p-6 rounded-lg">
          <div className="md:col-span-1 flex justify-center">
            <Skeleton className="h-[120px] w-[120px] rounded-full" />
          </div>
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-7 w-1/4" />
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-7 w-24 rounded-full" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-7 w-1/4" />
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-7 w-24 rounded-full" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
