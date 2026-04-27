import { PrismaService } from '../../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
export declare class StoresService {
    private prisma;
    constructor(prisma: PrismaService);
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
    findOne(id: number): Promise<{
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
    create(createStoreDto: CreateStoreDto, ownerId: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: number;
    }>;
    update(id: number, updateStoreDto: Partial<CreateStoreDto>, userId: number, userRole: string): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: number;
    }>;
    remove(id: number, userId: number, userRole: string): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: number;
    }>;
}
//# sourceMappingURL=stores.service.d.ts.map