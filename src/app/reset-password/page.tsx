import ResetPasswordForm from "@/app/reset-password/_components/ResetPasswordForm";

type SearchParams = Promise<{
  token?: string;
}>;

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const token = params.token ?? "";

  return <ResetPasswordForm token={token} />;
}
