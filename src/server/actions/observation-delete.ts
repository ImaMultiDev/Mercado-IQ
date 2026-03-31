"use server";

import { deleteObservation } from "@/server/actions/observations";

/** Envoltorio para `form action` (Next exige `Promise<void>`). */
export async function deleteObservationAction(formData: FormData): Promise<void> {
  await deleteObservation(formData);
}
