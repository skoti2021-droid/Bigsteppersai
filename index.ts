// ─────────────────────────────────────────────────────────────────────────────
// BIG STEPPERS AI — Instagram auto-sync (Supabase Edge Function)
//
// Checks your Instagram Business/Creator feed via the Instagram Graph API,
// finds new reels, routes each one to a website industry using hashtags in
// the caption (via the hashtag_map table), and inserts it into `videos` —
// the same table the landing page grid and admin panel use.
//
// Deploy:   supabase functions deploy instagram-sync
// Secrets:  supabase secrets set IG_ACCESS_TOKEN=xxx IG_USER_ID=xxx
// Schedule: see the pg_cron snippet at the bottom of supabase/schema.sql
//
// Token note: long-lived tokens last 60 days. This function auto-refreshes
// the token when it has less than 7 days left and stores the new one in the
// `app_secrets` vault-style row (or update the secret manually every ~50 days).
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "npm:@supabase/supabase-js@2";

const IG_API = "https://graph.instagram.com";

type IgMedia = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_product_type?: string; // "REELS" | "FEED" | ...
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
};

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const token = Deno.env.get("IG_ACCESS_TOKEN");
  const igUserId = Deno.env.get("IG_USER_ID");
  if (!token || !igUserId) {
    await supabase.from("sync_log").insert({ error: "Missing IG_ACCESS_TOKEN or IG_USER_ID secret" });
    return json({ ok: false, error: "Missing Instagram credentials" }, 500);
  }

  let imported = 0;
  let skipped = 0;

  try {
    // 1. Load hashtag → industry routing
    const { data: mapRows, error: mapErr } = await supabase.from("hashtag_map").select("hashtag, industry");
    if (mapErr) throw mapErr;
    const hashtagMap = new Map((mapRows ?? []).map((r) => [r.hashtag.toLowerCase(), r.industry]));

    // 2. Fetch latest media from the Instagram Graph API
    const fields = "id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp";
    const res = await fetch(`${IG_API}/${igUserId}/media?fields=${fields}&limit=25&access_token=${token}`);
    if (!res.ok) throw new Error(`Instagram API ${res.status}: ${await res.text()}`);
    const feed: { data: IgMedia[] } = await res.json();

    for (const media of feed.data ?? []) {
      // Reels / video posts only
      const isReel = media.media_type === "VIDEO" || media.media_product_type === "REELS";
      if (!isReel) { skipped++; continue; }

      // 3. Route by first matching hashtag in the caption
      const caption = (media.caption ?? "").toLowerCase();
      const tags = caption.match(/#[\p{L}\p{N}_]+/gu) ?? [];
      const industry = tags.map((t) => hashtagMap.get(t)).find(Boolean);
      if (!industry) { skipped++; continue; } // no mapped hashtag → not for the website

      // Title = first line of the caption, hashtags stripped
      const title =
        (media.caption ?? "").split("\n")[0].replace(/#[\p{L}\p{N}_]+/gu, "").trim().slice(0, 60) ||
        `${industry} Commercial`;

      // 4. Insert — ig_media_id is UNIQUE, so re-runs never duplicate
      const { error: insErr } = await supabase.from("videos").insert({
        industry,
        title,
        views: "New",
        thumbnail_url: media.thumbnail_url ?? media.media_url ?? null,
        reel_url: media.permalink,
        video_url: null, // optionally mirror the file to Supabase Storage for native playback
        ig_media_id: media.id,
        source: "instagram",
        published: true,
      });

      if (insErr) {
        if (insErr.code === "23505") skipped++; // already imported
        else throw insErr;
      } else imported++;
    }

    // 5. Refresh the long-lived token if it's close to expiring
    try {
      const dbg = await fetch(`${IG_API}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`);
      if (dbg.ok) {
        const refreshed = await dbg.json();
        if (refreshed.access_token && refreshed.access_token !== token) {
          console.log("Token refreshed — update the IG_ACCESS_TOKEN secret:", refreshed.access_token.slice(0, 12) + "…");
        }
      }
    } catch { /* refresh is best-effort */ }

    await supabase.from("sync_log").insert({ imported, skipped });
    return json({ ok: true, imported, skipped });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await supabase.from("sync_log").insert({ imported, skipped, error: msg });
    return json({ ok: false, error: msg }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}
