import {
  Content,
  ErrorResource,
  LoadingResource,
  UndefinedResource,
  ResourceEnum,
  ReloadingResource,
} from './types';

type ICommonType<TContent, TError extends Error = Error> =
  | Content<TContent>
  | ErrorResource<TError>
  | LoadingResource
  | ReloadingResource<TContent>
  | UndefinedResource;

export const makeContentResource = <T>(content: T): Content<T> => ({
  kind: ResourceEnum.Content,
  content,
});

export const makeReloadingResource = <T>(content: T): ReloadingResource<T> => ({
  kind: ResourceEnum.Reloading,
  content,
});

export const makeErrorResource = <TError extends Error>(error: TError): ErrorResource<TError> => ({
  kind: ResourceEnum.Error,
  error,
});

export const makeLoadingResource = (): LoadingResource => ({
  kind: ResourceEnum.Loading,
});

export const makeUndefinedResource = (): UndefinedResource => ({
  kind: ResourceEnum.Undefined,
});

export const isContentResource = <TContent>(
  resource: ICommonType<TContent>
): resource is Content<TContent> => resource.kind === ResourceEnum.Content;

export const isReloadingResource = <TContent>(
  resource: ICommonType<TContent>
): resource is ReloadingResource<TContent> => resource.kind === ResourceEnum.Reloading;

export const isErrorResource = <TContent, TError extends Error>(
  resource: ICommonType<TContent, TError>
): resource is ErrorResource<TError> => resource.kind === ResourceEnum.Error;

export const isLoadingResource = <TContent>(
  resource: ICommonType<TContent>
): resource is LoadingResource => resource.kind === ResourceEnum.Loading;

export const isUndefinedResource = <TContent>(
  resource: ICommonType<TContent>
): resource is UndefinedResource => resource.kind === ResourceEnum.Undefined;

export const getContent = <TContent>(
  contentResource: Content<TContent> | ReloadingResource<TContent>
): TContent => contentResource.content;
