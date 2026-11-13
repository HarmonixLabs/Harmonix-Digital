import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";

/** The exact shared Harmonix / Harmony widget approved by the founder.
 * Do not enable until the GHL allInOneChat consent checkbox is no longer
 * preselected and missing SMS compliance links/text are corrected. The GHL
 * public API currently returns 422 for writes to allInOneChat widgets.
 */
export const HARMONIX_CHAT_WIDGET_ID = "6adc81d74e3a6a8f950affe3";
export const HARMONIX_GHL_LOCATION = "eKlKYR6vdxwBnCFOUy5l";
const CHAT_RELEASED = import.meta.env.VITE_HARMONIX_CHAT_RELEASE_APPROVED === "true";
const PUBLIC_ROUTES = new Set([
  "/", "/marketplace", "/harmony", "/pricing", "/case-studies",
  "/join", "/demo", "/contact", "/careers", "/faq",
]);

export function HarmonixGHLChat() {
  const [path] = useLocation();
  const [requested, setRequested] = useState(false);
  const [failed, setFailed] = useState(false);
  const allowed = PUBLIC_ROUTES.has(path);

  useEffect(() => {
    if (!CHAT_RELEASED || !allowed || !requested) return;
    // A GTM-loaded widget and this component must never both instantiate one.
    const present = document.querySelector(`script[data-widget-id="${HARMONIX_CHAT_WIDGET_ID}"]`);
    if (present) return;

    const node = document.createElement("div");
    node.setAttribute("data-chat-widget", "");
    node.dataset.widgetId = HARMONIX_CHAT_WIDGET_ID;
    node.dataset.locationId = HARMONIX_GHL_LOCATION;

    const loader = document.createElement("script");
    loader.src = "https://widgets.leadconnectorhq.com/loader.js";
    loader.dataset.resourcesUrl = "https://widgets.leadconnectorhq.com/chat-widget/loader.js";
    loader.dataset.widgetId = HARMONIX_CHAT_WIDGET_ID;
    loader.async = true;
    loader.onerror = () => setFailed(true);
    document.body.append(node, loader);

    return () => {
      loader.onerror = null;
      loader.remove();
      node.remove();
    };
  }, [allowed, requested]);

  if (!CHAT_RELEASED || !allowed) return null;

  return <aside aria-label="Harmonix Digital chat" className="fixed bottom-4 right-4 z-50 max-w-[min(23rem,calc(100vw-2rem))] rounded-xl border border-amber-500/40 bg-[#111714] p-4 text-white shadow-xl">
    {!requested ? <>
      <p className="text-sm font-semibold">Ask Harmonix</p>
      <p className="mt-2 text-xs leading-relaxed text-white/80">
        Open a third-party GoHighLevel chat service. By opening it you request
        this service to load. AI may help answer routine questions; human
        follow-up and SMS/phone preferences remain separate choices. Avoid
        sharing sensitive medical, legal, or financial information here.
      </p>
      <a className="mt-2 block text-xs underline" href="https://trustcenter.harmonixdigital.com/privacy" target="_blank" rel="noopener noreferrer">Privacy policy</a>
      <button type="button" className="mt-3 min-h-11 rounded-lg border border-amber-500/50 px-4 text-sm" onClick={() => setRequested(true)}>Open Harmonix chat</button>
    </> : <p role={failed ? "alert" : "status"} className="text-sm">{failed ? "Chat could not load. Please use the contact page." : "Opening Harmonix chat. Continue in the chat window."}</p>}
  </aside>;
}
