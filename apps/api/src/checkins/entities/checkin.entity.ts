import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Habit } from '../../habits/entities/habit.entity';

@Entity('checkins')
@Unique(['habitId', 'date'])
export class CheckIn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  habitId: number;

  @ManyToOne(() => Habit, (habit) => habit.checkins, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'habitId' })
  habit: Habit;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'text', nullable: true })
  note: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
