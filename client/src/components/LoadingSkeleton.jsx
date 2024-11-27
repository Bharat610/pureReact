import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";


export default function LoadingSkeleton({count}) {
  return (
    <div className="flex flex-wrap flex-col lg:flex-row gap-2.5 lg:gap-5">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="bg-white lg:w-[48.9%] border border-gray-200 flex flex-col gap-4 p-5 rounded-md"
          >
            <div className="flex gap-2 items-center">
              <Skeleton
                height={40}
                width="40px"
                className="w-full rounded-full"
              />
              <Skeleton height={20} width="80px" />
            </div>

            <Skeleton height={80} />
            <Skeleton />
          </div>
        ))}
    </div>
  );
}
