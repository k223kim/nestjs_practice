import { Injectable } from "@nestjs/common";

@Injectable()
export class CatOutsideClass{
    getOutdoorCat(): string{
        return 'Does this work with a non-class provider token?';
    }
}
