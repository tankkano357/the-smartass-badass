import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { importManual, listDocuments } from '../services/ingestion';

export const DocumentsScreen = () => {
  const [filter, setFilter] = useState('');
  const [documents, setDocuments] = useState<any[]>(listDocuments());

  const onImport = async () => {
    await importManual();
    setDocuments(listDocuments());
  };

  const filtered = documents.filter((d) => d.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.importButton} onPress={onImport}>
        <Text style={styles.buttonText}>Import PDF/DOCX</Text>
      </TouchableOpacity>
      <TextInput
        value={filter}
        onChangeText={setFilter}
        placeholder="Search documents"
        placeholderTextColor="#777"
        style={styles.search}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>{item.type.toUpperCase()} • {item.imported_at}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d', padding: 16 },
  importButton: { backgroundColor: '#455a64', padding: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  search: { marginVertical: 12, backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 10, padding: 12 },
  card: { backgroundColor: '#1a1a1a', padding: 12, borderRadius: 10, marginBottom: 8 },
  name: { color: '#f1f1f1', fontWeight: '700' },
  meta: { color: '#999', marginTop: 4 }
});
