"use client";
import { ChangeEvent, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Create dummy data of users with roles
const dummyData = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane.doe@example.com",
    role: "user",
  },
  {
    id: 3,
    name: "Bob Smith",
    email: "bob.smith@example.com",
    role: "admin",
  },
  {
    id: 4,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "user",
  },
  {
    id: 5,
    name: "Mike Brown",
    email: "mike.brown@example.com",
    role: "user",

  },
  {
    id: 6,
    name: "Emma Davis",
    email: "emma.davis@example.com",
    role: "user",
  }
];

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get query values from url which serves as the single source of truth(i.e not relying on local state)
  const roleQueryValue = searchParams.get("role");
  const roleModalState = searchParams.get("modal");

  // Fuction that creates a new query string by adding a key-value pair to the existing search parameters.url
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  // Filter function that saves user role to url as search params
  const handleFilter = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = e.target.value;
    router.replace(pathname + "?" + createQueryString("role", selectedRole));
  };

  // Logic to filter based on role in url vs role in original data
  const filteredUsers = dummyData.filter(
    (user) => user.role === roleQueryValue
  );
  const users = filteredUsers.length > 0 ? filteredUsers : dummyData;

  //Reset all filters by simply replacing the url to the original path
  const resetFilter = () => {
    router.replace(pathname);
  };

  // Converts the roleModalState string to a boolean value and assigns it to isToggleModal.
  const isToggleModal = roleModalState === "true" ? true : false;

  // Function that saves modal state to url as search params(modal=true)
  const handleModalOpen = () => {
    router.replace("?" + createQueryString("modal", "true"));
  };

  // Function that saves modal state to url as search params(modal=false)
  const handleModalClose = () => {
    router.replace("?" + createQueryString("modal", "false"));
  };

  // Check if to show clear filter button or not
  const showClearFilter = roleQueryValue || roleModalState;

  return (
    <main className="relative w-full h-screen flex flex-col px-5 gap-y-5 justify-center items-center">
      <h1>FILTER TABLE WITH URL SEARCH QUERIES</h1>
      <div className="flex w-full justify-between items-center">
        <div className="flex gap-x-2 items-center">
          <select className="border p-2" onChange={handleFilter}>
            <option selected disabled>
              Filter by role
            </option>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          {showClearFilter && (
            <button
              onClick={resetFilter}
              className="bg-white shadow-md border text-xs p-1 rounded-sm text-red-400"
            >
              Clear Filters
            </button>
          )}
        </div>
        <button
          onClick={handleModalOpen}
          className="bg-blue-400 text-white px-2 py-1 rounded-md"
        >
          Open Modal
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr>
            <th scope="col" className="border border-gray-200 p-4">
              ID
            </th>
            <th scope="col" className="border border-gray-200 p-4">
              Name
            </th>
            <th scope="col" className="border border-gray-200 p-4">
              Email
            </th>
            <th scope="col" className="border border-gray-200 p-4">
              Role
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border border-gray-200 p-4">{user.id}</td>
              <td className="border border-gray-200 p-4">{user.name}</td>
              <td className="border border-gray-200 p-4">{user.email}</td>
              <td className="border border-gray-200 p-4">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {isToggleModal && (
        <div className="bg-black/50 w-full h-screen fixed z-10">
          <button
            onClick={handleModalClose}
            className="bg-red-600 text-xs text-white absolute right-4 top-4 px-2 py-1 rounded"
          >
            close
          </button>
        </div>
      )}
    </main>
  );
}
