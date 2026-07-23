export default function AdminSettingsPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="label-mini">Settings</p>
        <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">System settings</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">Adjust platform defaults, content, and access policies.</p>
      </div>
      <div className="rounded-[1.5rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-gray-600 dark:text-slate-300">Configuration cards and form controls can be connected to backend settings later.</p>
      </div>
    </section>
  );
}
