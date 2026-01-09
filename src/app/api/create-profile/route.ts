import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId, fullName, age, avatarUrl } = await request.json();

    // Basic validation
    if (!userId || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use admin client to bypass RLS (since we're doing server-side creation)
    const adminSupabase = createAdminClient();
    
    const { data, error } = await adminSupabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: fullName,
        age: age,
        avatar_url: avatarUrl,
        role: 'customer'
      }, {
        onConflict: 'id'
      })
      .select();

    if (error) {
      console.error('Admin client profile creation error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data, success: true });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}