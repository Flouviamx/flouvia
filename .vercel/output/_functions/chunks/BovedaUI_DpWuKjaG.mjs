import { c as createComponent } from "./astro-component_Kupf9CL7.mjs";
import "piccolore";
import { B as maybeRenderHead, a3 as addAttribute, Q as renderTemplate } from "./sequence_D-5XYlps.mjs";
import "clsx";
import { r as renderScript, u as useTranslations } from "./PortalLayout_Dz6IJSth.mjs";
import { s as supabase } from "./supabase_DmaxYdvD.mjs";
const $$BovedaUI = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BovedaUI;
  const { lang } = Astro2.props;
  const t = useTranslations(lang);
  const user = await Astro2.locals.currentUser();
  const email = user?.emailAddresses[0]?.emailAddress || "flouvia.mx@gmail.com";
  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString(lang === "en" ? "en-US" : "es-MX", { day: "2-digit", month: "short", year: "numeric" });
  };
  const catMap = {
    contratos: "contracts",
    diseno: "design",
    entregables: "design",
    general: "general"
  };
  const { data: rows } = await supabase.from("boveda_archivos").select("*").eq("email_cliente", email).order("created_at", { ascending: false });
  const data = {
    files: (rows ?? []).map((a) => ({
      id: a.id,
      name: a.nombre,
      category: catMap[a.categoria] ?? "general",
      type: a.tipo,
      size: a.size ?? "",
      date: formatDate(a.created_at),
      url: a.url_descarga
    }))
  };
  return renderTemplate`${maybeRenderHead()}<div class="os-page" data-astro-cid-ov6xqmon> <div class="os-wrap" data-astro-cid-ov6xqmon> <!-- HEADER --> <header class="bv-header" data-astro-cid-ov6xqmon> <div class="bv-topbar" id="bv-topbar" data-astro-cid-ov6xqmon> <a${addAttribute(lang === "en" ? "/en/dashboard" : "/dashboard", "href")} class="bv-back" data-astro-cid-ov6xqmon> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" data-astro-cid-ov6xqmon><polyline points="15 18 9 12 15 6" data-astro-cid-ov6xqmon></polyline></svg>
Dashboard
</a> <div class="bv-badge" data-astro-cid-ov6xqmon> <span class="bv-led" data-astro-cid-ov6xqmon></span> <span data-astro-cid-ov6xqmon>${t("portal.secure")}</span> </div> </div> <div class="bv-title-row" data-astro-cid-ov6xqmon> <div data-astro-cid-ov6xqmon> <h1 class="bv-title" id="bv-title" data-astro-cid-ov6xqmon>${t("vault.title")}</h1> <p class="bv-sub" id="bv-sub" data-astro-cid-ov6xqmon>${t("vault.subtitle")}</p> </div> <a${addAttribute(lang === "en" ? "/en/boveda-upload" : "/boveda-upload", "href")} class="bv-upload-btn" id="bv-upload-btn" data-astro-cid-ov6xqmon> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-ov6xqmon><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" data-astro-cid-ov6xqmon></path><polyline points="17 8 12 3 7 8" data-astro-cid-ov6xqmon></polyline><line x1="12" y1="3" x2="12" y2="15" data-astro-cid-ov6xqmon></line></svg> ${t("vault.upload_btn")} </a> </div> <div class="bv-rule" id="bv-rule" data-astro-cid-ov6xqmon></div> </header> <!-- FINDER CARD --> <div class="bv-card" id="bv-card" data-astro-cid-ov6xqmon> <div class="os-spotlight" aria-hidden="true" data-astro-cid-ov6xqmon></div> <!-- Toolbar estilo macOS Finder --> <div class="bv-toolbar" data-astro-cid-ov6xqmon> <div class="bv-tabs" data-astro-cid-ov6xqmon> <button class="bv-tab active" data-filter="all" data-astro-cid-ov6xqmon>${t("vault.folders.all")}</button> <button class="bv-tab" data-filter="contracts" data-astro-cid-ov6xqmon>${t("vault.folders.contracts")}</button> <button class="bv-tab" data-filter="design" data-astro-cid-ov6xqmon>${t("vault.folders.design")}</button> </div> <span class="bv-count" id="bv-count" data-astro-cid-ov6xqmon>${data.files.length} ${lang === "en" ? "items" : "archivos"}</span> </div> <!-- Columnas tipo Finder --> <div class="bv-col-header" data-astro-cid-ov6xqmon> <span class="bv-col-name" data-astro-cid-ov6xqmon>${lang === "en" ? "Name" : "Nombre"}</span> <span class="bv-col-size" data-astro-cid-ov6xqmon>${lang === "en" ? "Size" : "Tamaño"}</span> <span class="bv-col-date" data-astro-cid-ov6xqmon>${lang === "en" ? "Modified" : "Modificado"}</span> <span class="bv-col-action" data-astro-cid-ov6xqmon></span> </div> <div class="bv-file-list" id="files-container" data-astro-cid-ov6xqmon> ${data.files.map((file) => renderTemplate`<div class="bv-row-wrap"${addAttribute(file.category, "data-category")} data-astro-cid-ov6xqmon> <a${addAttribute(file.url, "href")} class="bv-file-row" download data-astro-cid-ov6xqmon> <div class="bv-accent" data-astro-cid-ov6xqmon></div> <div class="bv-file-left" data-astro-cid-ov6xqmon> <div${addAttribute(`bv-icon bv-icon-${file.type.toLowerCase()}`, "class")} data-astro-cid-ov6xqmon> <span class="bv-ext" data-astro-cid-ov6xqmon>${file.type}</span> </div> <span class="bv-file-name"${addAttribute(file.name, "title")} data-astro-cid-ov6xqmon>${file.name}</span> </div> <span class="bv-file-size" data-astro-cid-ov6xqmon>${file.size}</span> <span class="bv-file-date" data-astro-cid-ov6xqmon>${file.date}</span> <div class="bv-dl-btn" data-astro-cid-ov6xqmon> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-ov6xqmon><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" data-astro-cid-ov6xqmon></path></svg> </div> </a> </div>`)} </div> <div id="vault-empty" class="bv-empty" style="display:none;" data-astro-cid-ov6xqmon> <div class="bv-empty-icon" data-astro-cid-ov6xqmon> <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" data-astro-cid-ov6xqmon><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" data-astro-cid-ov6xqmon></path></svg> </div> <p data-astro-cid-ov6xqmon>${t("vault.empty")}</p> </div> </div> </div> </div>  ${renderScript($$result, "/Users/andrevalleortega/Desktop/Flouvia-Web/Flouvia-Web/src/components/portal/BovedaUI.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/andrevalleortega/Desktop/Flouvia-Web/Flouvia-Web/src/components/portal/BovedaUI.astro", void 0);
export {
  $$BovedaUI as $
};
