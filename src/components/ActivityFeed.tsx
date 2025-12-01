"use client";

import React from "react";
import { formatSmartDate } from "@/lib/date";
import { Activity } from "@/types/models";
import { Film, User, UserCircle, Heart, Play, LogIn, Trash, Edit, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityFeedProps {
  activities: Activity[];
  isLoading?: boolean;
  limit?: number;
}

const actionIcons: Record<string, React.ElementType> = {
  created: Upload,
  updated: Edit,
  deleted: Trash,
  uploaded: Upload,
  login: LogIn,
  logout: LogIn,
  liked: Heart,
  watched: Play,
  joined: User,
};

const actionColors: Record<string, string> = {
  created: "text-green-500",
  updated: "text-blue-500",
  deleted: "text-red-500",
  uploaded: "text-purple-500",
  login: "text-gray-400",
  logout: "text-gray-400",
  liked: "text-pink-500",
  watched: "text-primary",
  joined: "text-green-500",
};

const resourceIcons: Record<string, React.ElementType> = {
  film: Film,
  creator: UserCircle,
  user: User,
  admin: UserCircle,
  playlist: Film,
  role: UserCircle,
  session: LogIn,
};

export default function ActivityFeed({ activities, isLoading, limit = 10 }: ActivityFeedProps) {
  const displayActivities = activities.slice(0, limit);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg animate-pulse">
            <div className="w-10 h-10 bg-secondary rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-secondary rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-secondary rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-sm">No recent activities</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {displayActivities.map((activity) => {
        const ActionIcon = actionIcons[activity.action] || Upload;
        const ResourceIcon = resourceIcons[activity.resource] || Film;
        const actionColor = actionColors[activity.action] || "text-gray-400";

        return (
          <div
            key={activity.activityId}
            className="flex items-start gap-3 p-3 bg-[#1a1a1a] border border-secondary rounded-lg hover:border-primary/50 transition-colors duration-200"
          >
            {/* Icon */}
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
              <ActionIcon className={cn("w-5 h-5", actionColor)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-white text-sm">
                  <span className="font-medium">
                    {activity.adminEmail || activity.userId || "Unknown"}
                  </span>{" "}
                  <span className="text-gray-400">{activity.action}</span>{" "}
                  <span className="font-medium">{activity.resource}</span>
                  {activity.resourceName && (
                    <>
                      {" "}
                      <span className="text-gray-400">-</span>{" "}
                      <span className="text-primary">{activity.resourceName}</span>
                    </>
                  )}
                </p>
                <ResourceIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
              </div>

              <p className="text-gray-500 text-xs">
                {formatSmartDate(new Date(activity.createdAt || activity.timestamp))}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
