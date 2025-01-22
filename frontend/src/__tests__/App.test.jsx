import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";

describe("App komponenta", () => {
  // Testira prikaz zaglavlja
  test("prikazuje zaglavlje", () => {
    render(<App />);
    const headerElement = screen.getByRole("heading", { name: /prijava/i });
    expect(headerElement).toBeInTheDocument();
  });

  // Testira prikaz polja za unos e-maila
  test("prikazuje polje za unos e-maila", () => {
    render(<App />);
    const emailInput = screen.getByLabelText(/e-mail/i);
    expect(emailInput).toBeInTheDocument();
  });

  // Testira prikaz polja za unos lozinke
  test("prikazuje polje za unos lozinke", () => {
    render(<App />);
    const passwordInput = screen.getByLabelText(/lozinka/i);
    expect(passwordInput).toBeInTheDocument();
  });

  // Testira prikaz gumba za prijavu
  test("prikazuje gumb za prijavu", () => {
    render(<App />);
    const submitButton = screen.getByRole("button", { name: /prijavi se/i });
    expect(submitButton).toBeInTheDocument();
  });

  // Testira promjenu vrijednosti polja za unos e-maila
  test("mijenja vrijednost polja za unos e-maila", async () => {
    render(<App />);
    const emailInput = screen.getByLabelText(/e-mail/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput).toHaveValue('test@example.com');
  });

  // Testira promjenu vrijednosti polja za unos lozinke
  test("mijenja vrijednost polja za unos lozinke", async () => {
    render(<App />);
    const passwordInput = screen.getByLabelText(/lozinka/i);
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    expect(passwordInput).toHaveValue('password');
  });
});