export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseRequest {
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export interface UpdateExpenseRequest extends Partial<CreateExpenseRequest> {
  id: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface SignozConfig {
  ingestionUrl: string;
  ingestionKey: string;
  serviceName: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}
