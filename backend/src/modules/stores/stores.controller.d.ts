import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
export declare class StoresController {
    private readonly storesService;
    constructor(storesService: StoresService);
    findAll(): Promise<({
        owner: {
            id: number;
            email: string;
            password: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            country: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        products: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            priceCOP: import("@prisma/client/runtime/library").Decimal;
            stock: number;
            images: string[];
            storeId: number;
        }[];
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: number;
    })[]>;
    findOne(id: string): Promise<{
        owner: {
            id: number;
            email: string;
            password: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            country: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        products: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            priceCOP: import("@prisma/client/runtime/library").Decimal;
            stock: number;
            images: string[];
            storeId: number;
        }[];
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: number;
    }>;
    create(createStoreDto: CreateStoreDto, req: any): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: number;
    }>;
    update(id: string, updateStoreDto: Partial<CreateStoreDto>, req: any): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: number;
    }>;
    remove(id: string, req: any): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: number;
    }>;
}
//# sourceMappingURL=stores.controller.d.ts.map