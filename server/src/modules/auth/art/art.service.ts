import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Art } from './entities/art.entity';
import { CreateArtDto } from './dto/create-art.dto';
import { UpdateArtDto } from './dto/update-art.dto';

@Injectable()
export class ArtService {
  constructor(@InjectRepository(Art) private artRepository: Repository<Art>) {}

  async create(createArtDto: CreateArtDto): Promise<Art> {
    const newArt = this.artRepository.create(createArtDto);
    newArt.inStock = createArtDto.quantity > 0;
    return this.artRepository.save(newArt);
  }

  async findAll(): Promise<Art[]> {
    return this.artRepository.find();
  }

  async findOne(id: number): Promise<Art> {
    const art = await this.artRepository.findOne({ where: { id } });
    if (!art) {
      throw new NotFoundException(`Art with ID ${id} not found`);
    }
    return art;
  }

  async update(id: number, updateArtDto: UpdateArtDto): Promise<Art> {
    const art = await this.findOne(id);
    const updatedArt = this.artRepository.merge(art, updateArtDto);
    updatedArt.inStock = updatedArt.quantity > 0;
    return this.artRepository.save(updatedArt);
  }

  async remove(id: number): Promise<void> {
    const art = await this.findOne(id);
    await this.artRepository.remove(art);
  }
}