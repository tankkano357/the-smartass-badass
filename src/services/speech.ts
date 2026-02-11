import * as Speech from 'expo-speech';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent
} from 'expo-speech-recognition';

export const speakAnswer = (text: string) => {
  Speech.speak(text, { rate: 0.95, language: 'en-US' });
};

export const stopSpeaking = () => Speech.stop();

export const startListening = async () => {
  const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
  if (!result.granted) throw new Error('Speech recognition permission denied');

  return ExpoSpeechRecognitionModule.start({
    lang: 'en-US',
    interimResults: true,
    continuous: false,
    maxAlternatives: 1
  });
};

export const stopListening = () => ExpoSpeechRecognitionModule.stop();

export { useSpeechRecognitionEvent };
