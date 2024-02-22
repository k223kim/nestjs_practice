import { ServiceA } from "./serviceA";

export class BaseService{
	constructor(private readonly serviceA: ServiceA){}
	getCat(): string{
		return 'Hello from Base Cat!';
	}

	runServiceA(): string{
		return this.serviceA.getCat();
	}
}
