import { Film, Star, Award, Globe, Clock } from "lucide-react";

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    year: string;
    poster: string;
    quality: string;
    category: string;
    imdbRating?: string;
    rated?: string;
    genre?: string;
    runtime?: string;
    language?: string;
    country?: string;
    awards?: string;
    type?: string;
    totalSeasons?: string;
    metascore?: string;
    ratings?: Array<{ Source: string; Value: string }>;
  };
  onDownloadClick: () => void;
}

export function MovieCard({ movie, onDownloadClick }: MovieCardProps) {
  // Get Rotten Tomatoes rating if available
  const rottenTomatoesRating = movie.ratings?.find(r => r.Source === "Rotten Tomatoes")?.Value;
  
  return (
    <div className="group relative bg-[#1a1a2e] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/20">
      <div className="relative aspect-[2/3]">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <Film className="w-16 h-16 text-gray-600" />
          </div>
        )}
        
        {/* Quality Badge */}
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 text-[10px] font-bold rounded bg-red-500 text-white shadow-lg animate-pulse">
            {movie.quality || 'HD'}
          </span>
        </div>

        {/* IMDB Rating Badge */}
        {movie.imdbRating && movie.imdbRating !== 'N/A' && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 text-[10px] font-bold rounded bg-yellow-500 text-black shadow-lg flex items-center gap-1">
              ⭐ {movie.imdbRating}
            </span>
          </div>
        )}

        {/* Rated Badge (if available) */}
        {movie.rated && movie.rated !== 'N/A' && (
          <div className="absolute bottom-2 left-2">
            <span className="px-2 py-1 text-[10px] font-bold rounded bg-gray-900/90 text-white shadow-lg border border-white/20">
              {movie.rated}
            </span>
          </div>
        )}

        {/* Type Badge for Series */}
        {movie.type === 'series' && movie.totalSeasons && (
          <div className="absolute bottom-2 right-2">
            <span className="px-2 py-1 text-[10px] font-bold rounded bg-purple-600 text-white shadow-lg">
              📺 {movie.totalSeasons} Seasons
            </span>
          </div>
        )}
        
        {/* Hover Overlay with Extended Info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 overflow-y-auto">
          {/* Quick Info */}
          <div className="mb-3 space-y-1.5 text-[10px]">
            {/* Genre */}
            {movie.genre && movie.genre !== 'N/A' && (
              <div className="flex items-start gap-1.5">
                <Film className="w-3 h-3 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 line-clamp-2">{movie.genre}</span>
              </div>
            )}
            
            {/* Runtime */}
            {movie.runtime && movie.runtime !== 'N/A' && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-blue-500 flex-shrink-0" />
                <span className="text-gray-300">{movie.runtime}</span>
              </div>
            )}
            
            {/* Language & Country */}
            {movie.language && movie.language !== 'N/A' && (
              <div className="flex items-start gap-1.5">
                <Globe className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 line-clamp-1">{movie.language}</span>
              </div>
            )}
            
            {/* Awards */}
            {movie.awards && movie.awards !== 'N/A' && movie.awards !== 'N/A' && (
              <div className="flex items-start gap-1.5">
                <Award className="w-3 h-3 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 line-clamp-2 text-[9px]">{movie.awards}</span>
              </div>
            )}

            {/* Ratings Row */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {/* Metascore */}
              {movie.metascore && movie.metascore !== 'N/A' && (
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-green-600 text-white">
                  Meta {movie.metascore}
                </span>
              )}
              
              {/* Rotten Tomatoes */}
              {rottenTomatoesRating && (
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-red-600 text-white">
                  🍅 {rottenTomatoesRating}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onDownloadClick}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2.5 rounded-lg font-semibold text-sm shadow-lg transition-all"
          >
            Download Now
          </button>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-3">
        <h4 className="text-sm font-semibold truncate text-white group-hover:text-red-400 transition-colors">
          {movie.title}
        </h4>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-500">{movie.year}</p>
          {movie.country && movie.country !== 'N/A' && (
            <p className="text-[10px] text-gray-600 truncate max-w-[100px]">
              {movie.country.split(',')[0]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}