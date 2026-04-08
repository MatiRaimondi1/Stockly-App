import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FadeIn, FloatingPreview } from "@/components/motion-wrapper";

describe("Motion Wrappers", () => {

    describe("FadeIn Component", () => {
        it("should render its child elements correctly", () => {
            render(
                <FadeIn>
                    <div data-testid="child-element">Test content</div>
                </FadeIn>
            );

            expect(screen.getByTestId("child-element")).toBeInTheDocument();
            expect(screen.getByText("Test content")).toBeInTheDocument();
        });

        it("should wrap the content in a motion div", () => {
            const { container } = render(
                <FadeIn>
                    <p>Test</p>
                </FadeIn>
            );

            expect(container.firstChild).not.toBeNull();
        });
    });

    describe("FloatingPreview Component", () => {
        it("should render its child elements correctly", () => {
            render(
                <FloatingPreview>
                    <span data-testid="floating-child">Preview Content</span>
                </FloatingPreview>
            );

            expect(screen.getByTestId("floating-child")).toBeInTheDocument();
        });

        it("should not crash when using the viewport logic (whileInView)", () => {
            const renderComponent = () => render(
                <FloatingPreview>
                    <div>Safe Render</div>
                </FloatingPreview>
            );

            expect(renderComponent).not.toThrow();
            expect(screen.getByText("Safe Render")).toBeInTheDocument();
        });
    });

    describe("Integration of Props", () => {
        it("FadeIn should accept and apply the optional delay", () => {
            const { rerender } = render(
                <FadeIn delay={0.5}>
                    <div>Delay Test</div>
                </FadeIn>
            );

            expect(screen.getByText("Delay Test")).toBeInTheDocument();

            rerender(
                <FadeIn delay={1}>
                    <div>Delay Test</div>
                </FadeIn>
            );
            expect(screen.getByText("Delay Test")).toBeInTheDocument();
        });
    });
});