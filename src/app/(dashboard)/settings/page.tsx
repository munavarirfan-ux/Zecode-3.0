import { redirect } from "next/navigation";
import { ROUTES } from "@/config/routes";

export default function SettingsIndexPage() {
  redirect(ROUTES.settingsMyProfile);
}
