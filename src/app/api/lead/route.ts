import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const honey = (body?.company || '').toString().trim(); // honeypot
    if (honey) return NextResponse.json({ ok: true, honey: true });

    const email  = (body?.email  || '').toString().trim().toLowerCase();
    const role   = (body?.role   || 'LIFE').toString().toUpperCase();
    const source = (body?.source || 'fund.hempin.org').toString();

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    if (!emailOk) return NextResponse.json({ ok:false, error:'Invalid email' }, { status: 400 });
    if (!['WORK','LIFE'].includes(role)) {
      return NextResponse.json({ ok:false, error:'Invalid role' }, { status: 400 });
    }

    const supa = createAdminClient();
    const { error } = await supa.from('leads').insert({ email, role, source });

    if (error) {
      if ((error as any)?.code === '23505') return NextResponse.json({ ok: true, dedupe: true });
      return NextResponse.json({ ok:false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, inserted: true });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e?.message || 'Server error' }, { status: 500 });
  }
}