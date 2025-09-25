import ClientUserProfilePage from "./ClientUserProfilePage";

type PageParams = {
  params: {
    id: string | string[];
  };
};

export default function Page({ params }: PageParams) {
  const profileId = Array.isArray(params.id) ? params.id[0] : params.id;

  return <ClientUserProfilePage profileId={profileId} />;
}

export function generateStaticParams() {
  return [];
}
