import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import Preview from "@/components/preview";

vi.mock("next/image", () => ({
    default: ({ src, alt, className }: any) => (
        <img src={src} alt={alt} className={className} data-testid="next-image" />
    ),
}));

describe("Preview Component", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it("should render the initial image and indicators", () => {
        render(<Preview />);

        const images = screen.getAllByTestId("next-image");
        const indicators = screen.getAllByRole("generic").filter(el =>
            el.className.includes("h-1 transition-all")
        );

        expect(images[0].closest('div')).toHaveClass("opacity-100");
        expect(images[1].closest('div')).toHaveClass("opacity-0");

        expect(indicators[0]).toHaveClass("w-8 bg-purple-500");
        expect(indicators[1]).toHaveClass("w-2 bg-zinc-700");
    });

    it("should change to the second image after 5 seconds", () => {
        render(<Preview />);

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        const images = screen.getAllByTestId("next-image");
        const indicators = screen.getAllByRole("generic").filter(el =>
            el.className.includes("h-1 transition-all")
        );

        expect(images[0].closest('div')).toHaveClass("opacity-0");
        expect(images[1].closest('div')).toHaveClass("opacity-100");

        expect(indicators[1]).toHaveClass("w-8 bg-purple-500");
    });

    it("should return to the first image after 10 seconds (complete cycle)", () => {
        render(<Preview />);

        act(() => {
            vi.advanceTimersByTime(10000);
        });

        const images = screen.getAllByTestId("next-image");
        expect(images[0].closest('div')).toHaveClass("opacity-100");
    });

    it("should clear the interval when the component is unmounted", () => {
        const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
        const { unmount } = render(<Preview />);

        unmount();

        expect(clearIntervalSpy).toHaveBeenCalled();
    });
});