import { useTranslations } from "@/localization/TranslationProvider";

export default function PageHeader() {
  const { t } = useTranslations();
  return (
    <header className="space-y-2">
      <h1 className="text-2xl font-semibold">{t("admin.chats.header.title", "All chats")}</h1>
      <p className="text-sm text-white/60">
        {t("admin.chats.header.subtitle", "Catch up with every conversation you keep close.")}
      </p>
    </header>
  );
}