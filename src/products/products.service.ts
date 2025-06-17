import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

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

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
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
