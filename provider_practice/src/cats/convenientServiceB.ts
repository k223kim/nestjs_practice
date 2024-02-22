import { Injectable } from "@nestjs/common";
import { ConvenientBaseService } from "./convenientBaseService";

@Injectable()
export class ConvenientServiceB extends ConvenientBaseService{
    getCat(): string{
        return this.runServiceA();
    }
}
