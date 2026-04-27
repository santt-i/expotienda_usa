import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
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
    findOne(id: number): Promise<{
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
    update(id: number, updateProductDto: Partial<CreateProductDto>): Promise<{
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
    remove(id: number): Promise<{
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
//# sourceMappingURL=products.service.d.ts.map