// src/lib/webpush.ts — server-side Web Push helper
import webpush from 'web-push';

const publicKey  = import.meta.env.PUBLIC_VAPID_KEY;
const privateKey = import.meta.env.VAPID_PRIVATE_KEY;
const email      = import.meta.env.VAPID_EMAIL || 'mailto:hola@flouvia.com';

if (publicKey && privateKey) {
  webpush.setVapidDetails(email, publicKey, privateKey);
}

export interface PushPayload {
  title: string;
  body:  string;
  url?:  string;
  tag?:  string;
  action?: string;
}

export interface PushSubscriptionRecord {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

export async function sendPush(
  subscription: PushSubscriptionRecord,
  payload: PushPayload
): Promise<{ ok: boolean; error?: string }> {
  try {
    await webpush.sendNotification(
      subscription as any,
      JSON.stringify(payload),
      { TTL: 86400 }
    );
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message ?? 'unknown' };
  }
}
