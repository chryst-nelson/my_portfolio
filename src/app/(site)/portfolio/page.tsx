import { redirect } from "next/navigation";

// The portfolio now lives at "/". Keep old links working.
export default function PortfolioRedirect() {
  redirect("/");
}
