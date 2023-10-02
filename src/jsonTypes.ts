export {}

declare global {
  namespace PrismaJson {
    // you can use typical basic types
    type MyType = Record<string, any>
    // or you can use classes, interfaces, object types, etc.
  }
}
