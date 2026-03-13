"use client";

import { useForm } from "@/app/scouting/contexts/FormContent";
import { useRouter } from "next/navigation";
import { Card, Button, Select, SelectItem } from "@heroui/react";

enum FetchBallPreference {
  DEPOT = 'Depot',
  OUTPOST_CHUTE = 'Outpost Chute',
  NEUTRAL_ZONE = 'Neutral Zone',
}

export default function Step4() {
  // @ts-ignore
  const { formData, setFormData } = useForm();
  const router = useRouter();

  const handleNext = () => router.push("/scouting/step5");
  const handleGoBack = () => router.push("/scouting/step3");

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      teleop: {
        ...prev.teleop,
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
        <h1 className="text-3xl font-google-sans font-extrabold mb-1">Teleop</h1>
        <div className="h-1 w-16 bg-primary mx-auto rounded-full" />
      </div>

      <div className="space-y-6">

        {/* Fuel Count */}
        <Card className="p-4 border-1 border-black dark:border-white">
          <label className="block font-medium mb-2">Fuel Count（选填）</label>
          <input
            type="number"
            placeholder="例如：10"
            className="w-full p-2 border rounded bg-transparent"
            value={formData.teleop.fuelCount ?? ""}
            onChange={(e) =>
              updateField("fuelCount", toNumberOrNull(e.target.value))
            }
          />
        </Card>

        {/* Human Fuel Count */}
        <Card className="p-4 border-1 border-black dark:border-white">
          <label className="block font-medium mb-2">Human Fuel Count（选填）</label>
          <input
            type="number"
            placeholder="例如：5"
            className="w-full p-2 border rounded bg-transparent"
            value={formData.teleop.humanFuelCount ?? ""}
            onChange={(e) =>
              updateField("humanFuelCount", toNumberOrNull(e.target.value))
            }
          />
        </Card>

        {/* Shots Taken */}
        <Card className="p-4 border-1 border-black dark:border-white">
          <label className="block font-medium mb-2">射击次数（选填）</label>
          <input
            type="number"
            placeholder="例如：6"
            className="w-full p-2 border rounded bg-transparent"
            value={formData.teleop.shotsTaken ?? ""}
            onChange={(e) =>
              updateField("shotsTaken", toNumberOrNull(e.target.value))
            }
          />
        </Card>

        {/* Shot Volumes */}
        <Card className="p-4 border-1 border-black dark:border-white">
          <label className="block font-medium mb-2">每次射击量（逗号分隔，选填）</label>
          <input
            type="text"
            placeholder="例如：1,2,1,3"
            className="w-full p-2 border rounded bg-transparent"
            value={formData.teleop.shotVolumes || ""}
            onChange={(e) => updateField("shotVolumes", e.target.value)}
          />
        </Card>

        {/* Subjective Accuracy */}
        <Card className="p-4 border-1 border-black dark:border-white">
          <label className="block font-medium mb-2">主观准确率 %（选填）</label>
          <input
            type="number"
            placeholder="例如：70"
            className="w-full p-2 border rounded bg-transparent"
            value={formData.teleop.subjectiveAccuracy ?? ""}
            onChange={(e) =>
              updateField("subjectiveAccuracy", toNumberOrNull(e.target.value))
            }
          />
        </Card>

        {/* Checkboxes */}
        <Card className="p-4 border-1 border-black dark:border-white">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="passBump"
                checked={formData.teleop.passBump || false}
                onChange={(e) => updateField("passBump", e.target.checked)}
                className="w-6 h-6 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="passBump" className="text-lg font-medium">
                Pass Bump
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="passTrench"
                checked={formData.teleop.passTrench || false}
                onChange={(e) => updateField("passTrench", e.target.checked)}
                className="w-6 h-6 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="passTrench" className="text-lg font-medium">
                Pass Trench
              </label>
            </div>
          </div>
        </Card>

        {/* Fetch Ball Preference */}
        <Card className="p-4 border-1 border-black dark:border-white">
          <Select
            label="Fetch Ball Preference（选填）"
            selectedKeys={
              formData.teleop.fetchBallPreference
                ? new Set([formData.teleop.fetchBallPreference])
                : new Set()
            }
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              updateField("fetchBallPreference", value || undefined);
            }}
          >
            <SelectItem key={FetchBallPreference.DEPOT}>{FetchBallPreference.DEPOT}</SelectItem>
            <SelectItem key={FetchBallPreference.OUTPOST_CHUTE}>{FetchBallPreference.OUTPOST_CHUTE}</SelectItem>
            <SelectItem key={FetchBallPreference.NEUTRAL_ZONE}>{FetchBallPreference.NEUTRAL_ZONE}</SelectItem>
          </Select>
        </Card>

      </div>

      <div className="flex justify-between mt-12 px-4">
        <Button variant="flat" className="font-google-sans px-12" size="lg" onPress={handleGoBack}>
          Back
        </Button>
        <Button color="primary" className="font-google-sans px-12 py-6" size="lg" onPress={handleNext}>
          Next
        </Button>
      </div>
    </main>
  );
}
