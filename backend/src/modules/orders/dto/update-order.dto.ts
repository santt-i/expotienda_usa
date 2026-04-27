import { OrderStatus } from "@prisma/client";

export class UpdateOrderDto {
    status?:OrderStatus;
    trackingCode?: string;
}