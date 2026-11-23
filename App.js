import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, Pressable, StyleSheet, Alert, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'plantgrow-demo-v1';
const START = { target: 5000, transactions: [{ id: 'seed', amount: 250, date: 'Starter deposit' }] };
const money = value => 'R ' + Number(value).toLocaleString('en-ZA', { maximumFractionDigits: 2, minimumFractionDigits: 2 });

export default function App() {
  const [data, setData] = useState(START);
  const [ready, setReady] = useState(false);
  const [amount, setAmount] = useState('');
  const [goal, setGoal] = useState('');
  useEffect(() => {
    AsyncStorage.getItem(KEY).then(saved => { if (saved) setData(JSON.parse(saved)); })
      .catch(() => Alert.alert('Storage', 'Could not load saved demo data.'))
      .finally(() => setReady(true));
  }, []);
  useEffect(() => {
    if (ready) AsyncStorage.setItem(KEY, JSON.stringify(data)).catch(() => Alert.alert('Storage', 'Could not save demo data.'));
  }, [data, ready]);
  const balance = data.transactions.reduce((sum, item) => sum + item.amount, 0);
  const progress = Math.min(1, balance / data.target);
  const stage = progress >= 1 ? 'Blooming!' : progress >= 0.7 ? 'Growing strong' : progress >= 0.35 ? 'Sprouting' : 'Just planted';
  const plant = progress >= 1 ? '🌳' : progress >= 0.7 ? '🌴' : progress >= 0.35 ? '🌿' : '🌱';
  const add = () => {
    const value = Number(amount.replace(',', '.'));
    if (!Number.isFinite(value) || value <= 0 || value > 100000000) return Alert.alert('Invalid amount', 'Enter a positive amount.');
    setData(old => ({ ...old, transactions: [{ id: String(Date.now()), amount: value, date: new Date().toLocaleDateString('en-ZA') }, ...old.transactions] }));
    setAmount('');
  };
  const updateGoal = () => {
    const value = Number(goal.replace(',', '.'));
    if (!Number.isFinite(value) || value <= 0 || value > 1000000000) return Alert.alert('Invalid goal', 'Enter a positive savings target.');
    setData(old => ({ ...old, target: value }));
    setGoal('');
  };
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F7EF" />
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>YOUR SAVINGS GARDEN</Text>
        <Text style={styles.title}>PlantGrow 🌱</Text>
        <Text style={styles.subtitle}>Grow your savings, one seed at a time.</Text>
        <View style={styles.hero}>
          <Text style={styles.small}>TOTAL SAVED</Text>
          <Text style={styles.balance}>{money(balance)}</Text>
          <Text style={styles.plant}>{plant}</Text>
          <Text style={styles.stage}>{stage}</Text>
          <View style={styles.track}><View style={[styles.fill, { width: (progress * 100) + '%' }]} /></View>
          <Text style={styles.progress}>{Math.round(progress * 100)}% of {money(data.target)} goal</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.heading}>Add to your garden</Text>
          <Text style={styles.muted}>Demo money only — no real deposits.</Text>
          <TextInput style={styles.input} placeholder="Amount in rand (e.g. 100)" keyboardType="decimal-pad" value={amount} onChangeText={setAmount} />
          <Pressable style={styles.button} onPress={add}><Text style={styles.buttonText}>+ Add savings</Text></Pressable>
        </View>
        <View style={styles.card}>
          <Text style={styles.heading}>Savings target</Text>
          <Text style={styles.muted}>Current goal: {money(data.target)}</Text>
          <TextInput style={styles.input} placeholder="New target (e.g. 10000)" keyboardType="decimal-pad" value={goal} onChangeText={setGoal} />
          <Pressable style={styles.secondary} onPress={updateGoal}><Text style={styles.secondaryText}>Update goal</Text></Pressable>
        </View>
        <View style={styles.card}>
          <Text style={styles.heading}>Savings history</Text>
          {data.transactions.map(item => <View key={item.id} style={styles.transaction}><View><Text style={styles.transactionTitle}>Savings added</Text><Text style={styles.muted}>{item.date}</Text></View><Text style={styles.positive}>+ {money(item.amount)}</Text></View>)}
        </View>
        <Text style={styles.footer}>PlantGrow demo • Local-only sample data • Not a bank</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F3F7EF' },
  page: { padding: 22, paddingBottom: 48 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 2, color: '#4C7653', marginTop: 14 },
  title: { fontSize: 34, fontWeight: '900', color: '#193D2A', marginTop: 6 },
  subtitle: { color: '#6B806E', marginTop: 4, marginBottom: 22 },
  hero: { backgroundColor: '#DCEED9', borderRadius: 28, padding: 24, alignItems: 'center', marginBottom: 16 },
  small: { color: '#4D7355', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  balance: { fontSize: 35, fontWeight: '900', color: '#193D2A', marginTop: 8 },
  plant: { fontSize: 94, marginVertical: 12 },
  stage: { fontSize: 18, fontWeight: '800', color: '#285E38', marginBottom: 18 },
  track: { width: '100%', height: 12, borderRadius: 10, backgroundColor: '#B9D5B7', overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: '#398B50', borderRadius: 10 },
  progress: { color: '#4D7355', marginTop: 10, fontWeight: '700' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginBottom: 16 },
  heading: { fontSize: 19, fontWeight: '800', color: '#193D2A', marginBottom: 6 },
  muted: { color: '#819084', fontSize: 13 },
  input: { backgroundColor: '#F3F7EF', padding: 15, borderRadius: 14, marginTop: 14, marginBottom: 12, fontSize: 16, color: '#193D2A' },
  button: { backgroundColor: '#276C40', borderRadius: 14, padding: 16, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  secondary: { borderWidth: 1, borderColor: '#276C40', borderRadius: 14, padding: 15, alignItems: 'center' },
  secondaryText: { color: '#276C40', fontWeight: '800' },
  transaction: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#EDF1EC' },
  transactionTitle: { fontWeight: '700', color: '#254632' },
  positive: { color: '#287E43', fontWeight: '800' },
  footer: { textAlign: 'center', color: '#819084', fontSize: 12, marginTop: 8 }
});
