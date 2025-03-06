import { requireAdmin } from "@/utils/protect";

export async function POST(request: Request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
}
