/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString, IsUrl} from 'class-validator';
export class AirlineDto {

 @IsString()
 @IsNotEmpty()
 readonly name: string;
 
 @IsString()
 @IsNotEmpty()
 readonly description: string;
 
 @IsString()
 @IsNotEmpty()
 readonly date: string;
 
 @IsUrl()
 @IsNotEmpty()
 readonly website: string;
}