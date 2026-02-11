import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { answerQuestion, getRecentQA } from '../services/qa';
import { speakAnswer, startListening, stopListening, useSpeechRecognitionEvent } from '../services/speech';

export const AskScreen = () => {
  const [transcript, setTranscript] = useState('');
  const [answer, setAnswer] = useState('');

  useSpeechRecognitionEvent('result', (event) => {
    const text = event.results?.[0]?.transcript ?? '';
    setTranscript(text);
  });

  const ask = () => {
    const output = answerQuestion(transcript.trim());
    setAnswer(output);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.micButton} onPress={() => startListening()} onLongPress={() => stopListening()}>
        <Text style={styles.micText}>🎤 Hold to Stop</Text>
      </TouchableOpacity>

      <TextInput
        value={transcript}
        onChangeText={setTranscript}
        placeholder="Ask about Virginia"
        placeholderTextColor="#888"
        style={styles.input}
        multiline
      />

      <TouchableOpacity style={styles.actionButton} onPress={ask}>
        <Text style={styles.buttonText}>Ask</Text>
      </TouchableOpacity>

      <View style={styles.answerCard}>
        <Text style={styles.answerText}>{answer || 'No question yet. Silence is suspiciously peaceful.'}</Text>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.smallButton} onPress={() => speakAnswer(answer)}>
          <Text style={styles.buttonText}>Read Aloud</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton} onPress={ask}>
          <Text style={styles.buttonText}>Repeat</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Recent Q&A</Text>
      {getRecentQA().map((row: any) => (
        <View key={row.id} style={styles.cacheItem}>
          <Text style={styles.cacheQuestion}>{row.question}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d' },
  content: { padding: 16, gap: 12 },
  micButton: { backgroundColor: '#212121', padding: 20, borderRadius: 12, alignItems: 'center' },
  micText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  input: { backgroundColor: '#1a1a1a', color: '#fff', minHeight: 90, borderRadius: 12, padding: 14 },
  actionButton: { backgroundColor: '#3949ab', padding: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  answerCard: { backgroundColor: '#141414', padding: 14, borderRadius: 10 },
  answerText: { color: '#ddd', lineHeight: 20 },
  row: { flexDirection: 'row', gap: 8 },
  smallButton: { flex: 1, backgroundColor: '#333', padding: 12, borderRadius: 10, alignItems: 'center' },
  sectionTitle: { color: '#bbb', marginTop: 12, fontWeight: '700' },
  cacheItem: { backgroundColor: '#1b1b1b', borderRadius: 8, padding: 10, marginTop: 8 },
  cacheQuestion: { color: '#aaa' }
});
