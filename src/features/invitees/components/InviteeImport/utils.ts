import type { ImportColumnRole, ImportRowDraft } from "../inviteeImportParser";

export const getDraftCellValue = (
  draft: ImportRowDraft,
  role: ImportColumnRole,
): string | number => {
  switch (role) {
    case "firstName":
      return draft.firstName;
    case "email":
      return draft.email;
    case "phone":
      return draft.phone;
    case "seats":
      return draft.seats;
    case "ignore":
      return "";
  }
};
