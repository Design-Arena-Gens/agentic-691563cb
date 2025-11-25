"use client";

import { triggerAutomation, type AutomationActionResult } from "@/app/actions";
import {
  Loader2,
  Send,
  Inbox,
  MessageCircle,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";

type ActionState = AutomationActionResult | undefined;

const initialState = undefined as ActionState;

export function AutomationForm() {
  const [state, formAction] = useFormState<ActionState, FormData>(
    async (_previousState, formData) => triggerAutomation(formData),
    initialState
  );
  const [isVerifying, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      <form
        action={formAction}
        className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl"
      >
        <header className="flex items-center gap-3">
          <div className="rounded-full bg-brand/10 p-3 text-brand">
            <Send className="size-6" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-100">
              Lancer le pont Gmail → WhatsApp
            </p>
            <p className="text-sm text-slate-400">
              Utilise les identifiants configurés dans les variables d&apos;environnement.
            </p>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="block text-sm font-medium text-slate-300">Nombre d&apos;emails</span>
            <input
              name="limit"
              type="number"
              min={1}
              max={20}
              defaultValue={5}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-brand focus:outline-none"
            />
            <p className="text-xs text-slate-500">
              Maximum d&apos;emails non lus à analyser pour cette exécution.
            </p>
          </label>

          <label className="space-y-2">
            <span className="block text-sm font-medium text-slate-300">Numéro WhatsApp cible</span>
            <input
              name="toOverride"
              type="text"
              placeholder="whatsapp:+33600000000"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-brand focus:outline-none"
            />
            <p className="text-xs text-slate-500">
              Optionnel : écrase DEFAULT_WHATSAPP_TO pour cette exécution.
            </p>
          </label>
        </div>

        <label className="space-y-2">
          <span className="block text-sm font-medium text-slate-300">
            Gabarit du message (placeholders: &#123;&#123;from&#125;&#125;, &#123;&#123;subject&#125;&#125;, &#123;&#123;body&#125;&#125;, &#123;&#123;id&#125;&#125;)
          </span>
          <textarea
            name="templateOverride"
            rows={4}
            placeholder="Nouvel email de {{from}} concernant {{subject}}"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-brand focus:outline-none"
          />
          <p className="text-xs text-slate-500">
            Laisse vide pour utiliser WHATSAPP_MESSAGE_TEMPLATE ou la variante par défaut.
          </p>
        </label>

        <label className="flex items-center gap-3">
          <input
            name="markAsRead"
            type="checkbox"
            className="size-5 rounded border border-slate-700 bg-slate-950 text-brand focus:ring-brand"
          />
          <span className="text-sm text-slate-300">
            Marquer les emails traités comme lus
          </span>
        </label>

        <SubmitButton />
      </form>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
        <header className="mb-4 flex items-center gap-3">
          <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-400">
            <CheckCircle2 className="size-6" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-100">Résultats</p>
            <p className="text-sm text-slate-400">
              Résumé de la dernière exécution de l’automatisation.
            </p>
          </div>
        </header>

        {state === undefined && (
          <p className="text-sm text-slate-500">
            Configure les variables d&apos;environnement, puis lance une première synchronisation.
          </p>
        )}

        {state?.success === false && (
          <div className="flex items-start gap-3 rounded-xl border border-red-800 bg-red-950/60 p-4 text-sm text-red-200">
            <AlertTriangle className="mt-0.5 size-5 shrink-0" />
            <div>
              <p className="font-semibold text-red-100">Échec de l&apos;exécution</p>
              <p>{state.error}</p>
            </div>
          </div>
        )}

        {state?.success === true && (
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard
                icon={Inbox}
                title="Emails contrôlés"
                value={state.data.checked.toString()}
                tone="info"
              />
              <StatCard
                icon={MessageCircle}
                title="Messages WhatsApp envoyés"
                value={state.data.successes.length.toString()}
                tone="success"
              />
              <StatCard
                icon={AlertTriangle}
                title="Échecs"
                value={state.data.failures.length.toString()}
                tone="warning"
              />
            </div>

            {state.data.successes.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-400">
                  Envois réussis
                </h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  {state.data.successes.map((item) => (
                    <li
                      key={item.whatsappSid}
                      className="rounded-xl border border-emerald-700/50 bg-emerald-950/30 p-4"
                    >
                      <p>
                        Email ID <code className="text-xs text-emerald-200">{item.emailId}</code>{" "}
                        → WhatsApp {item.to}
                      </p>
                      <p className="text-xs text-emerald-300">Statut: {item.status}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {state.data.failures.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-red-400">
                  Échecs
                </h3>
                <ul className="space-y-2 text-sm text-red-200">
                  {state.data.failures.map((item, index) => (
                    <li
                      key={`${item.emailId}-${index}`}
                      className="rounded-xl border border-red-800 bg-red-950/40 p-4"
                    >
                      <p>
                        Email ID <code className="text-xs text-red-200">{item.emailId}</code>
                      </p>
                      <p className="text-xs text-red-200/80">Erreur: {item.reason}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() =>
            startTransition(async () => {
              if (typeof navigator === "undefined" || !navigator.clipboard) {
                return;
              }
              await navigator.clipboard.writeText("https://agentic-691563cb.vercel.app");
            })
          }
          disabled={isVerifying}
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-brand hover:text-brand disabled:opacity-50"
        >
          {isVerifying ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Copie en cours…
            </>
          ) : (
            "Copier l'URL de déploiement"
          )}
        </button>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  title,
  value,
  tone
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  tone: "info" | "success" | "warning";
}) {
  const styles = {
    info: "border-sky-800/40 bg-sky-950/40 text-sky-100",
    success: "border-emerald-800/40 bg-emerald-950/40 text-emerald-100",
    warning: "border-amber-800/40 bg-amber-950/40 text-amber-100"
  }[tone];

  return (
    <div className={`rounded-xl border p-4 shadow-lg ${styles}`}>
      <div className="flex items-center gap-3">
        <div className="rounded-full border border-white/20 p-2">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide opacity-80">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-brand/40"
    >
      {pending ? (
        <>
          <Loader2 className="size-5 animate-spin" />
          Automatisation en cours…
        </>
      ) : (
        <>
          <Send className="size-5" />
          Déclencher maintenant
        </>
      )}
    </button>
  );
}
