// /services/index.js - Export centralisé des services Afroboost
// Compatible Vercel

// === EMAIL SERVICE (EmailJS) ===
export {
  getEmailJSConfig,
  saveEmailJSConfig,
  isEmailJSConfigured,
  initEmailJS,
  sendEmail,
  sendBulkEmails,
  testEmailJSConfig
} from './emailService';

// === WHATSAPP SERVICE (Twilio) ===
export {
  getWhatsAppConfig,
  saveWhatsAppConfig,
  isWhatsAppConfigured,
  formatPhoneE164,
  sendWhatsAppMessage,
  sendBulkWhatsApp,
  testWhatsAppConfig
} from './whatsappService';

// === AI RESPONSE SERVICE ===
export {
  getAIConfig,
  saveAIConfig,
  isAIEnabled,
  setLastMediaUrl,
  addAILog,
  getAILogs,
  clearAILogs,
  findClientByPhone,
  buildAIContext
} from './aiResponseService';
