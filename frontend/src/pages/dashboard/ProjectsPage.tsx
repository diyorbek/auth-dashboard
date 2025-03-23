import { useQuery } from "react-query";
import { privateHttpClient } from "../../api/httpClient";
import { useAccessToken } from "../../AuthContext";
// import { usePrivateHttpClient } from "../../api/httpClient";

interface ProjectsResponse {
  projects: Array<{
    id: string;
    name: string;
  }>;
}

export function ProjectsPage() {
  const token = useAccessToken();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["projects"],
    queryFn: () => privateHttpClient.get<ProjectsResponse>(`projects`).json(),
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Projects</h1>
      <button
        className="border-2 p-2 m-2 active:bg-gray-200"
        onClick={() => refetch()}
      >
        Refetch
      </button>

      {isLoading || isRefetching ? (
        <div>Loading...</div>
      ) : (
        <ol className="list-decimal p-8">
          {data?.projects.map(({ id, name }) => (
            <li key={id}>{name}</li>
          ))}
        </ol>
      )}
    </div>
  );
}
