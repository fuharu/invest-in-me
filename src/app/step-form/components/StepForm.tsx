"use client";
import { useState } from "react";
import StepBar from "./StepBar";
import StepProfile from "./StepProfile";
import StepSkills from "./StepSkills";
import StepPassion from "./StepPassion";
import StepCost from "./StepCost";
import StepConfirm from "./StepConfirm";
import { useFormStore } from "@/store/formStore";

export default function StepForm() {
  const [step, setStep] = useState(1);
  const {formData, setFormData,resetFormData} = useFormStore();

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
      <StepBar step={step} />
      {step === 1 && (
        <StepProfile formData={formData} setFormData={setFormData} nextStep={nextStep} />
      )}
      {step === 2 && (
        <StepSkills formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />
      )}
      {step === 3 && (
        <StepPassion formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />
      )}
      {step === 4 && (
        <StepCost formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />
      )}
      {step === 5 && (
        <StepConfirm formData={formData} prevStep={prevStep} />
      )}
    </div>
  );
}