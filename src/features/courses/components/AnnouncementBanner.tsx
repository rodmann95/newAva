import { createClient } from "@/lib/supabase/server";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MegaphoneIcon } from "lucide-react";

export async function AnnouncementBanner() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("institution_id")
    .eq("id", user.id)
    .single();

  if (!profile?.institution_id) return null;

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .eq("institution_id", profile.institution_id)
    .order("created_at", { ascending: false })
    .limit(1);

  if (!announcements || announcements.length === 0) return null;

  const announcement = announcements[0];

  return (
    <Alert className="bg-yellow-50 border-yellow-200">
      <MegaphoneIcon className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800 font-bold">Aviso da Instituição</AlertTitle>
      <AlertDescription className="text-yellow-700">
        <span className="font-semibold">{announcement.title}:</span> {announcement.content}
      </AlertDescription>
    </Alert>
  );
}
