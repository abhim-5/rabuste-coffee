// Workshop Analytics API
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/admin/workshops/analytics
 * Returns workshop analytics (booking rate, attendance, revenue)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all workshops with registrations
    const { data: workshops, error } = await supabase
      .from('workshops')
      .select(`
        *,
        workshop_registrations (
          id,
          user_id,
          status,
          created_at
        )
      `)
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching workshops:', error);
      return NextResponse.json({ error: 'Failed to fetch workshops' }, { status: 500 });
    }

    // Calculate analytics for each workshop
    const workshopAnalytics = (workshops || []).map((workshop: any) => {
      const registrations = workshop.workshop_registrations || [];
      const bookings = registrations.length;
      const capacity = workshop.capacity || 0;
      const bookingRate = capacity > 0 ? (bookings / capacity) * 100 : 0;

      // Count attended
      const attended = registrations.filter((r: any) => 
        r.status === 'attended' || r.status === 'completed'
      ).length;
      const attendanceRate = bookings > 0 ? (attended / bookings) * 100 : 0;

      // Calculate revenue
      const revenue = bookings * Number(workshop.price);

      // Check for repeat attendees (users who attended multiple workshops)
      const uniqueUsers = new Set(registrations.map((r: any) => r.user_id));
      
      return {
        workshop_id: workshop.id,
        title: workshop.title,
        instructor: workshop.instructor,
        start_date: workshop.start_date,
        bookings,
        capacity,
        booking_rate: Number(bookingRate.toFixed(2)),
        attendance: attended,
        attendance_rate: Number(attendanceRate.toFixed(2)),
        revenue: Number(revenue.toFixed(2)),
        average_rating: workshop.rating_avg || null,
        repeat_attendees: uniqueUsers.size !== registrations.length ? registrations.length - uniqueUsers.size : 0
      };
    });

    // Overall summary
    const summary = {
      total_workshops: workshops?.length || 0,
      total_bookings: workshopAnalytics.reduce((sum, w) => sum + w.bookings, 0),
      total_revenue: workshopAnalytics.reduce((sum, w) => sum + w.revenue, 0),
      avg_booking_rate: workshopAnalytics.length > 0
        ? workshopAnalytics.reduce((sum, w) => sum + w.booking_rate, 0) / workshopAnalytics.length
        : 0,
      avg_attendance_rate: workshopAnalytics.length > 0
        ? workshopAnalytics.reduce((sum, w) => sum + w.attendance_rate, 0) / workshopAnalytics.length
        : 0
    };

    return NextResponse.json({
      success: true,
      summary,
      workshops: workshopAnalytics
    });

  } catch (error) {
    console.error('Workshop analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
