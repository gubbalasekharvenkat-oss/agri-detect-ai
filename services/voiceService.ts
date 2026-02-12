
export class VoiceService {
  private static instance: VoiceService;
  private synth: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  private constructor() {
    this.synth = window.speechSynthesis;
  }

  public static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }

  public speak(text: string, lang: 'en' | 'es', onEnd?: () => void) {
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to find best matching voice
    const voices = this.synth.getVoices();
    const targetLang = lang === 'en' ? 'en-US' : 'es-ES';
    const voice = voices.find(v => v.lang.startsWith(targetLang)) || voices[0];
    
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.lang = targetLang;
    utterance.pitch = 1.0;
    utterance.rate = 1.0;

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
      console.error('SpeechSynthesis Error:', event);
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }

  public isSpeaking(): boolean {
    return this.synth.speaking;
  }
}
