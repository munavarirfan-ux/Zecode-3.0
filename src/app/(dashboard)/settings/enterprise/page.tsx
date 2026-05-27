import { redirect } from "next/navigation";
import { ROUTES } from "@/config/routes";

export default function SettingsEnterpriseRedirectPage() {
  redirect(ROUTES.settingsMyEnterprise);
}
