import { AutomationForm } from "@/components/automation-form";
import { BrainCircuit, MailCheck, MessageSquareShare } from "lucide-react";

const steps = [
  {
    title: "Configurer les secrets",
    description:
      "Définis les variables d’environnement Google OAuth, Twilio et filtres Gmail nécessaires dans ton dashboard Vercel.",
    icon: MailCheck
  },
  {
    title: "Définir la règle",
    description:
      "Utilise la requête GMAIL_SEARCH_QUERY pour cibler les emails à transférer automatiquement vers WhatsApp.",
    icon: BrainCircuit
  },
  {
    title: "Lancer et surveiller",
    description:
      "Déclenche l’automatisation manuellement ou via un cron Vercel, et surveille les envois réussis/échoués.",
    icon: MessageSquareShare
  }
];

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-12">
      <section className="space-y-6 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-1 text-sm font-medium text-brand">
          Automatisation Gmail → WhatsApp
        </p>
        <h1 className="text-4xl font-semibold text-slate-100 md:text-5xl">
          Convertis instantanément tes emails Gmail en messages WhatsApp.
        </h1>
        <p className="mx-auto max-w-2xl text-base text-slate-400">
          Ce tableau de bord déclenche une synchronisation sécurisée entre Gmail et WhatsApp via
          Twilio. Filtre les emails importants, génère un message formaté et envoie-le automatiquement
          au numéro WhatsApp de ton choix.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <article
            key={step.title}
            className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg transition hover:border-brand/60"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
              <step.icon className="size-6" />
            </div>
            <h2 className="text-lg font-semibold text-slate-100">{step.title}</h2>
            <p className="text-sm text-slate-400">{step.description}</p>
          </article>
        ))}
      </section>

      <AutomationForm />

      <footer className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-400">
        <p className="font-semibold text-slate-200">Conseils de mise en production :</p>
        <ul className="space-y-2">
          <li>
            • Crée un refresh token Gmail avec l&apos;API Gmail en mode OAuth (scope
            https://www.googleapis.com/auth/gmail.modify).
          </li>
          <li>
            • Active WhatsApp Business sur Twilio et renseigne un expéditeur format &quot;whatsapp:+&quot;.
          </li>
          <li>
            • Déploie une tâche planifiée (Vercel Cron) pour appeler l&apos;endpoint /api/automation toutes
            les X minutes si tu veux du temps réel.
          </li>
        </ul>
      </footer>
    </main>
  );
}
