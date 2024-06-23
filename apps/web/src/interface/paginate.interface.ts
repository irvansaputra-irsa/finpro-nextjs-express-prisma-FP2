export interface paginate {
  isPlaceholderData: boolean;
  page: number;
  totalPages: number;
  handleClickButton: (type: string) => void;
}
