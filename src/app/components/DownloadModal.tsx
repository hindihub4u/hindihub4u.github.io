import { X, Download, Star, Award, Globe, Film, Calendar, Clock, Users, Pen } from "lucide-react";

interface DownloadLink {
  quality: string;
  url: string;
}

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: {
    title: string;
    year: string;
    links: DownloadLink[];
    // Existing fields
    genre?: string;
    runtime?: string;
    imdbRating?: string;
    plot?: string;
    director?: string;
    actors?: string;
    // New OMDB fields
    rated?: string;
    released?: string;
    writer?: string;
    language?: string;
    country?: string;
    awards?: string;
    imdbVotes?: string;
    metascore?: string;
    type?: string;
    totalSeasons?: string;
    boxOffice?: string;
    production?: string;
    ratings?: Array<{ Source: string; Value: string }>;
  } | null;
}

export function DownloadModal({ isOpen, onClose, movie }: DownloadModalProps) {
  if (!isOpen || !movie) return null;

  // Helper function to check if value exists and is not 'N/A'
  const hasValue = (value?: string) => value && value !== 'N/A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[#1a1a2e] rounded-2xl border border-white/10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1a2e] border-b border-white/5 z-10">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <h4 className="text-xl font-bold text-white flex-1">{movie.title}</h4>
                  {movie.type && (
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-purple-600 text-white">
                      {movie.type === 'series' ? '📺 Series' : '🎬 Movie'}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-sm text-gray-400">{movie.year}</span>
                  {hasValue(movie.rated) && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded bg-gray-700 text-white border border-white/20">
                      {movie.rated}
                    </span>
                  )}
                  {hasValue(movie.runtime) && (
                    <span className="text-sm text-gray-400">• {movie.runtime}</span>
                  )}
                </div>

                {/* Ratings Bar */}
                {(hasValue(movie.imdbRating) || hasValue(movie.metascore) || movie.ratings) && (
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {hasValue(movie.imdbRating) && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded bg-yellow-500/20 border border-yellow-500/30">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold text-yellow-500">{movie.imdbRating}/10</span>
                        {hasValue(movie.imdbVotes) && (
                          <span className="text-[10px] text-gray-400 ml-1">({movie.imdbVotes})</span>
                        )}
                      </div>
                    )}
                    
                    {hasValue(movie.metascore) && (
                      <div className="px-2 py-1 rounded bg-green-600/20 border border-green-600/30">
                        <span className="text-xs font-bold text-green-500">Meta {movie.metascore}</span>
                      </div>
                    )}
                    
                    {movie.ratings?.map((rating, idx) => {
                      if (rating.Source === "Rotten Tomatoes") {
                        return (
                          <div key={idx} className="px-2 py-1 rounded bg-red-600/20 border border-red-600/30">
                            <span className="text-xs font-bold text-red-400">🍅 {rating.Value}</span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
              
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Plot */}
          {hasValue(movie.plot) && (
            <div>
              <h5 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <Film className="w-4 h-4 text-red-500" />
                Synopsis
              </h5>
              <p className="text-sm text-gray-300 leading-relaxed">{movie.plot}</p>
            </div>
          )}

          {/* Movie Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Info */}
            {hasValue(movie.genre) && (
              <div className="flex items-start gap-2">
                <Film className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Genre</p>
                  <p className="text-sm text-white">{movie.genre}</p>
                </div>
              </div>
            )}

            {hasValue(movie.released) && (
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Released</p>
                  <p className="text-sm text-white">{movie.released}</p>
                </div>
              </div>
            )}

            {hasValue(movie.director) && (
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Director</p>
                  <p className="text-sm text-white">{movie.director}</p>
                </div>
              </div>
            )}

            {hasValue(movie.writer) && (
              <div className="flex items-start gap-2">
                <Pen className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Writer</p>
                  <p className="text-sm text-white line-clamp-2">{movie.writer}</p>
                </div>
              </div>
            )}

            {hasValue(movie.actors) && (
              <div className="flex items-start gap-2 md:col-span-2">
                <Users className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Cast</p>
                  <p className="text-sm text-white">{movie.actors}</p>
                </div>
              </div>
            )}

            {hasValue(movie.language) && (
              <div className="flex items-start gap-2">
                <Globe className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Language</p>
                  <p className="text-sm text-white">{movie.language}</p>
                </div>
              </div>
            )}

            {hasValue(movie.country) && (
              <div className="flex items-start gap-2">
                <Globe className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Country</p>
                  <p className="text-sm text-white">{movie.country}</p>
                </div>
              </div>
            )}

            {movie.type === 'series' && hasValue(movie.totalSeasons) && (
              <div className="flex items-start gap-2">
                <Film className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Total Seasons</p>
                  <p className="text-sm text-white">{movie.totalSeasons}</p>
                </div>
              </div>
            )}

            {hasValue(movie.boxOffice) && (
              <div className="flex items-start gap-2">
                <Award className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Box Office</p>
                  <p className="text-sm text-white">{movie.boxOffice}</p>
                </div>
              </div>
            )}

            {hasValue(movie.production) && (
              <div className="flex items-start gap-2">
                <Film className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Production</p>
                  <p className="text-sm text-white">{movie.production}</p>
                </div>
              </div>
            )}
          </div>

          {/* Awards */}
          {hasValue(movie.awards) && (
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Award className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-yellow-500/80 font-semibold mb-1">Awards & Nominations</p>
                  <p className="text-sm text-white">{movie.awards}</p>
                </div>
              </div>
            </div>
          )}

          {/* Download Links */}
          <div className="border-t border-white/5 pt-6">
            <p className="text-sm text-gray-400 mb-4 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Select your preferred quality:
            </p>
            <div className="space-y-3">
              {movie.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="flex items-center justify-between gap-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-4 rounded-lg font-semibold transition-all transform hover:scale-[1.02] shadow-lg"
                >
                  <span>Download {link.quality}</span>
                  <Download className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Note */}
          <div className="border-t border-white/5 pt-4">
            <p className="text-xs text-gray-500 text-center">
              ⚠️ Please ensure you have rights to download this content
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}