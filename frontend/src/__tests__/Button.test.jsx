import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import Button from "/src/components/Button.jsx"; // Adjust the import path as needed

describe("Button komponenta", () => {
  test("pravilno se render-a s pravim props-ima", () => {
    render(<Button type="button" text="Click Me" />);

    const buttonElement = screen.getByText("Click Me");
    expect(buttonElement).toBeInTheDocument();

    expect(buttonElement).toHaveAttribute("type", "button");
  });

  test("postavi se className kad je zadan", () => {
    render(<Button type="button" text="Click Me" className="primary-btn" />);

    const buttonElement = screen.getByText("Click Me");
    expect(buttonElement).toHaveClass("primary-btn");
  });

  test("na klik se pozove \"onClick\"", () => {
    const handleClick = vi.fn();

    render(<Button type="button" text="Click Me" onClick={handleClick} />);

    const buttonElement = screen.getByText("Click Me");

    fireEvent.click(buttonElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("ne render-a se className ako nije zadan", () => {
    render(<Button type="button" text="Click Me" />);

    const buttonElement = screen.getByText("Click Me");
    expect(buttonElement).not.toHaveClass();
  });
  
  test("render-a se s ispravnim tipom", () => {
    render(<Button type="submit" text="Submit" />);
    const buttonElement = screen.getByText("Submit");
    expect(buttonElement).toHaveAttribute("type", "submit");
  });

});
