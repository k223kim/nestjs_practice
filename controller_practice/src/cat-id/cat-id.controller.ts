import { Controller, HostParam, Get } from '@nestjs/common';

@Controller({host: ':id.api.localhost'})
export class CatIdController {
    @Get()
    index(@HostParam('id') id: string): string{
        return `this is sub routing to ${id}`;
    }
}
