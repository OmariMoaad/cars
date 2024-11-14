"use client";
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Car } from "./../app/models/car-entity";
import { CarService } from "@/app/services/car-service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// CarTable Component
export function CarTable() {
  const [make, setMake] = React.useState("");
  const [model, setModel] = React.useState("");
  const [filteredCars, setFilteredCars] = React.useState<Car[]>(
    CarService.getCars()
  );
  const [selectedCar, setSelectedCar] = React.useState<Car | null>(null); // Store selected car for version display
  const [selectedVersions, setSelectedVersions] = React.useState<
    { name: string; price: number }[] | null
  >(null);

  // Function to handle viewing versions
  const handleViewVersions = (car: Car) => {
    setSelectedCar(car); // Set the selected car
    if (car.versions) {
      setSelectedVersions(car.versions);
    } else {
      setSelectedVersions(null);
    }
  };

  // Update the list of cars based on the selected make and model
  React.useEffect(() => {
    const allCars = CarService.getCars();
    const filtered = allCars.filter(
      (car: Car) =>
        (make ? car.make === make : true) &&
        (model ? car.model === model : true)
    );
    setFilteredCars(filtered);
  }, [make, model]);

  // Get all car models for the selected make
  const availableModels = CarService.getCarModels(make);

  // Reset model and selectedVersions when make changes
  const handleMakeChange = (newMake: string) => {
    setMake(newMake);
    setModel(""); // Reset the model when make changes
    setSelectedVersions(null); // Clear the selected versions when make changes
    setSelectedCar(null); // Reset the selected car
  };

  // Table columns definition
  const columns: ColumnDef<Car>[] = [
    {
      accessorKey: "make",
      header: "Make",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("make")}</div>
      ),
    },
    {
      accessorKey: "model",
      header: "Model",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("model")}</div>
      ),
    },
    {
      accessorKey: "year",
      header: "Year",
      cell: ({ row }) => <div>{row.getValue("year")}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const car = row.original;
        return (
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleViewVersions(car)} // Correct scope for handleViewVersions
          >
            <Eye />
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredCars,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="py-4 flex">
        <div className="pr-4">
          <Select onValueChange={handleMakeChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={make || "Make"} />
            </SelectTrigger>
            <SelectContent>
              {CarService.getCarManufactures().map((make) => (
                <SelectItem key={make} value={make}>
                  {make}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="pr-4">
          <Select
            onValueChange={setModel}
            disabled={!make} // Disable model select if no make is selected
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={model || "Model"} />
            </SelectTrigger>
            <SelectContent>
              {availableModels.length > 0 ? (
                availableModels.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  No models available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Display selected versions */}
      {selectedVersions && selectedCar && (
        <div className="mt-4 p-4 border rounded-md">
          <h2 className="text-lg font-semibold">
            Car Versions for {selectedCar.make} {selectedCar.model}
          </h2>
          <ul>
            {selectedVersions.map((version) => (
              <li key={version.name} className="py-1">
                {version.name}: ${version.price.toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
