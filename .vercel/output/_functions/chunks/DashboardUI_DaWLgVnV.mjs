import { c as createComponent } from "./astro-component_Kupf9CL7.mjs";
import "piccolore";
import { B as maybeRenderHead, a3 as addAttribute, b7 as unescapeHTML, Q as renderTemplate } from "./sequence_D-5XYlps.mjs";
import "clsx";
import { r as renderScript, u as useTranslations } from "./PortalLayout_Dz6IJSth.mjs";
import { s as supabase } from "./supabase_DmaxYdvD.mjs";
const $$DashboardUI = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$DashboardUI;
  const { lang } = Astro2.props;
  const t = useTranslations(lang);
  const user = await Astro2.locals.currentUser();
  const fullName = user?.fullName?.trim() || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || (lang === "en" ? "Executive" : "Ejecutivo");
  const email = user?.emailAddresses[0]?.emailAddress || "flouvia.mx@gmail.com";
  const dateOptions = { weekday: "long", day: "numeric", month: "long" };
  const today = (/* @__PURE__ */ new Date()).toLocaleDateString(lang === "en" ? "en-US" : "es-MX", dateOptions);
  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString(lang === "en" ? "en-US" : "es-MX", { day: "2-digit", month: "short", year: "numeric" });
  };
  const [{ data: proyecto }, { data: finanza }, { data: roadmapRows }, { data: archivos }] = await Promise.all([
    supabase.from("proyectos").select("*").eq("email_cliente", email).single(),
    supabase.from("finanzas_config").select("*").eq("email_cliente", email).single(),
    supabase.from("roadmap").select("*").eq("email_cliente", email).order("orden_index"),
    supabase.from("boveda_archivos").select("*").eq("email_cliente", email).limit(2)
  ]);
  const fallbackPortalUrl = lang === "en" ? "/en/portal/facturacion" : "/portal/facturacion";
  const data = {
    project: {
      name: proyecto?.nombre_proyecto ?? (lang === "en" ? "Global B2B Platform" : "Plataforma B2B Global"),
      stage: proyecto?.etapa ?? (lang === "en" ? "Frontend Engineering" : "Ingeniería Backend"),
      progress: proyecto?.progreso ?? 0,
      uptime: proyecto?.uptime ?? "99.98%",
      liveUrl: proyecto?.live_url ?? "#",
      deadline: proyecto?.deadline ?? "—"
    },
    capital: {
      status: finanza?.auto_pay ? lang === "en" ? "Active Subscription" : "Suscripción Activa" : lang === "en" ? "Payment Pending" : "Pago Pendiente",
      isAutoPay: finanza?.auto_pay ?? false,
      amount: finanza?.monto_proximo ?? 0,
      currency: finanza?.moneda ?? "USD",
      nextDate: formatDate(finanza?.fecha_proxima ?? null),
      portalUrl: finanza?.stripe_portal_url || fallbackPortalUrl
    },
    services: [
      { label: lang === "en" ? "Book Consultancy" : "Agendar Consultoría", icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`, link: lang === "en" ? "/en/calendario" : "/calendario", info: lang === "en" ? "2h SLA" : "SLA de 2h" },
      { label: lang === "en" ? "Document Vault" : "Bóveda de Documentos", icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`, link: lang === "en" ? "/en/boveda" : "/boveda", info: lang === "en" ? "Contracts" : "Contratos/Entregables" },
      { label: lang === "en" ? "VIP Technical Support" : "Soporte Técnico VIP", icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`, link: lang === "en" ? "/en/soporte" : "/soporte", info: lang === "en" ? "Assigned Engineer" : "Ingeniero Asignado" }
    ],
    roadmap: (roadmapRows ?? []).map((r) => ({
      title: r.titulo,
      status: r.status,
      date: r.fecha_info ?? ""
    })),
    documents: (archivos ?? []).map((a) => ({
      name: a.nombre,
      type: a.tipo,
      size: a.size ?? "",
      url: a.url_descarga
    }))
  };
  return renderTemplate`${maybeRenderHead()}<div class="db-root" data-astro-cid-xcjyirfm> <div class="db-wrap" data-astro-cid-xcjyirfm> <!-- ═══════════════ HEADER ═══════════════ --> <header class="db-header" data-astro-cid-xcjyirfm> <div class="db-meta-row" id="db-meta-row" data-astro-cid-xcjyirfm> <span class="db-mono" data-astro-cid-xcjyirfm>${today}</span> <span class="db-meta-sep" data-astro-cid-xcjyirfm>·</span> <span class="db-mono db-mono-ok" data-astro-cid-xcjyirfm> <span class="db-meta-dot" data-astro-cid-xcjyirfm></span> ${t("portal.uptime")} ${data.project.uptime} </span> </div> <h1 class="db-title" id="db-title" data-astro-cid-xcjyirfm> <span class="db-greeting" data-astro-cid-xcjyirfm>${t("portal.greeting")}</span> <span class="db-name" data-astro-cid-xcjyirfm>${fullName}.</span> </h1> <p class="db-sub" id="db-sub" data-astro-cid-xcjyirfm> ${t("portal.subtitle")} <strong data-astro-cid-xcjyirfm>${data.project.deadline}</strong> </p> </header> <!-- ═══════════════ GRID ═══════════════ --> <div class="db-grid" data-astro-cid-xcjyirfm> <!-- PROYECTO --> <div class="db-card db-c-project" id="card-project" data-astro-cid-xcjyirfm> <div class="db-c-in" data-astro-cid-xcjyirfm> <div class="db-c-top" data-astro-cid-xcjyirfm> <span class="db-ey" data-astro-cid-xcjyirfm>${t("portal.project")}</span> <a${addAttribute(lang === "en" ? "/en/entorno" : "/entorno", "href")} class="db-ghost-btn" data-astro-cid-xcjyirfm> ${t("portal.btn.env")} <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-xcjyirfm><path d="M7 17l9.2-9.2M17 17V7H7" data-astro-cid-xcjyirfm></path></svg> </a> </div> <div class="db-proj-body" data-astro-cid-xcjyirfm> <div class="db-proj-left" data-astro-cid-xcjyirfm> <h2 class="db-proj-name" data-astro-cid-xcjyirfm>${data.project.name}</h2> <div class="db-proj-meta" data-astro-cid-xcjyirfm> <span class="db-tag" data-astro-cid-xcjyirfm>${t("portal.stage")} <strong data-astro-cid-xcjyirfm>${data.project.stage}</strong></span> <span class="db-tag" data-astro-cid-xcjyirfm>${lang === "en" ? "Deadline" : "Entrega"}: <strong data-astro-cid-xcjyirfm>${data.project.deadline}</strong></span> </div> </div> <div class="db-ring-shell" data-astro-cid-xcjyirfm> <svg class="db-ring-svg" width="140" height="140" viewBox="0 0 160 160" data-astro-cid-xcjyirfm> <circle class="db-rt" cx="80" cy="80" r="68" data-astro-cid-xcjyirfm></circle> <circle class="db-rf" cx="80" cy="80" r="68"${addAttribute(data.project.progress, "data-progress")} style="stroke-dasharray:427;stroke-dashoffset:427;" data-astro-cid-xcjyirfm></circle> </svg> <div class="db-ring-mid" data-astro-cid-xcjyirfm> <span class="db-pct" data-astro-cid-xcjyirfm><span class="db-cnt"${addAttribute(data.project.progress, "data-target")} data-astro-cid-xcjyirfm>0</span><span class="db-pct-sym" data-astro-cid-xcjyirfm>%</span></span> <span class="db-pct-lbl" data-astro-cid-xcjyirfm>${lang === "en" ? "complete" : "avance"}</span> </div> </div> </div> </div> </div> <!-- FINANZAS --> <div class="db-card db-c-fin" id="card-fin" data-astro-cid-xcjyirfm> <div class="db-c-in" data-astro-cid-xcjyirfm> <div class="db-c-top" data-astro-cid-xcjyirfm> <span class="db-ey" data-astro-cid-xcjyirfm>${t("portal.finance")}</span> <span${addAttribute(`db-pill ${data.capital.isAutoPay ? "db-pill-ok" : "db-pill-warn"}`, "class")} data-astro-cid-xcjyirfm> ${data.capital.status} </span> </div> <div class="db-fin-body" data-astro-cid-xcjyirfm> <p class="db-fin-label" data-astro-cid-xcjyirfm>${t("portal.next_charge")} · ${data.capital.nextDate}</p> <div class="db-fin-amount" data-astro-cid-xcjyirfm> <span class="db-fin-sym" data-astro-cid-xcjyirfm>$</span> <span class="db-fin-num"${addAttribute(data.capital.amount, "data-target")} data-astro-cid-xcjyirfm>0</span> <span class="db-fin-cur" data-astro-cid-xcjyirfm>${data.capital.currency}</span> </div> </div> <a${addAttribute(data.capital.portalUrl, "href")} class="db-pay-btn" id="db-pay-btn" data-astro-cid-xcjyirfm> <span data-astro-cid-xcjyirfm>${t("portal.btn.pay")}</span> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-xcjyirfm><polyline points="9 18 15 12 9 6" data-astro-cid-xcjyirfm></polyline></svg> </a> </div> </div> <!-- SERVICIOS --> <div class="db-card db-c-svc" id="card-svc" data-astro-cid-xcjyirfm> <div class="db-c-in" data-astro-cid-xcjyirfm> <span class="db-ey db-ey-mb" data-astro-cid-xcjyirfm>${t("portal.services")}</span> <div class="db-svc-list" data-astro-cid-xcjyirfm> ${data.services.map((svc) => renderTemplate`<a${addAttribute(svc.link, "href")} class="db-svc-row" data-astro-cid-xcjyirfm> <span class="db-svc-ico" data-astro-cid-xcjyirfm>${unescapeHTML(svc.icon)}</span> <span class="db-svc-info" data-astro-cid-xcjyirfm> <span class="db-svc-lbl" data-astro-cid-xcjyirfm>${svc.label}</span> <span class="db-svc-sub" data-astro-cid-xcjyirfm>${svc.info}</span> </span> <span class="db-svc-arr" data-astro-cid-xcjyirfm> <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-xcjyirfm><polyline points="9 18 15 12 9 6" data-astro-cid-xcjyirfm></polyline></svg> </span> </a>`)} </div> </div> </div> <!-- ROADMAP --> <div class="db-card db-c-rm" id="card-rm" data-astro-cid-xcjyirfm> <div class="db-c-in" data-astro-cid-xcjyirfm> <div class="db-c-top" data-astro-cid-xcjyirfm> <span class="db-ey" data-astro-cid-xcjyirfm>${t("portal.roadmap")}</span> <a${addAttribute(lang === "en" ? "/en/roadmap" : "/roadmap", "href")} class="db-link-blue" data-astro-cid-xcjyirfm>${t("portal.btn.all")} →</a> </div> <div class="db-rm-list" data-astro-cid-xcjyirfm> ${data.roadmap.map((item, i) => renderTemplate`<div${addAttribute(`db-rm-row db-rm-${item.status}`, "class")} data-astro-cid-xcjyirfm> <div class="db-rm-track" data-astro-cid-xcjyirfm> <div class="db-rm-dot" data-astro-cid-xcjyirfm></div> ${i < data.roadmap.length - 1 && renderTemplate`<div class="db-rm-line" data-astro-cid-xcjyirfm></div>`} </div> <div class="db-rm-body" data-astro-cid-xcjyirfm> <span class="db-rm-title" data-astro-cid-xcjyirfm>${item.title}</span> <span class="db-rm-date" data-astro-cid-xcjyirfm>${item.date}</span> </div> </div>`)} </div> </div> </div> <!-- BÓVEDA --> <div class="db-card db-c-vault" id="card-vault" data-astro-cid-xcjyirfm> <div class="db-c-in" data-astro-cid-xcjyirfm> <div class="db-c-top" data-astro-cid-xcjyirfm> <span class="db-ey" data-astro-cid-xcjyirfm>${t("portal.vault")}</span> <a${addAttribute(lang === "en" ? "/en/boveda" : "/boveda", "href")} class="db-link-blue" data-astro-cid-xcjyirfm>${t("portal.btn.all")} →</a> </div> <div class="db-vault-list" data-astro-cid-xcjyirfm> ${data.documents.map((doc) => renderTemplate`<a${addAttribute(doc.url, "href")} class="db-vault-row" download data-astro-cid-xcjyirfm> <span${addAttribute(`db-fchip db-fchip-${doc.type.toLowerCase()}`, "class")} data-astro-cid-xcjyirfm>${doc.type}</span> <span class="db-fmeta" data-astro-cid-xcjyirfm> <span class="db-fname" data-astro-cid-xcjyirfm>${doc.name}</span> <span class="db-fsize" data-astro-cid-xcjyirfm>${doc.size}</span> </span> <span class="db-fdl" data-astro-cid-xcjyirfm> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-xcjyirfm><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" data-astro-cid-xcjyirfm></path></svg> </span> </a>`)} ${data.documents.length === 0 && renderTemplate`<p class="db-vault-empty" data-astro-cid-xcjyirfm>${lang === "en" ? "No documents yet." : "Sin documentos aún."}</p>`} </div> </div> </div> </div> </div> </div>  ${renderScript($$result, "/Users/andrevalleortega/Desktop/Flouvia-Web/Flouvia-Web/src/components/portal/DashboardUI.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/andrevalleortega/Desktop/Flouvia-Web/Flouvia-Web/src/components/portal/DashboardUI.astro", void 0);
export {
  $$DashboardUI as $
};
