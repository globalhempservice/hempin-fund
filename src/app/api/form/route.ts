import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side client with SERVICE ROLE (write w/out user session)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // light validation
    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim().toLowerCase();
    const company = String(body?.company || '').trim() || null;
    const website = String(body?.website || '').trim() || null;
    const message = String(body?.message || '').trim();
    const role = (String(body?.role || 'WORK').toUpperCase() === 'WORK' ? 'WORK' : 'LIFE') as 'WORK'|'LIFE';
    const source = String(body?.source || 'fund.hempin.org#workform1');

    if (!name || !email) {
      return NextResponse.json({ ok: false, error: 'Name and email are required.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('forms')
      .insert({
        name, email, company, website, message, role, source,
      });

    if (error) {
      console.error('[api/form] insert error', error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('[api/form] exception', err);
    return NextResponse.json({ ok: false, error: err?.message || 'Unknown error' }, { status: 500 });
  }
}