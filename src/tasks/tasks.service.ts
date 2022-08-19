import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Task } from './dto/task.entity';

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>
  ) {
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]>{
    if(Object.keys(filterDto).length){
      const { status, search } = filterDto;

      return await this.taskRepository.findBy([{
        status,
        title: ILike(`%${search}%`)
      },
      {
        status,
        description: ILike(`%${search}%`)
      }
    ]);
    }else{
      return await this.taskRepository.find();
    }
  }

  async getTaskById(id: string): Promise<Task> {
    // try to get task
    const found = await this.taskRepository.findOne({ where: {id: id}});
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      status: TaskStatus.OPEN,
    });

    await this.taskRepository.save(task);
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);
    
    if(result.affected === 0 ){
      throw new NotFoundException(`Task with ID '${id}' not found!`);
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus) {
    const task = await this.getTaskById(id);
    task.status = status;
    this.taskRepository.save(task);
    return task;
  }
}
