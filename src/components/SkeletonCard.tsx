"use client";

interface SkeletonCardProps {
    className?: string;
}

export default function SkeletonCard({ className = "" }: SkeletonCardProps) {
    return (
        <div className={`animate-pulse ${className}`}>
            <div className="bg-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-9 w-9 bg-gray-300 rounded-xl"></div>
                    <div className="h-5 w-32 bg-gray-300 rounded"></div>
                </div>
                <div className="space-y-3">
                    <div className="h-8 w-24 bg-gray-300 rounded"></div>
                    <div className="h-4 w-full bg-gray-300 rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                </div>
            </div>
        </div>
    );
}
