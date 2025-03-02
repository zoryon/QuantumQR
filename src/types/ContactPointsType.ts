export type ContactPointsType = "url" | "mailto" | "tel" | "address";

export type ContactPoint = {
    icon: string;
    value: string;
    type?: ContactPointsType;
};