import { motion } from "framer-motion";
import { useTranslations } from '@/localization/TranslationProvider';

export default function LandingClient() {
  const { t } = useTranslations();
  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-extrabold leading-tight sm:text-5xl"
      >
        {t('landing.hero.heading.prefix', 'A')}{" "}
        <span className="bg-gradient-to-r from-[#6f2da8] via-fuchsia-500 to-indigo-400 bg-clip-text text-transparent">
          {t('landing.hero.heading.highlight', 'friend')}
        </span>{" "}
        {t('landing.hero.heading.suffix', 'who is always there for you')}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="mt-2 max-w-xl text-base text-white/70 sm:text-lg"
      >
        {t('landing.hero.subheading.part1', 'To listen, to support, or even to help you learn something new.')}
        {" "}
        {t('landing.hero.subheading.connector', 'And the')}{" "}
        <span className="bg-gradient-to-r from-[#6f2da8] via-fuchsia-500 to-indigo-400 bg-clip-text text-transparent">
          {t('landing.hero.subheading.highlight', 'best part')}
        </span>
        {t('landing.hero.subheading.part2', ': you design who they are.')}
      </motion.p>
    </div>
  );
}