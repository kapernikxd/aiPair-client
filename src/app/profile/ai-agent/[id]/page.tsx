import ClientAiAgentProfilePage from "./ClientAiAgentProfilePage";

type PageParams = {
  params: {
    id: string | string[];
  };
};

export default function Page({ params }: PageParams) {
  const aiBotId = Array.isArray(params.id) ? params.id[0] : params.id;

  return <ClientAiAgentProfilePage aiBotId={aiBotId} />;
}

export function generateStaticParams() {
  return [];
}
