import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(): Promise<({
        store: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            ownerId: number;
        };
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        priceCOP: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        images: string[];
        storeId: number;
    })[]>;
    findOne(id: string): Promise<{
        store: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            ownerId: number;
        };
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        priceCOP: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        images: string[];
        storeId: number;
    }>;
    create(createProductDto: CreateProductDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        priceCOP: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        images: string[];
        storeId: number;
    }>;
    update(id: string, updateProductDto: Partial<CreateProductDto>): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        priceCOP: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        images: string[];
        storeId: number;
    }>;
    remove(id: string): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        priceCOP: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        images: string[];
        storeId: number;
    }>;
}
//# sourceMappingURL=products.controller.d.ts.map