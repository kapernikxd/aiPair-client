import ClientAiAgentProfilePage from "./ClientAiAgentProfilePage";

type PageParams = {
  params: Promise<{
    id: string | string[];
  }>;
};

export default async function Page({ params }: PageParams) {
  const resolvedParams = await params;
  const aiBotId = Array.isArray(resolvedParams.id)
    ? resolvedParams.id[0]
    : resolvedParams.id;

  return <ClientAiAgentProfilePage aiBotId={aiBotId} />;
}

export function generateStaticParams() {
  return [];
}
