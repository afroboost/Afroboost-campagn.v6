/**
 * MediaViewer Component
 * Lecteur média unifié Afroboost - masque YouTube derrière afroboosteur.com
 */
import { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL || '';

const MediaViewer = ({ slug }) => {
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadMedia = async () => {
      try {
        const response = await axios.get(`${API}/api/media/${slug}`);
        setMedia(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Média non trouvé');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadMedia();
    }
  }, [slug]);

  const handleCopyLink = () => {
    const shareUrl = `https://afroboosteur.com/v/${media.slug}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black flex items-center justify-center" data-testid="media-viewer-loading">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl">Chargement...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black flex flex-col items-center justify-center p-4" data-testid="media-viewer-error">
        <div className="text-red-400 text-xl mb-4">❌ {error}</div>
        <a 
          href="https://afroboosteur.com" 
          className="px-6 py-3 rounded-lg text-white font-semibold transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #d91cd2, #8b5cf6)' }}
        >
          Retour à l'accueil
        </a>
      </div>
    );
  }

  // Construire l'URL YouTube embed épurée (sans branding, sans recommandations)
  const youtubeEmbedUrl = media.youtube_id 
    ? `https://www.youtube.com/embed/${media.youtube_id}?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&cc_load_policy=0&playsinline=1`
    : media.video_url;

  const shareUrl = `https://afroboosteur.com/v/${media.slug}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black" data-testid="media-viewer">
      {/* Header Afroboost - Gradient stylé */}
      <header 
        className="py-4 px-6 sticky top-0 z-50 backdrop-blur-md"
        style={{ 
          background: 'linear-gradient(135deg, rgba(217, 28, 210, 0.9), rgba(139, 92, 246, 0.9))',
          boxShadow: '0 4px 30px rgba(217, 28, 210, 0.3)'
        }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="https://afroboosteur.com" className="text-white text-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform">
            <span>🎧</span>
            <span>Afroboost</span>
          </a>
          <div className="flex items-center gap-3 text-white/80 text-sm">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
              {media.views || 0}
            </span>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Thumbnail personnalisée ou titre avant la vidéo */}
        <h1 className="text-white text-2xl md:text-3xl font-bold mb-6 text-center" data-testid="media-title">
          {media.title}
        </h1>

        {/* Lecteur vidéo - avec overlay pour masquer YouTube */}
        <div 
          className="relative w-full rounded-2xl overflow-hidden"
          style={{ 
            paddingBottom: '56.25%',
            boxShadow: '0 0 60px rgba(217, 28, 210, 0.4)',
            border: '2px solid rgba(217, 28, 210, 0.5)'
          }}
          data-testid="video-container"
        >
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={youtubeEmbedUrl}
            title={media.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>

        {/* Description */}
        {media.description && (
          <div className="mt-8 p-6 rounded-xl bg-white/5 border border-white/10" data-testid="media-description">
            <p className="text-white/90 text-lg leading-relaxed text-center">
              {media.description}
            </p>
          </div>
        )}

        {/* Bouton CTA - CRUCIAL pour conversions */}
        {media.cta_text && media.cta_link && (
          <div className="mt-10 text-center" data-testid="cta-section">
            <a
              href={media.cta_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-white text-xl font-bold transition-all hover:scale-105 active:scale-95"
              style={{ 
                background: 'linear-gradient(135deg, #d91cd2 0%, #8b5cf6 100%)',
                boxShadow: '0 0 40px rgba(217, 28, 210, 0.6), 0 10px 40px rgba(139, 92, 246, 0.3)'
              }}
              data-testid="cta-button"
            >
              <span>{media.cta_text}</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        )}

        {/* Section Partage */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-white/50 text-sm mb-4 text-center">Partager cette vidéo</p>
          <div className="flex flex-wrap justify-center gap-3">
            {/* Copier le lien */}
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-medium transition-all hover:scale-105 ${copied ? 'bg-green-600' : 'bg-white/10 hover:bg-white/20'}`}
              data-testid="copy-link-btn"
            >
              {copied ? '✓ Copié !' : '📋 Copier le lien'}
            </button>
            
            {/* WhatsApp */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(media.title + '\n\n' + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-600 text-white text-sm font-medium transition-all hover:scale-105 hover:bg-green-700"
              data-testid="whatsapp-share-btn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            
            {/* Email */}
            <a
              href={`mailto:?subject=${encodeURIComponent(media.title)}&body=${encodeURIComponent('Découvre cette vidéo :\n\n' + shareUrl)}`}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium transition-all hover:scale-105 hover:bg-blue-700"
              data-testid="email-share-btn"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Email
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-white/5">
        <a 
          href="https://afroboosteur.com" 
          className="text-white/40 text-sm hover:text-white/70 transition-colors"
        >
          © Afroboost 2025 - Tous droits réservés
        </a>
      </footer>
    </div>
  );
};

export default MediaViewer;
