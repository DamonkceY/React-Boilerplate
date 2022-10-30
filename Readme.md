
# React-Vite Project Architecture


## Table of content
- [Setup](#setup)
- [Overview and Best Practices](#overview-and-best-practices)
  - [Build tool](#build-tool-vite)
  - [Linting](#linting-eslint--prettier)
  - [Git hooks](#git-hooks-husky)
  - [Imports](#imports)
  - [React hooks](#react-hooks)
- [Project documentation](#project-documentation)
  - [Environment variables](#environment-variables)
  - [Fonts](#fonts)
  - [Css Variables](#css-variables)
  - [Presentation](#presentation-folder-ui-interfaces)
  - [Core](#core-folder-background-logic)
  - [Utils](#utils-folder)

## Setup
> Clone the project then delete the .git folder to start a new project and then open your terminal and type `git init`.

> Set up your credentials and the origin you want to point into with git.

> Run `yarn` to install dependencies and set up the project.

> Create a .env file at the root of the project and copy the .env.example text into it (make sure that the .env file is added to .gitignore).

> You can change your IDE settings to support Eslint and prettier and format your code on the go.

> To run the project: `yarn start`, to build it: `yarn build`.

## Overview and Best Practices

### Build tool: Vite

Vite is a modern frontend build tool that provides an extremely fast development environment and bundles your code for production.  

Vite uses esbuild which is written in Go and pre-bundles dependencies 10–100x faster than JavaScript-based bundlers.
[Further details about vite in here](https://dev.to/nilanth/use-vite-for-react-apps-instead-of-cra-3pkg)


### Linting: Eslint && prettier

Prettier takes care of your code formatting, ESLint takes care of your code style.  
To lint your document run `yarn lint` and to format it run `yarn format`, and you can go further by
configuring your IDE (VsCode, WebStorm, ...) to lint and format on save.
[Further details about Eslint and prettier in here](https://prettier.io/docs/en/integrating-with-linters.html)

### Git Hooks: Husky

After installing the project, a command will be executed automatically `yarn prepare` which will set up husky to run its hooks. a pre-commit hook will be there
which will help on linting, formatting and checking the branch name before the commit.
to add other hooks (pre-push, ...) enter `yarn husky add .husky/pre-push` and configure your shell script as wanted.
[Further details about Husky in here](https://typicode.github.io/husky)

### Imports

While importing components you may need to put them on hold just to preserve the limited amount of memory 
of the user's machine, this can be done with **React.lazy** function.

Example:
```
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </div>
  );
}
```
**React.Suspense** will take care of showing the lazy mounted components it accepts a **fallback** which
shows any kind of loader while the components are being loaded.

***PS: Use React.lazy wisely (it can be tricky )***

[Further details about React.lazy in here](https://reactjs.org/docs/code-splitting.html)

### React Hooks

React hooks needs to be used respectfully, I'll explain why.
> **React.useState**
> useState is used to track and print a variable value into the dom after each change, so that's why we need to always
> try to group our states :
> ```
> // wrong usage
> const [carModel, setCarModel] = useState<string>('X');
> const [carColor, setCarColor] = useState<string>('red');
> const [carHorsePower, setCarHorsePower] = useState<number>(9);
> setCarColor('black');
> setCarHorsePower(5);
> // End
>
> // correct usage
> // PS: let's pretend that we have an interface named `CarDetailsInterface`
> const [carDetails, setCarDetails] = useState<CarDetailsInterface>({
>   model: 'X',
>   color: 'red',
>   horsePower: 9,
> });
> setCarDetails((previousState) => ({
>   ...previousState,
>   color: 'black',
>   horsePower: 5,
> }));
> // End
> ```
> Grouping variables in a single state(or maybe more, based on your needs) will minimise unwanted renders
> react will trigger after changing a state.

> **React.useEffect**  
> useEffect is a function that accepts a callback function and a dependencies array, this deps array can contain variables that changes over time such as passed props or scoped states.  
> If the deps array is empty, then the callback provided will be launched after the component first mounted into the dom.  
> If the deps array contains one or more variable, then the callback provided will be triggered only after the change of these variables.  
> The callback function provided to the useEffect hook can return a clean-up function, this function will be triggered only before the component is removed from the dom to prevent memory leak.
> ```
> // clean-up function example:
> const socket = null;
> useEffect(() => {
>   socket = new Socket();
>
>   // clean-up function:
>   return () => {
>     socket = null;
>   }
> }, [])
> ```
> ```
> // Be aware of these scenarios:
>
> const [num, setNum] = useState<number>(0);
>
> useEffect(() => {
>   setNum(num + 1)
> }, [num])
>
> // This will cause an infinite loop because the useEffect is watching a state that you were changing inside the callback
> ```

> **React.useRef**  
> useRef returns a mutable ref object whose .current property is initialized to the passed argument (initialValue).  
> The returned object will persist for the full lifetime of the component.
> ```
> const inputRef = useRef<HTMLInputElement>(null);
>
> useEffect(() => {
>   console.log(inputRef.current?.value);
>   // expected log ==> 5
> }, [])
>
> return (
>   <input value='5' ref={inputRef}/>
> )
> // End
> ```

> **useMemo | useCallback**  
> useMemo and useCallback are similar the only difference is that useMemo returns a memoized value and useCallback returns
> a memoized callback function depending on the dependencies array that is provided, this helps to avoid exhaustive calculations on every render.
> ```
> // useMemo example:
> const expensiveCalculation = (num) => {
>   console.log("Calculating...");
>   for (let i = 0; i < 1000000000; i++) {
>     num += 1;
>   }
>   return num;
> };
>
> const [count, setCount] = useState(0);
> const value = useMemo(() => expensiveCalculation(count), [count]);
>
> // useCallback example:
> const [count, setCount] = useState(0);
> const add = useCallback(() => {
>   setCount(count + 1);
> }, [count])
> ```
> Think of memoization as caching a value/callback so that it does not need to be recalculated.

## Project Documentation

### Environment variables:

In order to make your private keys more secure you need to provide them with a .env file and not hard-coded, this
is achievable by creating a .env in the root directory.
> Usage:
> add a key in the .env file, keys must be prefixed with 'VITE_' in order to use them properly, and then you can use them in javascript like this:  
> `const secretKey = import.meta.env.VITE_SECRET_KEY;`

### Fonts:

In many cases we need to install local fonts into our projects, so inside the assets folder you'll find
a fonts folder which can contain all of your desired fonts.  
to make it easy to import, you need to add a scss file inside each font you download, to describe the different font styles, 
and then all you need to do is import that scss file into the index.scss file inside fonts folder, which is imported inside the global index.scss to be ready for all components.

### Css variables:

At the src folder you'll find a _variables.scss file, that file can contain shared css variables across the project,
to use the variables inside any scss file all you need to do is to import the _variables.scss file.
> Sass variables example;
> ```
> @use './src/_variables' as V;  
> 
> // after the import we can use the variables as below :
> 
> @media screen and (max-width: V.$mobile-breakpoint) {  
>   body {  
>       background-color: red;  
>   }  
> }
> ```

### Presentation folder (UI interfaces)

The Presentation folder will be containing all of our UI layouts and pages, therefor it is composed mainly from three sub-folders:

- app: which will be containing the main pages and their children,
- entryPoint: which contains the entryPoint of the project A.K.A. index, by all means, this file need to prepare the routes and the global logic you need to apply to all the project such as the loader, etc...
- shared: this folder contains standalone components that are shared across the project, be advised that they need to be standalone and not other component child,

PS: You can safely delete the example components inside the app folder and replace them with your desired comps.

### Core folder (background logic)

This folder represents all the logic and calculations needed for the app, i'll be explaining them one by one:

**- Entities**: represents all the interfaces, types and even classes shared across the project.

**- Hooks**: contains all the custom hooks that needs to be consumed, you'll find an example called `useTrackDeviceWidth`, it is implemented in `entryPoint.tsx`.

**- i18n**: as it's name says, contains your internationalization logic, at first there will be en, fr and ar, feel free to add your preferred languages.

**- Router**: when we were at the stone ages, we were implementing all of our routes and it's logic in the index file or in our case the entryPoint, now it's not the case ! all of our routes will be configured in the routes.ts file,
that file will return an array of objects, these objects must be well configured to prevent INFINITE LOOPS and white screen problems, i'll explain how to configure them:

* A simple route will contain: 
  * path: the path string gained from paths.ts file.
  * component: the component that needs to be rendered with that path key, it needs to be lazy loaded (example in the routes.ts file).
  * displayType: a middleware that describes on which device this route should be rendered, the value can be either: ALL | DESKTOP | TABLET | MOBILE.
  * isPrivate: another middleware to prevent seeing that route when it's private, value can be true OR false.
* A nested route will contain all of the above plus:
  * fallback: this attribute will redirect to the child that needs to be rendered first.
  * children: an array containing simple or nested routes.

CRITICAL POINTS:
* In the entryPoint file you'll find the routesRenderer() method and below it there is a route that redirects to a fallback if there was no math,
that route can cause infinite loops if mal used. for example lets say that the value of fallback is `/home` and it's linking to a private route, then if you are unauthorized it will fall into an infinite loop because it's trying to access and redirect to the same route !
* The same thing applies to the fallback value of the nested routes.

**- Services**: this folder will contain any API call made through the app, these api calls must be written inside the modulesService folder,
inside the services folder you'll find a httpService folder which is a Singleton Axios instance to make your calls, if your project for example needs a socket.io connection then you need to add it inside the socketServices folder.
* httpService:
  * this file is an axios instance (interceptor), that is configured to run your API calls, inside 
this file you'll find a class with various methods, but none of them is accessible except the `getInstance()` and `executeRequest()` methods.
  * inside the file you'll find configuration to update the token and reExecute the fallen requests all with persisting the actual behaviour of the UI.
  * how to use the `executeRequest()` method: `HttpService.getInstance().executeRequest(...config)`, there is an example in modulesServices folder.
* modulesServices:
  * all of your store API needs must be implemented in this folder.

**- store**: Redux store, contains modules folder, hooks and index files:
* modules folder: contains the store slices that are needed to compose your app, a brief example exists in there.
* index: exports your created modules.
* hooks: exports `useAppSelector` and `useAppDispatch` which are typed instead of simple `useSelector` and `useDispatch`.

### Utils folder
contains any shared simple logics and constants such as the localStorage keys, etc...