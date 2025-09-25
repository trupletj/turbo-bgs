'use server';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/supabaseAdmin';

export async function verifyOtpFunc(register_number: string, phone: string, otp: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.verifyOtp({ phone, token: otp, type : "sms" });
    if(error){
        console.log('verifyOtpFunc error', error)
       return { error }
    }
    console.log('verifyOtpFunc data', data)
   return { data  }
}
