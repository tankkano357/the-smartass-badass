import * as Speech from 'expo-speech';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent
} from 'expo-speech-recognition';

export const speakAnswer = (text: string) => {
  if (!text.trim()) return;
  Speech.speak(text, { rate: 0.95, language: 'en-US' });
};

export const stopSpeaking = () => Speech.stop();

export const startListening = async () => {
  const hasModule = ExpoSpeechRecognitionModule && typeof ExpoSpeechRecognitionModule.start === 'function';
  if (!hasModule) return false;

  const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
  if (!result.granted) return false;

  await ExpoSpeechRecognitionModule.start({
    lang: 'en-US',
    interimResults: true,
    continuous: false,
    maxAlternatives: 1
  });
  return true;
};

export const stopListening = () => ExpoSpeechRecognitionModule.stop();

export { useSpeechRecognitionEvent };
