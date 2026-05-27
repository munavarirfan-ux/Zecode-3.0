import { redirect } from "next/navigation";
import { ROUTES } from "@/config/routes";

export default function LocalizationRedirectPage() {
  redirect(ROUTES.settingsLocalization);
}
