"use client";

import { CalendarIcon, ClockIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";
import { Card, CardContent } from "./card";

interface ComingSoonProps {
  title?: string;
  description?: string;
  feature?: string;
  timeline?: string;
  variant?: "default" | "minimal" | "detailed";
  className?: string;
}

export default function ComingSoon({
  title = "Coming Soon",
  description = "We're working hard to bring you something amazing. Stay tuned for updates!",
  feature = "This feature",
  timeline = "soon",
  variant = "default",
  className = "",
}: ComingSoonProps) {
  if (variant === "minimal") {
    return (
      <div className={`flex items-center justify-center min-h-[40vh] ${className}`}>
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <RocketLaunchIcon className="h-16 w-16 text-primary animate-bounce" />
              <div className="absolute -top-2 -right-4 h-4 w-4 bg-primary rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "detailed") {
    return (
      <div className={`flex items-center justify-center min-h-[60vh] ${className}`}>
        <Card className="max-w-2xl mx-auto border-0 shadow-lg bg-gradient-to-br from-gray-100/80 to-gray-200/80 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm">
          <CardContent className="p-12 text-center space-y-8">
            {/* Animated Icon Section */}
            <div className="relative flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                <div className="relative bg-primary/10 rounded-full p-6">
                  <RocketLaunchIcon className="h-16 w-16 text-primary animate-pulse" />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-foreground">{title}</h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                {description}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-background/50">
                <ClockIcon className="h-6 w-6 text-primary flex-shrink-0" />
                <div className="text-left">
                  <p className="font-medium text-foreground">In Development</p>
                  <p className="text-sm text-muted-foreground">{feature} is being crafted with care</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-background/50">
                <CalendarIcon className="h-6 w-6 text-primary flex-shrink-0" />
                <div className="text-left">
                  <p className="font-medium text-foreground">Expected</p>
                  <p className="text-sm text-muted-foreground">Available {timeline}</p>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="pt-6">
              <div className="flex items-center justify-center space-x-2">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                <div className="h-2 w-2 bg-primary/60 rounded-full animate-pulse delay-100"></div>
                <div className="h-2 w-2 bg-primary/30 rounded-full animate-pulse delay-200"></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Building something awesome...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`flex items-center justify-center min-h-[50vh] ${className}`}>
      <Card className="max-w-md mx-auto border-0 shadow-lg bg-gradient-to-br from-gray-100/80 to-gray-200/80 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm">
        <CardContent className="p-8 text-center space-y-6">
          {/* Animated Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
              <div className="relative bg-primary/10 rounded-full p-4">
                <RocketLaunchIcon className="h-12 w-12 text-primary animate-bounce" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {/* Timeline */}
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <ClockIcon className="h-4 w-4" />
            <span>Coming {timeline}</span>
          </div>

          {/* Progress Dots */}
          <div className="flex items-center justify-center space-x-1">
            <div className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse"></div>
            <div className="h-1.5 w-1.5 bg-primary/60 rounded-full animate-pulse delay-75"></div>
            <div className="h-1.5 w-1.5 bg-primary/30 rounded-full animate-pulse delay-150"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
