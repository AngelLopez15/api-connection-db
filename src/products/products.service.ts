import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    // You can inject other services or repositories here if needed
    @InjectRepository(Product) // This is just an example, adjust as necessary
    private readonly productRepository: Repository<Product>, // Injecting the Product repository to interact with the database
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      // Validate the DTO before creating the product
      // This is where you can add any additional validation logic if needed
      // Create a new product instance using the provided DTO
      const product = this.productRepository.create(createProductDto);
      // Save the product to the database
      // This will automatically handle the insertion and return the saved product
      await this.productRepository.save(product);
      // Return the created product
      // This will return the product with its ID and any default values set by the database
      return product;
    } catch (error) {
      // Handle any errors that occur during the creation process
      // If the error is related to a unique constraint violation, throw a BadRequestException
      // Otherwise, log the error and throw an InternalServerErrorException
      this.handleErrorException(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    // This method retrieves all products from the database
    // It uses the productRepository to find all products

    const {
      limit = 3,
      offset = 0,
    } = paginationDto;

    // The find() method returns an array of Product entities
    // You can also add pagination or filtering logic here if needed
    // For example, you can use find({ where: { isActive: true } }) to filter active products
    // This will return all products in the database
    // You can also use findAndCount() to get the total count of products
    // If you want to return only specific fields, you can use select() method
    // For example, this.productRepository.find({ select: ['id', 'title', 'price'] });
    // This will return all products in the database
    // You can also use relations to load related entities
    // For example, this.productRepository.find({ relations: ['category'] });
    // This will return all products in the database
    // You can also use findOne() to retrieve a single product by its ID
    // For example, this.productRepository.findOne(id);
    // This will return all products in the database
    // You can also use findBy() to retrieve products by specific criteria
    // For example, this.productRepository.findBy({ isActive: true });
    // This will return all products in the database
    // You can also use findAndCount() to get the total count of products
    // For example, const [products, count] = await this.productRepository.findAndCount();
    // This will return all products in the database
    // You can also use findByIds() to retrieve multiple products by their IDs
    // For example, this.productRepository.findByIds([1, 2, 3]);
    // This will return all products in the database
    // You can also use findOneOrFail() to retrieve a single product by its ID
    // For example, this.productRepository.findOneOrFail(id);
    return this.productRepository.find({
      take: limit, // Limit the number of products returned
      skip: offset, // Skip the specified number of products for pagination
      // You can also include relations if needed, e.g., relations: ['category']
      // If you want to select specific fields, you can use the select option
      // For example, select: ['id', 'title', 'price']
    });
  }

  async findOne(param: string) {
    // This method retrieves a single product by its ID from the database
    // It uses the productRepository to find the product with the given ID
    // const product = await this.productRepository.findOneBy({ id });
    // The findOne method returns a single Product entity or null if not found
    // You can also use findOneOrFail() to throw an error if the product is not found
    // For example, const product = await this.productRepository.findOneOrFail({ where: { id } });
    // If you want to include related entities, you can use the relations option
    // For example, const product = await this.productRepository.findOne({ where: { id }, relations: ['category'] });
    // If you want to include specific fields, you can use the select option
    // For example, const product = await this.productRepository.findOne({ where: { id }, select: ['id', 'title', 'price'] });
    // If you want to include soft-deleted products, you can use the withDeleted option
    // For example, const product = await this.productRepository.findOne({ where: { id }, withDeleted: true });
    // If you want to include products that match specific criteria, you can use the where option
    // For example, const product = await this.productRepository.findOne({ where: { id, isActive: true } });
    // If you want to include products that match specific criteria, you can use the where option
    // For example, const product = await this.productRepository.findOne({ where: { id, isActive: true } });
    // const product = await this.productRepository.findOne({
    //   where: { id },
      // You can also include relations if needed, e.g., relations: ['category']
    // });
    // if (!product) {
      // If the product is not found, throw a NotFoundException
      // This will return a 404 status code with a message
      // You can also log the error for debugging purposes
    //   throw new NotFoundException(`Product with ID ${id} not found`);
    // }
    // If the product is not found, it will return null
    // return product;

    let product: Product | null;
    // Check if the param is a valid UUID
    if (param.length === 36) {
      // If the param is a valid UUID, find the product by ID
      product = await this.productRepository.findOne({
        where: { id: param },
      });
    } else { 
      // If the param is not a valid UUID, find the product by slug
      // product = await this.productRepository.findOne({
      //   where: { slug: param },
      // });

      const query = this.productRepository.createQueryBuilder('product')
      // Use a query builder to find the product by slug or title
      // Use the LOWER function to make the search case-insensitive
      // Use the 'orWhere' method to search by both slug and title
      // This will return the first product that matches either condition
      product = await query
        .where('LOWER(product.slug) = LOWER(:slug)', { slug: param.toLowerCase() })
        .orWhere('LOWER(product.title) = LOWER(:title)', { title: param.toLowerCase() })
        .getOne();
    }
    // If the product is not found, throw a NotFoundException
    if (!product) {
      throw new NotFoundException(`Product with param "${param}" not found`);
    }
    // If the product is found, return it
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // This method updates a product by its ID in the database
    const product = await this.productRepository.preload({
      id, // The ID of the product to update
      ...updateProductDto, // The updated data from the DTO
    });
    // The preload method will create a new product instance with the updated data
    // If the product is not found, it will return null
    if (!product) {
      // If the product is not found, throw a NotFoundException
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    // If the product is found, save the updated product to the database
    try {
      // The save method will update the product in the database
      // If the product is not found, it will throw an error
      return await this.productRepository.save(product);
    } catch (error) {
      // If an error occurs during the update, handle it
      this.handleErrorException(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    // This method removes a product by its ID from the database
    // It first retrieves the product using the findOne method
    // If the product is not found, it will throw a NotFoundException
    // If the product is found, it will be passed to the remove method  
    // of the productRepository to delete it from the database
    // The remove method will return the deleted product
    // If you want to perform a soft delete instead of a hard delete,
    // you can use the softDelete method instead
    // The softDelete method will set the deletedAt field to the current date
    // and will not actually remove the product from the database
    // If you want to perform a hard delete, you can use the delete method instead
    // The delete method will remove the product from the database
    await this.productRepository.remove(product);
    // If the product is successfully removed, it will return nothing
    // If you want to return a success message, you can return a string or an object
    // For example, return { message: 'Product removed successfully' };
    return { message: 'Product removed successfully' }
  }

  /**
   * Handles errors that occur during product creation.
   * If the error is a unique constraint violation, it throws a BadRequestException.
   * Otherwise, it logs the error and throws an InternalServerErrorException.
   * @param error The error object caught during product creation.
   */
  private handleErrorException(error: any) {
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === '23505') {
      const detail = 'detail' in error && typeof (error as { detail?: string }).detail === 'string'
          ? (error as { detail: string }).detail
          : undefined;
      throw new BadRequestException(detail || 'Product already exists');
    }

    this.logger.error('An error occurred', error);
    // Log the error for debugging purposes
    // If an error occurs, throw an InternalServerErrorException
    // This will return a 500 status code with a message
    throw new InternalServerErrorException('Error creating product');
  }
}
