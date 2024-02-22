import { Injectable } from "@nestjs/common";

@Injectable()
// we need this decorator because this is used in BaseService
export class ServiceA{
	getCat(): string{
		return 'Hello from Cat A!';
	}
}
