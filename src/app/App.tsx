import { useState, useMemo, useEffect } from "react";
import { Search, Film, Menu, X } from "lucide-react";
import { MovieCard } from "./components/MovieCard";
import { DownloadModal } from "./components/DownloadModal";
import { moviesData } from "./data/moviesData";

const OMDB_API_KEY = 'c24f4e30';

type Category = 'all' | 'bollywood' | 'hollywood' | 'south' | 'webseries';

interface Movie {
  id: number;
  imdbID: string;
  title: string;
  year: string;
  poster: string;
  category: Category;
  quality: string;
  download_480p?: string;
  download_720p?: string;
  download_1080p?: string;
  download_4k?: string;
  // OMDB Additional Details
  rated?: string;
  released?: string;
  runtime?: string;
  genre?: string;
  director?: string;
  writer?: string;
  actors?: string;
  plot?: string;
  language?: string;
  country?: string;
  awards?: string;
  imdbRating?: string;
  imdbVotes?: string;
  metascore?: string;
  type?: string;
  ratings?: Array<{ Source: string; Value: string }>;
  // Series specific
  totalSeasons?: string;
  // Box office
  boxOffice?: string;
  production?: string;
}

interface DownloadModalData {
  title: string;
  year: string;
  links: Array<{ quality: string; url: string }>;
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
}

const categories = [
  { id: 'all' as Category, label: 'Home', icon: '🏠' },
  { id: 'bollywood' as Category, label: 'Bollywood', icon: '🎬' },
  { id: 'hollywood' as Category, label: 'Hollywood', icon: '🎥' },
  { id: 'south' as Category, label: 'South', icon: '🌟' },
  { id: 'webseries' as Category, label: 'Web Series', icon: '📺' },
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<DownloadModalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    // Load movies from imported data
    const loadMovies = async () => {
      console.log('🎬 Loading movies from data file...');
      console.log('Total movie entries:', moviesData.length);
      
      try {
        // Fetch OMDB data for each movie
        const moviesWithOMDB = await Promise.all(
          moviesData.map(async (csvMovie, index) => {
            const imdbId = csvMovie.imdb_id;
            
            try {
              // Fetch from OMDB API using IMDB ID
              const omdbResponse = await fetch(
                `https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`
              );
              const omdbData = await omdbResponse.json();
              
              if (omdbData.Response === 'True') {
                return {
                  id: index + 1,
                  imdbID: imdbId,
                  title: omdbData.Title,
                  year: omdbData.Year,
                  poster: omdbData.Poster !== 'N/A' ? omdbData.Poster : '',
                  category: csvMovie.category as Category,
                  quality: csvMovie.quality,
                  download_480p: csvMovie.download_480p,
                  download_720p: csvMovie.download_720p,
                  download_1080p: csvMovie.download_1080p,
                  download_4k: csvMovie.download_4k,
                  rated: omdbData.Rated,
                  released: omdbData.Released,
                  runtime: omdbData.Runtime,
                  genre: omdbData.Genre,
                  director: omdbData.Director,
                  writer: omdbData.Writer,
                  actors: omdbData.Actors,
                  plot: omdbData.Plot,
                  language: omdbData.Language,
                  country: omdbData.Country,
                  awards: omdbData.Awards,
                  imdbRating: omdbData.imdbRating,
                  imdbVotes: omdbData.imdbVotes,
                  metascore: omdbData.Metascore,
                  type: omdbData.Type,
                  ratings: omdbData.Ratings,
                  totalSeasons: omdbData.totalSeasons,
                  boxOffice: omdbData.BoxOffice,
                  production: omdbData.Production
                } as Movie;
              } else {
                console.warn(`OMDB fetch failed for ${imdbId}: ${omdbData.Error}`);
                return null;
              }
            } catch (error) {
              console.error(`Error fetching OMDB data for ${imdbId}:`, error);
              return null;
            }
          })
        );
        
        // Filter out null values
        const validMovies = moviesWithOMDB.filter(m => m !== null) as Movie[];
        
        console.log('✅ Successfully loaded', validMovies.length, 'movies with OMDB data');
        setMovies(validMovies);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading movies:', error);
        setIsLoading(false);
      }
    };
    
    loadMovies();
  }, []);

  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      const matchesCategory = selectedCategory === 'all' || movie.category === selectedCategory;
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          movie.year.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [movies, selectedCategory, searchQuery]);

  const handleDownloadClick = (movie: Movie) => {
    const links = [];
    if (movie.download_480p) links.push({ quality: '480p', url: movie.download_480p });
    if (movie.download_720p) links.push({ quality: '720p', url: movie.download_720p });
    if (movie.download_1080p) links.push({ quality: '1080p', url: movie.download_1080p });
    if (movie.download_4k) links.push({ quality: '4K', url: movie.download_4k });

    setSelectedMovie({
      title: movie.title,
      year: movie.year,
      links,
      genre: movie.genre,
      runtime: movie.runtime,
      imdbRating: movie.imdbRating,
      plot: movie.plot,
      director: movie.director,
      actors: movie.actors,
      // New OMDB fields
      rated: movie.rated,
      released: movie.released,
      writer: movie.writer,
      language: movie.language,
      country: movie.country,
      awards: movie.awards,
      imdbVotes: movie.imdbVotes,
      metascore: movie.metascore,
      type: movie.type,
      totalSeasons: movie.totalSeasons,
      boxOffice: movie.boxOffice,
      production: movie.production,
      ratings: movie.ratings
    });
    setIsModalOpen(true);
  };

  const getSectionTitle = () => {
    const category = categories.find(c => c.id === selectedCategory);
    return category ? `${category.icon} ${category.label === 'Home' ? 'All Movies' : category.label + ' Movies'}` : 'All Movies';
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-gray-100 font-['Inter',sans-serif]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0f0f1a]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Logo */}
            <div className="flex items-center justify-between">
              <a href="#" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                  <Film className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-['Bebas_Neue',sans-serif] tracking-wider bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                    HindiHub4u
                  </h1>
                  <p className="text-[10px] text-gray-500 -mt-1">Your Ultimate Movie Destination</p>
                </div>
              </a>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search movies, series..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#1a1a2e] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all"
                />
                {searchQuery && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                    {filteredMovies.length} results
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Category Navigation */}
          <nav className={`mt-4 overflow-x-auto ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
            <div className="flex gap-2 pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {category.icon} {category.label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-red-500/10 to-transparent py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-['Bebas_Neue',sans-serif] tracking-wide mb-2">
            <span className="text-white">Stream & Download</span>{' '}
            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Premium Movies
            </span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            Discover the latest Bollywood, Hollywood, South Indian movies and Web Series in HD, Full HD & 4K quality
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                {movies.length}+
              </div>
              <div className="text-xs text-gray-500">Movies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                4K
              </div>
              <div className="text-xs text-gray-500">Quality</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Free
              </div>
              <div className="text-xs text-gray-500">Forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Title */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
              <span className="w-1 h-6 bg-red-500 rounded-full"></span>
              {getSectionTitle()}
            </h3>
            <div className="text-sm text-gray-500">
              {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'}
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-[#1a1a2e] rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-[2/3] bg-gradient-to-br from-gray-800 to-gray-900"></div>
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-800 rounded"></div>
                    <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredMovies.map((movie, index) => (
                <div
                  key={movie.id}
                  className="animate-in fade-in-50 slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                >
                  <MovieCard
                    movie={movie}
                    onDownloadClick={() => handleDownloadClick(movie)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎬</div>
              <h4 className="text-xl font-semibold text-gray-300 mb-2">No movies found</h4>
              <p className="text-gray-500">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0a14] border-t border-white/5 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-['Bebas_Neue',sans-serif] tracking-wider bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              HindiHub4u
            </span>
          </div>
          <p className="text-xs text-gray-500 max-w-md mx-auto mb-4">
            ⚠️ Only free / licensed / public-domain content is listed. We do not host any copyrighted content.
          </p>
          <div className="flex justify-center gap-4 mb-4">
            <a href="#" className="text-gray-500 hover:text-red-500 transition-colors text-sm">About</a>
            <a href="#" className="text-gray-500 hover:text-red-500 transition-colors text-sm">Contact</a>
            <a href="#" className="text-gray-500 hover:text-red-500 transition-colors text-sm">DMCA</a>
            <a href="#" className="text-gray-500 hover:text-red-500 transition-colors text-sm">Privacy</a>
          </div>
          <p className="text-xs text-gray-600">© 2024 HindiHub4u. All rights reserved.</p>
        </div>
      </footer>

      {/* Download Modal */}
      <DownloadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movie={selectedMovie}
      />

      {/* Custom Scrollbar Styles */}
      <style>{`
        * {
          scrollbar-width: thin;
          scrollbar-color: #ef4444 #1a1a2e;
        }
        *::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        *::-webkit-scrollbar-track {
          background: #1a1a2e;
        }
        *::-webkit-scrollbar-thumb {
          background: #ef4444;
          border-radius: 4px;
        }
        *::-webkit-scrollbar-thumb:hover {
          background: #dc2626;
        }
      `}</style>
    </div>
  );
}