export type User = {
    id: number,
    username: string,
    password: string,
}

export type PublicUser = Omit<User, "id" | "password">;