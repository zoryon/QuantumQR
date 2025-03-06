export type User = {
    id: number,
    email: string,
    username: string,
    password: string,
}

export type PublicUser = Omit<User, "id" | "password">;