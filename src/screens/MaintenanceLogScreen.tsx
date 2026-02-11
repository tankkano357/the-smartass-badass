import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import db from '../db/database';

export const MaintenanceLogScreen = () => {
  const [mileage, setMileage] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [parts, setParts] = useState('');
  const [cost, setCost] = useState('');
  const [rows, setRows] = useState<any[]>(db.getAllSync('SELECT * FROM maintenance_logs ORDER BY date DESC'));
  const [dueSoonMiles, setDueSoonMiles] = useState('500');

  const save = () => {
    db.runSync('INSERT INTO maintenance_logs (date, mileage, category, notes, parts, cost) VALUES (?, ?, ?, ?, ?, ?)', [
      new Date().toISOString().slice(0, 10),
      Number(mileage),
      category,
      notes,
      parts,
      Number(cost || 0)
    ]);
    setRows(db.getAllSync('SELECT * FROM maintenance_logs ORDER BY date DESC'));
  };

  const latestMileage = Number(rows[0]?.mileage ?? 0);
  const dueSoon = latestMileage > 0 && latestMileage % 5000 >= 5000 - Number(dueSoonMiles);

  return (
    <View style={styles.container}>
      <Text style={styles.warning}>{dueSoon ? 'Due soon warning: service window approaching.' : 'Due soon monitor: calm for now.'}</Text>
      <TextInput style={styles.input} value={dueSoonMiles} onChangeText={setDueSoonMiles} placeholder="Due soon threshold miles" placeholderTextColor="#777" keyboardType="number-pad" />
      {[{ v: mileage, s: setMileage, p: 'Mileage' }, { v: category, s: setCategory, p: 'Category' }, { v: notes, s: setNotes, p: 'Notes' }, { v: parts, s: setParts, p: 'Parts' }, { v: cost, s: setCost, p: 'Cost' }].map((f) => (
        <TextInput key={f.p} style={styles.input} value={f.v} onChangeText={f.s} placeholder={f.p} placeholderTextColor="#777" />
      ))}
      <TouchableOpacity style={styles.save} onPress={save}><Text style={styles.button}>Save Log</Text></TouchableOpacity>
      <FlatList data={rows} keyExtractor={(item) => String(item.id)} renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.main}>{item.date} • {item.mileage} mi • {item.category}</Text>
          <Text style={styles.sub}>{item.notes}</Text>
        </View>
      )} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e0f', padding: 16 },
  warning: { color: '#ffcc80', marginBottom: 8 },
  input: { backgroundColor: '#1d1d1d', borderRadius: 10, color: '#fff', padding: 12, marginBottom: 8 },
  save: { backgroundColor: '#00695c', borderRadius: 10, padding: 12, alignItems: 'center', marginBottom: 10 },
  button: { color: '#fff', fontWeight: '700' },
  card: { backgroundColor: '#181818', borderRadius: 10, padding: 10, marginBottom: 8 },
  main: { color: '#eee' },
  sub: { color: '#aaa', marginTop: 4 }
});
