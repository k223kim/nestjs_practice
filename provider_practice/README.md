## References
- NestJS official document about providers ([1](https://docs.nestjs.com/providers), [2](https://docs.nestjs.com/fundamentals/custom-providers#standard-providers))
## Setup
- Run the following commands
```bash
nest new provider_practice
cd provider_practice
nest g co cats
```
- Whenever running the terminal commands in the following paragraphs, make sure to run the local server by doing so:
```bash
npm run start:dev
```
## Providers
- Provider can be **injected** as a dependency
- Controllers handle HTTP requests and delegate more complex tasks to **providers**
	- Providers perform the business logic
## Dependency Injection (DI)
- Design pattern
- Inversion of Control (IoC) technique ([details](https://www.linkedin.com/pulse/inversion-control-ioc-design-principle-jahid-momin#:~:text=Inversion%20of%20Control%20(IoC)%20is,and%20managing%20its%20own%20dependencies.))
	- Design principle in which a software component is designed to receive its dependencies from an external source rather than creating them itself
	- Implemented using a **Dependency Injection container** (or the **IoC container**)
		- Responsible for managing the dependencies between objects
		- Providing them to the objects that need them
		- Uses reflection to create objects and wire them
		- Helps to **decouple** components in a system
- Delegate instantiation of dependencies to the IoC container (NestJS runtime system)
- DI system has two main roles
	- dependency consumer
	- dependency provider
	- IoC container (NestJS runtime system) facilitates the interaction between them
-  How DI system works
	- When a dependency is requested, injector checks its registry to see if there is an instance available
		- if not, create a new instance and store it into the registry
#### Injecting Dependency - Class Constructor
- Most common way to inject a dependency is to declare it in a **class constructor**
- When the IoC container instantiate this class, it determines which services or other dependencies that class need by looking at the constructor parameter types
- IoC container checks if the injector has any existing instance of that service
	- If it does not exist, IoC container creates one using the **Provider**
	- Adds it to the IoC container and calls the constructor
```ts
//src/app.controller.ts
import { AppService } from './app.service';

// Inject dependency in a class constructor
@Controller()
export class AppController{
	constructor(private readonly appService: AppService){}
}
```
#### Injecting Dependency - `@Inject()`
```ts
// Inject dependency using @Inject()
//src/app.controller.ts
import { Controller, Get , Inject} from '@nestjs/common';

@Controller()
export class AppController{
	@Inject(AppService) private readonly appService: AppService;
}
```
####  `@Injectable()`
- This allows the class to be a **provider** that can be injected in different Nest components
```ts
//src/app.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```
- Let us illustrate the usage of `@Injectable()` by using the following example
#### `@Injectable()` example
- Setup
	- Set up the file structure under `/src/` as the following
```bash
.
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── cats
│   ├── cats.controller.ts
│   ├── cats.service.ts
│   ├── dto
│   │   └── create-cat.dto.ts
│   └── interfaces
│       └── cat.interface.ts
└── main.ts
```
- Below shows how each file should be filled
```typescript
//src/cats/interfaces/cat.interface.ts
export interface Cat {
  name: string;
  age: number;
  breed: string;
}
```

```ts
//src/cats/dto/create-cat.dto.ts
export class CreateCatDto{
  name: string;
  age: number;
  breed: string;
}
```

```typescript
//src/cats/cats.service.ts
import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable()//CatsService is now a provider
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
```

```typescript
//src/cats/cats.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}
  //CatsService provider is injected by Nest

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

```ts
//src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';

@Module({
  imports: [],
  controllers: [AppController, CatsController],
  providers: [AppService, CatsService],
})
export class AppModule {}
```

```bash
curl -X POST http://localhost:3000/cats -H "Content-Type: application/json" -d '{"name": "tico", "age": 13, "breed": "maltese"}'
curl -X POST http://localhost:3000/cats -H "Content-Type: application/json" -d '{"name": "hope", "age": 4, "breed": "british_short_hair"}'
curl http://localhost:3000/cats
#[{"name":"hope","age":4,"breed":"british_short_hair"},{"name":"tico","age":13,"breed":"maltese"}]
```
#### DI Fundamentals
- Let us understand exactly how dependency injection occurred in the above example
```typescript
//src/app.module.ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';
@Module({
  imports: [],
  controllers: [AppController, CatsController],
  providers: [AppService, CatsService],
  //register CatsService provider to Nest IoC container
})
export class AppModule {}
```
1. `cats.service.ts` has `@Injectable()` that declares that `CatsService` class can be managed by the Nest IoC container (i.e. `CatsService` is a **provider** class)
2. `cats.controller.ts` has `CatsController` that declares a dependency on the `CatsService` **token** with the **constructor injection** (`constructor(private catsService: CatsService)`)
	- When Nest IoC container instantiates this class `CatsController`, it looks for any dependencies
	- When if finds `CatsService` dependency, it performs a **lookup** on the `CatsService` token
		- this returns the `CatsService` **class**
	- Nest will then either create an instance of `CatsService` class or return an existing instance
3. `app.module.ts` associates the **token** `CatsService` with the **class** `CatsService` from  `cats.service.ts`  (i.e. registration)
#### Provider Registration
- Associating a **token** with the **provider class**
	- this **token** is used when there is a **request** of an instance of that particular provider class (i.e. the **lookup** process)
- `CatsService`: Provider class
- `CatsController`: consumer (of that service; dependency; provider)
- To register the service with Nest, service must be added to `providers` array of the `@Module()` decorator
```ts
//src/app.module.ts
@Module({
	controllers: [CatsController],
	providers: [CatsService],
})
export class AppModule {}
```
- Above is equivalent to the following construction
```ts
//src/app.module.ts
@Module({
	controllers: [CatsController],
	providers: [
		provide: CatsService,
		useClass: CatsService,
	],
})
export class AppModule {}
```
#### Provider with Inheritance - Class Constructor
- Consider the following services by creating three more `.ts` files (`serviceA.ts`, `serviceB.ts`, and `baseService.ts`)
	```ts
//src/cats/serviceA.ts
import { Injectable } from "@nestjs/common";

@Injectable()
// we need this decorator because this is used in BaseService
export class ServiceA{
	getCat(): string{
		return 'Hello from Cat A!';
	}
}
```

```ts
//src/cats/baseService.ts
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
```

```ts
//src/cats/serviceB.ts
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
```

```ts
//src/cats/cats.controller.ts
import { ServiceB } from './serviceB';

@Controller('cats')
export class CatsController{
	constructor(private readonly serviceB: ServiceB){}
	...
	@Get('/serviceB')
	getCat(): string{
		return this.serviceB.getCat();
	}
}

```

```ts
//src/cats/cats.module.ts
import { ServiceB } from './cats/serviceB';
import { ServiceA } from './cats/serviceA';

@Module({
  imports: [],
  controllers: [AppController, CatsController],
  providers: [AppService, CatsService, ServiceB, ServiceA],
})
export class AppModule {}
```
- Notice that while **ServiceB** and **ServiceA** have `@Injectable()`, **BaseService** does not. That is because **BaseService** is never injected directly (it is used as a base class).
- Notice that `@Injectable()` allows **ServiceB** and **ServiceA** to be managed by the IoC container
- `providers: [AppService, CatsService, ServiceB, ServiceA]` associates tokens to corresponding classes:
```
|    tokens   |    class     |
|  AppService |  AppService  |
| CatsService |  CatsService |
|   ServiceB  |   ServiceB   |
|   ServiceA  |   ServiceA   |
```
- Whenever IoC container instantiate **BaseService**, it will check its dependency which is **ServiceA** and check the lookup table to get its class
- Whenever IoC container instantiate **CatsController**, it will check its dependency which is **ServiceB** and check the lookup table to get its class
```bash
curl http://localhost:3000/cats/serviceB
# Hello from Cat A!
```
#### Provider with Inheritance - `@Inject()`
- The same can be done by using `Inject()`
- This is more preferable as we don't have to pass in the `ServiceA` provider to the base class using `super()`
```ts
//src/cats/convenientBaseService.ts
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
```

```ts
//src/cats/convenientServiceB.ts
import { Injectable } from "@nestjs/common";
import { ConvenientBaseService } from "./convenientBaseService";

@Injectable()
export class ConvenientServiceB extends ConvenientBaseService{
    getCat(): string{
        return this.runServiceA();
    }
}
```

```ts
//src/cats/cats.controller.ts
import { ConvenientServiceB } from './convenientServiceB';

@Controller('cats')
export class CatsController{
	constructor(private readonly convenientServiceB: ConvenientServiceB){}

	@Get('/convenientServiceB')
	getConvenientCat(): string {
		return this.convenientServiceB.getCat();
	}
}
```

```ts
//src/app.module.ts
import { ConvenientServiceB } from './cats/convenientServiceB';

@Module({
  imports: [],
  controllers: [AppController, CatsController],
  providers: [AppService, CatsService, ServiceB, ServiceA, ConvenientServiceB],
})
export class AppModule {}
```

```bash
curl http://localhost:3000/cats/convenientServiceB/
# Convenient version - Hello from Cat A!
```

## Custom Providers
#### Non-class-based provider tokens
- Note that the provider tokens can be a `string` or a `symbol`
- Consider another provider:
```ts
//src/cats/notClassProvider.ts
import { Injectable } from "@nestjs/common";

@Injectable()
export class CatOutsideClass{
    getOutdoorCat(): string{
        return 'Does this work with a non-class provider token?';
    }
}
```
- This can be registered to IoC container like so:
```ts
//src/app.module.ts
import { CatOutsideClass } from './cats/notClassProvider';
@Module({
...
providers: [
      {provide: 'outdoorCat', useClass: CatOutsideClass},
]
})
```
- To inject such provider, it can be done as the following:
```ts
import { Controller, Get, Post, Body , Inject} from '@nestjs/common';
import { CatOutsideClass } from './notClassProvider';

@Controller('cats')
export class CatsController {
  constructor(
		...
      @Inject('outdoorCat') private readonly  outdoorCat: CatOutsideClass ,
  ) {}
  ...
  @Get('/outdoor')
  getOutdoorCatOutput(): string {
    return this.outdoorCat.getOutdoorCat();
  }
}
```
- This can be confirmed as shown below:
```bash
curl http://localhost:3000/cats/outdoor
# Does this work with a non-class provider token?
```
#### Class provider - `useClass`
- Can dynamically determine a class that a token should resolve to
- From the above example, `useClass` was used to assign `'outdoorCat'` token to `CatOutsideClass` class
- In order to use such provider, we must use `@Inject()`
#### Value provider - `useValue`
- Can be used to inject a **constant value**
	- Often useful to use **mock values** for testing
- The registration step can be done at `src/app.module.ts`
	- `useValue` property must have a literal object that has the **same interface** as the `provide` object or must be a **instance** generated by the `new` keyword
- There are three examples illustrated below to show how `useValue` can be used in different scenarios
1. Using **constant values**
```ts
//src/cats/weirdCat.ts
export const weirdCatConst = {
    name: "kaeun",
    age: 97,
    color: "blue"
}
```
- This can be registered like so:
```ts
//src/app.module.ts
import { weirdCatConst } from './cats/weirdCat';

@Module({
	...
  providers: [
	  {provide: 'weirdCat', useValue: weirdCatConst}],
})
export class AppModule {}
```
- This constant value can be injected using `@Inject()`
```ts
@Controller('cats')
export class CatsController {
  constructor(
      @Inject('weirdCat') private readonly catConst
  ) {}
...
  @Get('/getWeirdCat')
  getWeirdCat(): string {
    return this.catConst;
  }
}

```
- The dependency injection can be confirmed as the following
```bash
curl http://localhost:3000/cats/getWeirdCat
# {"name":"kaeun","age":97,"color":"blue"}
```
2. Using **mock values**
- Let us create a mock `ServiceA` to see how this works
```ts
//src/app.module.ts
const mockServiceA = {
    getCat: function mockGetCat(){
        return 'this is mocking serviceA for testing!';
    }
}
@Module({
...
providers: [
	...
	{provide: ServiceA, useValue: mockServiceA}]
})
```
- notice how the interface of `mockServiceA` is identical to the interface of class `ServiceA` in `/src/cats/serviceA`
- This `mockServiceA` will now replace the original `serviceA`
```bash
curl http://localhost:3000/cats/serviceB
# this is mocking serviceA for testing!
```
3. Using the `new` keyword
- Consider the following `CatNameService` 
```ts
//src/cats/catNameService.ts
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
```
- Let us say that we want to test it with a test input. This can be done with a `new` keyword at `/src/app.module.ts`
```ts
//src/app.module.ts
import { CatNameService } from './cats/catNameService';
...
const testCatNameService = new CatNameService();
testCatNameService.setCatName('testCatName');

@Module({
...
providers:[
	...
	{provide: CatNameService, useValue: testCatNameService}
]
})
```
- Now, `CatNameService` can be injected as the following
```ts
//src/cats/cats.controller.ts
import { CatNameService } from './catNameService';

@Controller('cats')
export class CatsController {
  constructor(
		...
      private readonly catNameService: CatNameService
  ) {}
	...
  @Get('/getCatName')
  getCatName(): string {
    return this.catNameService.getCatName();
  }
}
```
- As expected, the output will be the following
```bash
curl http://localhost:3000/cats/getCatName
# the cat name is testCatName
```
- Interestingly enough, when adding (i.e. overwriting) the `CatNameService` provider as the following:
```ts
//src/app.module.ts
import { CatNameService } from './cats/catNameService';

@Module({
	providers: [
	...
      {provide: CatNameService, useValue: testCatNameService},
      CatNameService,
	]
})
```
- Rather than `testCatNameService`, the actual class `CatNameService` will be used. Therefore, when running the following, the output will change
```bash
curl http://localhost:3000/cats/getCatName
# the cat name is no cat name
```
