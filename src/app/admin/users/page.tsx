"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { deleteUserAction, getUsersAction } from "@/lib/actions/admin/user-action";
import DeleteModal from "../_components/DeleteModal";
import UserTable from "../_components/UserTable";

type UserData = {
  _id: string;
  email: string;
  role: string;
  createdAt?: string;
  person?: {
    firstName?: string;
    lastName?: string;
  };
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    const result = await getUsersAction({ page, limit });

    if (!result.ok) {
      setError(result.message);
      setUsers([]);
      setLoading(false);
      return;
    }

    setUsers(result.data || []);
    setMeta(result.meta || { page: 1, limit, total: 0, totalPages: 1 });
    setLoading(false);
  };

  useEffect(() => {
    void fetchUsers();
  }, [page]);

  const filteredUsers = useMemo(() => {
    if (!query) return users;

    const q = query.toLowerCase();

    return users.filter((user) => {
      const fullName = `${user.person?.firstName || ""} ${user.person?.lastName || ""}`.toLowerCase();
      return fullName.includes(q) || user.email.toLowerCase().includes(q);
    });
  }, [users, query]);

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleteLoading(true);
    const result = await deleteUserAction(deleteId);
    setDeleteLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setDeleteId(null);
    void fetchUsers();
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Users</h2>
        <Link href="/admin/users/create" className="primary-btn w-fit">
          Create User
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <label className="label-mini">Search by name or email</label>
        <input
          className="input-shell mt-1"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading && <p className="rounded-xl bg-white p-4 text-sm text-gray-600">Loading users...</p>}
      {error && !loading && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>}
      {!loading && !error && filteredUsers.length === 0 && (
        <p className="rounded-xl bg-white p-4 text-sm text-gray-600">No users found in the roster.</p>
      )}

      {!loading && !error && filteredUsers.length > 0 && <UserTable users={filteredUsers} onDeleteClick={setDeleteId} />}

      <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
        <p>
          Page {meta.page} of {meta.totalPages} | Total {meta.total}
        </p>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="rounded-lg border border-gray-200 px-3 py-2 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled={page >= meta.totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="rounded-lg border border-gray-200 px-3 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <DeleteModal
        open={Boolean(deleteId)}
        loading={deleteLoading}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </section>
  );
}
