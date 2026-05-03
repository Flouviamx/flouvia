import { c as createComponent } from "./astro-component_Kupf9CL7.mjs";
import "piccolore";
import { B as maybeRenderHead, a3 as addAttribute, Q as renderTemplate } from "./sequence_D-5XYlps.mjs";
import "clsx";
import { r as renderScript, u as useTranslations } from "./PortalLayout_Dz6IJSth.mjs";
import { s as supabase } from "./supabase_DmaxYdvD.mjs";
const $$RoadmapUI = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$RoadmapUI;
  const { lang } = Astro2.props;
  const t = useTranslations(lang);
  const user = await Astro2.locals.currentUser();
  const email = user?.emailAddresses[0]?.emailAddress || "flouvia.mx@gmail.com";
  const { data: rows } = await supabase.from("roadmap").select("*").eq("email_cliente", email).order("orden_index");
  const items = (rows ?? []).map((r) => ({
    id: r.id,
    title: r.titulo,
    status: r.status,
    date: r.fecha_info ?? "",
    description: r.descripcion ?? ""
  }));
  const statusLabel = (s) => {
    if (s === "done") return t("road.status.done");
    if (s === "active") return t("road.status.active");
    return t("road.status.pending");
  };
  const doneCount = items.filter((i) => i.status === "done").length;
  return renderTemplate`${maybeRenderHead()}<div class="pure-white-wrapper" data-astro-cid-h72bi6v6> <div class="noise-overlay" data-astro-cid-h72bi6v6></div> <div class="container-master" data-astro-cid-h72bi6v6> <header class="dashboard-header gsap-reveal" data-astro-cid-h72bi6v6> <div class="header-status" data-astro-cid-h72bi6v6> <a${addAttribute(lang === "en" ? "/en/dashboard" : "/dashboard", "href")} class="back-link haptic-soft" data-astro-cid-h72bi6v6> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" data-astro-cid-h72bi6v6><polyline points="15 18 9 12 15 6" data-astro-cid-h72bi6v6></polyline></svg> ${lang === "en" ? "Back to Console" : "Volver a Console"} </a> <div class="secure-badge" data-astro-cid-h72bi6v6> <span class="dot-secure pulse" data-astro-cid-h72bi6v6></span> ${t("portal.secure")} </div> </div> <div class="header-flex mt-4" data-astro-cid-h72bi6v6> <div class="title-group" data-astro-cid-h72bi6v6> <h1 class="greeting-title" data-astro-cid-h72bi6v6>${t("road.title")}</h1> <p class="greeting-subtitle" data-astro-cid-h72bi6v6>${t("road.subtitle")}</p> </div> ${items.length > 0 && renderTemplate`<div class="sprint-count-badge" data-astro-cid-h72bi6v6> <span class="count-num" data-astro-cid-h72bi6v6>${doneCount}</span> <span class="count-slash" data-astro-cid-h72bi6v6>/</span> <span class="count-total" data-astro-cid-h72bi6v6>${items.length}</span> <span class="count-label" data-astro-cid-h72bi6v6>${lang === "en" ? "completed" : "completados"}</span> </div>`} </div> </header> <div class="timeline-wrapper gsap-reveal" data-astro-cid-h72bi6v6> ${items.length === 0 ? renderTemplate`<div class="empty-state" data-astro-cid-h72bi6v6> <div class="empty-icon" data-astro-cid-h72bi6v6> <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-astro-cid-h72bi6v6><circle cx="12" cy="12" r="10" data-astro-cid-h72bi6v6></circle><line x1="12" y1="8" x2="12" y2="12" data-astro-cid-h72bi6v6></line><line x1="12" y1="16" x2="12.01" y2="16" data-astro-cid-h72bi6v6></line></svg> </div> <p data-astro-cid-h72bi6v6>${t("road.empty")}</p> </div>` : renderTemplate`<div class="timeline-list" data-astro-cid-h72bi6v6> ${items.map((item, index) => renderTemplate`<div${addAttribute(`timeline-item ${item.status}`, "class")} data-astro-cid-h72bi6v6> <div class="tl-left" data-astro-cid-h72bi6v6> <div${addAttribute(`node-dot ${item.status}`, "class")} data-astro-cid-h72bi6v6></div> ${index < items.length - 1 && renderTemplate`<div class="connector-line" data-astro-cid-h72bi6v6></div>`} </div> <div class="tl-card" data-astro-cid-h72bi6v6> <div class="tl-card-header" data-astro-cid-h72bi6v6> <span class="sprint-eyebrow" data-astro-cid-h72bi6v6>${t("road.sprint")} ${String(index + 1).padStart(2, "0")}</span> <span${addAttribute(`status-chip ${item.status}`, "class")} data-astro-cid-h72bi6v6>${statusLabel(item.status)}</span> </div> <h3${addAttribute(`sprint-title ${item.status === "done" ? "is-done" : ""}`, "class")} data-astro-cid-h72bi6v6>${item.title}</h3> ${item.description && renderTemplate`<p class="sprint-desc" data-astro-cid-h72bi6v6>${item.description}</p>`} ${item.date && renderTemplate`<div class="sprint-meta" data-astro-cid-h72bi6v6> <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-h72bi6v6><rect x="3" y="4" width="18" height="18" rx="2" ry="2" data-astro-cid-h72bi6v6></rect><line x1="16" y1="2" x2="16" y2="6" data-astro-cid-h72bi6v6></line><line x1="8" y1="2" x2="8" y2="6" data-astro-cid-h72bi6v6></line><line x1="3" y1="10" x2="21" y2="10" data-astro-cid-h72bi6v6></line></svg> <span class="sprint-date" data-astro-cid-h72bi6v6>${item.date}</span> </div>`} </div> </div>`)} </div>`} </div> </div> </div>  ${renderScript($$result, "/Users/andrevalleortega/Desktop/Flouvia-Web/Flouvia-Web/src/components/portal/RoadmapUI.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/andrevalleortega/Desktop/Flouvia-Web/Flouvia-Web/src/components/portal/RoadmapUI.astro", void 0);
export {
  $$RoadmapUI as $
};
