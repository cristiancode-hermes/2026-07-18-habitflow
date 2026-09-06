import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { CheckIn } from '../../checkins/entities/checkin.entity';

export enum HabitFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
}

export enum HabitCategory {
  HEALTH = 'health',
  LEARNING = 'learning',
  PRODUCTIVITY = 'productivity',
  CREATIVITY = 'creativity',
  FINANCE = 'finance',
  SOCIAL = 'social',
  MINDFULNESS = 'mindfulness',
  OTHER = 'other',
}

@Entity('habits')
export class Habit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    type: 'simple-enum',
    enum: HabitCategory,
    default: HabitCategory.OTHER,
  })
  category: HabitCategory;

  @Column({
    type: 'simple-enum',
    enum: HabitFrequency,
    default: HabitFrequency.DAILY,
  })
  frequency: HabitFrequency;

  @Column({ length: 7, default: '#6366f1' })
  color: string;

  @Column({ length: 32, default: 'star' })
  icon: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => CheckIn, (checkin) => checkin.habit, { cascade: true })
  checkins: CheckIn[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
