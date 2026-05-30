import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatCard } from "./StatCard";

describe("StatCard", () => {
  it("renders label and value for dashboard cards", () => {
    render(<StatCard label="Total Hunts" value={42} />);
    expect(screen.getByText("Total Hunts")).toBeTruthy();
    expect(screen.getByText("42")).toBeTruthy();
  });
});
