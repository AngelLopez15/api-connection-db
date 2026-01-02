import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductImage {
  // The primary key for the product image entity, using UUID for uniqueness.
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // The URL of the image, stored as text.
  @Column('text')
  url: string;

  // The product to which this image belongs, establishing a many-to-one relationship.
  @ManyToOne(() => Product, (product) => product.images, {
    // This establishes a many-to-one relationship with the Product entity.
    // Eager loading means that when a product image is fetched, its associated product is also fetched automatically.
    // eager: true,
    // The 'cascade' option allows for operations like insert, update, and remove to be cascaded to the related product.
    // This means that if a product is deleted, its associated images will also be deleted.
    // onDelete: 'CASCADE',
  })
  product: Product;
}