"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

/**
 * Interface for chart data
 */
interface ChartData {
    week: string;
    products: number;
}

/**
 * ProductChart component
 * @param param0 
 * @returns 
 */
export default function ProductChart({data}: {data: ChartData[]}) {
    return (
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                    <defs>
                        <linearGradient id="colorProducts" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    
                    <CartesianGrid 
                        strokeDasharray="3 3" 
                        vertical={false} 
                        stroke="#27272a" 
                    />
                    
                    <XAxis 
                        dataKey="week" 
                        stroke="#71717a" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        dy={10}
                    />
                    
                    <YAxis 
                        stroke="#71717a" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        allowDecimals={false}
                    />
                    
                    <Tooltip 
                        contentStyle={{
                            backgroundColor: "#18181b",
                            border: "1px solid #3f3f46",
                            borderRadius: "12px",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                            padding: "8px 12px"
                        }}
                        itemStyle={{
                            color: "#a855f7",
                            fontSize: "12px",
                            fontWeight: "bold",
                            textTransform: "uppercase"
                        }}
                        labelStyle={{
                            color: "#71717a",
                            fontSize: "10px",
                            marginBottom: "4px",
                            textTransform: "uppercase"
                        }}
                        cursor={{ stroke: '#3f3f46', strokeWidth: 1 }}
                    />

                    <Area 
                        type="monotone" 
                        dataKey="products" 
                        stroke="#a855f7" 
                        fillOpacity={1} 
                        fill="url(#colorProducts)" 
                        strokeWidth={3} 
                        animationDuration={1500}
                        dot={{ fill: "#0b0b0d", stroke: "#a855f7", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 0, fill: "#ffffff" }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    ) 
}