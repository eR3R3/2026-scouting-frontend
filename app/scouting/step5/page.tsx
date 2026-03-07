'use client'

import React from 'react';
import { Textarea, Button, Card, Input, Select, SelectItem } from "@heroui/react";
import { useForm } from "@/app/scouting/contexts/FormContent";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getCookie } from 'cookies-next/client';

const towerOptions = [
  { key: "None", label: "No Tower" },
  { key: "L1", label: "Tower L1 (30 pts)" },
  { key: "L2", label: "Tower L2 (20 pts)" },
  { key: "L3", label: "Tower L3 (10 pts)" },
];

const Step5 = () => {
  // @ts-ignore
  const { formData, setFormData } = useForm();
  const router = useRouter();
  const { toast } = useToast();

  const handleGoBack = () => {
    router.push("/scouting/step4");
  };

  const handleSubmit = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scouting/record`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getCookie("Authorization")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData),
    });

    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      data = {};
    }

    if (response.ok) {
      toast({
        title: "Success",
        description: "Match record submitted successfully",
      });
      router.push("/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: data.message || "Failed to submit match record",
      });
    }
  };

  const handleCheckboxChange = (field) => (e) => {
    setFormData({
      ...formData,
      endAndAfterGame: {
        ...formData.endAndAfterGame,
        [field]: e.target.checked
      }
    });
  };

  const handleNumberChange = (field) => (e) => {
    setFormData({
      ...formData,
      endAndAfterGame: {
        ...formData.endAndAfterGame,
        [field]: Number(e.target.value)
      }
    });
  };

  const handleCommentsChange = (e) => {
    setFormData({
      ...formData,
      endAndAfterGame: {
        ...formData.endAndAfterGame,
        comments: e.target.value
      }
    });
  };

  const handleTowerStatusChange = (keys) => {
    const value = Array.from(keys)[0] as string;
    setFormData(prev => ({
      ...prev,
      endAndAfterGame: {
        ...prev.endAndAfterGame,
        towerStatus: value || "None",
      },
    }));
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-google-sans font-extrabold mb-1">End Game & After Game</h1>
        <div className="h-1 w-16 bg-primary mx-auto rounded-full" />
      </div>

      <div className="space-y-8">
        {/* Robot Movement */}
        <Card className="p-6 backdrop-blur-md hover:shadow-lg transition-shadow duration-200 border-1 border-black dark:border-white">
          <h2 className="text-xl font-google-sans mb-4">Robot Movement</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input type="checkbox" id="autonomousMove" checked={formData.endAndAfterGame.autonomousMove} onChange={handleCheckboxChange('autonomousMove')} className="w-6 h-6 rounded border-gray-300 text-primary focus:ring-primary" />
              <label htmlFor="autonomousMove" className="ml-3 text-lg">Robot moved during autonomous</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="teleopMove" checked={formData.endAndAfterGame.teleopMove} onChange={handleCheckboxChange('teleopMove')} className="w-6 h-6 rounded border-gray-300 text-primary focus:ring-primary" />
              <label htmlFor="teleopMove" className="ml-3 text-lg">Robot moved during teleop</label>
            </div>
          </div>
        </Card>

        {/* Tower Status */}
        <Card className="p-6 backdrop-blur-md hover:shadow-lg transition-shadow duration-200 border-1 border-black dark:border-white">
          <h2 className="text-xl font-google-sans mb-4">Tower Status</h2>
          <Select
            label="Select Tower Level"
            selectedKeys={new Set([formData.endAndAfterGame.towerStatus])}
            onSelectionChange={handleTowerStatusChange}
            className="max-w-md"
          >
            {towerOptions.map((option) => (
              <SelectItem key={option.key}>{option.label}</SelectItem>
            ))}
          </Select>
        </Card>

        {/* Climbing Time */}
        <Card className="p-6 backdrop-blur-md hover:shadow-lg transition-shadow duration-200 border-1 border-black dark:border-white">
          <label htmlFor="climbingTime" className="block text-lg mb-2">Climbing Time (seconds)</label>
          <Input id="climbingTime" type="number" min="0" value={formData.endAndAfterGame.climbingTime || ''} onChange={handleNumberChange('climbingTime')} className="w-full" />
        </Card>

        {/* Points */}
        <Card className="p-6 backdrop-blur-md hover:shadow-lg transition-shadow duration-200 border-1 border-black dark:border-white">
          <h2 className="text-xl font-google-sans mb-4">Points</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="rankingPoint" className="block text-lg mb-2">Ranking Points</label>
              <Input id="rankingPoint" type="number" min="0" max="6" value={formData.endAndAfterGame.rankingPoint || ''} onChange={handleNumberChange('rankingPoint')} className="w-full" />
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="coopPoint" checked={formData.endAndAfterGame.coopPoint} onChange={handleCheckboxChange('coopPoint')} className="w-6 h-6 rounded border-gray-300 text-primary focus:ring-primary" />
              <label htmlFor="coopPoint" className="ml-3 text-lg">Earned Cooperation Point</label>
            </div>
          </div>
        </Card>

        {/* Comments */}
        <Card className="p-6 backdrop-blur-md hover:shadow-lg transition-shadow duration-200 border-1 border-black dark:border-white">
          <h2 className="text-xl font-google-sans mb-4">Additional Comments</h2>
          <Textarea placeholder="Enter any additional observations..." value={formData.endAndAfterGame.comments} onChange={handleCommentsChange} rows={4} className="w-full" />
        </Card>
      </div>

      <div className="flex justify-between mt-12 px-4">
        <Button variant="flat" className="font-google-sans px-12" size="lg" onPress={handleGoBack}>Back</Button>
        <Button color="primary" className="font-google-sans px-12 py-6" onPress={handleSubmit} size="lg">Submit</Button>
      </div>
    </main>
  );
};

export default Step5;
