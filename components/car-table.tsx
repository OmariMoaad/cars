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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Car } from "../app/models/car-entity";
import { CarService } from "@/app/services/car-service";

// CarTable Component
export function CarTable() {
  const [make, setMake] = React.useState("");
  const [model, setModel] = React.useState("");
  const [filteredCars, setFilteredCars] = React.useState<Car[]>(
    CarService.getCars()
  );
  const [selectedCar, setSelectedCar] = React.useState<Car | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // Handle viewing versions
  const handleViewVersions = (car: Car) => {
    setSelectedCar(car);
    setIsDrawerOpen(true);
  };

  // Update cars based on selected make and model
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

  // Handle make change and reset model
  const handleMakeChange = (newMake: string) => {
    setMake(newMake);
    setModel("");
  };

  // Handle model change and automatically set the corresponding make
  const handleModelChange = (newModel: string) => {
    setModel(newModel);
    const associatedMake = CarService.getMakeByModel(newModel);
    if (associatedMake) {
      setMake(associatedMake);
    }
  };

  // Table column definitions
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
            onClick={() => handleViewVersions(car)}
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
      <div className="py-4 flex gap-4">
        <Select onValueChange={handleMakeChange} value={make}>
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

        <Select onValueChange={handleModelChange} value={model}>
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
        <Button onClick={() => setFilteredCars(CarService.getCars())}>
          All Cars
        </Button>
      </div>

      {/* Car Table */}
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

      {/* Drawer for Car Versions */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>
                {selectedCar ? (
                  <h2>
                    Car Versions - {selectedCar.make} {selectedCar.model}
                  </h2>
                ) : (
                  "Select a car to view versions"
                )}
              </DrawerTitle>
            </DrawerHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Version</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedCar?.versions?.map((version) => (
                  <TableRow key={version.name}>
                    <TableCell>{version.name}</TableCell>
                    <TableCell className="text-right">
                      ${version.price.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <DrawerFooter>
              <DrawerClose>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
