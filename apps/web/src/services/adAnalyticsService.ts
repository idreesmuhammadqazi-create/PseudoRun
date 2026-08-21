import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../config/firebase';

const ANALYTICS_DOC_PATH = 'analytics/adBanner';

export interface AdBannerStats {
  views: number;
  clicks: number;
}

export async function trackAdView(): Promise<void> {
  try {
    const ref = doc(db, ANALYTICS_DOC_PATH);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, { views: 1, clicks: 0, updatedAt: new Date() });
    } else {
      await updateDoc(ref, { views: increment(1), updatedAt: new Date() });
    }
  } catch (e) {
    console.warn('trackAdView failed', e);
  }
}

export async function trackAdClick(): Promise<void> {
  try {
    const ref = doc(db, ANALYTICS_DOC_PATH);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, { views: 0, clicks: 1, updatedAt: new Date() });
    } else {
      await updateDoc(ref, { clicks: increment(1), updatedAt: new Date() });
    }
  } catch (e) {
    console.warn('trackAdClick failed', e);
  }
}

export async function getAdBannerStats(): Promise<AdBannerStats> {
  try {
    const ref = doc(db, ANALYTICS_DOC_PATH);
    const snap = await getDoc(ref);
    if (!snap.exists()) return { views: 0, clicks: 0 };
    const data = snap.data() as any;
    return { views: data.views ?? 0, clicks: data.clicks ?? 0 };
  } catch (e) {
    console.warn('getAdBannerStats failed', e);
    return { views: 0, clicks: 0 };
  }
}
