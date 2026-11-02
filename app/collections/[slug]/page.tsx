import { categories } from "@/lib/catalog";
import Catalog from "@/components/Catalog";
import { notFound } from "next/navigation";
export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return { title: categories.find((c) => c.id === slug)?.name || "Collection" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = categories.find((c) => c.id === slug);
  if (!c) notFound();
  return <Catalog key={c.id} collection={c} />;
}
