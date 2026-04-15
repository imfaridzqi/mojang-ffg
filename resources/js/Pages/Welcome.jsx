import { Head } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';

const chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
];

const tableData = [
    { id: 1, name: 'Alice', role: 'Engineer', status: 'Active' },
    { id: 2, name: 'Bob', role: 'Designer', status: 'Inactive' },
    { id: 3, name: 'Carol', role: 'Manager', status: 'Active' },
];

const columnHelper = createColumnHelper();
const columns = [
    columnHelper.accessor('id', { header: 'ID' }),
    columnHelper.accessor('name', { header: 'Name' }),
    columnHelper.accessor('role', { header: 'Role' }),
    columnHelper.accessor('status', { header: 'Status' }),
];

export default function Welcome() {
    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-background p-8">
                <h1 className="text-3xl font-bold mb-8">Laravel + Inertia + React + Tailwind + shadcn/ui</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>shadcn/ui Buttons</CardTitle>
                        </CardHeader>
                        <CardContent className="flex gap-2 flex-wrap">
                            <Button>Default</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="destructive">Destructive</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recharts Bar Chart</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={180}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="oklch(0.205 0 0)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>TanStack Table</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-sm">
                            <thead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id} className="border-b">
                                        {headerGroup.headers.map((header) => (
                                            <th key={header.id} className="text-left p-2 font-semibold">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className="border-b hover:bg-muted/50">
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="p-2">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
