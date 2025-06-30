import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {
  // The title of the product, which is a required field.
  @IsString()
  @MinLength(3)
  title: string;

  // The price of the product, which is a required field.
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price: number;

  // An optional description providing more details about the product.
  @IsString()
  @IsOptional()
  description?: string;

  // A unique slug for the product, often used in URLs.
  @IsString()
  @IsOptional()
  slug?: string;

  // The stock quantity available for the product, defaulting to 0 if not specified.
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  // An array of sizes available for the product, such as 'S', 'M', 'L', etc.
  @IsString({each: true})
  @IsArray()
  sizes: string[];

  @IsIn(['men', 'women', 'unisex'])
  gender: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags?: string[];
}
