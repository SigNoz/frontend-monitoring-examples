import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  Save,
  Loader2,
  Calendar,
  DollarSign,
  Tag,
  FileText,
  X,
  ChevronDown,
} from 'lucide-react';
import { Expense } from '../types';
import { expenseApi } from '../services/api';
import { formatDateForInput } from '../utils';
import { logInfo, logWarn, logError } from '../otel/logger_utils';

// Form validation schema
const expenseSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  amount: z
    .number()
    .min(0.01, 'Amount must be greater than 0')
    .max(999999.99, 'Amount is too large'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseFormPageProps {
  onCreate: (
    expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<Expense>;
  onUpdate: (id: string, updates: Partial<Expense>) => Promise<Expense>;
  mode: 'create' | 'edit';
}

const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Utilities',
  'Housing',
  'Education',
  'Travel',
  'Other',
];

export default function ExpenseFormPage({
  onCreate,
  onUpdate,
  mode,
}: ExpenseFormPageProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  // Note: no local expense state needed
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: '',
      amount: 0,
      category: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
    },
  });

  // Load expense data for edit mode
  useEffect(() => {
    if (mode === 'edit' && id) {
      logInfo('ExpenseFormPage edit mode - loading expense data', { id });
      loadExpense();
    } else if (mode === 'create') {
      logInfo('ExpenseFormPage create mode - initializing form');
    }
  }, [mode, id]);

  const loadExpense = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expenseApi.getById(id!);
      if (data) {
        reset({
          title: data.title,
          amount: data.amount,
          category: data.category,
          date: formatDateForInput(data.date),
          description: data.description || '',
        });
        logInfo('Successfully loaded expense data for editing', {
          id,
          title: data.title,
          amount: data.amount,
          category: data.category,
        });
      } else {
        const errorMsg = 'Expense not found';
        setError(errorMsg);
        logWarn('Expense not found during edit mode', { id });
      }
    } catch (err) {
      const errorMsg = 'Failed to load expense';
      setError(errorMsg);
      logError('Failed to load expense for editing', {
        id,
        error: err instanceof Error ? err.message : String(err),
      });
      console.error('Error loading expense:', err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      setLoading(true);
      setError(null);

      if (mode === 'edit' && id) {
        await onUpdate(id, data);
        logInfo('Expense update form submitted successfully', { id });
      } else {
        logInfo('Submitting new expense form', {
          title: data.title,
          amount: data.amount,
          category: data.category,
        });
        await onCreate(data);
        logInfo('New expense form submitted successfully');
      }

      // Navigate back to home page
      logInfo('Navigating back to home page after successful form submission');
      navigate('/');
    } catch (err) {
      const errorMsg = 'Failed to save expense';
      setError(errorMsg);
      logError('Failed to submit expense form', {
        mode,
        id,
        formData: data,
        error: err instanceof Error ? err.message : String(err),
      });
      console.error('Error saving expense:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    logWarn('User cancelled expense form', { mode, id });
    navigate('/');
  };

  if (loading && mode === 'edit') {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <Loader2 className='w-8 h-8 text-primary-600 animate-spin mx-auto mb-4' />
          <p className='text-gray-600'>Loading expense...</p>
        </div>
      </div>
    );
  }

  if (error && mode === 'edit') {
    return (
      <div className='text-center py-12'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto'>
          <p className='text-red-700 mb-4'>{error}</p>
          <button onClick={handleCancel} className='btn-secondary'>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-2xl mx-auto'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div className='flex items-center space-x-4'>
          <button
            onClick={handleCancel}
            className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200'>
            <ArrowLeft className='w-5 h-5' />
          </button>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              {mode === 'create' ? 'Add New Expense' : 'Edit Expense'}
            </h1>
            <p className='text-gray-600 mt-1'>
              {mode === 'create'
                ? 'Track a new expense to manage your finances'
                : 'Update your expense details'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <div className='card'>
          {/* Title Field */}
          <div className='mb-6'>
            <label
              htmlFor='title'
              className='block text-sm font-medium text-gray-700 mb-2'>
              Expense Title *
            </label>
            <div className='relative'>
              <input
                {...register('title')}
                type='text'
                id='title'
                placeholder='e.g., Grocery shopping, Gas station, Movie tickets'
                className={`input-field ${
                  errors.title ? 'border-red-300 focus:ring-red-500' : ''
                }`}
              />
              {errors.title && (
                <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                  <X className='w-5 h-5 text-red-500' />
                </div>
              )}
            </div>
            {errors.title && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Amount and Category Row */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
            {/* Amount Field */}
            <div>
              <label
                htmlFor='amount'
                className='block text-sm font-medium text-gray-700 mb-2'>
                Amount *
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <DollarSign className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  {...register('amount', { valueAsNumber: true })}
                  type='number'
                  id='amount'
                  step='0.01'
                  min='0.01'
                  placeholder='0.00'
                  className={`input-field pl-10 ${
                    errors.amount ? 'border-red-300 focus:ring-red-500' : ''
                  }`}
                />
                {errors.amount && (
                  <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                    <X className='w-5 h-5 text-red-500' />
                  </div>
                )}
              </div>
              {errors.amount && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Category Field */}
            <div>
              <label
                htmlFor='category'
                className='block text-sm font-medium text-gray-700 mb-2'>
                Category *
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Tag className='h-5 w-5 text-gray-400' />
                </div>
                <select
                  {...register('category')}
                  id='category'
                  className={`input-field pl-10 appearance-none pr-10 ${
                    errors.category ? 'border-red-300 focus:ring-red-500' : ''
                  }`}>
                  <option value=''>Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {!errors.category && (
                  <ChevronDown className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                )}
                {errors.category && (
                  <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                    <X className='w-5 h-5 text-red-500' />
                  </div>
                )}
              </div>
              {errors.category && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          {/* Date Field */}
          <div className='mb-6'>
            <label
              htmlFor='date'
              className='block text-sm font-medium text-gray-700 mb-2'>
              Date *
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Calendar className='h-5 w-5 text-gray-400' />
              </div>
              <input
                {...register('date')}
                type='date'
                id='date'
                className={`input-field pl-10 ${
                  errors.date ? 'border-red-300 focus:ring-red-500' : ''
                }`}
              />
              {errors.date && (
                <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                  <X className='w-5 h-5 text-red-500' />
                </div>
              )}
            </div>
            {errors.date && (
              <p className='mt-1 text-sm text-red-600'>{errors.date.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-gray-700 mb-2'>
              Description (Optional)
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none'>
                <FileText className='h-5 w-5 text-gray-400' />
              </div>
              <textarea
                {...register('description')}
                id='description'
                rows={3}
                placeholder='Add any additional details about this expense...'
                className={`input-field pl-10 resize-none ${
                  errors.description ? 'border-red-300 focus:ring-red-500' : ''
                }`}
              />
              {errors.description && (
                <div className='absolute right-3 top-3'>
                  <X className='w-5 h-5 text-red-500' />
                </div>
              )}
            </div>
            {errors.description && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.description.message}
              </p>
            )}
            <p className='mt-1 text-sm text-gray-500'>
              {watch('description')?.length || 0}/500 characters
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
            <p className='text-red-700'>{error}</p>
          </div>
        )}

        {/* Form Actions */}
        <div className='flex items-center justify-end space-x-4'>
          <button
            type='button'
            onClick={handleCancel}
            className='btn-secondary'
            disabled={isSubmitting}>
            Cancel
          </button>
          <button
            type='submit'
            disabled={isSubmitting}
            className='btn-primary disabled:opacity-50 disabled:cursor-not-allowed'>
            {isSubmitting ? (
              <div className='flex items-center space-x-2'>
                <Loader2 className='w-4 h-4 animate-spin' />
                <span>Saving...</span>
              </div>
            ) : (
              <div className='flex items-center space-x-2'>
                <Save className='w-4 h-4' />
                <span>
                  {mode === 'create' ? 'Create Expense' : 'Update Expense'}
                </span>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
