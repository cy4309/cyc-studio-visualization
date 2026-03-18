"use client";

import { useState } from "react";
import { useI18n } from "@/locales/i18n";

export default function ContactsSection() {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [requirements, setRequirements] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [validationError, setValidationError] = useState("");

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedRequirements = requirements.trim();

    if (!trimmedName || !trimmedEmail || !trimmedRequirements) {
      setValidationError(t("contacts.formEmpty"));
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setValidationError(t("contacts.formEmailInvalid"));
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          requirements: trimmedRequirements,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setStatus("success");
      setName("");
      setEmail("");
      setRequirements("");
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section
      id="contacts"
      className="relative w-full bg-background border-t border-white/10 z-20 py-16 px-6 md:px-12"
    >
      <div className="w-full max-w-[90vw] md:max-w-[70vw] mx-auto flex flex-col items-center">
        <div className="w-full flex justify-start items-center gap-3 opacity-30 mb-3">
          <span className="font-mono text-xs uppercase tracking-widest">
            {t("contacts.label")}
          </span>
          <span className="w-12 h-[0.5px] bg-white/40" />
        </div>
        {/* Requirements form */}
        <form
          onSubmit={handleSubmit}
          className="my-16 max-w-xl w-full"
          suppressHydrationWarning
        >
          <h3 className="font-mono text-xs tracking-widest uppercase opacity-50 mb-6">
            {t("contacts.formTitle")}
          </h3>
          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="contact-name"
                className="block text-xs font-mono uppercase tracking-widest opacity-60 mb-2"
              >
                {t("contacts.formName")}
              </label>
              <input
                id="contact-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                suppressHydrationWarning
                className="w-full bg-white/5 border border-white/20 px-4 py-3 text-sm font-inter focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="contact-email"
                className="block text-xs font-mono uppercase tracking-widest opacity-60 mb-2"
              >
                {t("contacts.formEmail")}
              </label>
              <input
                id="contact-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                suppressHydrationWarning
                className="w-full bg-white/5 border border-white/20 px-4 py-3 text-sm font-inter focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="contact-requirements"
                className="block text-xs font-mono uppercase tracking-widest opacity-60 mb-2"
              >
                {t("contacts.formRequirements")}
              </label>
              <textarea
                id="contact-requirements"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                required
                rows={4}
                suppressHydrationWarning
                className="w-full bg-white/5 border border-white/20 px-4 py-3 text-sm font-inter focus:outline-none focus:border-white/40 transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="self-end px-6 py-3 text-xs font-mono uppercase tracking-widest bg-primary/40 border border-white/40 hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "..." : t("contacts.formSubmit")}
            </button>
            {status === "success" && (
              <p className="text-sm text-primary/80">
                {t("contacts.formSuccess")}
              </p>
            )}
            {(validationError || status === "error") && (
              <p className="text-sm text-primary/80">
                {validationError || t("contacts.formError")}
              </p>
            )}
          </div>
        </form>

        {/* Contact info */}
        <div className="flex flex-col md:flex-row justify-start items-start gap-12 text-left w-full max-w-xl">
          <div className="flex flex-col gap-4">
            <a
              href="mailto:cy4309@gmail.com"
              className="mt-2 inline-flex items-center gap-3 font-inter text-xs tracking-widest opacity-60 hover:opacity-100 transition-opacity group"
            >
              <span className="uppercase">{t("contacts.writeToUs")}</span>
              <span className="w-8 h-[0.5px] bg-white/40 group-hover:w-12 transition-all duration-500" />
              <span>cy4309@gmail.com</span>
            </a>
            <div className="flex gap-4 text-xs font-mono uppercase tracking-widest opacity-60">
              <span>Chester Chu / +886 916 530 519</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
