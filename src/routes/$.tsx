/**
 * Catch-all TanStack path so /tutorial, /score don't 404
 * before react-router-dom AppRoutes handles them in the root frame.
 */
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$")({
  component: () => null,
});
