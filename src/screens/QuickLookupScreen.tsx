import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import db from '../db/database';

const sections = [
  { title: 'Torque Specs', regex: /torque|ft-lb|nm/i },
  { title: 'Fluids & Capacities', regex: /capacity|fluid|oil|dot\s?5|qt|oz/i },
  { title: 'Diagnostic Codes', regex: /\bp0\d{3}\b|dtc|code/i },
  { title: 'Maintenance Intervals', regex: /interval|miles|schedule|service/i }
];

export const QuickLookupScreen = () => {
  const rows = db.getAllSync<any>('SELECT chunk_text FROM chunks');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {sections.map((section) => {
        const matches = rows
          .flatMap((r) => r.chunk_text.split('\n'))
          .filter((line) => section.regex.test(line))
          .slice(0, 25);

        return (
          <View key={section.title} style={styles.card}>
            <Text style={styles.title}>{section.title}</Text>
            {matches.length ? matches.map((line, idx) => <Text key={idx} style={styles.item}>• {line}</Text>) : <Text style={styles.item}>No indexed entries yet.</Text>}
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d' },
  content: { padding: 16, gap: 12 },
  card: { backgroundColor: '#161616', borderRadius: 12, padding: 14 },
  title: { color: '#fff', fontWeight: '700', marginBottom: 8 },
  item: { color: '#bdbdbd', marginBottom: 6 }
});
