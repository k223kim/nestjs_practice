import { Injectable } from "@nestjs/common";

@Injectable()
export class CatNameService {
    private catName: string = 'no cat name';;
    setCatName(catName: string){
        this.catName = catName;
    }
    getCatName(): string{
        return `the cat name is ${this.catName}`;
    }
}
