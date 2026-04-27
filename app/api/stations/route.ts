import { getStations } from "@/lib/stations";

export const dynamic = "force-static";

export async function GET() {
  const stations = await getStations();
  return Response.json({ count: stations.length, stations });
}
