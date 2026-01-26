import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, shipping_address, billing_address } = await req.json();
    
    if (!items || items.length === 0) {
      throw new Error("Panier vide");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Initialize Supabase with service role key to bypass RLS
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get user if authenticated
    let user = null;
    try {
      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const { data } = await supabase.auth.getUser(token);
        user = data.user;
      }
    } catch (error) {
      console.log("No authenticated user, proceeding as guest");
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => {
      const price = parseFloat(item.price.replace('€', ''));
      return sum + (price * item.quantity);
    }, 0);

    // Check for existing Stripe customer
    let customerId = null;
    if (user?.email) {
      const customers = await stripe.customers.list({ 
        email: user.email, 
        limit: 1 
      });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      }
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId || undefined,
      customer_email: customerId ? undefined : (user?.email || billing_address?.email),
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
            description: `Origine: ${item.origin}`,
            metadata: {
              category: item.category,
              origin: item.origin,
            },
          },
          unit_amount: Math.round(parseFloat(item.price.replace('€', '')) * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${req.headers.get("origin")}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/checkout/cancel`,
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'ES', 'IT', 'DE'],
      },
      billing_address_collection: 'required',
      automatic_tax: {
        enabled: true,
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: totalAmount >= 80 ? 0 : 695, // Gratuit si >= 80€, sinon 6.95€
              currency: 'eur',
            },
            display_name: totalAmount >= 80 ? 'Livraison gratuite' : 'Livraison standard',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 2,
              },
              maximum: {
                unit: 'business_day',
                value: 5,
              },
            },
          },
        },
      ],
      metadata: {
        user_id: user?.id || 'guest',
        total_items: items.length.toString(),
        order_source: 'boutique',
      },
    });

    // Create order record in database
    const orderData = {
      user_id: user?.id || null,
      stripe_payment_intent_id: session.payment_intent as string,
      total_amount: totalAmount,
      currency: 'EUR',
      status: 'pending',
      items: items,
      shipping_address: shipping_address,
      billing_address: billing_address,
      created_at: new Date().toISOString(),
    };

    const { error: orderError } = await supabase
      .from('orders')
      .insert(orderData);

    if (orderError) {
      console.error('Error creating order:', orderError);
      // Continue anyway, order can be created via webhook
    }

    console.log('Checkout session created:', session.id);
    
    return new Response(JSON.stringify({ 
      checkout_url: session.url,
      session_id: session.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Error in create-checkout-session:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Erreur lors de la création de la session de paiement' 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});