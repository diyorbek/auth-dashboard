import { useQuery } from "react-query";
import { NavLink } from "react-router";
import { privateHttpClient } from "../../api/httpClient";
// import { usePrivateHttpClient } from "../../api/httpClient";

interface UserInfoResponse {
  user: {
    id: string;
    email: string;
  };
}

export function ProfilePage() {
  // const privateHttpClient = usePrivateHttpClient();
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => privateHttpClient.get("me").json<UserInfoResponse>(),
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="p-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div>ID: {data?.user.id}</div>
            <div>Email: {data?.user.email}</div>
          </>
        )}
      </div>
    </div>
  );
}

export function Overview() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="p-4">
        <NavLink to="edit" className="text-blue-600">
          Edit profile
        </NavLink>
      </div>
    </div>
  );
}

export function EditForm() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Profile &gt; Edit</h1>
      <NavLink to="../" className="text-blue-600">
        Go back
      </NavLink>

      <div className="p-4">
        <h2 className="text-xl">Edit form</h2>
      </div>
    </div>
  );
}
