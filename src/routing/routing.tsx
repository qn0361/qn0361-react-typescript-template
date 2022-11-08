import React, { FC } from 'react';
import { Route as DefaultRoute } from 'react-router-dom';
export { BrowserRouter } from 'react-router-dom';

type Routes = {
  '/': {};
};

type HasNoProperties<T extends {}> = keyof T extends never ? true : false;
type Params<T extends keyof Routes> = HasNoProperties<Routes[T]> extends true
  ? []
  : [Routes[T]];

export const composeRoute = <K extends keyof Routes>(
  route: K,
  ...tuple: Params<K>
) => {
  const [params] = tuple;

  if (!params) return route;

  const replaced = route.split('/').reduce((acc, chunk) => {
    const isPathParam = chunk.startsWith(':');

    if (!isPathParam) return [...acc, chunk];

    const key = chunk.slice(1) as keyof Routes[K];
    const value = (params as Routes[K])[key];

    return [...acc, String(value)];
  }, [] as string[]);

  return replaced.join('/');
};

// had to do this after transition to react-router-dom 6
export const Route = DefaultRoute;
