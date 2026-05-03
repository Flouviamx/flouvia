import { c as createComponent } from "./astro-component_Kupf9CL7.mjs";
import "piccolore";
import { Q as renderTemplate } from "./sequence_D-5XYlps.mjs";
import { r as renderComponent } from "./entrypoint_DsZf82re.mjs";
import { $ as $$PortalLayout } from "./PortalLayout_Dz6IJSth.mjs";
import { $ as $$LoginUI } from "./LoginUI_BdD803MX.mjs";
const prerender = false;
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Login;
  const { userId } = await Astro2.locals.auth();
  if (userId) {
    return Astro2.redirect("https://os.flouvia.com/en/dashboard");
  }
  return renderTemplate`${renderComponent($$result, "PortalLayout", $$PortalLayout, { "title": "Private Access | Flouvia" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "LoginUI", $$LoginUI, { "lang": "en" })} ` })}`;
}, "/Users/andrevalleortega/Desktop/Flouvia-Web/Flouvia-Web/src/pages/en/portal/login.astro", void 0);
const $$file = "/Users/andrevalleortega/Desktop/Flouvia-Web/Flouvia-Web/src/pages/en/portal/login.astro";
const $$url = "/en/portal/login";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
