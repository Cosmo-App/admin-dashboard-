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
    <div className="space-y-3">
      {displayFilms.map((film, index) => (
        <div
          key={film.filmId}
          className="group flex items-center gap-4 p-3 bg-[#0a0a0a] border border-secondary/30 rounded-xl hover:border-primary/50 hover:bg-[#1a1a1a] transition-all duration-300"
        >
          {/* Rank */}
          <div className="w-8 flex-shrink-0 flex justify-center">
            <span className={`text-xl font-bold ${
              index === 0 ? "text-yellow-500" : 
              index === 1 ? "text-gray-300" : 
              index === 2 ? "text-amber-700" : 
              "text-gray-700"
            }`}>
              #{index + 1}
            </span>
          </div>

          {/* Poster */}
          <div className="w-12 h-16 sm:w-14 sm:h-20 bg-secondary/50 rounded-lg overflow-hidden flex-shrink-0 relative shadow-md group-hover:shadow-primary/20 transition-shadow">
            {film.posterUrl ? (
              <Image
                src={film.posterUrl}
                alt={film.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="64px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary">
                <span className="text-gray-500 text-[10px]">No Img</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-sm sm:text-base truncate mb-1 group-hover:text-primary transition-colors">
              {film.title}
            </h4>
            {film.creatorName && (
              <p className="text-gray-400 text-xs truncate mb-2 flex items-center gap-1">
                <span>by</span>
                <span className="text-gray-300">{film.creatorName}</span>
              </p>
            )}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-secondary/30 px-2 py-0.5 rounded-full">
                <span className="text-primary text-xs">❤️</span>
                <span className="text-white text-xs font-medium">{formatNumber(film.likesCount)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
