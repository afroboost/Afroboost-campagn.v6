// /services/notificationService.js - Service de notifications sonores et visuelles
// Pour le systeme de chat Afroboost - Optimise pour iOS et Android

/**
 * Sons de notification utilisant Web Audio API + son Base64 de qualite
 * Optimise pour iOS (Safari) et Android
 * Son "soft" type Pop/Glass - se declenche uniquement si document.visibilityState === 'hidden'
 */

// Contexte Audio global avec gestion iOS
let audioContext = null;
let isAudioUnlocked = false;
let notificationAudio = null;

// === SON BASE64 "POP" DOUX ET DISCRET ===
// Son synthetique court (150ms) type "glass chime" - pas de fichier externe
const SOFT_POP_SOUND = 'data:audio/wav;base64,UklGRl4FAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YToFAAAAAAD//wEAAQD+/wIA/f8DAP3/AgD+/wIA/f8CAP7/AQD//wAA//8BAP//AQD//wEA//8BAP//AAAAAAAAAAAA//8BAP//AQD//wEA//8AAAAAAAAAAAAAAAAAAP//AQD//wEA//8BAAAAAAAAAAAAAAD//wEAAAABAAAAAwACAAQAAwAGAAUACQAJAA0ADQASABMAGQAbACEAJAAqAC4ANgA7AEQASgBVAFwAaABwAH4AhwCWAKAAsAC7AM0A2ADsAPgADQEZAS8BOwFSAV4BdgGCAZoBpgG/AcsB4wHvAQcCEwIqAjYCTQJYAm4CeQKOApgCrAK1AsoCzwLhAucC9gL5AgYDCQMUAxcDIQMjAywDLgM1AzYDOwM9Az8DPQM/Az0DPgM8AzwDOgM5AzcDNQM0AzIDLwMtAysDKAMlAyMDHwMcAxkDFgMSAw8DCwMIAwQDAQP9AvkC9gLyAu4C6gLmAuEC3QLYAtMCzwLKAsUCwAK7ArYCsQKsAqcCoQKcApYCkAKLAoUCfwJ5AnMCbQJnAmECWwJVAk8CSQJDAL0AtwCxAKsApQCfAJkAkwCNAIcAgQB7AHUAbwBpAGMAXQBXAFEASwBFAD8AOQA0AC4AKAAjAB0AGAASAAwABwACAP3/+P/z/+7/6f/k/+D/2//W/9L/zv/J/8X/wf+9/7n/tf+y/67/q/+o/6T/of+e/5v/mP+W/5P/kf+O/4z/iv+I/4b/hP+D/4H/gP9//37/ff98/3v/ev96/3n/ef95/3n/ef95/3n/ev96/3v/fP99/37/gP+B/4P/hf+H/4r/jP+P/5L/lf+Y/5z/n/+j/6f/q/+v/7P/t/+8/8D/xf/K/8//1P/Z/97/4//p/+7/9P/5////BAEKARABFgEcASIBKAEuATQBOgFAAUYBSwFRAVcBXAFiAWcBbAFxAXYBewGAAYQBiAGMAZABlAGYAZsBngGhAaQBpgGoAaoBqwGsAa0BrgGuAa4BrgGuAa0BrAGrAakBpwGlAaMBoAGdAZoBmAGUAZEBjQGJAYUBgAF8AXcBcgFtAWgBYwFdAVgBUgFMAUYBQAE6ATQBLgEnASEBGgETAQ0BBgEAAfoA8wDsAOYA3wDYANEAywDEAL0AtgCwAKkAogCcAJUAjgCIAIEAfAB1AG8AaQBjAF0AVwBRAEsARgBAADoANQAwACoAJQAfABoAFQAQAAsABgACAP3/+f/0//D/6//n/+P/3v/b/9f/0v/P/8v/yP/E/8H/vv+7/7j/tv+z/7D/rv+s/6n/p/+m/6T/ov+g/5//nf+c/5v/mv+Z/5j/l/+X/5b/lv+W/5X/lf+V/5X/lf+W/5b/l/+X/5j/mf+a/5v/nP+d/5//oP+i/6T/pv+o/6r/rf+v/7L/tf+4/7v/vv/C/8X/yf/N/9D/1P/Y/9z/4P/k/+n/7f/x//X/+v/+/wIABwAMABAAFQAaAB8AJAAoAC0AMgA3ADwAQQBFAEoATwBTAFgAXQBhAGYAagBuAHIAdgB6AH4AggCFAIkAjACPAJIAlQCYAJoAnQCfAKEAowClAKYAqACpAKoAqwCsAKwArACsAKwArAGsAKsAqwCqAKkAqACmAKUAowCiAKAAngCbAJkAlgCUAJEAjgCLAIgAhQCCAH8AfAB4AHUAcQBuAGoAZgBjAF8AWwBXAFMATwBLAEcAQwA/ADsANgAyAC4AKgAmACEAHQAZABUAEAAMAAgABAAAAAEA
    }
    
    // Résumer le contexte audio si suspendu (politique navigateur iOS/Chrome)
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // Ajouter un filtre pour un son plus doux sur mobile
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2000;

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sine';
    
    const now = ctx.currentTime;

    // Différents sons selon le type
    switch (type) {
      case 'private':
        // Son URGENT pour message privé (triple bip ascendant)
        oscillator.frequency.setValueAtTime(440, now); // La4
        oscillator.frequency.setValueAtTime(554, now + 0.1); // Do#5
        oscillator.frequency.setValueAtTime(659, now + 0.2); // Mi5
        gainNode.gain.setValueAtTime(0.4, now);
        gainNode.gain.setValueAtTime(0.35, now + 0.1);
        gainNode.gain.setValueAtTime(0.3, now + 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        oscillator.start(now);
        oscillator.stop(now + 0.35);
        break;
        
      case 'coach':
        // Son distinctif pour réponse coach (double bip harmonieux)
        oscillator.frequency.setValueAtTime(523, now); // Do5
        oscillator.frequency.setValueAtTime(659, now + 0.12); // Mi5
        gainNode.gain.setValueAtTime(0.35, now);
        gainNode.gain.setValueAtTime(0.3, now + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        oscillator.start(now);
        oscillator.stop(now + 0.25);
        break;
      
      case 'user':
        // Son aigu pour message utilisateur (notification subtile)
        oscillator.frequency.setValueAtTime(784, now); // Sol5
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        oscillator.start(now);
        oscillator.stop(now + 0.15);
        break;
      
      default:
        // Son standard (bip agréable)
        oscillator.frequency.setValueAtTime(587, now); // Ré5
        gainNode.gain.setValueAtTime(0.28, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        oscillator.start(now);
        oscillator.stop(now + 0.12);
    }

  } catch (err) {
    console.warn('Notification sound failed:', err);
  }
};

/**
 * Joue un son de notification plus long et distinct (pour les notifications push)
 */
export const playPushNotificationSound = async () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const now = ctx.currentTime;
    
    // Créer un son de notification plus élaboré
    const notes = [523, 659, 784]; // Do, Mi, Sol (accord majeur)
    
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const startTime = now + i * 0.1;
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
      
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });

  } catch (err) {
    console.warn('Push notification sound failed:', err);
  }
};

/**
 * Demande la permission pour les notifications browser
 * @returns {Promise<'granted'|'denied'|'default'|'unsupported'>} Status de la permission
 */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('[NOTIFICATIONS] Browser notifications not supported');
    return 'unsupported';
  }
  
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  
  if (Notification.permission === 'denied') {
    console.log('[NOTIFICATIONS] Permission was denied previously');
    return 'denied';
  }
  
  // Permission is 'default' - ask user
  try {
    const permission = await Notification.requestPermission();
    console.log('[NOTIFICATIONS] Permission result:', permission);
    return permission;
  } catch (err) {
    console.error('[NOTIFICATIONS] Error requesting permission:', err);
    return 'denied';
  }
};

/**
 * Vérifie l'état actuel de la permission de notification
 * @returns {'granted'|'denied'|'default'|'unsupported'}
 */
export const getNotificationPermissionStatus = () => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
};

/**
 * Affiche une notification browser (si autorisée)
 * @param {string} title - Titre de la notification
 * @param {string} body - Corps du message
 * @param {object} options - Options supplémentaires
 * @returns {Promise<{notification: Notification|null, fallbackNeeded: boolean}>}
 */
export const showBrowserNotification = async (title, body, options = {}) => {
  // Vérifier le support et la permission
  if (!('Notification' in window)) {
    console.log('[NOTIFICATIONS] Browser not supported - fallback needed');
    return { notification: null, fallbackNeeded: true, reason: 'unsupported' };
  }
  
  if (Notification.permission !== 'granted') {
    console.log('[NOTIFICATIONS] Permission not granted - fallback needed');
    return { notification: null, fallbackNeeded: true, reason: 'permission_denied' };
  }

  try {
    const notification = new Notification(title, {
      body,
      icon: options.icon || '/favicon.ico',
      badge: options.badge || '/favicon.ico',
      tag: options.tag || 'afroboost-chat',
      requireInteraction: options.requireInteraction || false,
      silent: false, // Permet le son systeme
      ...options
    });

    // Fermer automatiquement apres 8 secondes (plus long pour plus de visibilite)
    setTimeout(() => notification.close(), 8000);

    // Callback au clic - Focus la fenetre et executer le callback
    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      notification.close();
      if (options.onClick) {
        options.onClick(event);
      }
    };

    console.log('[NOTIFICATIONS] Browser notification shown:', title);
    return { notification, fallbackNeeded: false };
    
  } catch (err) {
    console.error('[NOTIFICATIONS] Error showing notification:', err);
    return { notification: null, fallbackNeeded: true, reason: 'error' };
  }
};

/**
 * Affiche une notification systeme pour un nouveau message Afroboost
 * A utiliser quand l'onglet est en arriere-plan
 * @param {string} senderName - Nom de l'expediteur
 * @param {string} messageText - Texte du message (tronque si trop long)
 * @returns {Promise<boolean>} - true si la notification a ete affichee
 */
export const showNewMessageNotification = async (senderName, messageText) => {
  // Ne pas afficher si la fenetre a le focus
  if (document.hasFocus()) {
    console.log('[NOTIFICATIONS] Window has focus - skipping notification');
    return false;
  }
  
  // Tronquer le message si trop long (max 100 caracteres)
  const truncatedText = messageText && messageText.length > 100 
    ? messageText.substring(0, 97) + '...' 
    : messageText || '';
  
  const result = await showBrowserNotification(
    `Afroboost - ${senderName || 'Nouveau message'}`,
    truncatedText,
    {
      tag: 'afroboost-new-message',
      requireInteraction: false,
      onClick: () => {
        // Focus et scroll vers le chat quand l'utilisateur clique
        window.focus();
      }
    }
  );
  
  return !result.fallbackNeeded;
};

/**
 * Convertit une URL en lien cliquable
 * @param {string} text - Texte à analyser
 * @returns {string} - Texte avec liens HTML
 */
export const linkifyText = (text) => {
  if (!text) return '';
  
  // Si le texte contient déjà du HTML (emojis img), le préserver
  // D'abord, extraire les balises img pour les protéger
  const imgTags = [];
  let protectedText = text.replace(/<img[^>]+>/gi, (match) => {
    imgTags.push(match);
    return `__IMG_PLACEHOLDER_${imgTags.length - 1}__`;
  });
  
  // Regex pour détecter les URLs
  const urlRegex = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g;
  
  // Convertir les URLs en liens
  protectedText = protectedText.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="chat-link">${url}</a>`;
  });
  
  // Restaurer les balises img
  imgTags.forEach((img, index) => {
    protectedText = protectedText.replace(`__IMG_PLACEHOLDER_${index}__`, img);
  });
  
  return protectedText;
};

/**
 * Mapping des emojis personnalisés vers leurs équivalents natifs (fallback)
 */
const EMOJI_FALLBACK_MAP = {
  'fire': '🔥',
  'fire.svg': '🔥',
  'muscle': '💪',
  'muscle.svg': '💪',
  'heart': '❤️',
  'heart.svg': '❤️',
  'thumbsup': '👍',
  'thumbsup.svg': '👍',
  'star': '⭐',
  'star.svg': '⭐',
  'celebration': '🎉',
  'celebration.svg': '🎉'
};

/**
 * Parse les tags [emoji:filename.svg] et les convertit en balises <img>
 * Compatible avec linkifyText (préserve les URLs)
 * Inclut un fallback vers l'emoji natif si l'image ne charge pas
 * @param {string} text - Texte avec potentiels tags emoji
 * @returns {string} - Texte avec balises img pour les emojis
 */
export const parseEmojis = (text) => {
  if (!text) return '';
  
  const API = process.env.REACT_APP_BACKEND_URL + '/api';
  
  // Regex pour détecter [emoji:filename.svg] ou [emoji:filename]
  const emojiRegex = /\[emoji:([^\]]+)\]/g;
  
  return text.replace(emojiRegex, (match, filename) => {
    // Ajouter .svg si pas d'extension
    const file = filename.includes('.') ? filename : `${filename}.svg`;
    const emojiName = filename.replace('.svg', '');
    
    // Emoji natif en fallback
    const fallbackEmoji = EMOJI_FALLBACK_MAP[filename] || EMOJI_FALLBACK_MAP[file] || '😊';
    
    // Balise img avec onerror pour afficher l'emoji natif en fallback
    return `<img src="${API}/emojis/${file}" alt="${emojiName}" class="chat-emoji" style="width:20px;height:20px;vertical-align:middle;display:inline-block;margin:0 2px;" onerror="this.outerHTML='${fallbackEmoji}'" />`;
  });
};

/**
 * Combine le parsing d'emojis et la création de liens
 * @param {string} text - Texte brut
 * @returns {string} - Texte HTML avec emojis et liens
 */
export const parseMessageContent = (text) => {
  if (!text) return '';
  
  // D'abord parser les emojis
  let parsed = parseEmojis(text);
  
  // Puis ajouter les liens (linkifyText préserve les balises img)
  parsed = linkifyText(parsed);
  
  return parsed;
};

/**
 * Vérifie si le texte contient des URLs
 * @param {string} text - Texte à vérifier
 * @returns {boolean}
 */
export const containsLinks = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return urlRegex.test(text);
};

// ==================== CLIGNOTEMENT TITRE ONGLET ====================
let originalTitle = document.title;
let titleInterval = null;
let isFlashing = false;

/**
 * Démarre le clignotement du titre de l'onglet pour attirer l'attention
 * @param {string} message - Message à afficher (ex: "💬 Nouveau message privé !")
 */
export const startTitleFlash = (message = '💬 Nouveau message privé !') => {
  if (isFlashing) return; // Déjà en cours
  
  originalTitle = document.title;
  isFlashing = true;
  let showMessage = true;
  
  titleInterval = setInterval(() => {
    document.title = showMessage ? message : originalTitle;
    showMessage = !showMessage;
  }, 1000); // Alterne toutes les secondes
  
  // Écouter le focus de la fenêtre pour arrêter le clignotement
  const handleFocus = () => {
    stopTitleFlash();
    window.removeEventListener('focus', handleFocus);
  };
  window.addEventListener('focus', handleFocus);
};

/**
 * Arrête le clignotement du titre et restaure le titre original
 */
export const stopTitleFlash = () => {
  if (titleInterval) {
    clearInterval(titleInterval);
    titleInterval = null;
  }
  document.title = originalTitle;
  isFlashing = false;
};

/**
 * Vérifie si la fenêtre/onglet a le focus
 * @returns {boolean}
 */
export const isWindowFocused = () => {
  return document.hasFocus();
};

/**
 * Notification complète pour MP: titre clignotant + badge (son géré par ChatWidget)
 * À appeler quand un message privé arrive
 */
export const notifyPrivateMessage = (senderName = 'Quelqu\'un') => {
  // Note: Le son est géré par ChatWidget via playSoundIfEnabled() pour respecter les préférences
  
  // Clignoter le titre si la fenêtre n'a pas le focus
  if (!isWindowFocused()) {
    startTitleFlash(`💬 ${senderName} vous a envoyé un message !`);
  }
  
  // Notification navigateur si autorisée
  showBrowserNotification(
    '💬 Nouveau message privé',
    `${senderName} vous a envoyé un message`,
    'private'
  );
};

export default {
  playNotificationSound,
  playPushNotificationSound,
  unlockAudio,
  requestNotificationPermission,
  showBrowserNotification,
  showNewMessageNotification,
  linkifyText,
  parseEmojis,
  parseMessageContent,
  containsLinks,
  startTitleFlash,
  stopTitleFlash,
  isWindowFocused,
  notifyPrivateMessage
};
