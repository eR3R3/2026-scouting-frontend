"use client";

import { useForm } from "@/app/scouting/contexts/FormContent";
import { useRouter } from "next/navigation";
import { Card, Button, Tooltip, Select, SelectItem } from "@heroui/react";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";

enum FetchBallPreference {
  DEPOT = 'Depot',
  OUTPOST_CHUTE = 'Outpost Chute',
  NEUTRAL_ZONE = 'Neutral Zone',
}

export default function Step4() {
  // @ts-ignore
  const { formData, setFormData } = useForm();
  const router = useRouter();

  const handleNext = () => {
    router.push("/scouting/step5");
  };

  function handleGoBack() {
    router.push("/scouting/step3");
  }

  const handleIncrement = (field: string) => {
    setFormData(prev => ({
      ...prev,
      teleop: {
        ...prev.teleop,
        [field]: (prev.teleop[field] || 0) + 1,
      },
    }));
  };

  const handleDecrement = (field: string) => {
    setFormData(prev => ({
      ...prev,
      teleop: {
        ...prev.teleop,
        [field]: Math.max(0, (prev.teleop[field] || 0) - 1),
      },
    }));
  };

  const handleCheckbox = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      teleop: { ...prev.teleop, [field]: checked },
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
        <h1 className="text-3xl font-google-sans font-extrabold mb-1">Teleop</h1>
        <div className="h-1 w-16 bg-primary mx-auto rounded-full" />
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        {/* Fuel Counts */}
        <Counter
          label="Fuel Count (1 pt each)"
          value={formData.teleop.fuelCount}
          onIncrement={() => handleIncrement('fuelCount')}
          onDecrement={() => handleDecrement('fuelCount')}
        />

        <Counter
          label="Human Fuel Count (1 pt each)"
          value={formData.teleop.humanFuelCount}
          onIncrement={() => handleIncrement('humanFuelCount')}
          onDecrement={() => handleDecrement('humanFuelCount')}
        />

        {/* Checkboxes */}
        <Card className="w-full p-4 backdrop-blur-md hover:shadow-lg transition-shadow duration-200 border-1 border-black dark:border-white">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="passBump"
                checked={formData.teleop.passBump}
                onChange={(e) => handleCheckbox('passBump', e.target.checked)}
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
                checked={formData.teleop.passTrench}
                onChange={(e) => handleCheckbox('passTrench', e.target.checked)}
                className="w-6 h-6 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="passTrench" className="text-lg font-medium">
                Pass Trench
              </label>
            </div>
          </div>
        </Card>

        {/* Fetch Ball Preference */}
        <Card className="w-full p-4 backdrop-blur-md hover:shadow-lg transition-shadow duration-200 border-1 border-black dark:border-white">
          <Select
            label="Fetch Ball Preference"
            selectedKeys={formData.teleop.fetchBallPreference ? new Set([formData.teleop.fetchBallPreference]) : new Set()}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              setFormData(prev => ({
                ...prev,
                teleop: { ...prev.teleop, fetchBallPreference: value || '' },
              }));
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
        <Button color="primary" className="font-google-sans px-12 py-6" onPress={handleNext} size="lg">
          Next
        </Button>
      </div>
    </main>
  );
}
