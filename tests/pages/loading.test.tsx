import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Loading from "@/app/loading";

describe("Loading Component", () => {
    it("should render the main container with the correct background", () => {
        const { container } = render(<Loading />);

        const mainDiv = container.firstChild as HTMLElement;
        expect(mainDiv).toHaveClass("min-h-screen", "bg-[#0b0b0d]", "flex", "flex-col", "items-center", "justify-center", "relative", "overflow-hidden");
    });

    it("should render the decorative background element (blur)", () => {
        const { container } = render(<Loading />);

        const blurEffect = container.querySelector(".bg-purple-600\\/10");
        expect(blurEffect).toBeInTheDocument();
        expect(blurEffect).toHaveClass("blur-[100px]");
    });

    it("should render the spinner with its static borders", () => {
        render(<Loading />);

        const { container } = render(<Loading />);
        const staticBorder = container.querySelector(".border-zinc-800");
        expect(staticBorder).toBeInTheDocument();
    });

    it("should have the animated element with the brand color properties", () => {
        const { container } = render(<Loading />);

        const animatedSpinner = container.querySelector(".border-t-purple-500");
        expect(animatedSpinner).toBeInTheDocument();
    });

    it("should apply relative positioning classes to the spinner", () => {
        render(<Loading />);

        const spinnerWrapper = screen.getAllByRole("generic").find((el) => el.classList.contains("h-16") && el.classList.contains("w-16"));
        expect(spinnerWrapper).toBeInTheDocument();
    });
});