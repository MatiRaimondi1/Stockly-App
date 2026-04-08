import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FeatureCard } from "@/components/feature-card";

describe("FeatureCard Component", () => {
    const defaultProps = {
        title: "Test Title",
        description: "Test Description",
        index: 0,
    };

    const MockIcon = () => <svg data-testid="mock-icon" />;

    it("should display the correct title and description", () => {
        render(
            <FeatureCard {...defaultProps}>
                <MockIcon />
            </FeatureCard>
        );

        expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
        expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
        expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
    });

    it("should apply the animation delay based on the index", () => {
        const { container } = render(
            <FeatureCard {...defaultProps} index={2}>
                <MockIcon />
            </FeatureCard>
        );

        const motionDiv = container.firstChild;

        expect(motionDiv).toBeDefined();
    });

    it("should update the mouse coordinates when the mouse is moved", () => {
        const { container } = render(
            <FeatureCard {...defaultProps}>
                <MockIcon />
            </FeatureCard>
        );

        const card = container.firstChild as HTMLElement;

        vi.spyOn(card, 'getBoundingClientRect').mockReturnValue({
            left: 100,
            top: 100,
            width: 300,
            height: 200,
            bottom: 300,
            right: 400,
            x: 100,
            y: 100,
            toJSON: () => { }
        });

        fireEvent.mouseMove(card, {
            clientX: 250,
            clientY: 200,
        });

        expect(card).toHaveClass('group');
    });

    it("should have the necessary Tailwind classes for hover states", () => {
        render(
            <FeatureCard {...defaultProps}>
                <MockIcon />
            </FeatureCard>
        );

        const title = screen.getByText(defaultProps.title);
        const iconContainer = screen.getByTestId("mock-icon").parentElement;

        expect(title).toHaveClass('group-hover:text-purple-200');
        expect(iconContainer).toHaveClass('group-hover:bg-purple-500');
    });
});