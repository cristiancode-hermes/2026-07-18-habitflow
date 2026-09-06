import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habit } from './entities/habit.entity';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitsRepository: Repository<Habit>,
  ) {}

  async create(dto: CreateHabitDto): Promise<Habit> {
    const habit = this.habitsRepository.create(dto);
    return this.habitsRepository.save(habit);
  }

  async findAll(): Promise<Habit[]> {
    return this.habitsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Habit> {
    const habit = await this.habitsRepository.findOne({
      where: { id },
      relations: ['checkins'] as any,
    });
    if (!habit) throw new NotFoundException(`Habit #${id} not found`);
    return habit;
  }

  async update(id: number, dto: UpdateHabitDto): Promise<Habit> {
    const habit = await this.findOne(id);
    Object.assign(habit, dto);
    return this.habitsRepository.save(habit);
  }

  async remove(id: number): Promise<void> {
    const result = await this.habitsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Habit #${id} not found`);
    }
  }
}
