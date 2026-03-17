import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import Sidebar from '../Sidebar';

// mock the auth hook so we can control the returned user
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { role: 'SUPER_ADMIN' },
  }),
}));

describe('Sidebar component', () => {
  it('shows base navigation links', () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/products/i)).toBeInTheDocument();
    expect(screen.getByText(/Fornecedores/i)).toBeInTheDocument();
  });

  it('includes super admin link when role is SUPER_ADMIN', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText(/Super Admin/i)).toBeInTheDocument();
  });
});
