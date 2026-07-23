import { Suspense } from "react";
import ResetPasswordForm from "../__components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="text-sm text-gray-600">Loading reset form...</p>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
