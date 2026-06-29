"use client";

type DeleteModalProps = {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteModal({ open, loading = false, onClose, onConfirm }: DeleteModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card">
        <h3 className="text-lg font-bold text-gray-900">Delete User</h3>
        <p className="mt-2 text-sm text-gray-600">This action cannot be undone. Are you sure you want to remove this user?</p>
        <div className="mt-6 flex justify-end gap-3">
          <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700" onClick={onClose}>
            Cancel
          </button>
          <button disabled={loading} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white" onClick={onConfirm}>
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
