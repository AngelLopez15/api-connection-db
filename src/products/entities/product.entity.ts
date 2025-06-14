import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
// This entity represents a product in the system.
// It can be extended with properties like name, price, description, etc.
@Entity()
export class Product {
  // The primary key for the product entity, using UUID for uniqueness.
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Additional properties can be added here, such as:
  @Column('text', {
    unique: true,
  })
  title: string;

  // The price of the product, stored as a numeric type.
  @Column('numeric', {
    default: 0,
  })
  price: number;

  // The description provides more details about the product.
  @Column('text', {
    nullable: true,
  })
  description: string;

  // The slug is a URL-friendly version of the title, often used for SEO purposes.
  @Column('text', {
    unique: true,
  })
  slug: string;

  // The stock field indicates the number of items available for this product.
  @Column('int', {
    default: 0,
  })
  stock: number;

  // The sizes field is an array of strings, allowing for multiple size options for the product.
  // This is useful for products that come in different sizes, such as clothing or shoes.
  @Column('text', {
    array: true,
  })
  sizes: string[];

  @Column('text')
  gender: string;
}
