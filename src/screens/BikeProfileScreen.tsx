import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BIKE_PROFILE } from '../constants/bikeProfile';

export const BikeProfileScreen = () => (
  <ScrollView style={styles.container} contentContainerStyle={styles.content}>
    <Text style={styles.name}>{BIKE_PROFILE.nickname}</Text>
    <Text style={styles.meta}>{BIKE_PROFILE.year} {BIKE_PROFILE.make} {BIKE_PROFILE.model}</Text>
    <Text style={styles.meta}>Model Code: {BIKE_PROFILE.modelCode}</Text>
    <Text style={styles.meta}>VIN: {BIKE_PROFILE.vin}</Text>

    {Object.entries(BIKE_PROFILE.buildSheet).map(([section, values]) => (
      <View key={section} style={styles.card}>
        <Text style={styles.section}>{section}</Text>
        {values.map((value) => (
          <Text key={value} style={styles.item}>• {value}</Text>
        ))}
      </View>
    ))}

    <View style={styles.card}>
      <Text style={styles.section}>Milestone</Text>
      <Text style={styles.item}>{BIKE_PROFILE.milestone}</Text>
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0c0c0c' },
  content: { padding: 16, gap: 12 },
  name: { color: '#fff', fontWeight: '800', fontSize: 28 },
  meta: { color: '#b8b8b8' },
  card: { backgroundColor: '#151515', borderRadius: 12, padding: 12 },
  section: { color: '#f5f5f5', fontWeight: '700', marginBottom: 8 },
  item: { color: '#b0b0b0', marginBottom: 4 }
});
