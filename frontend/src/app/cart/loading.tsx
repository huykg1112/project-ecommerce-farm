import { Skeleton } from "@/components/ui/skeleton";

export default function CartLoading() {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <Skeleton className="h-4 w-40" />
      </div>

      <Skeleton className="h-10 w-60 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-24" />
              </div>

              {/* Danh sách sản phẩm skeleton */}
              <div className="space-y-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex gap-4">
                    <Skeleton className="w-24 h-24 rounded-md" />
                    <div className="flex-grow">
                      <Skeleton className="h-5 w-full max-w-md mb-2" />
                      <Skeleton className="h-4 w-32 mb-4" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Skeleton className="h-10 w-40" />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <Skeleton className="h-6 w-40 mb-6" />

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>

              <Skeleton className="h-px w-full my-6" />

              <div className="flex justify-between mb-6">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-28" />
              </div>

              <div className="flex gap-2 mb-6">
                <Skeleton className="h-10 flex-grow" />
                <Skeleton className="h-10 w-24" />
              </div>

              <Skeleton className="h-12 w-full mb-4" />

              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
