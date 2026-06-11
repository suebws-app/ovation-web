export const getBillablePages = (totalPages: number): number =>
  totalPages % 2 === 0 ? totalPages : totalPages + 1;
