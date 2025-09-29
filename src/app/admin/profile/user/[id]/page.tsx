import ClientUserProfilePage from "./ClientUserProfilePage";

type PageParams = {
  params: Promise<{
    id: string | string[];
  }>;
};

export default async function Page({ params }: PageParams) {
  const resolvedParams = await params;
  const profileId = Array.isArray(resolvedParams.id)
    ? resolvedParams.id[0]
    : resolvedParams.id;

  return <ClientUserProfilePage profileId={profileId} />;
}

export function generateStaticParams() {
  return [];
}
