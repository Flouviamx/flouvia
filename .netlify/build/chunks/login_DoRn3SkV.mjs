import { c as createComponent } from "./astro-component_CdEB2w-7.mjs";
import "piccolore";
import { P as renderTemplate, y as maybeRenderHead } from "./sequence_BSVkO_8S.mjs";
import { r as renderComponent } from "./ssr-function_WW0EI8fa.mjs";
import { $ as $$InternalUIComponentRenderer, a as $$Layout } from "./InternalUIComponentRenderer_YtJoguC7.mjs";
const $$SignIn = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$SignIn;
  return renderTemplate`${renderComponent($$result, "InternalUIComponentRenderer", $$InternalUIComponentRenderer, { ...Astro2.props, "component": "sign-in" })}`;
}, "/Users/andrevalleortega/Desktop/Flouvia-Web/Flouvia-Web/node_modules/@clerk/astro/components/interactive/SignIn.astro", void 0);
const prerender = false;
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Login;
  const { userId } = await Astro2.locals.auth();
  if (userId) {
    return Astro2.redirect("/portal/dashboard");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Flouvia | Acceso a Clientes", "data-astro-cid-uaub6dnk": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="login-container" data-astro-cid-uaub6dnk> ${renderComponent($$result2, "SignIn", $$SignIn, { "routing": "path", "path": "/portal/login", "forceRedirectUrl": "/portal/dashboard", "data-astro-cid-uaub6dnk": true })} </div> ` })}`;
}, "/Users/andrevalleortega/Desktop/Flouvia-Web/Flouvia-Web/src/pages/portal/login.astro", void 0);
const $$file = "/Users/andrevalleortega/Desktop/Flouvia-Web/Flouvia-Web/src/pages/portal/login.astro";
const $$url = "/portal/login";
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
