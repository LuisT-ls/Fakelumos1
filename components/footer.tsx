"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Mail, Phone } from "lucide-react";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t("footer.aboutProject")}</h3>
            <p className="text-sm text-muted-foreground">{t("footer.aboutDescription")}</p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">{t("footer.usefulLinks")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/how-it-works" className="text-muted-foreground hover:text-foreground">
                  {t("nav.howItWorks")}
                </Link>
              </li>
              <li>
                <Link href="/tips" className="text-muted-foreground hover:text-foreground">
                  {t("nav.tips")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  {t("footer.privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  {t("footer.termsOfUse")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">{t("footer.contact")}</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href="mailto:luishg213@outlook.com" className="hover:text-foreground">
                  luishg213@outlook.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a href="tel:+5571993322305" className="hover:text-foreground">
                  +55 (71) 9 9332-2305
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
}
