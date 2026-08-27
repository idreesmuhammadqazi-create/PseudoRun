import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../config/firebase';

// LearningAide referral campaign tracked by this banner.
const CAMPAIGN_REF = 'IDREES';
const CAMPAIGN_SIGNUP_URL = 'https://learningaide.ai/signup?ref=IDREES';

// Per-campaign doc so views/clicks are attributed to this referral.
const ANALYTICS_DOC_PATH = `analytics/adBanner/${CAMPAIGN_REF.toLowerCase()}`;

export interface AdBannerStats {
  views: number;
  clicks: number;
}

async function ensureDoc(ref: any) {
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      views: 0,
      clicks: 0,
      ref: CAMPAIGN_REF,
      signupUrl: CAMPAIGN_SIGNUP_URL,
      updatedAt: new Date(),
    });
  }
}

export async function trackAdView(): Promise<void> {
  try {
    const ref = doc(db, ANALYTICS_DOC_PATH);
    await ensureDoc(ref);
    await updateDoc(ref, { views: increment(1), updatedAt: new Date() });
  } catch (e) {
    console.warn('trackAdView failed', e);
  }
}

export async function trackAdClick(): Promise<void> {
  try {
    const ref = doc(db, ANALYTICS_DOC_PATH);
    await ensureDoc(ref);
    await updateDoc(ref, { clicks: increment(1), updatedAt: new Date() });
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
