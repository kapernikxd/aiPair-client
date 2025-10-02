import { Info } from "lucide-react";

import TruncatedReveal from "../ui/TruncatedReveal";
import { useTranslations } from "@/localization/TranslationProvider";

export default function Introduction({ text }: { text: string }) {
  const { t } = useTranslations();

  return (
    <section className="p-2 md:p-0">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Info className="size-5 text-violet-300" />
        {t("admin.aiAgent.introduction.title", "Introduction")}
      </h2>
      <TruncatedReveal
        text={text}
        maxChars={160}
        className="mt-3 text-sm leading-6 text-white/70"
        title={t("admin.aiAgent.introduction.expand", "Read more")}
      />
    </section>
  );
}
