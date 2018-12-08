export function alreadyExistsError(namespace: string) {
  return {
    code: 'already_exists',
    message: `Could not add module "${namespace}": trying to add a module that already exists`,
    params: {
      namespace
    }
  };
}
export function removeStaticError(namespace: string) {
  return {
    code: 'remove_static',
    message: `Could not remove module "${namespace}": trying to remove a static module`,
    params: {
      namespace
    }
  };
}
