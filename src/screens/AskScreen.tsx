import * as Clipboard from 'expo-clipboard';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { AnswerSections, QAResult } from '../types';
import { answerQuestion, getRecentQA } from '../services/qa';
import { speakAnswer, startListening, stopListening, useSpeechRecognitionEvent } from '../services/speech';

const EmptyMessage = 'No question yet. Silence is suspiciously peaceful.';

const SectionsView = ({ answer, showSources }: { answer: AnswerSections; showSources: boolean }) => (
  <View style={styles.answerCard}>
    <Text style={styles.sectionTitle}>Bottom Line</Text>
    <Text style={styles.answerText}>{answer.bottomLine}</Text>

    {!!answer.steps.length && (
      <>
        <Text style={styles.sectionTitle}>Steps</Text>
        {answer.steps.map((step) => (
          <Text style={styles.answerText} key={step}>{step}</Text>
        ))}
      </>
    )}

    {!!answer.toolsParts?.length && (
      <>
        <Text style={styles.sectionTitle}>Tools/Parts</Text>
        {answer.toolsParts.map((item) => (
          <Text style={styles.answerText} key={item}>• {item}</Text>
        ))}
      </>
    )}

    {!!answer.specifications?.length && (
      <>
        <Text style={styles.sectionTitle}>Specifications</Text>
        {answer.specifications.map((spec) => (
          <Text style={styles.answerText} key={spec}>{spec}</Text>
        ))}
      </>
    )}

    {showSources && (
      <>
        <Text style={styles.sectionTitle}>Citations</Text>
        {answer.citations.map((citation, idx) => (
          <Text style={styles.citationText} key={`${citation.document}-${idx}`}>
            • {citation.document} (Page {citation.pages}): "{citation.snippet}"
          </Text>
        ))}
      </>
    )}
  </View>
);

export const AskScreen = () => {
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState<QAResult | null>(null);
  const [showSources, setShowSources] = useState(false);

  useSpeechRecognitionEvent('result', (event) => {
    const text = event.results?.[0]?.transcript ?? '';
    setTranscript(text);
  });

  const ask = () => {
    const output = answerQuestion(transcript.trim());
    setResult(output);
  };

  const stepsOnly = useMemo(() => {
    if (result?.status !== 'ANSWERED') return '';
    return result.structured.steps.join('\n');
  }, [result]);

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

      {!result && (
        <View style={styles.answerCard}>
          <Text style={styles.answerText}>{EmptyMessage}</Text>
        </View>
      )}

      {result?.status === 'ANSWERED' && <SectionsView answer={result.structured} showSources={showSources} />}
      {result?.status !== 'ANSWERED' && !!result && (
        <View style={styles.answerCard}>
          <Text style={styles.answerText}>{result.message}</Text>
        </View>
      )}

      <View style={styles.row}>
        <TouchableOpacity style={styles.smallButton} onPress={() => speakAnswer(result?.status === 'ANSWERED' ? result.rendered : result?.message ?? '')}>
          <Text style={styles.buttonText}>Read Aloud</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton} onPress={ask}>
          <Text style={styles.buttonText}>Repeat</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.smallButton} onPress={() => Clipboard.setStringAsync(stepsOnly)}>
          <Text style={styles.buttonText}>Copy Steps</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton} onPress={() => setShowSources((prev) => !prev)}>
          <Text style={styles.buttonText}>{showSources ? 'Hide Sources' : 'Show Sources'}</Text>
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
  answerCard: { backgroundColor: '#141414', padding: 14, borderRadius: 10, gap: 8 },
  answerText: { color: '#ddd', lineHeight: 20 },
  citationText: { color: '#c6c6c6', lineHeight: 20 },
  row: { flexDirection: 'row', gap: 8 },
  smallButton: { flex: 1, backgroundColor: '#333', padding: 12, borderRadius: 10, alignItems: 'center' },
  sectionTitle: { color: '#bbb', marginTop: 8, fontWeight: '700' },
  cacheItem: { backgroundColor: '#1b1b1b', borderRadius: 8, padding: 10, marginTop: 8 },
  cacheQuestion: { color: '#aaa' }
});
