## Disclaimer
- These examples are based on the [nestjs document](https://docs.nestjs.com/controllers)
## Basic Setting
```bash
nest new controller_practice
```
- This will set up a new nest project with corresponding boilerplate code
- I have selected **npm** for the package manager
- running `npm run start:dev` will start the server on the **localhost**
- when accessing `http://localhost:3000`, you'll see
```bash
Hello World!
```
## Controllers
- receive specific requests for the application
##### routing
- controls which controller receives which request
- each controller has more than one route
- different routes can perform different actions
#### `nest g resource [name]`
- create a CRUD resource
	- generates NestJS building blocks (modules, service, controller classes), entity class, DTO classes, testing (`.spec`) files
- For our example, run `nest g resource cats`
#### `@Controller()`
- Required to define a basic controller
- can assign an optional **route path** prefix
```ts
//src/cats/cats.controller.ts
@Controller('cats')
```
- notice that when doing `nest g resource cats`, it creates `src/cats/cats.controller.ts` that has a prefix **cats**
- `curl http://localhost:3000/cats` will call the `GET` method and call `findAll()` which will output `This action returns all cats`
#### `@Get()`
- HTTP request method decorator
- this defines an endpoint to fetch resources
- Nest creates a **handler** for a specific **endpoint** for HTTP requests
	- endpoint
		- HTTP request method & route path
	- route path
		- prefix declared by the controller + path specified in the method's decorator
```ts
//src/cats/cats.controller.ts
@Controller('cats')
export class CatsController {
	@Get('breed') //HTTP request method (GET) is made to this endpoint
	//route path: http://localhost:3000/cats/breed
	findAll(): string{
		return 'This action returns all cats';
	}
}
// Nest will map 'GET /cats/breed' to this handler
```
- Nest routes the request (GET) to `findAll()`
- the function name (`findAll()`)  does not matter!
#### `@Req`
- **Request** object (HTTP request)
- Access to the request object
```ts
//src/cats/cats.controller.ts
import { Req } from '@nestjs/common'
import { Request } from 'express';

@Get()
findAll(@Req() request: Request): string{
	return 'This action returns all cats';
}
```
#### `@Post()`
- endpoint that creates new records
- it is called a 'Post handler'
#### Route wildcards
```ts
//src/cats/cats.controller.ts
@Get('ab*cd')
//matches abcd, ab_cd, abecd, etc
findAll(){
	return 'This route uses a wildcard';
}
```
#### `@HttpCode(204)`
- Response status code is **200** by default
	- **POST requests** are **201**
- Can change the behavior
```ts
//src/cats/cats.controller.ts
import { HttpCode } from '@nestjs/common';
@Post()
@HttpCode(204)
create(){
	return 'This action adds a new cat';
}
```
#### `@Header()`
- specify custom response header
```ts
//src/cats/cats.controller.ts
import { Header } from '@nestjs/common';

@Post()
@Header('Cache-Control', 'none')
create(){
	return 'This action adds a new cat'
}
// this addes 'Cache-Control: none' to the Header
```
- this can be confirmed by the following
```bash
curl -X POST http://localhost:3000/cats -v
```
- this shows the newly added response header
```
*   Trying 127.0.0.1:3000...
* Connected to localhost (127.0.0.1) port 3000 (#0)
> POST /cats HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.86.0
> Accept: */*
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 201 Created
< X-Powered-By: Express
< Cache-Control: none
< Content-Type: text/html; charset=utf-8
< Content-Length: 26
< ETag: W/"1a-2akZlhd5h5eyBoEmpkMg7vz8ALY"
< Date: Mon, 19 Feb 2024 08:38:27 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
<
* Connection #0 to host localhost left intact
This action adds a new cat%
```
#### `@Redirect(url, status code)`
- redirect can be **overwritten** by the returned url
```ts
//src/cats/cats.controller.ts
@Get('docs')
@Redirect('https://docs.nestjs.com', 302)
//accessing localhost:3000/cats/docs/ will redirect to
//https://docs.nestjs.com
getDocs(@Query('version') version){
	if (version && version === '5'){
		return {url: 'https://docs.nestjs.com/v5/'};
		//accessing localhost:3000/cats/docs?version=5 will redirec to
		//https://docs.nest.js.com/v5/
	}
}
```
- notice that the returned values will **override** any arguments passed to **@Redirect()**
#### Route parameters (`@Get(':var'), @Param('var')
- can capture dynamic value in the request URL
- route parameters declared in `@Get()` can be accessed with `@Param()`
```ts
//src/cats/cats.controller.ts
@Get(':id')//dynamic token 'id' declared
findOne(@Param() params: any): string{
	console.log(params.id);
	return `This action returns a #${params.id} cat`;
}
//OR
findOne(@Param('id') params: string): string{
	console.log(params);
	return `The action returns a #${params} cat`;
}
```
- example with multiple route parameters
```ts
//src/cats/cats.controller.ts
@Get(':id/:number')
findOne(@Param() params: any): string{
	console.log(params.id, params.number);
	return `This action returns ${params.id} and ${params.number}`;
}
// we can access this by http://localhost:3000/cats/2/100
```
- but a better practice is to declare each param independently with its corresponding type
```ts
//src/cats/cats.controller.ts
@Get(':id/:number')
findOne(
	@Param('id') id: string,
	@Param('number') number: string,
){
	return `id: ${id}, number: ${number}`;
}
// curl http://localhost:3000/cats/1/100
// results in
// id: 1, number: 100
```
#### Sub-Domain Routing (`@Controller({host:}`, `@HostParam`)
- let us create another controller by using `nest g co CatID`
```ts
//default controller
//src/app.controller.ts
@Controller()
export class AppController{
	constructor(private readonly appService: AppService){}

	@Get()
	getHello(): string{
		return 'Hello World!'
	}
}
```

```ts
// src/cat-id/cat-id.controller.ts (created by nest g co id)
import { Controller, HostParam, Get } from '@nestjs/common';

@Controller({host: ':id.api.localhost'})
export class CatIdController {
    @Get()
    index(@HostParam('id') id: string): string{
        return `this is sub routing to ${id}`;
    }
}
```
- Notice how `CatIdController` has a **endpoint** that is the root route (`localhost:3000`). Also, notice how `AppController` also has a **endpoint** that is a root route (`localhost:3000`)
```ts
//src/app.module.ts
@Module({
	...
	controllers: [AppController, CatIdController]
	...
})
```
- since the `app.module.ts` has `AppController` first, that means that when having the same **endpoint**, the following will result in the same output (`Hello World!`)
```bash
curl http://localhost:3000 # Hello World!
curl http://kaeun.api.localhost:3000 # Hello World!
```
- if we modify the `app.module.ts` as so, when having the same endpoint, `CatIdController` will be processed first
```ts
//src/app.module.ts
@Module({
	...
	controllers: [CatIdController, AppController]
	...
})
```
- This means the following
``` bash
curl http://kaeun.api.localhost:3000 # this is sub routing to kaeun
curl http://localhost:3000 # Hello World!
```
- Note
	- When requesting to a **host** that is not in the `host` parameter, (e.g. `http://kaeun.localhost:3000`, this request is being requested to the original domain (i.e. `http://localhost:3000`)
#### DTO (Data Transfer Object)
- object that defines how the data will be sent over the network
- recommended to define DTO schema using **Typescript classes**
```ts
//src/cats/dto/create-cat.dto.ts
export class CreateIDDto{
	name: string;
	id: number;
}
```
#### Request Payloads
- `@Body()` can be used for the **POST** route handler to accept client parameters
```ts
//src/cats/cats.controller.ts
import { CreateCatDto } from './dto/create-cat.dto';

@Post()
create(@Body() createCatDto: CreateCatDto) {
  const {name, id} = createCatDto;
  return `This action adds a cat with name: ${name} and id: ${id}!`
}
```
- This results in
```bash
curl -X POST http://localhost:3000/cats -H "Content-Type: application/json" -d '{"name": "Kaeun", "id": 97}'
# This action adds a cat with name: Kaeun and id: 97!
```
- DTO can also be used to retrieve information from a **GET** request
	- Consider a case where we pass in `GET http://localhost:3000/users?offset=0&limit=10`
	- To use these input options in the **GET** request, we can do the following
```ts
// src/cats/dto/create-cat.dto.ts
export class GetCatDto{
	offset: number;
	limit: number;
}
```

```ts
//src/cats/cats.controller.ts
import {GetCatDto} from './dto/create-cat.dto';
import { Query } from '@nestjs/common'

@Get()
getDto(@Query() info: GetCatDto){
  const {offset, limit} = info;
  return `got offset: ${offset}, limit: ${limit}`;
}
```
- This results in `curl http://localhost:3000/cats?limit=10&offset=10`, we get the following output
```bash
curl http://localhost:3000/cats?limit=10&offset=10
# got offset: 10, limit: 10
```
#### Controller and Module
- controllers always belong to a module
- controller must be included within the `@Module()` decorator for Nest to know that it exists (it will then create an instance of this controller class)
```ts
//src/app.module.ts
@Module({
	controllers: [CatIdController, AppController],//add controller here
})
```
