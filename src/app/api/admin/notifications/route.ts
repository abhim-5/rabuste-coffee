import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Check Admin Auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (!profile || !['admin', 'superadmin', 'staff'].includes(profile.role)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Fetch Data in Parallel - ONLY NEW TYPES
        const [workshopRes, franchiseRes, newsletterRes, reviewsRes] = await Promise.all([
            // 1. Workshop Requests
            supabase
                .from('workshop_requests')
                .select('*')
                .eq('status', 'pending')
                .order('created_at', { ascending: false }),
            
            // 2. Franchise Inquiries
            supabase
                .from('franchise_inquiries')
                .select('*')
                .in('status', ['pending', 'contacted'])
                .order('created_at', { ascending: false }),

            // 3. Newsletter Subscriptions (last 30 days)
            supabase
                .from('newsletter_subscriptions')
                .select('*')
                .eq('status', 'active')
                .gte('subscribed_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
                .order('subscribed_at', { ascending: false }),
            
            // 4. Cafe Reviews
            supabase
                .from('cafe_reviews')
                .select(`
                    *,
                    profiles:user_id (full_name, email)
                `)
                .eq('status', 'pending')
                .order('created_at', { ascending: false })
        ]);

        const notifications = [];

        // Normalize Workshop Requests
        if (workshopRes.data) {
            notifications.push(...workshopRes.data.map(req => ({
                id: req.id,
                type: 'workshop_request',
                title: `Workshop: ${req.workshop_theme}`,
                subtitle: req.name,
                description: req.additional_details || 'No additional details',
                user_name: req.name,
                created_at: req.created_at,
                status: req.status,
                metadata: {
                    email: req.email,
                    phone: req.phone,
                    instagram_handle: req.instagram_handle
                }
            })));
        }

        // Normalize Franchise Inquiries
        if (franchiseRes.data) {
            notifications.push(...franchiseRes.data.map(inquiry => ({
                id: inquiry.id,
                type: 'franchise_inquiry',
                title: `Franchise Inquiry: ${inquiry.location}`,
                subtitle: inquiry.name,
                description: inquiry.message || 'No message',
                user_name: inquiry.name,
                created_at: inquiry.created_at,
                status: inquiry.status,
                metadata: {
                    email: inquiry.email,
                    phone: inquiry.phone,
                    location: inquiry.location
                }
            })));
        }

        // Normalize Newsletter Subscriptions
        if (newsletterRes.data) {
            notifications.push(...newsletterRes.data.map(sub => ({
                id: sub.id,
                type: 'newsletter',
                title: `Newsletter Signup`,
                subtitle: sub.email,
                description: `Subscribed ${new Date(sub.subscribed_at).toLocaleDateString()}`,
                user_name: sub.email,
                created_at: sub.subscribed_at,
                status: sub.status,
                metadata: {
                    email: sub.email
                }
            })));
        }

        // Normalize Cafe Reviews
        if (reviewsRes.data) {
            notifications.push(...reviewsRes.data.map(review => ({
                id: review.id,
                type: 'cafe_review',
                title: `Cafe Review ${review.rating}/5 ⭐`,
                subtitle: review.profiles?.full_name || review.profiles?.email || 'Anonymous',
                description: review.review_text || 'No review text',
                user_name: review.profiles?.full_name || review.profiles?.email || 'Anonymous',
                created_at: review.created_at,
                status: review.status,
                metadata: {
                    rating: review.rating,
                    review_text: review.review_text,
                    user_email: review.profiles?.email
                }
            })));
        }

        // Sort combined list by date (newest first)
        notifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return NextResponse.json({
            success: true,
            count: notifications.length,
            notifications
        });

    } catch (error) {
        console.error('Notification API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
