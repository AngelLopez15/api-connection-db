import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
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
  @Column('float', {
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

  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];
  
  @BeforeInsert()
  // This method is called before inserting a new product into the database.
  // It ensures that the slug is always in a consistent format.
  checkSlug() {
    if (!this.slug) {
      // If no slug is provided, generate one from the title.
      // This will create a slug by converting the title to lowercase, replacing spaces with underscores,
      // and removing any non-alphanumeric characters.
      // This ensures that the slug is URL-friendly and consistent.
      // This is useful for SEO and user-friendly URLs.
      // This will ensure that the slug is always in a consistent format.
      this.slug = this.title.toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, '');
    } else {
      // If a slug is provided, ensure it is formatted correctly
      // Convert to lowercase, replace spaces with underscores, and remove non-alphanumeric characters
      // This ensures that the slug is URL-friendly and consistent.
      // This is useful for SEO and user-friendly URLs.
      // This will ensure that the slug is always in a consistent format.
      this.slug = this.slug.toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, '');
    }
  }

  @BeforeInsert()
  // This method is called before inserting a new product into the database.
  checkSlugUpdate() {
    // This method is similar to checkSlug, but it is specifically for updating the slug.
    // It ensures that the slug is always in a consistent format when the product is updated.
    if (!this.slug) {
      this.slug = this.title.toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, '');
    } else {
      this.slug = this.slug.toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, '');
    }
  }
}
