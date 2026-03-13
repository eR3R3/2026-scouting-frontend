"use client";

import { useForm } from "@/app/scouting/contexts/FormContent";
import { useRouter } from "next/navigation";
import { Card, Button } from "@heroui/react";
import { toast } from "@/hooks/use-toast";

export default function Step3() {
  // @ts-ignore
  const { formData, setFormData } = useForm();
  const router = useRouter();

  const handleNext = () => router.push("/scouting/step4");
  const handleGoBack = () => router.push("/scouting/step1");

  const handleCurrentStepNoData = () => {
    setFormData((prev) => ({
      ...prev,
      autonomous: {
        autoStart: 0,
        leftStartingZone: false,
        fuelCount: 0,
        isTowerSuccess: false,
        shooterType: '',
        shotsTaken: 0,
        shotVolumes: '',
        subjectiveAccuracy: 0,
      },
    }));
    toast({ title: '已设置', description: '当前页已标记为无数据，可继续下一步。' });
  };

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      autonomous: {
        ...prev.autonomous,
        [field]: value,
      },
    }));
  };

  // 统一数字转换函数
  const toNumberOrNull = (value: string) =>
    value === "" ? null : Number(value);

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-google-sans font-extrabold mb-1">Autonomous</h1>
        <div className="h-1 w-16 bg-primary mx-auto rounded-full" />
      </div>

      <div className="space-y-6">

        {/* 是否是炮塔 */}
        <Card className="p-4 border-1 border-black dark:border-white">
          <label className="block font-medium mb-2">Shooter Type（选填）</label>
          <select
            className="w-full p-2 border rounded bg-transparent"
            value={formData.autonomous.shooterType || ""}
            onChange={(e) => updateField("shooterType", e.target.value)}
          >
            <option value="">未选择</option>
            <option value="turret">炮塔</option>
            <option value="non-turret">非炮塔</option>
            <option value="noturret">无炮塔</option>
          </select>
        </Card>

        {/* 射击次数 */}
        <Card className="p-4 border-1 border-black dark:border-white">
          <label className="block font-medium mb-2">出球数（选填）</label>
          <input
            type="number"
            onWheel={(e) => e.currentTarget.blur()}
            placeholder="例如：5"
            className="w-full p-2 border rounded bg-transparent"
            value={formData.autonomous.shotsTaken ?? ""}
            onChange={(e) =>
              updateField("shotsTaken", toNumberOrNull(e.target.value))
            }
          />
        </Card>

        {/* 每次射击量 */}
        <Card className="p-4 border-1 border-black dark:border-white">
          <label className="block font-medium mb-2">进球数（逗号分隔，选填）</label>
          <input
            type="text"
            placeholder="例如：1,2,1,3"
            className="w-full p-2 border rounded bg-transparent"
            value={formData.autonomous.shotVolumes || ""}
            onChange={(e) => updateField("shotVolumes", e.target.value)}
          />
        </Card>

      </div>

      <div className="mt-12 px-4 space-y-4">
        <div className="flex justify-between gap-4">
          <Button variant="flat" className="font-google-sans px-12" size="lg" onPress={handleGoBack}>
            Back
          </Button>
          <Button color="primary" className="font-google-sans px-12 py-6" size="lg" onPress={handleNext}>
            Next
          </Button>
        </div>
        <Button color="warning" className="font-google-sans w-full py-6" size="lg" onPress={handleCurrentStepNoData}>
          本页无数据
        </Button>
      </div>
    </main>
  );
}
