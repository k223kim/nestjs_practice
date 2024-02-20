export class CreateCatDto {
    name: string;
    id: number;
}

export class CreateCatRequest{
    name: string;
    id: number;
}

export class CreateCatResponse{
    name: string;
    id: number;
    note: string;
}

export class GetCatDto{
    offset: number
    limit: number
}
