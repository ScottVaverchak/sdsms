export type MockedObject<T> = Record<keyof T, jest.Mock> & T

export const mockObject = <T>(methods: (keyof T)[]): MockedObject<T> => { 
    const entries = methods.map(name => [name, jest.fn()])
    const mock = Object.fromEntries(entries)
    return mock as Partial<MockedObject<T>> as MockedObject<T>
}