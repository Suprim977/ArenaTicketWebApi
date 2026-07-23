type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export default function SectionHeader({ eyebrow, title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        {eyebrow && <p className="label-mini">{eyebrow}</p>}
        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{title}</h2>
        {description && <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>}
      </div>
      {action}
    </div>
  );
}
