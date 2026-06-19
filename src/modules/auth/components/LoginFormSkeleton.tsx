import { Skeleton } from "@/components/ui/skeleton";

export default function LoginFormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Email Field Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" /> {/* Label */}
        <Skeleton className="h-10 w-full rounded-lg" /> {/* Input */}
      </div>

      {/* Password Field Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" /> {/* Label */}
        <Skeleton className="h-10 w-full rounded-lg" /> {/* Input */}
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded" /> {/* Checkbox */}
          <Skeleton className="h-4 w-24" /> {/* Remember me text */}
        </div>
        <Skeleton className="h-4 w-28" /> {/* Forgot password link */}
      </div>

      {/* Login Button */}
      <Skeleton className="h-11 w-full rounded-lg" />

      {/* Divider */}
      <div className="flex items-center space-x-2">
        <Skeleton className="h-px flex-1" />
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-px flex-1" />
      </div>

      {/* Social Login Buttons */}
      <div className="space-y-3">
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>

      {/* Sign up link */}
      <div className="text-center">
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>
    </div>
  );
}