import { Inject } from "@nestjs/common";
import { ServiceA } from "./serviceA";

export class ConvenientBaseService{
    @Inject(ServiceA) private readonly serviceA: ServiceA;
    getCat(): string{
        return 'Hello from Convenient Base Cat!';
    }

    runServiceA(): string{
        return `Convenient version - ${this.serviceA.getCat()}`;
    }
}
