export class OrderItemDto {
  productId!: number;
  quantity!: number;
}

export class CreateOrderDto {
  storeId!: number;
  items!: OrderItemDto[];
}