export type ContactPointsType = "url" | "email" | "tel" | "address";

export type ContactPoint = {
    icon: string;
    value: string;
    type?: ContactPointsType;
};