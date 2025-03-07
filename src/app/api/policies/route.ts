import { PolicyTypes } from "@/types/PolicyTypes";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import matter from "gray-matter";

const POLICIES_PATH = path.join(process.cwd(), "/src/content/policies");

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") as PolicyTypes;

    if (!type) {
        return NextResponse.json({ error: "Invalid policy type" }, { status: 400 });
    }

    try {
        const filePath = path.join(POLICIES_PATH, `${type}.md`);
        const fileContent = fs.readFileSync(filePath, "utf-8");

        // Content is the markdown content, frontmatter is the metadata
        const { data: frontmatter, content } = matter(fileContent);

        return NextResponse.json({
            lastUpdated: frontmatter.lastUpdated,
            content: content,
        }, {
            headers: {
                "Cache-Control": "public, s-maxage=86400", // Cache 24h
                "CDN-Cache-Control": "max-age=86400",
            }
        });
    } catch (error) {
        return NextResponse.json({ error: "Policy not found" }, { status: 404 });
    }
}
