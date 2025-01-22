import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../views/Login";
import { vi } from "vitest";

describe("Login component", () => {
    test("render-a se forma za prijavu", () => {
      render(<Login />);
      const emailInput = screen.getByLabelText(/E-mail/i);
      const passwordInput = screen.getByLabelText(/Lozinka/i);
      const submitButton = screen.getByRole("button", { name: /Prijavi se/i });
  
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });
  
    test("mijenja se vrijednost polja za unos e-maila", async () => {
      render(<Login />);
      const emailInput = screen.getByLabelText(/E-mail/i);
      await userEvent.type(emailInput, "test@example.com");
  
      expect(emailInput).toHaveValue("test@example.com");
    });
  
    test("mijenja se vrijednost polja za unos lozinke", async () => {
      render(<Login />);
      const passwordInput = screen.getByLabelText(/Lozinka/i);
      await userEvent.type(passwordInput, "password");
  
      expect(passwordInput).toHaveValue("password");
    });
  });