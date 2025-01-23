import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect } from "vitest";
import renderWithProvider from "./test_utils/renderWithProvider";
import App from "../App";

describe("App komponenta", () => {
  test("prikazuje zaglavlje", () => {
    renderWithProvider(<App />);
    const headerElement = screen.getByRole("heading", { name: /prijava/i });
    expect(headerElement).toBeInTheDocument();
  });

  test("prikazuje polje za unos e-mail-a", () => {
    renderWithProvider(<App />);
    const emailInput = screen.getByLabelText(/e-mail/i);
    expect(emailInput).toBeInTheDocument();
  });

  test("prikazuje polje za unos lozinke", () => {
    renderWithProvider(<App />);
    const passwordInput = screen.getByLabelText(/lozinka/i);
    expect(passwordInput).toBeInTheDocument();
  });

  test("prikazuje gumb za prijavu", () => {
    renderWithProvider(<App />);
    const submitButton = screen.getByRole("button", { name: /prijavi se/i });
    expect(submitButton).toBeInTheDocument();
  });

  test("mijenja vrijednost polja za unos e-mail-a", async () => {
    renderWithProvider(<App />);
    const emailInput = screen.getByLabelText(/e-mail/i);
    await userEvent.type(emailInput, 'test@example.com'); // Use userEvent
    expect(emailInput).toHaveValue('test@example.com');
  });

  test("mijenja vrijednost polja za unos lozinke", async () => {
    renderWithProvider(<App />);
    const passwordInput = screen.getByLabelText(/lozinka/i);
    await userEvent.type(passwordInput, 'password'); // Use userEvent
    expect(passwordInput).toHaveValue('password');
  });
});