import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FCM_SERVER_KEY = Deno.env.get('FCM_SERVER_KEY');
const APNS_AUTH_KEY = Deno.env.get('APNS_AUTH_KEY');
const APNS_KEY_ID = Deno.env.get('APNS_KEY_ID');
const APNS_TEAM_ID = Deno.env.get('APNS_TEAM_ID');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { userId, title, body, data } = await req.json();

    // Fetch user push token and platform
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('push_token, platform')
      .eq('id', userId)
      .single();

    if (profileError || !profile?.push_token) {
      return new Response(
        JSON.stringify({ error: 'No push token found for user' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send notification based on platform
    if (profile.platform === 'android' && FCM_SERVER_KEY) {
      // Send via Firebase Cloud Messaging (Android)
      const fcmResponse = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `key=${FCM_SERVER_KEY}`,
        },
        body: JSON.stringify({
          to: profile.push_token,
          notification: { 
            title, 
            body,
            sound: 'default',
            badge: 1,
          },
          data,
          priority: 'high',
        }),
      });

      const fcmResult = await fcmResponse.json();
      
      return new Response(
        JSON.stringify({ success: true, result: fcmResult }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (profile.platform === 'ios' && APNS_AUTH_KEY) {
      // Send via Apple Push Notification Service (iOS)
      // Note: This is a simplified example. Real APNS integration requires JWT token generation
      console.log('iOS push notification not fully implemented yet');
      
      return new Response(
        JSON.stringify({ success: true, message: 'iOS notifications require full APNS setup' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Platform not supported or missing credentials' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error sending push notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
