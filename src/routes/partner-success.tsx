import { createFileRoute } from "@tanstack/react-router";
import { PartnerSuccessPage } from "./partner";

export const Route = createFileRoute("/partner-success")({
  head: () => ({ meta: [{ title: "Application received — Aladùn" }] }),
  component: PartnerSuccessPage,
});
