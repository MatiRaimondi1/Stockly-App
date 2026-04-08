import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProductChart from "@/components/products-chart";

vi.mock("recharts", () => ({
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    AreaChart: ({ children, data }: any) => (
        <div data-testid="area-chart">
            {data?.map((d: any) => <span key={d.week}>{d.week}</span>)}
            {children}
        </div>
    ),
    Area: () => <div data-testid="chart-area" />,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
}));

describe("ProductChart Component", () => {
    const mockData = [
        { week: "Mon", products: 10 },
        { week: "Tue", products: 20 },
        { week: "Wed", products: 15 },
    ];

    it("should render the main container", () => {
        const { container } = render(<ProductChart data={mockData} />);
        expect(container.firstChild).toHaveClass("h-full w-full");
    });

    it("should render the internal elements of the Recharts SVG", () => {
        render(<ProductChart data={mockData} />);
        expect(screen.getByTestId("area-chart")).toBeInTheDocument();
    });

    it("should display the X-axis labels (weeks)", () => {
        render(<ProductChart data={mockData} />);

        expect(screen.getByText("Mon")).toBeInTheDocument();
        expect(screen.getByText("Tue")).toBeInTheDocument();
        expect(screen.getByText("Wed")).toBeInTheDocument();
    });

    it("should render the Area element of the chart", () => {
        render(<ProductChart data={mockData} />);
        expect(screen.getByTestId("chart-area")).toBeInTheDocument();
    });
});