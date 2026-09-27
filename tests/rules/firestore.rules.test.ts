// Çalıştırmak için Java gerekir: npm run test:rules
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import { assertFails, assertSucceeds, initializeTestEnvironment, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc, Timestamp, updateDoc } from 'firebase/firestore';

let env: RulesTestEnvironment;
const valid = () => ({ text: 'selam', sticker: 'yildiz', color: 'accent', x: 0.2, y: 0.8, createdAt: serverTimestamp() });

beforeAll(async () => {
  env = await initializeTestEnvironment({ projectId: 'demo-site', firestore: { rules: readFileSync('firestore.rules', 'utf8') } });
});
beforeEach(() => env.clearFirestore());
afterAll(() => env.cleanup());

const db = () => env.unauthenticatedContext().firestore();

describe('notes kuralları', () => {
  it('geçerli not eklenebilir', async () => {
    await assertSucceeds(addDoc(collection(db(), 'notes'), valid()));
  });
  it('160 birimden uzun metin reddedilir', async () => {
    await assertFails(addDoc(collection(db(), 'notes'), { ...valid(), text: 'a'.repeat(161) }));
  });
  it('fazladan alan reddedilir', async () => {
    await assertFails(addDoc(collection(db(), 'notes'), { ...valid(), admin: true }));
  });
  it('istemci saatiyle createdAt reddedilir', async () => {
    await assertFails(addDoc(collection(db(), 'notes'), { ...valid(), createdAt: Timestamp.fromMillis(0) }));
  });
  it('güncelleme ve silme reddedilir', async () => {
    await env.withSecurityRulesDisabled(async (c) => { await setDoc(doc(c.firestore(), 'notes/n1'), { ...valid(), createdAt: Timestamp.now() }); });
    await assertFails(updateDoc(doc(db(), 'notes/n1'), { text: 'değişti' }));
    await assertFails(deleteDoc(doc(db(), 'notes/n1')));
  });
  it('herkes okuyabilir', async () => {
    await assertSucceeds(getDocs(collection(db(), 'notes')));
  });
});
