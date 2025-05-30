'use server';
const MESSAGEPRO_API_KEY = 'a04cb3406db988949c909cdc5657de3b';
const SMS_FROM_NUMBER = '72777080';

export type SmsResult = {
  Result: 'SUCCESS' | 'FAIL';
  'Message ID': number;
  Reason?: string;
};

export async function sendSms(to: string, text: string): Promise<SmsResult> {
  // URL үүсгэх
  const url = new URL('https://api.messagepro.mn/send');
  url.searchParams.set('key', MESSAGEPRO_API_KEY);
  url.searchParams.set('from', SMS_FROM_NUMBER);
  url.searchParams.set('to', to);
  url.searchParams.set('text', text);

  // GET хүсэлт
  const res = await fetch(url.toString(), { method: 'GET' });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  // JSON үр дүнг уншина
  const data = (await res.json()) as SmsResult[];
  if (data.length === 0) {
    throw new Error('MessagePro.mn-аас хоосон хариу авсан');
  }

  const result = data[0];
  if (result.Result === 'FAIL') {
    throw new Error(`SMS илгээхэд алдаа: ${result.Reason}`);
  }
  return result;
}
