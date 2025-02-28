/**
 * Handles watching an object.
 * @param obj The passed object to watch.
 * @param accessor The function ran when an object key/value exists and is accessed.
 * @param setter The function ran when an object key/value is set.
 * @returns a watcher for the obj param.
 */
function watcher(
  obj: Object,
  accessor: Function | undefined,
  setter: Function | undefined
) {
  const handler: ProxyHandler<Object> = {
    get: (target: Object, property: string | symbol) => {
      const value: any = target[property as keyof Object]

      // If neither accessor nor value are undefined, run the accessor param function.
      if (accessor && value !== undefined) {
        return accessor(property, value)
      }

      return value
    },
    set: (target: Object, property: string | symbol, value: any) => {
      target[property as keyof Object] = value

      // If setter exists, run the setter param function
      if (setter) {
        setter(property, value)
      }

      return true
    },
  }

  return new Proxy(obj, handler)
}

const testObj: Object = {}

const watchedObj = watcher(
  testObj,
  (key: any, value: any) => console.log("property accessed: ", key),
  (key: any, value: any) => console.log("property modified: ", key, value)
)

// @ts-expect-error
watchedObj.foo
// @ts-expect-error
watchedObj.foo = true
// @ts-expect-error
watchedObj.foo
