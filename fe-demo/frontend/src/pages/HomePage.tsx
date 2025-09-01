import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  RefreshCw,
  Search,
  TrendingUp,
  Calendar,
  DollarSign,
  ChevronDown,
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Expense } from '../types';
import {
  formatCurrency,
  formatDate,
  getCategoryColor,
  getCategoryIcon,
} from '../utils';
import { logInfo, logWarn, logError } from '../otel/logger_utils';

interface HomePageProps {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => void;
}

export default function HomePage({
  expenses,
  loading,
  error,
  onDelete,
  onRefresh,
}: HomePageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>(
    '30d'
  );

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(expenses.map(expense => expense.category)),
    ];
    return uniqueCategories.sort();
  }, [expenses]);

  // Filter and sort expenses
  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = expenses.filter(expense => {
      const matchesSearch =
        expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || expense.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort expenses
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [expenses, searchTerm, selectedCategory, sortBy, sortOrder]);

  // Calculate analytics with time range filtering
  const analytics = useMemo(() => {
    // Helper function to get date range based on timeRange
    const getDateRange = () => {
      const now = new Date();
      const endDate = new Date(now);
      let startDate = new Date(now);

      switch (timeRange) {
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(now.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      return { startDate, endDate };
    };

    const { startDate, endDate } = getDateRange();

    // Filter expenses by selected time range
    const filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });

    const total = filteredExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    // Calculate comparison period for growth
    const comparisonStartDate = new Date(startDate);
    const comparisonEndDate = new Date(endDate);
    const timeDiff = endDate.getTime() - startDate.getTime();
    comparisonStartDate.setTime(startDate.getTime() - timeDiff);
    comparisonEndDate.setTime(endDate.getTime() - timeDiff);

    const previousPeriodExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate >= comparisonStartDate && expenseDate < comparisonEndDate
      );
    });

    const previousPeriodTotal = previousPeriodExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const periodGrowth =
      previousPeriodTotal > 0
        ? ((total - previousPeriodTotal) / previousPeriodTotal) * 100
        : 0;

    // Current month calculation (for the "This Month" card)
    const thisMonth = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        const now = new Date();
        return (
          expenseDate.getMonth() === now.getMonth() &&
          expenseDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    const avgPerExpense =
      filteredExpenses.length > 0 ? total / filteredExpenses.length : 0;

    // Category breakdown for filtered period
    const categoryBreakdown = filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    // Top spending categories
    const topCategories = Object.entries(categoryBreakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // Daily spending trend for the selected period
    const getDaysInRange = () => {
      const days = [];
      const current = new Date(startDate);

      while (current <= endDate) {
        days.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }

      // Limit to reasonable number of days for display
      if (days.length > 30) {
        // For longer periods, show weekly averages
        const weeks = [];
        for (let i = 0; i < days.length; i += 7) {
          const weekDays = days.slice(i, i + 7);
          const weekStart = weekDays[0];
          const weekAmount = filteredExpenses
            .filter(expense => weekDays.includes(expense.date))
            .reduce((sum, expense) => sum + expense.amount, 0);
          weeks.push({ date: weekStart, amount: weekAmount, isWeekly: true });
        }
        return weeks.slice(-10); // Show last 10 weeks
      }

      return days.slice(-14).map(date => ({
        date,
        amount: filteredExpenses
          .filter(expense => expense.date === date)
          .reduce((sum, expense) => sum + expense.amount, 0),
        isWeekly: false,
      }));
    };

    const dailyTrend = getDaysInRange();

    const analyticsResult = {
      total,
      thisMonth,
      previousPeriodTotal,
      avgPerExpense,
      periodGrowth,
      count: filteredExpenses.length,
      categoryBreakdown,
      topCategories,
      dailyTrend,
      timeRange,
      filteredExpenses,
    };

    logInfo('Analytics calculation completed', {
      timeRange,
      totalExpenses: expenses.length,
      filteredExpenses: filteredExpenses.length,
      totalAmount: total,
      thisMonthAmount: thisMonth,
      periodGrowth: `${periodGrowth.toFixed(1)}%`,
      topCategoriesCount: topCategories.length,
    });

    return analyticsResult;
  }, [expenses, timeRange]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await onDelete(id);
        logInfo('Expense deleted successfully from HomePage', { id });
      } catch (error) {
        logError('Failed to delete expense from HomePage', {
          id,
          error: error instanceof Error ? error.message : String(error),
        });
        console.error('Failed to delete expense:', error);
        alert('Failed to delete expense');
      }
    } else {
      logWarn('User cancelled expense deletion', { id });
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <div className='flex justify-center mb-4'>
            <div className='p-3 bg-blue-100 rounded-full'>
              <RefreshCw className='w-8 h-8 text-blue-600 animate-spin' />
            </div>
          </div>
          <h3 className='text-lg font-semibold text-gray-800 mb-2'>
            Loading analytics...
          </h3>
          <p className='text-gray-600'>Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-12'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto'>
          <div className='flex justify-center mb-4'>
            <div className='p-3 bg-red-100 rounded-full'>
              <AlertTriangle className='w-8 h-8 text-red-600' />
            </div>
          </div>
          <h3 className='text-lg font-semibold text-red-800 mb-2'>
            Something went wrong
          </h3>
          <p className='text-red-700 mb-6'>{error}</p>
          <button
            onClick={onRefresh}
            className='inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 hover:shadow-sm'>
            <RefreshCw className='w-4 h-4 mr-2' />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Analytics Dashboard
          </h1>
          <p className='text-gray-600 mt-1'>
            Track and analyze your spending patterns
          </p>
        </div>
        <Link
          to='/expense/new'
          className='btn-primary inline-flex items-center'>
          <Plus className='w-4 h-4 mr-2' />
          Add Expense
        </Link>
      </div>

      {/* Time Range Selector */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <h3 className='text-sm font-medium text-gray-700'>Time Range:</h3>
          <div className='flex bg-gray-100 rounded-lg p-1'>
            {(['7d', '30d', '90d', '1y'] as const).map(range => (
              <button
                key={range}
                onClick={() => {
                  if (range !== timeRange) {
                    logInfo('User changed time range filter', {
                      previousRange: timeRange,
                      newRange: range,
                    });
                  }
                  setTimeRange(range);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                  timeRange === range
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}>
                {range === '7d' && '7D'}
                {range === '30d' && '30D'}
                {range === '90d' && '90D'}
                {range === '1y' && '1Y'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='card'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Total Spending
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                {formatCurrency(analytics.total)}
              </p>
            </div>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <DollarSign className='w-6 h-6 text-blue-600' />
            </div>
          </div>
          <div className='mt-2 flex items-center text-sm'>
            {analytics.periodGrowth >= 0 ? (
              <ArrowUpRight className='w-4 h-4 text-green-500 mr-1' />
            ) : (
              <ArrowDownRight className='w-4 h-4 text-red-500 mr-1' />
            )}
            <span
              className={
                analytics.periodGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              }>
              {Math.abs(analytics.periodGrowth).toFixed(1)}%
            </span>
            <span className='text-gray-500 ml-1'>vs previous period</span>
          </div>
        </div>

        <div className='card'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>This Month</p>
              <p className='text-2xl font-bold text-gray-900'>
                {formatCurrency(analytics.thisMonth)}
              </p>
            </div>
            <div className='p-2 bg-green-100 rounded-lg'>
              <Calendar className='w-6 h-6 text-green-600' />
            </div>
          </div>
        </div>

        <div className='card'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Avg per Expense
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                {formatCurrency(analytics.avgPerExpense)}
              </p>
            </div>
            <div className='p-2 bg-purple-100 rounded-lg'>
              <TrendingUp className='w-6 h-6 text-purple-600' />
            </div>
          </div>
        </div>

        <div className='card'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Total Count</p>
              <p className='text-2xl font-bold text-gray-900'>
                {analytics.count}
              </p>
            </div>
            <div className='p-2 bg-orange-100 rounded-lg'>
              <BarChart3 className='w-6 h-6 text-orange-600' />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Category Breakdown */}
        <div className='card'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
            <PieChart className='w-5 h-5 mr-2 text-blue-600' />
            Top Spending Categories
          </h3>
          <div className='space-y-3'>
            {analytics.topCategories.map(([category, amount]) => (
              <div key={category} className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <div
                    className={`w-3 h-3 rounded-full ${getCategoryColor(
                      category
                    )}`}></div>
                  <span className='text-sm font-medium text-gray-700'>
                    {category}
                  </span>
                </div>
                <div className='text-right'>
                  <p className='text-sm font-semibold text-gray-900'>
                    {formatCurrency(amount)}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {((amount / analytics.total) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Trend */}
        <div className='card'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
            <Activity className='w-5 h-5 mr-2 text-green-600' />
            Daily Spending Trend
          </h3>
          <div className='space-y-3'>
            {analytics.dailyTrend.map(({ date, amount, isWeekly }) => (
              <div key={date} className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>
                  {isWeekly ? `Week of ${formatDate(date)}` : formatDate(date)}
                </span>
                <div className='flex items-center space-x-2'>
                  <div className='w-20 bg-gray-200 rounded-full h-2'>
                    <div
                      className='bg-blue-600 h-2 rounded-full'
                      style={{
                        width: `${Math.max(
                          (amount /
                            Math.max(
                              ...analytics.dailyTrend.map(d => d.amount)
                            )) *
                            100,
                          5
                        )}%`,
                      }}></div>
                  </div>
                  <span className='text-sm font-medium text-gray-900 w-16 text-right'>
                    {formatCurrency(amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className='bg-white border border-gray-200 rounded-lg p-4'>
        <div className='flex flex-col lg:flex-row gap-3'>
          {/* Search */}
          <div className='flex-1'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <input
                type='text'
                placeholder='Search expenses...'
                value={searchTerm}
                onChange={e => {
                  const newSearchTerm = e.target.value;
                  if (newSearchTerm !== searchTerm) {
                    logInfo('User updated search term', {
                      previousTerm: searchTerm,
                      newTerm: newSearchTerm,
                      termLength: newSearchTerm.length,
                    });
                  }
                  setSearchTerm(newSearchTerm);
                }}
                className='w-full px-3 py-2 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm'
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className='lg:w-44'>
            <div className='relative'>
              <select
                value={selectedCategory}
                onChange={e => {
                  const newCategory = e.target.value;
                  if (newCategory !== selectedCategory) {
                    logInfo('User changed category filter', {
                      previousCategory: selectedCategory,
                      newCategory: newCategory,
                    });
                  }
                  setSelectedCategory(newCategory);
                }}
                className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm appearance-none pr-8'>
                <option value='all'>All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown className='pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            </div>
          </div>

          {/* Sort */}
          <div className='lg:w-44'>
            <div className='relative'>
              <select
                value={sortBy}
                onChange={e => {
                  const newSortBy = e.target.value as
                    | 'date'
                    | 'amount'
                    | 'title';
                  if (newSortBy !== sortBy) {
                    logInfo('User changed sort field', {
                      previousSortBy: sortBy,
                      newSortBy: newSortBy,
                    });
                  }
                  setSortBy(newSortBy);
                }}
                className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm appearance-none pr-8'>
                <option value='date'>Sort by Date</option>
                <option value='amount'>Sort by Amount</option>
                <option value='title'>Sort by Title</option>
              </select>
              <ChevronDown className='pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-200' />
            </div>
          </div>

          {/* Sort Order Toggle */}
          <button
            onClick={toggleSortOrder}
            className='px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium'
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}>
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => {
              logInfo('User clicked refresh button');
              onRefresh();
            }}
            className='px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium'
            title='Refresh expenses'>
            <RefreshCw className='w-4 h-4' />
          </button>
        </div>
      </div>

      {/* Expenses List */}
      <div className='space-y-4'>
        {filteredAndSortedExpenses.length === 0 ? (
          <div className='text-center py-12'>
            <div className='text-gray-400 text-6xl mb-4'>📊</div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              No expenses found
            </h3>
            <p className='text-gray-600 mb-6'>
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first expense'}
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <Link
                to='/expense/new'
                className='inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200'>
                <Plus className='w-4 h-4 mr-2' />
                Add Your First Expense
              </Link>
            )}
          </div>
        ) : (
          filteredAndSortedExpenses.map(expense => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Expense Card Component
interface ExpenseCardProps {
  expense: Expense;
  onDelete: (id: string) => Promise<void>;
}

function ExpenseCard({ expense, onDelete }: ExpenseCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      logInfo('ExpenseCard delete operation started', {
        expenseId: expense.id,
        expenseTitle: expense.title,
      });
      await onDelete(expense.id);
      logInfo('ExpenseCard delete operation completed', {
        expenseId: expense.id,
        expenseTitle: expense.title,
      });
    } catch (error) {
      logError('ExpenseCard delete operation failed', {
        expenseId: expense.id,
        expenseTitle: expense.title,
        error: error instanceof Error ? error.message : String(error),
      });
      console.error('ExpenseCard delete operation failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200'>
      <div className='flex items-start justify-between'>
        <div className='flex items-start space-x-3 flex-1'>
          {/* Category Icon with Background */}
          <div className='flex-shrink-0'>
            <div className='w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center'>
              <span className='text-lg text-gray-600'>
                {getCategoryIcon(expense.category)}
              </span>
            </div>
          </div>

          {/* Expense Details */}
          <div className='flex-1 min-w-0'>
            <div className='flex items-center space-x-3 mb-0.5'>
              <h3 className='text-lg font-semibold text-gray-900 truncate'>
                {expense.title}
              </h3>
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(
                  expense.category
                )}`}>
                {expense.category}
              </span>
            </div>

            {expense.description && (
              <p className='text-gray-600 text-sm mb-1 line-clamp-2'>
                {expense.description}
              </p>
            )}

            <div className='flex items-center space-x-3 text-sm text-gray-500'>
              <span className='flex items-center'>
                <Calendar className='w-3 h-3 mr-1 text-gray-400' />
                {formatDate(expense.date)}
              </span>
              <span>•</span>
              <span>Added {formatDate(expense.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Amount and Actions */}
        <div className='flex flex-col items-end space-y-2'>
          <div className='text-right'>
            <p className='text-2xl font-bold text-gray-900'>
              {formatCurrency(expense.amount)}
            </p>
          </div>

          <div className='flex items-center space-x-1'>
            <Link
              to={`/expense/${expense.id}/edit`}
              className='p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200'
              title='Edit expense'>
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                />
              </svg>
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className='p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50'
              title='Delete expense'>
              {isDeleting ? (
                <div className='w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin'></div>
              ) : (
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
