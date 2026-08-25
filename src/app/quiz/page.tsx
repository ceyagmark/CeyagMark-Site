import type { Metadata } from "next";
import Link from "next/link";
import { QuizFlow } from "./quiz-flow";

// Deliberately outside the (marketing) route group: the live quiz.html ships
// a stripped nav (logo + "Back to overview" only, no footer, no theme
// toggle, no WhatsApp FAB) so the funnel stays distraction-free. Using the
// full marketing layout here would stack a second nav bar on top of this
// page's own header.
export const metadata: Metadata = {
  title: "Your Growth Audit | CeyagMark",
  description: "Answer fifteen quick questions and get your custom CeyagMark Growth Scorecard, a diagnosis of your acquisition, conversion and retention.",
  alternates: { canonical: "/quiz" },
  robots: { index: false, follow: true },
};

export default function QuizPage() {
  return (
    <>
      <header className="nav scrolled" data-open="false">
        <div className="wrap nav-inner">
          <Link className="brand" href="/" aria-label="CeyagMark home">
            <img className="brand-mark mark-light" src="/img/logo-mark-light.svg" alt="" width={34} height={34} />
            <img className="brand-mark mark-dark" src="/img/logo-mark.svg" alt="" width={34} height={34} />
            <span>
              Ceyag<b>mark</b>
            </span>
          </Link>
          <nav className="nav-menu" aria-label="Primary" style={{ display: "flex" }}>
            <div className="nav-cta" style={{ display: "flex" }}>
              <Link className="muted-link" href="/growth-audit">
                Back to overview
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main id="main">
        <h1 className="visually-hidden">Growth Audit: score your acquisition, conversion and retention</h1>
        <div className="quiz-shell">
          <div className="quiz-stage">
            <div className="quiz-card glass" role="form" aria-label="Growth Audit quiz">
              <QuizFlow />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
