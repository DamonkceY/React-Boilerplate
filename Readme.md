
# React Cheat Sheet


## Build tool: Vite vs CRA (create react app)
CRA uses Webpack to bundle the code. Webpack bundles the entire code,
so if your codebase is very large more than 10k lines you might see a slower start
in the development server and a long waiting time to see the changes made.

Vite uses esbuild which is written in Go and pre-bundles dependencies 10–100x
faster than JavaScript-based bundlers.

- Create a new Vite React Project:  
  `yarn create vite` => Choose React => Choose typescript

- Run:  
  `yarn run dev`
- Build:  
  `yarn run build`

[Further details in here](https://dev.to/nilanth/use-vite-for-react-apps-instead-of-cra-3pkg)


## Imports
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

[Further details in here](https://reactjs.org/docs/code-splitting.html)

## React Hooks
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
> useEffect is a function that accepts a callback function and a dependencies array, this deps array can contain
> variables that changes over time such as passed props or scoped states.  
> If the deps array is empty, then the callback provided will be launched after the component first mounted into the dom.  
> If the deps array contains one or more variable, then the callback provided will be triggered only after the change of these variables.  
> The callback function provided to the useEffect hook can return a clean-up function, this function will be triggered only before the component
> is removed from the dom to prevent memory leak.
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