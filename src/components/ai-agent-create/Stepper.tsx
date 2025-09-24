import { CheckCircle2 } from "lucide-react";
import { StepDef } from "../../helpers/types/agent-create";

export default function Stepper({ steps, current }: { steps: StepDef[]; current: number }) {
  return (
    <ol className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-neutral-900/60 p-5 sm:flex-row sm:items-start sm:gap-6">
      {steps.map((item, index) => {
        const status = index === current ? "current" : index < current ? "done" : "todo";
        return (
          <li key={item.title} className="flex flex-1 items-start gap-3">
            <span
              className={`mt-1 inline-flex size-8 items-center justify-center rounded-full border text-sm font-semibold transition ${
                status === "done"
                  ? "border-emerald-400/40 bg-emerald-500/20 text-emerald-200"
                  : status === "current"
                  ? "border-violet-400/60 bg-violet-500/20 text-violet-100"
                  : "border-white/15 bg-white/5 text-white/50"
              }`}
            >
              {status === "done" ? <CheckCircle2 className="size-4" /> : index + 1}
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white/90">{item.title}</p>
              <p className="text-xs text-white/60">{item.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
