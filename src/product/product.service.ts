import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { data } from './data';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  async getProducts() {
    return data;
  }
}
