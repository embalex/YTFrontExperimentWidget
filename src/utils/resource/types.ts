export enum ResourceEnum {
  Content = 'Content',
  Error = 'Error',
  Loading = 'Loading',
  Reloading = 'Reloading',
  Undefined = 'Undefined',
}

export interface Content<T> {
  kind: ResourceEnum.Content;
  content: T;
}

export interface ErrorResource<E extends Error = Error> {
  kind: ResourceEnum.Error;
  error: E;
}

export interface LoadingResource {
  kind: ResourceEnum.Loading;
}

export interface ReloadingResource<T> {
  kind: ResourceEnum.Reloading;
  content: T;
}

export interface UndefinedResource {
  kind: ResourceEnum.Undefined;
}

export type Resource<T, E extends Error = Error> = Content<T> | ErrorResource<E> | LoadingResource;
export type Nullable<T> = Content<T> | UndefinedResource;
export type NullableResource<T> = Resource<T> | UndefinedResource;
export type NullableReloadableResource<T> = NullableResource<T> | ReloadingResource<T>;
