"use client";

import Link from "next/link";

type UserRow = {
  _id: string;
  email: string;
  role: string;
  createdAt?: string;
  person?: {
    firstName?: string;
    lastName?: string;
  };
};

type UserTableProps = {
  users: UserRow[];
  onDeleteClick: (id: string) => void;
};

export default function UserTable({ users, onDeleteClick }: UserTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-[0.14em] text-gray-500">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Created Date</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-t border-gray-100">
              <td className="px-4 py-3 text-xs text-gray-500">{user._id.slice(0, 10)}...</td>
              <td className="px-4 py-3 font-medium text-gray-800">
                {user.person?.firstName || "-"} {user.person?.lastName || ""}
              </td>
              <td className="px-4 py-3 text-gray-600">{user.email}</td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold capitalize text-indigo-600">{user.role}</span>
              </td>
              <td className="px-4 py-3 text-gray-600">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <Link href={`/admin/users/${user._id}/edit`} className="text-sm font-semibold text-arena-indigo">
                    Edit
                  </Link>
                  <button className="text-sm font-semibold text-red-500" onClick={() => onDeleteClick(user._id)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
