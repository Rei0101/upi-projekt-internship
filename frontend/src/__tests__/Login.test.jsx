import { screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { describe, test, expect } from "vitest";
import renderWithProvider from "./test_utils/renderWithProvider";
import Login from "../views/Login";
import { MemoryRouter } from "react-router-dom";

describe("Login komponenta", () => {
  test("render-a se forma za prijavu", () => {
    renderWithProvider(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const emailInput = screen.getByLabelText(/E-mail/i);
    const passwordInput = screen.getByLabelText(/Lozinka/i);
    const submitButton = screen.getByRole("button", { name: /Prijavi se/i });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test("mijenja se vrijednost polja za unos e-mail-a", async () => {
    renderWithProvider(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const emailInput = screen.getByLabelText(/E-mail/i);
    await userEvent.type(emailInput, "test@example.com");

    expect(emailInput).toHaveValue("test@example.com");
  });

  test("mijenja se vrijednost polja za unos lozinke", async () => {
    renderWithProvider(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const passwordInput = screen.getByLabelText(/Lozinka/i);
    await userEvent.type(passwordInput, "password");

    expect(passwordInput).toHaveValue("password");
  });
});