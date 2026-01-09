// Art Gallery Analytics API
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/admin/gallery/analytics
 * Returns art gallery analytics (revenue by artist, top sellers)
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

    // Get all art purchases with art piece details
    const { data: purchases, error } = await supabase
      .from('art_purchases')
      .select(`
        *,
        art_pieces (
          id,
          name,
          artist,
          price
        )
      `);

    if (error) {
      console.error('Error fetching art purchases:', error);
      return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }

    // Group by artist
    const artistStats: Record<string, { sales: number; revenue: number; pieces: Set<string> }> = {};
    
    purchases?.forEach((purchase: any) => {
      const artist = purchase.art_pieces?.artist || 'Unknown';
      const price = Number(purchase.purchase_price || purchase.art_pieces?.price || 0);
      
      if (!artistStats[artist]) {
        artistStats[artist] = { sales: 0, revenue: 0, pieces: new Set() };
      }
      
      artistStats[artist].sales += 1;
      artistStats[artist].revenue += price;
      if (purchase.art_pieces?.id) {
        artistStats[artist].pieces.add(purchase.art_pieces.id);
      }
    });

    // Convert to array
    const artistAnalytics = Object.entries(artistStats).map(([artist, data]) => ({
      artist,
      total_sales: data.sales,
      total_revenue: Number(data.revenue.toFixed(2)),
      avg_price: data.sales > 0 ? Number((data.revenue / data.sales).toFixed(2)) : 0,
      pieces_sold: data.pieces.size
    })).sort((a, b) => b.total_revenue - a.total_revenue);

    // Get top selling pieces
    const { data: artPieces } = await supabase
      .from('art_pieces')
      .select('id, name, artist, price');

    const pieceSales = new Map<string, number>();
    purchases?.forEach((purchase: any) => {
      const pieceId = purchase.art_piece_id;
      pieceSales.set(pieceId, (pieceSales.get(pieceId) || 0) + 1);
    });

    const topSellers = artPieces
      ?.map(piece => ({
        ...piece,
        sales: pieceSales.get(piece.id) || 0,
        revenue: (pieceSales.get(piece.id) || 0) * Number(piece.price)
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);

    // Overall summary
    const summary = {
      total_sales: purchases?.length || 0,
      total_revenue: purchases?.reduce((sum, p) => 
        sum + Number(p.purchase_price || p.art_pieces?.price || 0), 0
      ) || 0,
      unique_artists: Object.keys(artistStats).length,
      avg_sale_price: purchases && purchases.length > 0
        ? purchases.reduce((sum, p) => sum + Number(p.purchase_price || 0), 0) / purchases.length
        : 0
    };

    return NextResponse.json({
      success: true,
      summary,
      by_artist: artistAnalytics,
      top_sellers: topSellers
    });

  } catch (error) {
    console.error('Gallery analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
