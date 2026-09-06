import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckIn } from './entities/checkin.entity';
import { CreateCheckInDto } from './dto/create-checkin.dto';

@Injectable()
export class CheckinsService {
  constructor(
    @InjectRepository(CheckIn)
    private readonly checkinsRepository: Repository<CheckIn>,
  ) {}

  async create(dto: CreateCheckInDto): Promise<CheckIn> {
    const date = dto.date || new Date().toISOString().split('T')[0];
    const existing = await this.checkinsRepository.findOne({
      where: { habitId: dto.habitId, date },
    });
    if (existing) {
      throw new ConflictException(`Check-in already exists for habit #${dto.habitId} on ${date}`);
    }
    const checkin = this.checkinsRepository.create({ ...dto, date });
    return this.checkinsRepository.save(checkin);
  }

  async findByHabit(habitId: number): Promise<CheckIn[]> {
    return this.checkinsRepository.find({
      where: { habitId },
      order: { date: 'DESC' },
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.checkinsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`CheckIn #${id} not found`);
    }
  }

  async removeByHabitAndDate(habitId: number, date: string): Promise<void> {
    const checkin = await this.checkinsRepository.findOne({
      where: { habitId, date },
    });
    if (!checkin) {
      throw new NotFoundException(`No check-in found for habit #${habitId} on ${date}`);
    }
    await this.checkinsRepository.remove(checkin);
  }
}
