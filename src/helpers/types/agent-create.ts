export type FormState = {
  firstName: string;
  lastName: string;
  prompt: string;
  description: string;
  intro: string;
};

export type GalleryItem = {
  id: string;
  preview: string; // object URL
  file: File;
};

export type StepDef = { title: string; description: string };
