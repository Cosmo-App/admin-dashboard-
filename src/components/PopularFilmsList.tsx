"use client";

import React from "react";
import { formatNumber } from "@/lib/utils";
import Image from "next/image";

interface PopularFilm {
  filmId: string;
  title: string;
  posterUrl: string;
  likesCount: number;
  creatorName?: string;
}

interface PopularFilmsListProps {
  films: PopularFilm[];
  isLoading?: boolean;
  limit?: number;
}

export default function PopularFilmsList({ films, isLoading, limit = 10 }: PopularFilmsListProps) {
  const displayFilms = films.slice(0, limit);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg animate-pulse">
            <div className="w-16 h-24 bg-secondary rounded"></div>
            <div className="flex-1">
              <div className="h-4 bg-secondary rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-secondary rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!films.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-sm">No films found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {displayFilms.map((film, index) => (
        <div
          key={film.filmId}
          className="flex items-center gap-3 p-3 bg-[#1a1a1a] border border-secondary rounded-lg hover:border-primary/50 transition-colors duration-200"
        >
          {/* Rank */}
          <div className="w-8 flex-shrink-0">
            <span className="text-2xl font-bold text-gray-600">#{index + 1}</span>
          </div>

          {/* Poster */}
          <div className="w-16 h-24 bg-secondary rounded overflow-hidden flex-shrink-0 relative">
            {film.posterUrl ? (
              <Image
                src={film.posterUrl}
                alt={film.title}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-500 text-xs">No image</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-medium text-sm truncate mb-1">{film.title}</h4>
            {film.creatorName && (
              <p className="text-gray-400 text-xs truncate mb-2">{film.creatorName}</p>
            )}
            <div className="flex items-center gap-1">
              <span className="text-primary text-sm font-medium">
                ❤️ {formatNumber(film.likesCount)}
              </span>
              <span className="text-gray-500 text-xs">likes</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
