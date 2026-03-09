"use client";

import { useForm } from "@/app/scouting/contexts/FormContent";
import { useRouter } from "next/navigation";
import { Card, Button, Tooltip } from "@heroui/react";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";

export default function Step3() {
  // @ts-ignore
  const { formData, setFormData } = useForm();
  const router = useRouter();

  const handleNext = () => {
    router.push("/scouting/step4");
  };

  function handleGoBack() {
    // Go back to step1 (step2 is removed)
    router.push("/scouting/step1");
  }

  const handleFuelIncrement = () => {
    setFormData(prev => ({
      ...prev,
      autonomous: {
        ...prev.autonomous,
        fuelCount: (prev.autonomous.fuelCount || 0) + 1,
      },
    }));
  };

  const handleFuelDecrement = () => {
    setFormData(prev => ({
      ...prev,
      autonomous: {
        ...prev.autonomous,
        fuelCount: Math.max(0, (prev.autonomous.fuelCount || 0) - 1),
      },
    }));
  };

  const CounterButton = ({ placement, onClick, icon: Icon, label }) => (
    <Tooltip
      content={label}
      classNames={{ content: "text-default-600 bg-white dark:bg-black" }}
      placement={placement}
    >
      <button
        onClick={onClick}
        className="p-2 rounded-full hover:bg-gray-400 transition-all duration-200 active:bg-gray-400"
        aria-label={label}
      >
        <Icon className="text-default-600" />
      </button>
    </Tooltip>
  );

  const Counter = ({ label, value, onIncrement, onDecrement }) => (
    <Card className="w-full p-4 backdrop-blur-sm hover:shadow-md transition-shadow duration-200 border-1 border-black dark:border-white">
      <div className="flex items-center justify-between gap-4">
        <CounterButton placement="right" onClick={onDecrement} icon={RemoveIcon} label={`Decrease ${label}`} />
        <div className="flex-1 text-center">
          <span className="text-sm text-default-600 block">{label}</span>
          <span className="text-2xl font-google-sans">{value}</span>
        </div>
        <CounterButton placement="left" onClick={onIncrement} icon={AddIcon} label={`Increase ${label}`} />
      </div>
    </Card>
  );

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-google-sans font-extrabold mb-1">Autonomous</h1>
        <div className="h-1 w-16 bg-primary mx-auto rounded-full" />
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        {/* Left Starting Zone */}
        <Card className="w-full p-4 backdrop-blur-md hover:shadow-lg transition-shadow duration-200 border-1 border-black dark:border-white">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="leftStartingZone"
              checked={formData.autonomous.leftStartingZone}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  autonomous: { ...prev.autonomous, leftStartingZone: e.target.checked },
                }))
              }
              className="w-6 h-6 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="leftStartingZone" className="text-lg font-medium">
              Robot left starting zone
            </label>
          </div>
        </Card>

        {/* Fuel Count */}
        <Counter
          label="Fuel Count (1 pt each)"
          value={formData.autonomous.fuelCount}
          onIncrement={handleFuelIncrement}
          onDecrement={handleFuelDecrement}
        />

        {/* Tower Success */}
        <Card className="w-full p-4 backdrop-blur-md hover:shadow-lg transition-shadow duration-200 border-1 border-black dark:border-white">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isTowerSuccess"
              checked={formData.autonomous.isTowerSuccess}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  autonomous: { ...prev.autonomous, isTowerSuccess: e.target.checked },
                }))
              }
              className="w-6 h-6 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="isTowerSuccess" className="text-lg font-medium">
              Tower L1 Success (15 pts)
            </label>
          </div>
        </Card>
      </div>

      <div className="flex justify-between mt-12 px-4">
        <Button variant="flat" className="font-google-sans px-12" size="lg" onPress={handleGoBack}>
          Back
        </Button>
        <Button color="primary" className="font-google-sans px-12 py-6" onPress={handleNext} size="lg">
          Next
        </Button>
      </div>
    </main>
  );
}
