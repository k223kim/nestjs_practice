import { Injectable } from "@nestjs/common";
import { BaseService } from "./baseService";
import { ServiceA } from "./serviceA";

@Injectable()
// we need this decorator because this is used in CatsController
export class ServiceB extends BaseService{
	constructor(private readonly _serviceA: ServiceA){
		super(_serviceA);
	}
	getCat(): string{
		return this.runServiceA();
	}
}
