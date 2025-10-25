import type { Metadata } from "next";
import { metadata as pageMetadata } from "./metadata";

export const metadata: Metadata = pageMetadata;

export default function TermosCondicoesLayout({ children, }: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
