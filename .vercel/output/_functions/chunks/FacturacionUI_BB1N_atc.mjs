import { c as createComponent } from "./astro-component_Kupf9CL7.mjs";
import "piccolore";
import { B as maybeRenderHead, a3 as addAttribute, Q as renderTemplate } from "./sequence_D-5XYlps.mjs";
import "clsx";
import { r as renderScript, u as useTranslations } from "./PortalLayout_Dz6IJSth.mjs";
import { s as supabase } from "./supabase_DmaxYdvD.mjs";
const $$FacturacionUI = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$FacturacionUI;
  const { lang } = Astro2.props;
  const t = useTranslations(lang);
  const user = await Astro2.locals.currentUser();
  const email = user?.emailAddresses[0]?.emailAddress || "flouvia.mx@gmail.com";
  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString(lang === "en" ? "en-US" : "es-MX", { day: "2-digit", month: "short", year: "numeric" });
  };
  const formatCurrency = (amount, currency) => new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2 }).format(amount);
  const [{ data: perfil }, { data: finanza }, { data: facturaRows }] = await Promise.all([
    supabase.from("perfiles").select("plan_activo").eq("email_cliente", email).single(),
    supabase.from("finanzas_config").select("*").eq("email_cliente", email).single(),
    supabase.from("facturas").select("*").eq("email_cliente", email).order("fecha", { ascending: false })
  ]);
  const data = {
    planName: perfil?.plan_activo ?? (lang === "en" ? "Enterprise Infrastructure" : "Infraestructura Enterprise"),
    currency: finanza?.moneda ?? "USD",
    nextAmount: finanza?.monto_proximo ?? 0,
    nextDate: formatDate(finanza?.fecha_proxima ?? null),
    portalUrl: finanza?.stripe_portal_url ?? "#",
    paymentMethod: {
      brand: finanza?.card_brand ?? "Visa",
      last4: finanza?.card_last4 ?? "••••",
      exp: finanza?.card_exp ?? "••/••"
    },
    history: (facturaRows ?? []).map((f) => ({
      id: f.invoice_id,
      date: formatDate(f.fecha),
      amount: formatCurrency(f.monto, finanza?.moneda ?? "USD"),
      status: f.status,
      url: f.download_url ?? "#"
    }))
  };
  return renderTemplate`${maybeRenderHead()}<div class="os-page" data-astro-cid-svmumqrn> <div class="os-wrap" data-astro-cid-svmumqrn> <!-- Topbar --> <div class="fact-topbar" style="opacity:0;" data-astro-cid-svmumqrn> <a${addAttribute(lang === "en" ? "/en/dashboard" : "/dashboard", "href")} class="fact-back-link" data-astro-cid-svmumqrn> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" data-astro-cid-svmumqrn> <polyline points="15 18 9 12 15 6" data-astro-cid-svmumqrn></polyline> </svg> ${lang === "en" ? "Dashboard" : "Dashboard"} </a> <div class="fact-secure-badge" data-astro-cid-svmumqrn> <span class="fact-led pulse" aria-hidden="true" data-astro-cid-svmumqrn></span> <span id="fact-badge" data-astro-cid-svmumqrn>${t("portal.secure")}</span> </div> </div> <!-- Gradient rule --> <div class="fact-rule" aria-hidden="true" data-astro-cid-svmumqrn></div> <!-- Title block --> <h1 class="fact-title" id="fact-title" style="opacity:0;" data-astro-cid-svmumqrn>${t("fact.title")}</h1> <p class="fact-sub" style="opacity:0;" data-astro-cid-svmumqrn>${t("fact.subtitle")}</p> <!-- 12-col grid --> <div class="fact-grid" data-astro-cid-svmumqrn> <!-- Card hero (span 7) --> <div class="os-card card-hero" data-astro-cid-svmumqrn> <div class="os-spotlight" aria-hidden="true" data-astro-cid-svmumqrn></div> <div class="hero-eyebrow" data-astro-cid-svmumqrn> <span class="eyebrow-label" data-astro-cid-svmumqrn>${t("fact.plan")}</span> <span class="plan-badge" data-astro-cid-svmumqrn> <span class="plan-dot" aria-hidden="true" data-astro-cid-svmumqrn></span> ${data.planName} </span> </div> <div class="hero-amount" data-astro-cid-svmumqrn> <span class="fact-amount-currency" data-astro-cid-svmumqrn>${data.currency === "USD" ? "$" : data.currency === "MXN" ? "$" : data.currency}</span> <span class="fact-amount-num"${addAttribute(data.nextAmount, "data-target")} data-astro-cid-svmumqrn>0.00</span> <span class="fact-amount-code" data-astro-cid-svmumqrn>${data.currency}</span> </div> <p class="hero-next-label" data-astro-cid-svmumqrn>${t("fact.next")} &mdash; ${data.nextDate}</p> <div class="hero-actions" data-astro-cid-svmumqrn> <a id="fact-pay-btn"${addAttribute(data.portalUrl, "href")} class="fact-manage-btn haptic" data-astro-cid-svmumqrn> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true" data-astro-cid-svmumqrn> <rect x="1" y="4" width="22" height="16" rx="2" ry="2" data-astro-cid-svmumqrn></rect> <line x1="1" y1="10" x2="23" y2="10" data-astro-cid-svmumqrn></line> </svg> ${t("fact.stripe_btn")} </a> <p class="hero-stripe-note" data-astro-cid-svmumqrn> <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true" data-astro-cid-svmumqrn> <rect x="3" y="11" width="18" height="11" rx="2" ry="2" data-astro-cid-svmumqrn></rect> <path d="M7 11V7a5 5 0 0 1 10 0v4" data-astro-cid-svmumqrn></path> </svg>
Secured by Stripe
</p> </div> </div> <!-- Card CC (span 5) --> <div class="os-card card-cc" data-astro-cid-svmumqrn> <div class="os-spotlight" aria-hidden="true" data-astro-cid-svmumqrn></div> <span class="eyebrow-label" data-astro-cid-svmumqrn>${t("fact.method")}</span> <div class="apple-card-visual" data-astro-cid-svmumqrn> <div class="apple-card-visual__header" data-astro-cid-svmumqrn> <div class="cc-chip" aria-hidden="true" data-astro-cid-svmumqrn></div> <span class="cc-brand" data-astro-cid-svmumqrn>${data.paymentMethod.brand}</span> </div> <div class="cc-number" data-astro-cid-svmumqrn>
&bull;&bull;&bull;&bull;&nbsp;&bull;&bull;&bull;&bull;&nbsp;&bull;&bull;&bull;&bull;&nbsp;${data.paymentMethod.last4} </div> <div class="cc-footer" data-astro-cid-svmumqrn> <span class="cc-expires-label" data-astro-cid-svmumqrn>EXPIRES</span> <span class="cc-expires-value" data-astro-cid-svmumqrn>${data.paymentMethod.exp}</span> </div> </div> </div> <!-- Card history (span 12) --> <div class="os-card card-history" data-astro-cid-svmumqrn> <div class="os-spotlight" aria-hidden="true" data-astro-cid-svmumqrn></div> <span class="eyebrow-label eyebrow-label--history" data-astro-cid-svmumqrn>${t("fact.history")}</span> <div class="inv-table" role="list" data-astro-cid-svmumqrn> ${data.history.map((invoice) => renderTemplate`<div class="inv-row" role="listitem" data-astro-cid-svmumqrn> <div class="inv-left" data-astro-cid-svmumqrn> <div class="inv-icon-box" aria-hidden="true" data-astro-cid-svmumqrn> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-svmumqrn> <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" data-astro-cid-svmumqrn></path> <polyline points="14 2 14 8 20 8" data-astro-cid-svmumqrn></polyline> </svg> </div> <div class="inv-meta" data-astro-cid-svmumqrn> <span class="inv-id" data-astro-cid-svmumqrn>${invoice.id}</span> <span class="inv-date" data-astro-cid-svmumqrn>${invoice.date}</span> </div> </div> <div class="inv-right" data-astro-cid-svmumqrn> <span class="inv-amount" data-astro-cid-svmumqrn>${invoice.amount}</span> <span class="inv-paid-pill" data-astro-cid-svmumqrn>${t("fact.paid")}</span> <a${addAttribute(invoice.url, "href")} class="inv-dl-btn"${addAttribute(t("fact.download"), "title")}${addAttribute(t("fact.download"), "aria-label")} data-astro-cid-svmumqrn> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-svmumqrn> <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" data-astro-cid-svmumqrn></path> </svg> </a> </div> </div>`)} </div> </div> </div><!-- /fact-grid --> </div><!-- /os-wrap --> </div><!-- /os-page -->  ${renderScript($$result, "/Users/andrevalleortega/Desktop/Flouvia-Web/Flouvia-Web/src/components/portal/FacturacionUI.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/andrevalleortega/Desktop/Flouvia-Web/Flouvia-Web/src/components/portal/FacturacionUI.astro", void 0);
export {
  $$FacturacionUI as $
};
