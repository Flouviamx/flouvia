import { c as createComponent } from "./astro-component_Kupf9CL7.mjs";
import "piccolore";
import { Q as renderTemplate, B as maybeRenderHead } from "./sequence_D-5XYlps.mjs";
import { r as renderComponent } from "./entrypoint_DsZf82re.mjs";
import { a as $$InternalUIComponentRenderer, r as renderScript, u as useTranslations } from "./PortalLayout_Dz6IJSth.mjs";
const $$SignIn = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$SignIn;
  return renderTemplate`${renderComponent($$result, "InternalUIComponentRenderer", $$InternalUIComponentRenderer, { ...Astro2.props, "component": "sign-in" })}`;
}, "/Users/andrevalleortega/Desktop/Flouvia-Web/Flouvia-Web/node_modules/@clerk/astro/components/interactive/SignIn.astro", void 0);
const $$LoginUI = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$LoginUI;
  const { lang } = Astro2.props;
  const t = useTranslations(lang);
  const loginPath = lang === "en" ? "/en/login" : "/login";
  const redirectPath = lang === "en" ? "/en/dashboard" : "/dashboard";
  return renderTemplate`${maybeRenderHead()}<div class="pure-white-wrapper" data-astro-cid-aiasetk3> <div class="noise-overlay" data-astro-cid-aiasetk3></div> <div class="container-master" data-astro-cid-aiasetk3> <div class="split-grid" data-astro-cid-aiasetk3> <div class="brand-side" data-astro-cid-aiasetk3> <span class="apple-eyebrow gsap-reveal" data-astro-cid-aiasetk3>${t("login.eyebrow")}</span> <h1 class="hero-heading gsap-reveal" data-astro-cid-aiasetk3> ${t("login.title1")} <br data-astro-cid-aiasetk3> <span class="editorial" data-astro-cid-aiasetk3>${t("login.title2")}</span> </h1> <p class="brand-description gsap-reveal" data-astro-cid-aiasetk3> ${t("login.desc")} </p> <div class="secure-badge mt-4 gsap-reveal" data-astro-cid-aiasetk3> <span class="dot-secure pulse" data-astro-cid-aiasetk3></span> ${lang === "en" ? "END-TO-END ENCRYPTION" : "ENCRIPTACIÓN END-TO-END"} </div> </div> <div class="login-side" data-astro-cid-aiasetk3> <div class="gsap-card" data-astro-cid-aiasetk3> ${renderComponent($$result, "SignIn", $$SignIn, { "routing": "path", "path": loginPath, "forceRedirectUrl": redirectPath, "appearance": {
    variables: {
      colorPrimary: "#0a192f",
      // Tu var(--color-blue-deep)
      colorBackground: "#ffffff",
      colorText: "#050505",
      // Tu var(--color-text)
      colorInputBackground: "#f4f6f9",
      // Tu var(--color-blue-icy)
      colorInputText: "#050505",
      borderRadius: "24px",
      // Para coincidir con tu squircle
      fontFamily: "'Inter', system-ui, sans-serif"
    },
    elements: {
      // Aquí le damos el estilo de "Apple Card" a la propia caja de Clerk
      card: {
        boxShadow: "0 20px 40px -8px rgba(10, 25, 47, 0.08), 0 1px 3px rgba(10, 25, 47, 0.03)",
        border: "1px solid rgba(0,0,0,0.04)",
        padding: "2.5rem"
      },
      headerTitle: { display: "none" },
      headerSubtitle: { display: "none" },
      dividerRow: { display: "none" },
      footer: { display: "none" },
      // Quitamos el footer molesto de Clerk
      formFieldLabel: {
        color: "#555555",
        // var(--color-text-muted)
        fontSize: "0.8rem",
        fontWeight: "600",
        letterSpacing: "0.5px"
      },
      formFieldInput: {
        border: "1px solid rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        padding: "0.8rem 1rem",
        boxShadow: "none"
      },
      socialButtonsBlockButton: {
        border: "1px solid rgba(0,0,0,0.08)",
        backgroundColor: "#ffffff",
        transition: "all 0.3s ease",
        fontWeight: "600"
      },
      formButtonPrimary: {
        boxShadow: "0 10px 20px rgba(10, 25, 47, 0.12)",
        transition: "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.05)",
        padding: "1rem",
        fontWeight: "600",
        fontSize: "0.95rem"
      }
    }
  }, "data-astro-cid-aiasetk3": true })} </div> </div> </div> </div> </div>  ${renderScript($$result, "/Users/andrevalleortega/Desktop/Flouvia-Web/Flouvia-Web/src/components/portal/LoginUI.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/andrevalleortega/Desktop/Flouvia-Web/Flouvia-Web/src/components/portal/LoginUI.astro", void 0);
export {
  $$LoginUI as $
};
