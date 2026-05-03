import { Webhook } from "svix";
import { createClient } from "@supabase/supabase-js";
const prerender = false;
const supabaseAdmin = createClient(
  "https://lblmwsjgjawrirzxcqiy.supabase.co",
  "your-supabase-service-role-key-here"
);
const POST = async ({ request }) => {
  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response(JSON.stringify({ error: "Missing svix headers" }), { status: 400 });
  }
  const secret = "whsec_your-clerk-webhook-secret-here";
  const rawBody = await request.text();
  let event;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(rawBody, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid webhook signature" }), { status: 401 });
  }
  if (event.type !== "user.created") {
    return new Response(JSON.stringify({ ok: true, skipped: true }), { status: 200 });
  }
  const { id: clerkId, email_addresses, primary_email_address_id } = event.data;
  const primaryEmail = email_addresses.find(
    (e) => e.id === primary_email_address_id
  )?.email_address ?? email_addresses[0]?.email_address;
  if (!primaryEmail) {
    return new Response(JSON.stringify({ error: "No email found in event" }), { status: 422 });
  }
  try {
    const { data: existing } = await supabaseAdmin.from("perfiles").select("id").eq("email_cliente", primaryEmail).single();
    if (existing) {
      const { error } = await supabaseAdmin.from("perfiles").update({ clerk_id: clerkId }).eq("email_cliente", primaryEmail);
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin.from("perfiles").insert({
        email_cliente: primaryEmail,
        clerk_id: clerkId,
        nombre_empresa: "Nuevo Cliente"
      });
      if (error) throw error;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown database error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
