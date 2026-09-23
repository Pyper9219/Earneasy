import { connectDB } from "@/lib/db/connect";
import { CommissionConfig } from "@/lib/db/models/CommissionConfig";
import CommissionConfigForm from "@/components/admin/CommissionConfigForm";

export default async function CommissionConfigPage() {
  await connectDB();
  const config = await CommissionConfig.findOne({ key: "default" }).lean();

  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Commission Configuration</h1>
        <p className="text-slate-500 mt-1">
          Edit how the KES 450 payment is split across levels.
        </p>
      </header>
      <CommissionConfigForm
        initial={{
          level1: config?.level1 ?? 250,
          level2: config?.level2 ?? 100,
          level3: config?.level3 ?? 50,
          totalPrice: config?.totalPrice ?? 450,
        }}
      />
    </div>
  );
}