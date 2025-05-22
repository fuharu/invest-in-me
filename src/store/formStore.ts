import { create } from "zustand";

type FormData = {
  school: string;
  faculty: string;
  gpa: string;
  skills: string;
  programming: string;
  intern: string;
  contest: string;
  passion: string;
  goal: string;
  costPast: string;
  costFuture: string;
};

type FormStore = {
  formData: FormData;
  setFormData: (data: Partial<FormData>) => void;
  resetFormData: () => void;
};

const initialFormData: FormData = {
  school: "",
  faculty: "",
  gpa: "",
  skills: "",
  programming: "",
  intern: "",
  contest: "",
  passion: "",
  goal: "",
  costPast: "",
  costFuture: "",
};

export const useFormStore = create<FormStore>((set) => ({
  formData: initialFormData,
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  resetFormData: () => set({ formData: initialFormData }),
}));