import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/newsletter
 * Handles newsletter subscription form submissions
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { email } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter_subscriptions')
      .select('id, status')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json(
          { error: 'This email is already subscribed to our newsletter' },
          { status: 409 }
        );
      } else {
        // Reactivate subscription
        const { error: updateError } = await supabase
          .from('newsletter_subscriptions')
          .update({ status: 'active', unsubscribed_at: null })
          .eq('id', existing.id);

        if (updateError) {
          console.error('Newsletter resubscribe error:', updateError);
          return NextResponse.json(
            { error: 'Failed to resubscribe' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Welcome back! You\'re subscribed again.'
        });
      }
    }

    // Insert new subscription
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .insert({
        email: email.toLowerCase()
      });

    if (error) {
      console.error('Newsletter subscription error:', error);
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to our newsletter!'
    });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
