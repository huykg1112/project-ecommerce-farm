import { Injectable } from '@nestjs/common';
import { CreateTreatmentPlanDto } from './dto/create-treatment-plan.dto';
import { UpdateTreatmentPlanDto } from './dto/update-treatment-plan.dto';

@Injectable()
export class TreatmentPlanService {
  create(createTreatmentPlanDto: CreateTreatmentPlanDto) {
    return 'This action adds a new treatmentPlan';
  }

  findAll() {
    return `This action returns all treatmentPlan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} treatmentPlan`;
  }

  update(id: number, updateTreatmentPlanDto: UpdateTreatmentPlanDto) {
    return `This action updates a #${id} treatmentPlan`;
  }

  remove(id: number) {
    return `This action removes a #${id} treatmentPlan`;
  }
}
