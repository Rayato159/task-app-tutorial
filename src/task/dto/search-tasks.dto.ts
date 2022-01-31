import { IsOptional } from "class-validator";

export class SearchTasksDto {
    
    @IsOptional()
    search?: string
}