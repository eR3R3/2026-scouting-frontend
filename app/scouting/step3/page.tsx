"use client";

import { useForm } from "@/app/scouting/contexts/FormContent";
import { useRouter } from "next/navigation";
import { Card, Button, Select, SelectItem } from "@heroui/react";

export default function Step3() {
  const { formData, setFormData } = useForm();
  const router = useRouter();

  const handleNext = () => router.push("/scouting/step4");
  const handleGoBack = () => router.push("/scouting/step1");

  // 限定 autonomous 字段类型
  type AutonomousField = keyof typeof formData.autonomous;

  const updateField = (field: AutonomousField, value: any) => {
    setFormData((prev) => ({
      ...prev,
      autonomous: {
        ...prev.autonomous,
        [field]: value,
      },
    }));
  };

  // 安全数字转换
  const toNumberOrNull = (value: string) => {
    if (value.trim() === "") return null;
    const num = Number(value);
    return Number.isNaN(num) ? null : num;
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-google-sans font-extrabold mb-1">
          Autonomous
        </h1>
        <div className="h-1 w-16 bg-primary mx-auto rounded-full" />
      </div>

      <div className="space-y-6">

        {/* Shooter Type */}
        <Card className="p-4 border-1 border-black dark:border-white">
          <label className="block font-medium mb-2">Shooter Type（选填）</label>

          <Select
            selectedKeys={new Set([formData.autonomous.shooterType || ""])}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              updateField("shooterType", value);
            }}
            className="max-w-md"
            placeholder="未选择"
          >
            <SelectItem key="">未选择</SelectItem>
            <SelectItem key="turret">炮塔</SelectItem>
            <SelectItem key="non-turret">非炮塔</SelectItem>
          </Select>
        </Card>

        {/* Shots Taken */}
        <Card className="p-4 border-1 border-black dark:border-white">
          <label className="block font-medium mb-2">射击次数（选填）</label>
          <input
            type="number"
            placeholder="例如：5"
            className="w-full p-2 border rounded bg-transparent"
            value={formData.autonomous.shotsTaken ?? ""}
            onChange={(e) =>
              updateField("shotsTaken", toNumberOrNull(e.target.value))
            }
          />
        </Card>

        {/* Shot Volumes */}
        <Card className="p-4 border-1 border-black dark:border-white">
          <label className="block font-medium mb-2">
            每次射击量（逗号分隔，选填）
          </label>
          <input
            type="text"
            placeholder="例如：1,2,1,3"
            className="w-full p-2 border rounded bg-transparent"
            value={formData.autonomous.shotVolumes || ""}
            onChange={(e) => updateField("shotVolumes", e.target.value)}
          />
        </Card>

        {/* Subjective Accuracy */}
        <Card className="p-4 border-1 border-black dark:border-white">
          <label className="block font-medium mb-2">主观准确率 %（选填）</label>
          <input
            type="number"
            placeholder="例如：75"
            className="w-full p-2 border rounded bg-transparent"
            value={formData.autonomous.subjectiveAccuracy ?? ""}
            onChange={(e) =>
              updateField("subjectiveAccuracy", toNumberOrNull(e.target.value))
            }
          />
        </Card>
      </div>

      <div className="flex justify-between mt-12 px-4">
        <Button
          variant="flat"
          className="font-google-sans px-12"
          size="lg"
          onPress={handleGoBack}
        >
          Back
        </Button>
        <Button
          color="primary"
          className="font-google-sans px-12 py-6"
          size="lg"
          onPress={handleNext}
        >
          Next
        </Button>
      </div>
    </main>
  );
}
