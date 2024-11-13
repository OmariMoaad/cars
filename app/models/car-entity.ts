
export interface Car {
    make: string;
    model: string;
    year: number;
    versions: Version[];
}

export interface Version {
    name: string;
    price: number;
}