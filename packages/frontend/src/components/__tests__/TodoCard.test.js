import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });
});

describe('TodoCard overdue badge', () => {
  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.useFakeTimers({ now: new Date('2026-03-20') });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders "Overdue" badge for incomplete todo with past due date', () => {
    const todo = { id: 1, title: 'Overdue task', dueDate: '2026-03-19', completed: 0, createdAt: '2026-01-01T00:00:00Z' };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(screen.getByText('Overdue')).toBeInTheDocument();
  });

  it('does NOT render "Overdue" badge for completed todo with past due date', () => {
    const todo = { id: 2, title: 'Done task', dueDate: '2026-03-19', completed: 1, createdAt: '2026-01-01T00:00:00Z' };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  it('does NOT render "Overdue" badge for incomplete todo due today', () => {
    const todo = { id: 3, title: 'Due today', dueDate: '2026-03-20', completed: 0, createdAt: '2026-01-01T00:00:00Z' };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  it('does NOT render "Overdue" badge for incomplete todo with no due date', () => {
    const todo = { id: 4, title: 'No due date', dueDate: null, completed: 0, createdAt: '2026-01-01T00:00:00Z' };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  it('does NOT render "Overdue" badge for incomplete todo with future due date', () => {
    const todo = { id: 5, title: 'Future task', dueDate: '2026-03-21', completed: 0, createdAt: '2026-01-01T00:00:00Z' };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  it('badge has role="status" and accessible name including "Overdue"', () => {
    const todo = { id: 6, title: 'Overdue task', dueDate: '2026-03-19', completed: 0, createdAt: '2026-01-01T00:00:00Z' };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    const badge = screen.getByRole('status');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAccessibleName(/Overdue/i);
  });

  it('badge element has className containing "overdue-badge"', () => {
    const todo = { id: 7, title: 'Overdue task', dueDate: '2026-03-19', completed: 0, createdAt: '2026-01-01T00:00:00Z' };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    const badge = screen.getByText('Overdue');
    expect(badge.className).toContain('overdue-badge');
  });

  it('badge does NOT appear when todo.completed === 1', () => {
    const todo = { id: 8, title: 'Completed overdue', dueDate: '2026-03-19', completed: 1, createdAt: '2026-01-01T00:00:00Z' };
    render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });
});
